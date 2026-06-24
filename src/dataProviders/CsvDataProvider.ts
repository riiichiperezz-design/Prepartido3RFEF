import { ManualDataProvider } from "./ManualDataProvider";

/**
 * Proveedor CSV/Excel.
 *
 * Una vez importas un archivo, los datos quedan guardados en la base de datos
 * local, así que la lectura es idéntica a la del proveedor manual. La diferencia
 * conceptual es el origen del dato (se marca como CSV al importar). Por eso
 * reutilizamos la lógica de lectura de ManualDataProvider.
 *
 * La importación en sí vive en src/lib/import.ts (parser + upsert conservando
 * tus notas).
 */
export class CsvDataProvider extends ManualDataProvider {
  readonly id = "csv";
  readonly label = "Datos CSV/Excel";
}
