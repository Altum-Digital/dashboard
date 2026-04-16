import { Link } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { StatusBadge, PackageBadge } from "@/components/Badge";
import type { Client } from "@/data/types";

function clientStats(c: Client) {
  const open  = c.tasks.filter(t => t.status !== "done").length;
  const checks = c.monthlyChecks.filter(ch => ch.done).length;
  const total  = c.monthlyChecks.length;
  return { open, checks, total };
}

export function Dashboard() {
  const { clients, loading } = useApp();

  if (loading) return (
    <div className="min-h-screen bg-[#0f1117] flex items-center justify-center text-slate-500 text-sm">
      Cargando...
    </div>
  );

  const active  = clients.filter(c => c.status === "active").length;
  const pending = clients.filter(c => c.status === "pending").length;
  const totalMRR = clients.reduce((s, c) => s + c.monthlyFee, 0);

  return (
    <div className="min-h-screen bg-[#0f1117]">
      {/* Header */}
      <header className="border-b border-white/8 px-8 py-5 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Agency Dashboard</h1>
          <p className="text-sm text-slate-500 mt-0.5">Control de clientes — Eugenio Creixell</p>
        </div>
        <Link
          to="/new"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          + Nuevo cliente
        </Link>
      </header>

      <div className="px-8 py-8 max-w-6xl mx-auto">

        {/* KPIs */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white/4 border border-white/8 rounded-xl p-5">
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Clientes activos</p>
            <p className="text-3xl font-bold text-white">{active}</p>
          </div>
          <div className="bg-white/4 border border-white/8 rounded-xl p-5">
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Pendientes</p>
            <p className="text-3xl font-bold text-yellow-400">{pending}</p>
          </div>
          <div className="bg-white/4 border border-white/8 rounded-xl p-5">
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">MRR total</p>
            <p className="text-3xl font-bold text-white">
              {totalMRR === 0 ? "—" : `$${totalMRR.toLocaleString()} USD`}
            </p>
          </div>
        </div>

        {/* Client list */}
        <div className="space-y-3">
          {clients.map(c => {
            const { open, checks, total } = clientStats(c);
            const checkPct = total > 0 ? Math.round((checks / total) * 100) : 0;
            return (
              <Link
                key={c.id}
                to={`/client/${c.id}`}
                className="block bg-white/4 border border-white/8 rounded-xl px-6 py-5 hover:bg-white/7 hover:border-white/15 transition-all group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1.5">
                      <h2 className="text-base font-semibold text-white group-hover:text-blue-400 transition-colors truncate">
                        {c.name}
                      </h2>
                      <StatusBadge status={c.status} />
                      <PackageBadge pkg={c.package} />
                    </div>
                    <p className="text-sm text-slate-500">{c.industry} · {c.contactName}</p>
                  </div>

                  <div className="flex items-center gap-6 shrink-0 text-right">
                    {/* Tasks */}
                    <div>
                      <p className="text-xs text-slate-600 mb-0.5">Tareas abiertas</p>
                      <p className={`text-lg font-bold ${open > 0 ? "text-yellow-400" : "text-green-400"}`}>{open}</p>
                    </div>
                    {/* Monthly checks */}
                    <div>
                      <p className="text-xs text-slate-600 mb-0.5">Checklist mes</p>
                      <p className={`text-lg font-bold ${checkPct < 100 ? "text-slate-300" : "text-green-400"}`}>
                        {checks}/{total}
                      </p>
                    </div>
                    {/* Fee */}
                    <div>
                      <p className="text-xs text-slate-600 mb-0.5">Mensualidad</p>
                      <p className="text-lg font-bold text-slate-300">
                        {c.monthlyFee === 0 ? "Pro bono" : `$${c.monthlyFee}`}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Progress bar for monthly checks */}
                {total > 0 && (
                  <div className="mt-3">
                    <div className="h-1 bg-white/8 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${checkPct === 100 ? "bg-green-500" : "bg-blue-500"}`}
                        style={{ width: `${checkPct}%` }}
                      />
                    </div>
                  </div>
                )}
              </Link>
            );
          })}
        </div>

      </div>
    </div>
  );
}
