"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import {
  DashboardIcon,
  BriefingIcon,
  TeamIcon,
  PlayerIcon,
  TargetIcon,
  ClockIcon,
  ImportIcon,
  SettingsIcon,
  LogoutIcon,
} from "./icons";

const items = [
  { href: "/", label: "Panel", Icon: DashboardIcon },
  { href: "/match", label: "Preparar partido", Icon: BriefingIcon, primary: true },
  { href: "/tactics", label: "Campo táctico", Icon: TargetIcon },
  { href: "/weekly", label: "Actualización semanal", Icon: ClockIcon },
  { href: "/teams", label: "Equipos", Icon: TeamIcon },
  { href: "/players", label: "Jugadores", Icon: PlayerIcon },
  { href: "/import", label: "Importar datos", Icon: ImportIcon },
  { href: "/settings", label: "Ajustes", Icon: SettingsIcon },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="no-print sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-ink-line bg-ink px-3 py-5 text-gray-300 md:flex">
      <div className="mb-7 px-3">
        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500">
          Prepartido
        </div>
        <div className="text-lg font-semibold leading-tight text-white">Análisis arbitral</div>
        <div className="mt-0.5 text-xs text-gray-500">3ª RFEF · Grupo 14</div>
      </div>

      <nav className="flex flex-1 flex-col gap-0.5">
        {items.map(({ href, label, Icon, primary }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-white/10 font-medium text-white"
                  : "text-gray-400 hover:bg-white/5 hover:text-white",
              )}
            >
              <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={1.75} />
              <span className="truncate">{label}</span>
              {primary && !active && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-accent" />
              )}
            </Link>
          );
        })}
      </nav>

      <form action="/api/auth/logout" method="post" className="mt-4 border-t border-white/10 pt-3">
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-400 transition-colors hover:bg-white/5 hover:text-white">
          <LogoutIcon className="h-[18px] w-[18px]" strokeWidth={1.75} />
          Cerrar sesión
        </button>
      </form>
    </aside>
  );
}
