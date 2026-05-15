import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { StatusBadge, PackageBadge, PhaseBadge } from "@/components/Badge";
import type { Client } from "@/data/types";

function clientStats(c: Client) {
  const open   = c.tasks.filter(t => t.status !== "done").length;
  const checks = c.monthlyChecks.filter(ch => ch.done).length;
  const total  = c.monthlyChecks.length;
  return { open, checks, total };
}

function paymentAlert(c: Client): string | null {
  if (c.monthlyFee === 0) return null;
  if (c.anticipo && !c.anticipo.received) return "Anticipo pendiente";
  if (c.finalPayment && !c.finalPayment.received) return "Pago final pendiente";
  if (!c.mensualidadActive && c.phase === "mantenimiento") return "Mensualidad inactiva";
  return null;
}

export function Dashboard() {
  const { clients, loading } = useApp();
  const [pendingCount, setPendingCount] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/submissions")
      .then(r => r.ok ? r.json() : [])
      .then((subs: { reviewed: boolean }[]) => setPendingCount(subs.filter(s => !s.reviewed).length))
      .catch(() => {});
  }, []);

  function copyOnboardingLink() {
    navigator.clipboard.writeText(`${window.location.origin}/onboarding`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-400 text-sm">
      Cargando...
    </div>
  );

  const active   = clients.filter(c => c.status === "active").length;
  const pipeline = clients.filter(c => c.phase !== "mantenimiento").length;
  const totalMRR = clients.filter(c => c.mensualidadActive).reduce((s, c) => s + c.monthlyFee, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-8 py-5 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Agency Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">Control de clientes — Eugenio Creixell</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={copyOnboardingLink}
            className="px-3 py-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg transition-colors flex items-center gap-2"
          >
            {copied ? "Copiado!" : "Form onboarding"}
            {!copied && (
              <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            )}
          </button>
          <Link to="/templates" className="px-3 py-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg transition-colors">
            Templates
          </Link>
          <Link to="/paquetes" className="px-3 py-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg transition-colors">
            Paquetes
          </Link>
          <a href="/propuesta_altum_digital.pdf" target="_blank" rel="noopener noreferrer" className="px-3 py-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg transition-colors">
            Propuesta PDF
          </a>
          <Link to="/submissions" className="relative px-3 py-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg transition-colors">
            Submissions
            {pendingCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-yellow-400 text-black text-[10px] font-bold rounded-full flex items-center justify-center">
                {pendingCount}
              </span>
            )}
          </Link>
          <Link to="/new" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors">
            + Nuevo cliente
          </Link>
        </div>
      </header>

      <div className="px-8 py-8 max-w-6xl mx-auto">

        {/* KPIs */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-5">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Clientes activos</p>
            <p className="text-3xl font-bold text-gray-900">{active}</p>
          </div>
          <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-5">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">En pipeline</p>
            <p className="text-3xl font-bold text-yellow-600">{pipeline}</p>
          </div>
          <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-5">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">MRR mensualidades</p>
            <p className="text-3xl font-bold text-gray-900">
              {totalMRR === 0 ? "—" : `$${totalMRR.toLocaleString("es-MX")} MXN`}
            </p>
          </div>
        </div>

        {/* Client list */}
        <div className="space-y-3">
          {clients.map(c => {
            const { open, checks, total } = clientStats(c);
            const checkPct = total > 0 ? Math.round((checks / total) * 100) : 0;
            const alert    = paymentAlert(c);
            return (
              <Link
                key={c.id}
                to={`/client/${c.id}`}
                className="block bg-white border border-gray-200 rounded-xl px-6 py-5 hover:bg-gray-50 hover:border-gray-300 transition-all group shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <h2 className="text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                        {c.name}
                      </h2>
                      <StatusBadge status={c.status} />
                      <PhaseBadge phase={c.phase} />
                      <PackageBadge pkg={c.package} />
                      {alert && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-50 text-red-500">
                          ⚠ {alert}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{c.industry} · {c.contactName}</p>
                    {c.domain && <p className="text-xs text-gray-400 mt-0.5">{c.domain}</p>}
                  </div>

                  <div className="flex items-center gap-6 shrink-0 text-right">
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">Tareas abiertas</p>
                      <p className={`text-lg font-bold ${open > 0 ? "text-yellow-600" : "text-green-600"}`}>{open}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">Checklist</p>
                      <p className={`text-lg font-bold ${checkPct < 100 ? "text-gray-700" : "text-green-600"}`}>
                        {checks}/{total}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">Mensualidad</p>
                      <p className="text-lg font-bold text-gray-700">
                        {c.monthlyFee === 0 ? "Pro bono" : `$${c.monthlyFee.toLocaleString("es-MX")}`}
                      </p>
                    </div>
                  </div>
                </div>

                {total > 0 && (
                  <div className="mt-3">
                    <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
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
