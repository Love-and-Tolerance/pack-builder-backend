import { relative } from "path";

export async function compress(
  dir: string,
  archiveName: string,
): Promise<boolean> {
  const process = Deno.run({
    cwd: dir,
    cmd: ["zip", "-r9q", relative(dir, archiveName), "."],
  });

  const status = await process.status();

  return status.success;
}
