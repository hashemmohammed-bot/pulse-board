/**
 * `crypto.randomUUID` only exists in a secure context, so it is missing when the
 * app is opened over a plain-http LAN address — exactly how a laptop demos to a
 * room. Falling back to `getRandomValues`, then to Math.random, keeps "New user"
 * working there. These ids only have to be unique within one browser session.
 */
export function newId(prefix: string): string {
  return `${prefix}-${randomHex(8)}`;
}

function randomHex(length: number): string {
  const bytes = Math.ceil(length / 2);

  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID().replace(/-/g, "").slice(0, length);
  }

  if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
    const buffer = new Uint8Array(bytes);
    crypto.getRandomValues(buffer);
    return Array.from(buffer, (b) => b.toString(16).padStart(2, "0"))
      .join("")
      .slice(0, length);
  }

  return Math.random()
    .toString(16)
    .slice(2, 2 + length)
    .padEnd(length, "0");
}
