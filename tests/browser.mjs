// Shared headless-browser setup for the preview tests: SwiftShader WebGL (no GPU in CI / containers),
// the Chromium that is installed here, and the preview server address.
//   PREVIEW_PORT   port of `node preview/server.mjs <port>` (default 8770)
//   CHROMIUM       path of a Chromium binary (default: Playwright's own, else /opt/pw-browsers)
import { chromium } from "playwright";
import { existsSync, readdirSync } from "node:fs";
export const BASE = `http://127.0.0.1:${process.env.PREVIEW_PORT || 8770}`;
function findChromium() {
  if (process.env.CHROMIUM) return process.env.CHROMIUM;
  try { if (existsSync(chromium.executablePath())) return undefined; } catch {}
  const root = "/opt/pw-browsers";
  if (existsSync(root)) for (const d of readdirSync(root).filter((n) => /^chromium-\d+$/.test(n)).sort().reverse()) { const p = `${root}/${d}/chrome-linux/chrome`; if (existsSync(p)) return p; }
  return undefined;
}
export const launch = (args = []) => chromium.launch({ executablePath: findChromium(), args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist", ...args] });
