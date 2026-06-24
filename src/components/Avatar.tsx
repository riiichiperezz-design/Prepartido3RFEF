import clsx from "clsx";
import { initials } from "@/lib/format";

/**
 * Avatar genérico (jugador, staff) o escudo (equipo). Si hay imagen la muestra;
 * si no, dibuja las iniciales sobre un fondo de color. Evita depender de red.
 */
export default function Avatar({
  name,
  src,
  size = "md",
  square = false,
}: {
  name: string;
  src?: string | null;
  size?: "sm" | "md" | "lg" | "xl";
  square?: boolean;
}) {
  const dim = { sm: "h-8 w-8 text-xs", md: "h-11 w-11 text-sm", lg: "h-16 w-16 text-lg", xl: "h-24 w-24 text-2xl" }[size];

  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={src}
        alt={name}
        className={clsx(dim, square ? "rounded-xl" : "rounded-full", "object-cover")}
      />
    );
  }
  return (
    <div
      className={clsx(
        dim,
        square ? "rounded-xl" : "rounded-full",
        "flex items-center justify-center bg-ink font-bold text-white",
      )}
    >
      {initials(name)}
    </div>
  );
}
