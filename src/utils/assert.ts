// node:assert はブラウザで使えないため、Fail Fast用のassertを自前で提供する
export function assert(condition: boolean, message: string): asserts condition {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}
