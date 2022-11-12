import { copySync, expandGlobSync } from "fs";
import { join, relative } from "path";

const LANGS_GLOB = "assets/*/lang/*.json";

function collectLangs(src: string): Map<string, Record<string, string>> {
  const langs = expandGlobSync(join(src, LANGS_GLOB));
  const result = new Map<string, Record<string, string>>();

  for (const lang of langs) {
    const name = relative(src, lang.path);
    const content = JSON.parse(Deno.readTextFileSync(lang.path));

    result.set(name, content);
  }

  return result;
}

export function merge(src: string, dest: string): void {
  const oldLangs = collectLangs(dest);
  const newLangs = collectLangs(src);

  copySync(join(src, "assets"), join(dest, "assets"), {
    overwrite: true,
  });

  for (const [name, newLang] of newLangs) {
    const oldLang = oldLangs.get(name);

    if (oldLang === undefined) continue;

    const mergedContent = { ...oldLang, ...newLang };
    const mergedString = JSON.stringify(mergedContent, null, 2);

    const langDest = join(dest, name);

    Deno.writeTextFileSync(langDest, mergedString);
  }
}

export function finishMerge(src: string, dest: string): void {
  for (const dirEntry of Deno.readDirSync(src)) {
    if (
      dirEntry.name.startsWith(".git") ||
      (dirEntry.isDirectory && dirEntry.name === "assets")
    ) continue;

    copySync(join(src, dirEntry.name), join(dest, dirEntry.name), {
      overwrite: true,
    });
  }
}
