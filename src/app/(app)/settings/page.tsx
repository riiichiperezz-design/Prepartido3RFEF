import { getProvidersStatus, getActiveProviderKey } from "@/dataProviders";
import { DATA_PROVIDER_LABELS } from "@/lib/enums";
import ProviderCard from "@/components/ProviderCard";
import AlertBox from "@/components/AlertBox";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const providers = getProvidersStatus();
  const active = getActiveProviderKey();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-ink">Ajustes · Fuentes de datos</h1>
        <p className="text-sm text-ink-muted">
          Elige de dónde salen los datos. La app funciona perfectamente sin ninguna API configurada.
        </p>
      </div>

      <AlertBox level="info" title="Cómo cambiar el proveedor activo">
        El proveedor activo se define en el archivo <code>.env</code> con la variable{" "}
        <code>ACTIVE_DATA_PROVIDER</code> (valores: <code>manual</code>, <code>csv</code>,{" "}
        <code>besoccer</code>, <code>apifootball</code>). Actualmente:{" "}
        <strong>{DATA_PROVIDER_LABELS[active]}</strong>. Para conectar una API, añade su clave
        (<code>BESOCCER_API_KEY</code> o <code>API_FOOTBALL_KEY</code>) y reinicia la app.
      </AlertBox>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {providers.map((p) => (
          <ProviderCard key={p.id} provider={p} />
        ))}
      </div>

      <AlertBox level="low" title="Privacidad">
        Todos los datos se guardan en local (SQLite). No se envía nada a terceros salvo que tú
        configures expresamente una API. Cada equipo, jugador y miembro del cuerpo técnico indica si
        su origen es manual, importado o de API.
      </AlertBox>
    </div>
  );
}
