export function assertNotFound(
  err: unknown,
): asserts err is Deno.errors.NotFound {
  if (!(err instanceof Deno.errors.NotFound)) {
    throw err;
  }
}

export function read(path: string): Deno.FsFile | null {
  try {
    return Deno.openSync(path);
  } catch (err) {
    assertNotFound(err);
    return null;
  }
}
