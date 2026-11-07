import { readFile, mkdir, writeFile } from "node:fs/promises";
const files = ["domain", "storage", "i18n", "app"];
const js = (
  await Promise.all(files.map((x) => readFile(`src/${x}.js`, "utf8")))
)
  .map((s) => s.replace(/^import[\s\S]*?from\s+['"][^'"]+['"];?\s*$/gm, "").replace(/^export /gm, ""))
  .join("\n");
const css = await readFile("src/style.css", "utf8");
let html = await readFile("index.html", "utf8");
html = html
  .replace(
    /<link rel="stylesheet" href="\.\/src\/style\.css"\s*\/?>/,
    () => `<style>${css}</style>`,
  )
  .replace(
    '<script type="module" src="./src/app.js"></script>',
    () => `<script type="module">${js}</script>`,
  );
await mkdir("dist", { recursive: true });
await writeFile("dist/index.html", html);
console.log("dist/index.html listo (sin recursos externos).");
