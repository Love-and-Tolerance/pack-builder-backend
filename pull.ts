import { ASSETS } from "./data/assets/java.ts";
import { assertNotFound } from "./utils/fs.ts";

async function run(
  cwd: string,
  cmd: string,
  autoExit = true,
  read = false,
): Promise<Deno.ProcessStatus & { output: string | null }> {
  const process = Deno.run({
    cwd,
    cmd: cmd.split(" "),
    stdin: "null",
    stdout: read ? "piped" : "null",
    stderr: autoExit ? "inherit" : "null",
  });

  let output: string | null = null;

  if (read) {
    const buffer = await process.output();
    output = new TextDecoder().decode(buffer);
    output = output.replace(/\n$/g, "");
  }

  const status = await process.status();

  if (autoExit && !status.success) {
    Deno.exit(status.code);
  }

  return { ...status, output };
}

async function initRepo(
  dir: string,
  url: string,
  branch: string,
): Promise<void> {
  Deno.mkdirSync(dir, { recursive: true });
  const isGit = await run(dir, "git rev-parse --git-dir", false, true);

  if (isGit.output === ".git") {
    console.info(
      `Repo is already initialized. Pulling changes from branch "${branch}" ...\n`,
    );

    await run(dir, `git pull origin ${branch}`);
  } else {
    console.info(`No repo. Cloning with branch "${branch}" ...\n`);
    await run(dir, `git clone ${url} .`);
    await run(dir, `git checkout ${branch}`);
  }
}

console.log("\nCleaning up ...");

try {
  Deno.removeSync("addons/packed", { recursive: true });
} catch (err) {
  assertNotFound(err);
}

console.log("\nProcessing base ...");
await initRepo("addons/raw/base", ASSETS.repos.base.url, "HEAD");

for (const addon of ASSETS.repos.addons) {
  console.info(`\nProcessing addon "${addon.name}" ...`);

  for (const variant of addon.variants) {
    console.log("");

    if (variant.url === undefined) {
      console.info(`Variant "${variant.name}" is empty. Skipping.`);
      continue;
    }

    console.info(`Processing variant "${variant.name}" ...`);

    const dir = `addons/raw/${addon.id_pos}/${variant.id}`;

    let branches = ["HEAD"];

    if (typeof variant.branch === "string") {
      branches = [variant.branch];
    } else if (variant.branch !== undefined) {
      for (const condition of variant.branch) {
        branches.push(condition.value);
      }
    }

    for (const branch of branches) {
      await initRepo(`${dir}/${branch}`, variant.url, branch);
    }
  }
}

console.log("\nAll done!");
