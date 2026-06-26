import type { Config } from "tailwindcss";

/**
 * Sistema de diseño sobrio para una herramienta de análisis arbitral.
 *  - Navegación en grafito / azul noche.
 *  - Riesgo: verde apagado (bajo), ámbar apagado (medio), rojo oscuro (alto).
 *  - Gris técnico para información secundaria.
 *  - Sin colores chillones.
 */
const config: Config = {
  content: ["./src/app/**/*.{ts,tsx}", "./src/components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Grafito / azul noche para navegación y elementos principales
        ink: {
          DEFAULT: "#111827",
          soft: "#1f2937",
          muted: "#6b7280",
          line: "#e5e7eb",
        },
        // Fondo de aplicación
        canvas: "#f4f5f7",
        // Acento sobrio (verde técnico) para acciones principales
        accent: {
          DEFAULT: "#0f766e",
          soft: "#115e59",
          tint: "#ecfdf5",
        },
        // Niveles de riesgo (tonos apagados, nada chillón)
        risk: {
          low: "#15803d",
          lowtint: "#f0fdf4",
          medium: "#b45309",
          mediumtint: "#fffbeb",
          high: "#991b1b",
          hightint: "#fef2f2",
        },
        // Verde césped para la pizarra táctica (fase 2)
        pitch: {
          dark: "#15512f",
          DEFAULT: "#1c6b3c",
          line: "rgba(255,255,255,0.55)",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "-apple-system", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(17,24,39,0.04), 0 1px 3px rgba(17,24,39,0.06)",
        cardhover: "0 6px 20px rgba(17,24,39,0.10)",
        panel: "0 1px 0 rgba(17,24,39,0.04)",
      },
      borderRadius: {
        xl: "0.75rem",
        "2xl": "1rem",
      },
    },
  },
  plugins: [],
};

export default config;
