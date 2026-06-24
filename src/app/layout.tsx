import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Prepartido 3ª RFEF · G14",
  description: "Herramienta privada para preparar partidos como árbitro.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
