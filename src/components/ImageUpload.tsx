"use client";

import { useRef, useState } from "react";
import Avatar from "./Avatar";

/**
 * Subida de imagen (escudo de equipo o foto de jugador).
 *
 * La imagen se redimensiona en el navegador con un canvas y se guarda como
 * "data URL" (base64) en el propio campo de la base de datos (crestUrl/photoUrl).
 * Ventaja: funciona también en el despliegue online (no depende de escribir
 * archivos en disco) y mantiene todo en local. También admite pegar una URL.
 */
export default function ImageUpload({
  name,
  value,
  onChange,
  square = false,
  maxSize = 256,
}: {
  name: string;
  value: string;
  onChange: (dataUrl: string) => void;
  square?: boolean;
  maxSize?: number;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setError(null);
    if (!file.type.startsWith("image/")) {
      setError("El archivo debe ser una imagen.");
      return;
    }
    setBusy(true);
    try {
      const dataUrl = await resizeImage(file, maxSize);
      onChange(dataUrl);
    } catch {
      setError("No se ha podido procesar la imagen.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex items-center gap-4">
      <Avatar name={name || "?"} src={value || null} size="lg" square={square} />
      <div className="flex-1 space-y-2">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="btn-ghost text-xs"
            disabled={busy}
          >
            {busy ? "Procesando..." : "📷 Subir imagen"}
          </button>
          {value && (
            <button type="button" onClick={() => onChange("")} className="btn-ghost text-xs text-red-500">
              Quitar
            </button>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
            e.target.value = "";
          }}
        />
        <input
          type="url"
          className="input text-xs"
          placeholder="...o pega una URL de imagen"
          value={value.startsWith("data:") ? "" : value}
          onChange={(e) => onChange(e.target.value)}
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    </div>
  );
}

/** Redimensiona una imagen a un cuadrado máximo y devuelve un data URL PNG. */
function resizeImage(file: File, maxSize: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("no ctx"));
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/png"));
      };
      img.onerror = reject;
      img.src = reader.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
