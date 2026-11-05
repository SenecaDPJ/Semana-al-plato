import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { resolve, extname } from "node:path";
const root = process.cwd();
const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
};
createServer(async (req, res) => {
  try {
    const path = decodeURIComponent(
      new URL(req.url, "http://localhost").pathname,
    );
    const file = resolve(root, "." + (path === "/" ? "/index.html" : path));
    if (!file.startsWith(root + "/")) {
      res.writeHead(403);
      return res.end();
    }
    const body = await readFile(file);
    res.writeHead(200, {
      "Content-Type": mime[extname(file)] || "application/octet-stream",
      "Cache-Control": "no-store",
    });
    res.end(body);
  } catch {
    res.writeHead(404);
    res.end("No encontrado");
  }
}).listen(1420, "127.0.0.1", () => console.log("Semana al Plato: http://127.0.0.1:1420"));
