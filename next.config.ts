import type { NextConfig } from "next";

/**
 * Export estático. Funciona na Vercel (sem prefixo) e no GitHub Pages:
 * - site de usuário (usuario.github.io): deixe BASE_PATH vazio;
 * - repositório de projeto (usuario.github.io/<repo>): BASE_PATH=/<repo>.
 */
const basePath = (process.env.BASE_PATH ?? "").replace(/\/$/, "");

const nextConfig: NextConfig = {
  output: "export",
  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,
  trailingSlash: true,
  images: { unoptimized: true },
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  turbopack: { root: process.cwd() },
};

export default nextConfig;
