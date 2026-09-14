export const passwordRules = [
  { label: "At least 8 characters", test: (value) => value.length >= 8 },
  { label: "An uppercase letter (A–Z)", test: (value) => /[A-Z]/.test(value) },
  { label: "A lowercase letter (a–z)", test: (value) => /[a-z]/.test(value) },
  { label: "A number (0–9)", test: (value) => /[0-9]/.test(value) },
  { label: "A special character (such as !@#$%)", test: (value) => /[^A-Za-z0-9\s]/.test(value) },
  { label: "No spaces; at most 72 UTF-8 bytes", test: (value) => !/\s/.test(value) && new TextEncoder().encode(value).length <= 72 }
];

export function validatePassword(value) {
  if (typeof value !== "string") return "Password must be a string.";
  return passwordRules.every((rule) => rule.test(value))
    ? ""
    : "Use at least 8 characters with uppercase and lowercase letters, a number, and a special character. No spaces; maximum 72 UTF-8 bytes.";
}
