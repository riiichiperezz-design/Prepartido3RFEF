"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { DashboardIcon, BriefingIcon, TargetIcon, TeamIcon, PlayerIcon } from "./icons";

const items = [
  { href: "/", label: "Panel", Icon: DashboardIcon },
  { href: "/match", label: "Partido", Icon: BriefingIcon },
  { href: "/tactics", label: "Táctico", Icon: TargetIcon },
  { href: "/teams", label: "Equipos", Icon: TeamIcon },
  { href: "/players", label: "Jugadores", Icon: PlayerIcon },
];

export default function MobileNav() {
  const pathname = usePathname();
  return (
    <>
      <header className="no-print sticky top-0 z-20 flex items-center gap-2 border-b border-ink-line bg-ink px-4 py-3 text-white md:hidden">
        <span className="text-sm font-semibold">Prepartido · Arbitral</span>
        <form action="/api/auth/logout" method="post" className="ml-auto">
          <button className="text-xs text-gray-400 hover:text-white">Salir</button>
        </form>
      </header>
      {/* Barra inferior de navegación rápida en móvil */}
      <nav className="no-print fixed inset-x-0 bottom-0 z-20 flex items-stretch border-t border-ink-line bg-white md:hidden">
        {items.map(({ href, label, Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                "flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px]",
                active ? "text-ink" : "text-gray-400",
              )}
            >
              <Icon className="h-5 w-5" strokeWidth={1.75} />
              {label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
