// mGBA(WebAssembly) はスレッドを使うため、Cross-Origin Isolation 用ヘッダを付けて配信する必要がある。
// 依存パッケージなしの簡易静的サーバ。
import http from "node:http";
import { createReadStream, statSync } from "node:fs";
import { extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(fileURLToPath(new URL("./public", import.meta.url)));
const PORT = Number(process.env.PORT ?? 8080);

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".wasm": "application/wasm",
  ".map": "application/json",
  ".css": "text/css; charset=utf-8",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".svg": "image/svg+xml",
  ".json": "application/json",
};

http
  .createServer((req, res) => {
    const urlPath = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
    let filePath = join(ROOT, normalize(urlPath === "/" ? "/index.html" : urlPath));
    if (!filePath.startsWith(ROOT)) {
      res.writeHead(403).end("Forbidden");
      return;
    }
    let st;
    try {
      st = statSync(filePath);
      if (st.isDirectory()) {
        filePath = join(filePath, "index.html");
        st = statSync(filePath);
      }
    } catch {
      res.writeHead(404).end("Not Found");
      return;
    }
    res.writeHead(200, {
      "Content-Type": MIME[extname(filePath)] ?? "application/octet-stream",
      "Content-Length": st.size,
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Embedder-Policy": "require-corp",
      "Cross-Origin-Resource-Policy": "same-origin",
      "Cache-Control": "no-cache",
    });
    createReadStream(filePath).pipe(res);
  })
  .listen(PORT, () => {
    console.log(`mGBA Web: http://localhost:${PORT}`);
  });
