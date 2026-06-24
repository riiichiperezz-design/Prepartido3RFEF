"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

/** Navegación lateral principal. Marca la sección activa. */
const items = [
  { href: "/", label: "Panel", icon: "🏠" },
  { href: "/match", label: "Preparar partido", icon: "📋", highlight: true },
  { href: "/teams", label: "Equipos", icon: "🛡️" },
  { href: "/players", label: "Jugadores", icon: "👤" },
  { href: "/import", label: "Importar datos", icon: "📥" },
  { href: "/settings", label: "Ajustes / Fuentes", icon: "⚙️" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="no-print sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-slate-200 bg-ink px-4 py-6 text-white md:flex">
      <div className="mb-8 px-2">
        <div className="text-xs font-semibold uppercase tracking-widest text-pitch-500">
          Prepartido
        </div>
        <div className="text-xl font-extrabold leading-tight">3ª RFEF · G14</div>
        <div className="mt-1 text-xs text-slate-400">Extremadura · Uso privado</div>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {items.map((it) => {
          const active = it.href === "/" ? pathname === "/" : pathname.startsWith(it.href);
          return (
            <Link
              key={it.href}
              href={it.href}
              className={clsx(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-white/15 text-white"
                  : "text-slate-300 hover:bg-white/10 hover:text-white",
                it.highlight && !active && "ring-1 ring-pitch-500/40",
              )}
            >
              <span className="text-base">{it.icon}</span>
              {it.label}
            </Link>
          );
        })}
      </nav>

      <form action="/api/auth/logout" method="post" className="mt-4">
        <button className="w-full rounded-xl px-3 py-2 text-left text-sm text-slate-400 hover:bg-white/10 hover:text-white">
          ↪ Cerrar sesión
        </button>
      </form>
    </aside>
  );
}
