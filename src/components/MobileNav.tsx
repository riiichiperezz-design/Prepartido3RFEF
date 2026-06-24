"use client";

import Link from "next/link";

/** Barra superior solo para móvil/tablet (la lateral se oculta en pantallas pequeñas). */
export default function MobileNav() {
  return (
    <header className="no-print sticky top-0 z-10 flex items-center gap-3 overflow-x-auto border-b border-slate-200 bg-ink px-4 py-3 text-white md:hidden">
      <span className="font-extrabold">Prepartido G14</span>
      <nav className="ml-auto flex gap-3 text-sm">
        <Link href="/" className="hover:text-pitch-500">Panel</Link>
        <Link href="/match" className="font-semibold text-pitch-500">Partido</Link>
        <Link href="/teams" className="hover:text-pitch-500">Equipos</Link>
        <Link href="/players" className="hover:text-pitch-500">Jugadores</Link>
      </nav>
    </header>
  );
}
