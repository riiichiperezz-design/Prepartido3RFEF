import type { DataProvider } from "./types";
import { ManualDataProvider } from "./ManualDataProvider";
import { CsvDataProvider } from "./CsvDataProvider";
import { ApiFootballProvider } from "./ApiFootballProvider";
import { BeSoccerProvider } from "./BeSoccerProvider";

export * from "./types";
export { ManualDataProvider, CsvDataProvider, ApiFootballProvider, BeSoccerProvider };

/** Instancia (singleton) de cada proveedor disponible. */
export const providers = {
  manual: new ManualDataProvider(),
  csv: new CsvDataProvider(),
  besoccer: new BeSoccerProvider(),
  apifootball: new ApiFootballProvider(),
} as const;

export type ProviderKey = keyof typeof providers;

/** Lee de .env qué proveedor está activo (por defecto: manual). */
export function getActiveProviderKey(): ProviderKey {
  const key = (process.env.ACTIVE_DATA_PROVIDER || "manual").toLowerCase();
  if (key in providers) return key as ProviderKey;
  return "manual";
}

/** Devuelve el proveedor activo según la configuración. */
export function getActiveProvider(): DataProvider {
  return providers[getActiveProviderKey()];
}

/** Estado de configuración de todos los proveedores (para la pantalla Ajustes). */
export function getProvidersStatus() {
  return Object.values(providers).map((p) => ({
    id: p.id,
    label: p.label,
    configured: p.isConfigured(),
    active: p.id === getActiveProviderKey(),
  }));
}
