import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

const inter = localFont({
  src: "../fonts/inter-latin-wght-normal.woff2",
  variable: "--font-inter",
  weight: "100 900",
  display: "swap",
});

const exo = localFont({
  src: [
    { path: "../fonts/exo-2-latin-wght-normal.woff2", style: "normal", weight: "100 900" },
    { path: "../fonts/exo-2-latin-wght-italic.woff2", style: "italic", weight: "100 900" },
  ],
  variable: "--font-exo",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: process.env.SITE_URL ? new URL(process.env.SITE_URL) : undefined,
  title: {
    default: "ERCA LOC | Locação de Tecnologia",
    template: "%s | ERCA LOC",
  },
  description:
    "Locação de notebooks, monitores, celulares e impressoras para empresas, com gestão de inventário e suporte técnico.",
  icons: { icon: "/brand/simbolo.png", apple: "/brand/simbolo.png" },
};

export const viewport: Viewport = {
  themeColor: "#0B2340",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${exo.variable}`} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
