// Gera AVIF e WebP responsivos a partir de assets-src/colored/*.png
// e grava o manifesto content/images.json (larguras e proporção de cada gravura).
// Uso: node scripts/build-images.mjs [nome ...]
import { readdir, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const srcDir = path.join(root, "assets-src", "colored");
const outDir = path.join(root, "public", "img");

const WIDTHS = {
  default: [640, 960, 1440, 1920, 2560],
  avatar: [320, 640],
};

await mkdir(outDir, { recursive: true });
const manifestPath = path.join(root, "content", "images.json");
let manifest = {};
try {
  manifest = JSON.parse(await readFile(manifestPath, "utf8"));
} catch {}
const only = new Set(process.argv.slice(2));

for (const file of (await readdir(srcDir)).filter((f) => f.endsWith(".png")).sort()) {
  const name = file.replace(/\.png$/, "");
  if (only.size && !only.has(name)) continue;
  const input = sharp(path.join(srcDir, file));
  const { width, height } = await input.metadata();
  const widths = (WIDTHS[name] ?? WIDTHS.default).filter((w) => w <= width);
  if (!widths.length || widths.at(-1) < width * 0.9) widths.push(Math.min(width, 2560));
  const uniq = [...new Set(widths)];
  for (const w of uniq) {
    const base = path.join(outDir, `${name}-${w}`);
    const resized = sharp(path.join(srcDir, file)).resize({ width: w });
    await resized.clone().avif({ quality: 52, effort: 6, chromaSubsampling: "4:2:0" }).toFile(`${base}.avif`);
    await resized.clone().webp({ quality: 74, effort: 6 }).toFile(`${base}.webp`);
  }
  manifest[name] = { width, height, widths: uniq };
  console.log(name, width, height, uniq.join(","));
}

await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
