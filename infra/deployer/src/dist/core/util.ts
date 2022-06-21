export function handleErrorIf(err: unknown, condition: boolean): asserts condition {
  if (!condition) {
    throw err;
  }
}
