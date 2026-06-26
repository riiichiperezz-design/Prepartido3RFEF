import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

/**
 * Tipografía profesional Inter (auto-alojada por next/font, sin llamadas en
 * runtime). Se expone como variable CSS --font-sans usada por Tailwind.
 */
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Prepartido · Análisis arbitral",
  description: "Herramienta privada de preparación y análisis arbitral.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
