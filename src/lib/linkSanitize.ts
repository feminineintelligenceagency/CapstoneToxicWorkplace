/**
 * Helper utilities for validating and sanitizing link payloads used by the
 * Scenario Editor asset manager.
 *
 * Goals:
 * - Ensure only http(s) URLs are accepted.
 * - Reject URLs containing control characters or encoded/newline smuggling.
 * - Provide sanitized filenames for storage (safe chars, length limits).
 * - Provide an HTML-escaped title for safer rendering if UI accidentally uses raw HTML.
 *
 * Usage notes:
 * - Call `validateAndNormalizeUrl` to validate a user-provided URL before saving.
 * - Use `sanitizeTitleForFilename` to generate a filesystem/storage-safe filename prefix.
 * - Use `escapeHtml` when injecting user-provided text into the DOM (prefer React text content).
 * - Use `createLinkFilePayload` to produce the JSON body and filename for upload.
 *
 * IMPORTANT:
 * - This is a defense-in-depth helper. You MUST also:
 *   1) Validate URLs server-side before making them available to clients.
 *   2) Ensure UI rendering never uses dangerouslySetInnerHTML for user-provided fields.
 *   3) Apply bucket/ACL rules so untrusted users can't write arbitrary files.
 */

const MAX_FILENAME_LEN = 128;

/**
 * Characters considered control characters that should not appear in URLs or titles.
 * This covers ASCII C0 controls and DEL.
 */
const CONTROL_CHARS_REGEX = /[\u0000-\u001F\u007F]/;

/**
 * Detect common percent-encoded control characters/newlines that could be used to smuggle content.
 * Checks for %0A, %0D, %00 (case-insensitive).
 */
const PERCENT_ENCODED_CONTROL_REGEX = /%(0a|0d|00)/i;

/**
 * Allowed protocols for links.
 */
const ALLOWED_PROTOCOLS = new Set(["http:", "https:"]);

/**
 * Validate and normalize a raw URL string from user input.
 * - Trims whitespace.
 * - Rejects values that contain control characters or percent-encoded control chars.
 * - Ensures the URL constructor accepts the value and that the protocol is http or https.
 * - Rejects relative URLs (e.g. "//example.com" or "/path") — an absolute origin is required.
 *
 * Returns the normalized URL string (url.toString()) on success.
 * Throws an Error with a clear message on validation failure.
 */
export function validateAndNormalizeUrl(rawUrl: string): string {
  if (typeof rawUrl !== "string") {
    throw new Error("URL must be a string");
  }

  const trimmed = rawUrl.trim();

  if (!trimmed) {
    throw new Error("URL is required");
  }

  // Quick heuristics to catch newline/control char injection attempts before parsing.
  if (CONTROL_CHARS_REGEX.test(trimmed)) {
    throw new Error("URL contains invalid control characters");
  }

  if (PERCENT_ENCODED_CONTROL_REGEX.test(trimmed)) {
    throw new Error("URL contains encoded control characters");
  }

  // Disallow whitespace characters anywhere (spaces, tabs)
  if (/\s/.test(trimmed)) {
    throw new Error("URL contains whitespace");
  }

  // The URL constructor will accept many things; we insist on absolute URLs only.
  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch (err) {
    // If parsing fails, it's not an absolute URL. Reject.
    throw new Error("Invalid URL format; please include the protocol (https://)");
  }

  // Enforce allowed protocols explicitly
  if (!ALLOWED_PROTOCOLS.has(parsed.protocol)) {
    throw new Error("Only http and https links are allowed");
  }

  // hostname must be present
  if (!parsed.hostname) {
    throw new Error("URL must include a hostname");
  }

  // Normalize: re-serialize via URL.toString() to canonicalize.
  const normalized = parsed.toString();

  // As an extra precaution, reject if the normalized string contains control or encoded control characters.
  if (CONTROL_CHARS_REGEX.test(normalized) || PERCENT_ENCODED_CONTROL_REGEX.test(normalized)) {
    throw new Error("URL contains invalid characters after normalization");
  }

  return normalized;
}

/**
 * Sanitize a title for use as part of a filename.
 * - If the title is empty, falls back to using the hostname (if provided).
 * - Replaces non safe filename chars with '-', collapses repeated dashes.
 * - Truncates result to MAX_FILENAME_LEN characters.
 *
 * Example:
 *   "My Link! (Test)" -> "My-Link-Test"
 */
export function sanitizeTitleForFilename(title: string, fallbackHostname?: string): string {
  const raw = (title || "").trim() || (fallbackHostname || "").trim();

  if (!raw) {
    return "link";
  }

  // Replace sequences of characters that are not alphanumeric, dot, underscore or hyphen with '-'
  // This prevents slashes, path moves, or shell metacharacters.
  let safe = raw.replace(/[^\p{L}\p{N}._-]+/gu, "-");

  // Trim leading/trailing dashes or dots/underscores
  safe = safe.replace(/^[._-]+|[._-]+$/g, "");

  // Collapse multiple dashes
  safe = safe.replace(/-+/g, "-");

  if (!safe) {
    safe = "link";
  }

  if (safe.length > MAX_FILENAME_LEN) {
    safe = safe.slice(0, MAX_FILENAME_LEN);
  }

  return safe;
}

/**
 * Escape user-provided text for safe insertion into HTML text contexts.
 * Use this when you must render user-provided titles directly into innerHTML (avoid that where possible).
 */
export function escapeHtml(unsafe: string): string {
  if (unsafe == null) return "";
  return String(unsafe)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Create the .link.json filename and payload for a validated raw title + url.
 * - Calls validateAndNormalizeUrl to ensure URL is safe and normalized.
 * - Uses sanitizeTitleForFilename for a safe filename prefix.
 * - Stores the payload with the normalized URL and the original trimmed title (and a createdAt timestamp).
 *
 * Returns an object:
 * {
 *   fileName: string,         // e.g. "My-Link-163423423423.link.json"
 *   body: string,             // JSON.stringify of the payload
 *   payload: { ... }          // object (useful for tests)
 * }
 *
 * Notes:
 * - We intentionally use the sanitized title only for the filename. For display, UIs should use escapeHtml()
 *   when rendering `payload.title`. Storing the original trimmed title is usually preferable for UX,
 *   but you may choose to store `escapeHtml(title)` as `display_title` if you want an extra layer of defense.
 */
export function createLinkFilePayload(rawTitle: string, rawUrl: string) {
  const normalizedUrl = validateAndNormalizeUrl(rawUrl);
  const parsed = new URL(normalizedUrl);
  const titleTrimmed = (rawTitle || "").trim();

  const filenamePrefix = sanitizeTitleForFilename(
    titleTrimmed || parsed.hostname,
    parsed.hostname,
  );

  const fileName = `${filenamePrefix}-${Date.now()}.link.json`;

  // Store the trimmed title (for UX) and normalized url. UIs must escape title when rendering.
  const payload = {
    title: titleTrimmed || parsed.hostname,
    url: normalizedUrl,
    createdAt: new Date().toISOString(),
  };

  return {
    fileName,
    body: JSON.stringify(payload, null, 2),
    payload,
  };
}

/**
 * Quick utility: returns true if the given rawUrl is likely safe (does not throw validation).
 * Useful for pre-checks in UI without throwing; still prefer the throwing validateAndNormalizeUrl
 * on the critical save path.
 */
export function isUrlLikelySafe(rawUrl: string): boolean {
  try {
    validateAndNormalizeUrl(rawUrl);
    return true;
  } catch {
    return false;
  }
}

/**
 * Exported default for convenience.
 */
export default {
  validateAndNormalizeUrl,
  sanitizeTitleForFilename,
  escapeHtml,
  createLinkFilePayload,
  isUrlLikelySafe,
};
