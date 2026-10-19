export interface FrameRoute { path: string; fragment: string; params: Record<string, unknown> }

/** Theme-local HTML only. No URLs, encoded traversal, queries or hidden paths. */
export function frameRoute(value: unknown, current: string, params: unknown = {}): FrameRoute | null {
  if (typeof value !== "string" || value.length > 500) return null;
  const split = value.indexOf("#");
  const path = (split < 0 ? value : value.slice(0, split)) || current;
  const fragment = split < 0 ? "" : value.slice(split + 1);
  if (!path || path.length > 300 || !/\.html?$/i.test(path) || !/^[\w .()&'+,-]+(?:\/[\w .()&'+,-]+)*$/.test(path) || path.split("/").some(p => p.startsWith("."))) return null;
  if (fragment.length > 160 || /[\u0000-\u001f]/.test(fragment)) return null;
  if (!params || typeof params !== "object" || Array.isArray(params)) return null;
  try {
    const json = JSON.stringify(params);
    if (json.length > 8192) return null;
    const copy = JSON.parse(json);
    if (!copy || typeof copy !== "object" || Array.isArray(copy)) return null;
    return { path, fragment, params: copy };
  } catch { return null; }
}
