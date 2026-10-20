import { createServer } from "node:http";
import { createReadStream, existsSync, readFileSync, statSync } from "node:fs";
import { resolve, extname, sep } from "node:path";
import { fileURLToPath } from "node:url";
const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const types = { ".html":"text/html", ".js":"text/javascript", ".css":"text/css", ".json":"application/json", ".jpg":"image/jpeg", ".png":"image/png", ".gif":"image/gif", ".webp":"image/webp", ".mp4":"video/mp4", ".wav":"audio/wav", ".ogg":"audio/ogg", ".mp3":"audio/mpeg", ".woff2":"font/woff2", ".svg":"image/svg+xml", ".ttf":"font/ttf" };
// The same policy the plugin's server sends (py_modules/data_themes.py), with the preview's addresses.
export function frameCsp(origin, id) {
  const own = `${origin}/themes/${id}/`, themes = `${origin}/themes/`;
  return ["sandbox allow-scripts", "default-src 'none'", `script-src ${own} 'unsafe-inline'`, `style-src ${own} 'unsafe-inline'`,
    `img-src ${themes} ${origin}/preview/ https://cdn.cloudflare.steamstatic.com data: blob:`, `media-src ${themes} blob:`, `font-src ${themes} data:`,
    "connect-src 'none'", "frame-src 'none'", "worker-src 'none'", "form-action 'none'", "base-uri 'none'"].join("; ");
}
// The wrapper page a community interface is opened through (py_modules/data_themes.py: WRAPPER / frame_wrapper).
const WRAPPER = (() => {
  const py = readFileSync(resolve(root, "py_modules/data_themes.py"), "utf8");
  return py.match(/WRAPPER = """([\s\S]*?)"""/)[1];
})();
export function frameWrapper(origin, id, entry) {
  const own = `${origin}/themes/${encodeURIComponent(id)}/`;
  const src = own + entry.split("/").map(encodeURIComponent).join("/");
  const html = WRAPPER.replace("__SRC__", src.replace(/&/g, "&amp;").replace(/"/g, "&quot;"));
  const csp = ["sandbox allow-scripts", "default-src 'none'", "script-src 'unsafe-inline'", "style-src 'unsafe-inline'", `frame-src ${own}`, "connect-src 'none'", "form-action 'none'", "base-uri 'none'"].join("; ");
  return { html, csp };
}
// Data themes are read from themes/ (shipped) and, for the tests only, tests/fixtures/themes/ (never shipped).
function themePath(rest) {
  const media=resolve(root,"out/frame-media","."+rest);
  if(media.startsWith(resolve(root,"out/frame-media")+sep)&&existsSync(media))return media;
  for (const dir of ["themes", "tests/fixtures/themes", "out/import-fixtures"]) {
    const base = resolve(root, dir);
    const path = resolve(base, "." + rest);
    if (path.startsWith(base + sep) && existsSync(path)) return path;
  }
  return null;
}
export async function startPreviewServer(port = 0) {
  const server = createServer((req, res) => {
    try {
      const name = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
      const wrap = name.match(/^\/frame-wrap\/([a-z0-9:-]+)\/(.+\.html?)$/);
      if (wrap) {
        if (!themePath(`/${wrap[1]}/${wrap[2]}`)) throw new Error();
        const { html, csp } = frameWrapper(`http://${req.headers.host}`, wrap[1], wrap[2]);
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8", "Content-Security-Policy": csp, "X-Content-Type-Options": "nosniff", "Referrer-Policy": "no-referrer" });
        res.end(html);
        return;
      }
      const path = name.startsWith("/themes/") ? themePath(name.slice("/themes".length)) : resolve(root, "." + (name === "/" ? "/preview/preview.html" : name));
      if (!path || !path.startsWith(root + sep) || !["preview", "bundle", "assets", "out", "themes", "tests/fixtures/themes"].some(dir => path.startsWith(resolve(root, dir) + sep))) { res.writeHead(403); res.end(); return; }
      const st = statSync(path); if (!st.isFile()) throw new Error();
      const headers = { "Content-Type": types[extname(path)] || "application/octet-stream", "Content-Length": st.size };
      // data-theme pages run sealed, as on the Deck (py_modules/data_themes.py: frame_csp)
      const theme = name.match(/^\/themes\/([a-z0-9:-]+)\/.+\.html?$/);
      if (theme) Object.assign(headers, { "Content-Security-Policy": frameCsp(`http://${req.headers.host}`, theme[1]), "X-Content-Type-Options": "nosniff", "Referrer-Policy": "no-referrer" });
      res.writeHead(200, headers);
      createReadStream(path).pipe(res);
    } catch { res.writeHead(404); res.end("Preview file not found"); }
  });
  await new Promise(resolve => server.listen(port, "127.0.0.1", resolve));
  return { server, url: `http://127.0.0.1:${server.address().port}/preview/preview.html` };
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { url } = await startPreviewServer(Number(process.argv[2]) || 8766);
  console.log(url);
}
