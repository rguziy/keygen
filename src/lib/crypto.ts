export function randBytes(n: number): Uint8Array {
  const arr = new Uint8Array(n);
  crypto.getRandomValues(arr);
  return arr;
}

export function toHex(arr: Uint8Array): string {
  return Array.from(arr)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function toBase64url(arr: Uint8Array): string {
  const b = btoa(String.fromCharCode(...arr));
  return b.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

export type PasswordOptions = {
  length: number;
  upper: boolean;
  lower: boolean;
  digits: boolean;
  symbols: boolean;
};

export function generatePassword(opts: PasswordOptions): string {
  const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const LOWER = "abcdefghijklmnopqrstuvwxyz";
  const DIGITS = "0123456789";
  const SYMBOLS = "!@#$%^&*()-_=+[]{}|;:,.<>?";

  let charset = "";
  if (opts.upper) charset += UPPER;
  if (opts.lower) charset += LOWER;
  if (opts.digits) charset += DIGITS;
  if (opts.symbols) charset += SYMBOLS;
  if (!charset) charset = LOWER + DIGITS;

  const bytes = randBytes(opts.length * 2);
  let result = "";
  let i = 0;
  while (result.length < opts.length) {
    result += charset[bytes[i % bytes.length] % charset.length];
    i++;
  }
  return result;
}

export type ApiFormat = "hex" | "base64url" | "prefixed" | "segments";

export function generateApiKey(bytes: number, format: ApiFormat): string {
  const arr = randBytes(bytes);
  switch (format) {
    case "hex":
      return toHex(arr);
    case "base64url":
      return toBase64url(arr);
    case "prefixed":
      return "sk-" + toBase64url(arr);
    case "segments": {
      const h = toHex(arr);
      const parts: string[] = [];
      for (let i = 0; i < h.length; i += 8) parts.push(h.slice(i, i + 8));
      return parts.join("-");
    }
  }
}

export function generateUUID(): string {
  const arr = randBytes(16);
  arr[6] = (arr[6] & 0x0f) | 0x40;
  arr[8] = (arr[8] & 0x3f) | 0x80;
  const h = toHex(arr);
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20, 32)}`;
}

export type StrengthLevel = "weak" | "fair" | "strong" | "excellent";

export function calcStrength(val: string): {
  score: number;
  level: StrengthLevel;
  label: string;
} {
  const hasUpper = /[A-Z]/.test(val);
  const hasLower = /[a-z]/.test(val);
  const hasDigit = /[0-9]/.test(val);
  const hasSymbol = /[^A-Za-z0-9]/.test(val);
  const variety = [hasUpper, hasLower, hasDigit, hasSymbol].filter(Boolean).length;
  const len = val.length;

  let score = 0;
  if (len >= 20) score += 35;
  else if (len >= 12) score += 25;
  else if (len >= 8) score += 15;
  else score += 5;
  score += variety * 16;
  if (len >= 32) score += 10;
  const capped = Math.min(score, 100);

  let level: StrengthLevel;
  let label: string;
  if (capped < 40) { level = "weak"; label = "Weak"; }
  else if (capped < 65) { level = "fair"; label = "Fair"; }
  else if (capped < 85) { level = "strong"; label = "Strong"; }
  else { level = "excellent"; label = "Excellent"; }

  return { score: capped, level, label };
}
