import { createServer } from "node:http";
import { createReadStream, statSync } from "node:fs";
import { resolve, extname, sep } from "node:path";
import { fileURLToPath } from "node:url";
const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const types = { ".html":"text/html", ".js":"text/javascript", ".css":"text/css", ".json":"application/json", ".jpg":"image/jpeg", ".png":"image/png", ".gif":"image/gif", ".webp":"image/webp", ".mp4":"video/mp4", ".wav":"audio/wav", ".ogg":"audio/ogg", ".mp3":"audio/mpeg" };
export async function startPreviewServer(port = 0) {
  const server = createServer((req, res) => {
    try {
      const name = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
      const path = resolve(root, "." + (name === "/" ? "/preview/preview.html" : name));
      if (!path.startsWith(root + sep) || !["preview", "bundle", "assets", "out"].some(dir => path.startsWith(resolve(root, dir) + sep))) { res.writeHead(403); res.end(); return; }
      const st = statSync(path); if (!st.isFile()) throw new Error();
      res.writeHead(200, { "Content-Type": types[extname(path)] || "application/octet-stream", "Content-Length": st.size });
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
