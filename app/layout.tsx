import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { site } from "@/content/site";
import { asset } from "@/lib/paths";
import "./globals.css";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: `${site.name} — Engenheiro de IA`,
  description: site.description,
  openGraph: {
    title: `${site.name} — Engenheiro de IA`,
    description: site.description,
    type: "website",
    locale: "pt_BR",
    images: [{ url: asset("/img/hippogriff-1440.webp"), width: 1440, alt: "Gravura do hipogrifo de Gustave Doré em violeta" }],
  },
  icons: { icon: asset("/favicon.svg") },
};

export const viewport: Viewport = {
  themeColor: "#fbf8ec",
  width: "device-width",
  initialScale: 1,
};

// Marca a página como "com JS" antes da pintura, para esconder as gravuras
// até o shader assumir (sem piscar a imagem pronta antes da revelação).
const boot = `document.documentElement.classList.add('js')`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${serif.variable} ${sans.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: boot }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
