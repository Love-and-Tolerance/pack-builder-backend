import { Hono } from "hono";
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

const app = new Hono();

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

  const ids = filename.match(FILENAME_REGEX)?.[1]?.split("").reverse();

  if (ids === undefined) {
    throw new Error(`Failed to parse filename`);
  }

  try {
    Deno.removeSync("addons/temp", { recursive: true });
  } catch (err) {
    assertNotFound(err);
  }

  merge(`addons/raw/base`, "addons/temp");

  let i = ids.length;

  for (const id of ids) {
    try {
      merge(`addons/raw/${i--}/${id}`, "addons/temp");
    } catch (_err) {
      continue;
    }
  }

  finishMerge(`addons/raw/base`, "addons/temp");

  Deno.mkdirSync("addons/packed", { recursive: true });

  const compressSuccessful = await compress("addons/temp/", filepath);

  if (!compressSuccessful) {
    throw new Error("Failed to compress");
  }

  return c.body(Deno.readFileSync(filepath));
});

const port = Deno.env.get("PORT");

serve(app.fetch, { port: port === undefined ? port : parseInt(port) });
