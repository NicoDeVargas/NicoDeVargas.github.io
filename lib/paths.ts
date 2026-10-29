import images from "@/content/images.json";
import type { PlateName } from "@/content/projects";

/** Prefixo do site (vazio na Vercel; "/<repo>" no GitHub Pages de projeto). */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Caminho de um arquivo em /public, com o basePath aplicado. */
export function asset(path: string): string {
  if (/^(https?:|mailto:|#)/.test(path)) return path;
  return `${basePath}${path}`;
}

type ImageInfo = { width: number; height: number; widths: number[] };
const manifest = images as Record<string, ImageInfo>;

export function plateInfo(name: PlateName | "avatar"): ImageInfo {
  return manifest[name];
}

export function srcSet(name: string, format: "avif" | "webp"): string {
  return manifest[name].widths.map((w) => `${asset(`/img/${name}-${w}.${format}`)} ${w}w`).join(", ");
}

export function fallbackSrc(name: string, width = 1440): string {
  const widths = manifest[name].widths;
  const w = widths.find((x) => x >= width) ?? widths[widths.length - 1];
  return asset(`/img/${name}-${w}.webp`);
}
