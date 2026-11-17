/**
 * Tiny className joiner (falsy values are dropped).
 * @param {...(string|false|null|undefined)} args
 * @returns {string}
 */
export function cx(...args) {
  return args.filter(Boolean).join(' ');
}
