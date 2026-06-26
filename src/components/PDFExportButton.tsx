"use client";

import { PrintIcon } from "./icons";

/**
 * Exporta el briefing a PDF mediante la impresión del navegador (window.print)
 * con estilos @media print: permite "Guardar como PDF" con un diseño tipo
 * dossier. Es la opción más fiable para una app local y sin dependencias pesadas.
 */
export default function PDFExportButton() {
  return (
    <button onClick={() => window.print()} className="btn-primary no-print">
      <PrintIcon className="h-4 w-4" strokeWidth={2} />
      Exportar a PDF
    </button>
  );
}
