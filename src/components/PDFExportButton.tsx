"use client";

/**
 * Exporta el briefing a PDF.
 * Usa la impresión del navegador (window.print) con estilos @media print, que
 * permite "Guardar como PDF". Es la opción más fiable para una app local y no
 * requiere dependencias pesadas en el servidor.
 */
export default function PDFExportButton() {
  return (
    <button onClick={() => window.print()} className="btn-primary no-print">
      🖨️ Exportar a PDF
    </button>
  );
}
