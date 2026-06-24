import type { Config } from "tailwindcss";

/**
 * Paleta pensada para uso arbitral:
 *  - Fondo claro, tarjetas blancas.
 *  - Verde = riesgo bajo, Ámbar = medio, Rojo = alto.
 *  - Azul oscuro / casi negro para elementos principales.
 */
const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0f172a", // azul-negro principal
          soft: "#1e293b",
          muted: "#475569",
        },
        pitch: {
          50: "#ecfdf5",
          100: "#d1fae5",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
        },
        risk: {
          low: "#16a34a",
          medium: "#f59e0b",
          high: "#dc2626",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 3px rgba(15,23,42,0.08), 0 1px 2px rgba(15,23,42,0.04)",
        cardhover: "0 8px 24px rgba(15,23,42,0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
