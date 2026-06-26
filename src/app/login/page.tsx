/** Pantalla de acceso (login local básico por contraseña). */
export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center text-white">
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-400">
            Prepartido · Análisis arbitral
          </div>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">Tercera Federación · G14</h1>
          <p className="mt-1 text-sm text-gray-400">Herramienta privada de preparación de partidos</p>
        </div>

        <form action="/api/auth/login" method="post" className="card space-y-4 p-6">
          <div>
            <label className="label" htmlFor="password">
              Contraseña de acceso
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoFocus
              required
              className="input"
              placeholder="Introduce tu contraseña"
            />
          </div>

          {searchParams.error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              Contraseña incorrecta. Inténtalo de nuevo.
            </p>
          )}

          <button type="submit" className="btn-primary w-full py-2.5">
            Entrar
          </button>

          <p className="text-center text-xs text-slate-400">
            Configura tu contraseña en el archivo <code>.env</code> (APP_PASSWORD).
          </p>
        </form>
      </div>
    </div>
  );
}
