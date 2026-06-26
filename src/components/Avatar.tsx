import clsx from "clsx";
import { initials } from "@/lib/format";
import { PlayerIcon, TeamIcon } from "./icons";

/**
 * Avatar de jugador/técnico o escudo de equipo. Si hay imagen la muestra; si no,
 * dibuja un placeholder profesional (iniciales sobre fondo neutro, o un icono).
 * No depende de red y nunca rompe el diseño aunque falte la imagen.
 */
export default function Avatar({
  name,
  src,
  size = "md",
  square = false,
  variant = "person",
}: {
  name: string;
  src?: string | null;
  size?: "sm" | "md" | "lg" | "xl";
  square?: boolean;
  variant?: "person" | "team";
}) {
  const dim = {
    sm: "h-8 w-8 text-[11px]",
    md: "h-11 w-11 text-sm",
    lg: "h-16 w-16 text-base",
    xl: "h-24 w-24 text-xl",
  }[size];
  const radius = square ? "rounded-xl" : "rounded-full";

  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={src}
        alt={name}
        className={clsx(dim, radius, "border border-ink-line bg-white object-cover")}
      />
    );
  }

  const ini = initials(name);
  const Icon = variant === "team" ? TeamIcon : PlayerIcon;
  return (
    <div
      className={clsx(
        dim,
        radius,
        "flex items-center justify-center border border-ink-line bg-gray-100 font-semibold text-ink-muted",
      )}
    >
      {ini || <Icon className="h-1/2 w-1/2" strokeWidth={1.5} />}
    </div>
  );
}
