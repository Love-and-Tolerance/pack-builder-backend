import { Hono } from "hono";
import { logger } from "hono/middleware";
import { serve } from "http/server";
import { ASSETS as BEDROCK_ASSETS } from "./data/assets/bedrock.ts";
import { ASSETS as JAVA_ASSETS } from "./data/assets/java.ts";
import { compress } from "./utils/compress.ts";
import { escapeRegExp } from "./utils/escapeRegExp.ts";
import { assertNotFound } from "./utils/fs.ts";
import { finishMerge, merge } from "./utils/pack.ts";

const FILENAME_TEMPLATE = JAVA_ASSETS.repos.base.filename.replace(
  "{version}",
  JAVA_ASSETS.repos.base.version,
);

const FILENAME_PARAM = escapeRegExp(FILENAME_TEMPLATE).replace(
  "\\{ids\\}",
  `\\w{${JAVA_ASSETS.repos.addons.length}}`,
);

const FILENAME_REGEX = new RegExp(
  escapeRegExp(FILENAME_TEMPLATE).replace(
    "\\{ids\\}",
    `(\\w{${JAVA_ASSETS.repos.addons.length}})`,
  ),
);

const SORTED_ADDONS = [...JAVA_ASSETS.repos.addons].sort((a, b) =>
  a.apply_order - b.apply_order
);

const app = new Hono();

app.use("*", logger());

app.onError((err, c) => {
  console.error(err);

  return c.json({ error: err.name, message: err.message }, 500);
});

app.get("/resourcepacks/assets/bedrock.json", (c) => {
  return c.json(BEDROCK_ASSETS, 200, { "Access-Control-Allow-Origin": "*" });
});

app.get("/resourcepacks/assets/java.json", (c) => {
  return c.json(JAVA_ASSETS, 200, { "Access-Control-Allow-Origin": "*" });
});

app.get(`/resourcepacks/java/:filename{${FILENAME_PARAM}}`, async (c) => {
  const filename = c.req.param("filename");
  const filepath = `addons/packed/${filename}`;

  try {
    return c.body(Deno.readFileSync(filepath));
  } catch (err) {
    assertNotFound(err);
  }

  const ids = filename.match(FILENAME_REGEX)?.[1]?.split("");

  if (ids === undefined) {
    throw new Error("Incorrect filename");
  }

  // Try responding with already existing result
  try {
    Deno.removeSync("addons/temp", { recursive: true });
  } catch (err) {
    assertNotFound(err);
  }

  // Copy base into result
  merge(`addons/raw/base`, "addons/temp");

  const triggers = new Set<string>();

  for (const addon of SORTED_ADDONS) {
    console.info(`\nProcessing addon "${addon.name}" ...`);

    const id = ids[addon.id_pos - 1];

    if (id === undefined) {
      throw new Error(`No id at index ${addon.id_pos}`);
    }

    const variant = addon.variants.find((variant) => variant.id === id);

    if (variant === undefined) {
      throw new Error(`Unknown variant id "${id}"`);
    }

    // Variant does nothing. Skip.
    if (variant.url === undefined) {
      console.info(`Empty variant "${variant.id}". Skipping.`);
      continue;
    }

    console.info(`Selected variant: "${variant.name}"`);

    let branch = "HEAD";

    if (typeof variant.branch === "string") {
      branch = variant.branch;
    } else if (variant.branch !== undefined) {
      for (const condition of variant.branch) {
        if (
          triggers.has(condition.trigger) || condition.trigger === "DEFAULT"
        ) {
          branch = condition.value;
          console.info(`Branch change triggered by "${condition.trigger}"`);
          break;
        }
      }
    }

    console.info(`Selected branch: "${branch}"`);

    // Copy this variant into result
    console.info("Copying assets ...");
    merge(`addons/raw/${addon.id_pos}/${id}/${branch}`, "addons/temp");

    if (variant.enable_trigger !== undefined) {
      triggers.add(variant.enable_trigger);
      console.info(`Enabled trigger "${variant.enable_trigger}"`);
    }
  }

  // Copy resourcepack info files
  finishMerge(`addons/raw/base`, "addons/temp");

  // Create output dir if it's not created yet
  Deno.mkdirSync("addons/packed", { recursive: true });

  // Create the zip
  const compressSuccessful = await compress("addons/temp/", filepath);

  if (!compressSuccessful) {
    throw new Error("Failed to compress");
  }

  return c.body(Deno.readFileSync(filepath));
});

const port = Deno.env.get("PORT");

serve(app.fetch, { port: port === undefined ? port : parseInt(port) });
