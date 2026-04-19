import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { Submission } from "@/data/types";

export function Submissions() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const res = await fetch("/api/submissions");
    if (res.ok) setSubmissions(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function markReviewed(id: string) {
    await fetch(`/api/submissions?id=${id}`, { method: "PATCH" });
    setSubmissions(s => s.map(x => x.id === id ? { ...x, reviewed: true } : x));
  }

  async function remove(id: string) {
    await fetch(`/api/submissions?id=${id}`, { method: "DELETE" });
    setSubmissions(s => s.filter(x => x.id !== id));
  }

  const pending = submissions.filter(s => !s.reviewed);
  const reviewed = submissions.filter(s => s.reviewed);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-8 py-5">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link to="/" className="hover:text-gray-900 transition-colors">Dashboard</Link>
            <span>/</span>
            <span className="text-gray-700">Submissions de onboarding</span>
          </div>
          <a
            href="/onboarding"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-xs rounded-lg transition-colors"
          >
            Abrir formulario
          </a>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-gray-900">Formularios recibidos</h1>
          {pending.length > 0 && (
            <span className="px-2.5 py-1 bg-yellow-50 text-yellow-600 text-xs font-semibold rounded-full border border-yellow-200">
              {pending.length} pendiente{pending.length > 1 ? "s" : ""}
            </span>
          )}
        </div>

        {loading && (
          <p className="text-gray-500 text-sm">Cargando...</p>
        )}

        {!loading && submissions.length === 0 && (
          <div className="bg-white border border-gray-200 shadow-sm rounded-xl px-6 py-12 text-center">
            <p className="text-gray-500 text-sm">Aun no hay formularios enviados.</p>
            <a href="/onboarding" target="_blank" rel="noopener noreferrer"
              className="inline-block mt-4 text-xs text-blue-600 hover:text-blue-700 transition-colors">
              Compartir link de onboarding →
            </a>
          </div>
        )}

        {pending.length > 0 && (
          <div className="space-y-3 mb-8">
            {pending.map(s => (
              <SubmissionCard key={s.id} s={s} onReview={markReviewed} onDelete={remove} />
            ))}
          </div>
        )}

        {reviewed.length > 0 && (
          <>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">Revisados</p>
            <div className="space-y-2">
              {reviewed.map(s => (
                <SubmissionCard key={s.id} s={s} onReview={markReviewed} onDelete={remove} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function SubmissionCard({
  s, onReview, onDelete
}: {
  s: Submission;
  onReview: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(!s.reviewed);

  return (
    <div className={`bg-white border rounded-xl overflow-hidden transition-all shadow-sm ${s.reviewed ? "border-gray-100 opacity-60" : "border-gray-200"}`}>
      <button
        className="w-full px-6 py-4 flex items-center justify-between gap-4 text-left hover:bg-gray-50 transition-colors"
        onClick={() => setExpanded(e => !e)}
      >
        <div className="flex items-center gap-3 min-w-0">
          {!s.reviewed && <span className="w-2 h-2 rounded-full bg-yellow-400 shrink-0" />}
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{s.businessName}</p>
            <p className="text-xs text-gray-500">{s.contactName} · {s.contactEmail}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xs text-gray-400">{s.submittedAt}</span>
          <svg className={`w-4 h-4 text-gray-400 transition-transform ${expanded ? "rotate-180" : ""}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {expanded && (
        <div className="px-6 pb-5 border-t border-gray-100 pt-4 space-y-4">
          <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
            {s.industry    && <Row label="Giro" value={s.industry} />}
            {s.package     && <Row label="Paquete" value={s.package} />}
            {s.phone       && <Row label="Teléfono" value={s.phone} />}
            {s.contactWhatsApp && <Row label="WhatsApp" value={s.contactWhatsApp} />}
            {s.domain      && <Row label="Dominio" value={s.domain} />}
            {s.address     && <Row label="Dirección" value={s.address} />}
            {s.schedule    && <Row label="Horarios" value={s.schedule} />}
            {s.googleBusiness && <Row label="Google My Business" value={s.googleBusiness} />}
          </div>
          {s.slogan && (
            <div>
              <p className="text-xs text-gray-500 mb-1">Slogan</p>
              <p className="text-sm text-gray-700 italic">"{s.slogan}"</p>
            </div>
          )}
          {s.description && (
            <div>
              <p className="text-xs text-gray-500 mb-1">Descripción</p>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{s.description}</p>
            </div>
          )}
          {s.services && (
            <div>
              <p className="text-xs text-gray-500 mb-1">Servicios / Productos</p>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{s.services}</p>
            </div>
          )}
          {s.socials && (
            <div>
              <p className="text-xs text-gray-500 mb-1">Redes sociales</p>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{s.socials}</p>
            </div>
          )}
          {s.logoUrl && (
            <div>
              <p className="text-xs text-gray-500 mb-2">Logo</p>
              <img src={s.logoUrl} className="h-14 object-contain rounded border border-gray-200 bg-gray-50 p-1" />
            </div>
          )}
          {s.photoUrls && s.photoUrls.length > 0 && (
            <div>
              <p className="text-xs text-gray-500 mb-2">Fotos ({s.photoUrls.length})</p>
              <div className="flex flex-wrap gap-2">
                {s.photoUrls.map((url, i) => (
                  <a key={i} href={url} target="_blank" rel="noopener noreferrer">
                    <img src={url} className="w-16 h-16 object-cover rounded-lg border border-gray-200 hover:opacity-80 transition-opacity" />
                  </a>
                ))}
              </div>
            </div>
          )}
          {s.extras && (
            <div>
              <p className="text-xs text-gray-500 mb-1">Notas adicionales</p>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{s.extras}</p>
            </div>
          )}
          <div className="flex gap-3 pt-2">
            {!s.reviewed && (
              <button onClick={() => onReview(s.id)}
                className="px-4 py-1.5 bg-green-50 hover:bg-green-100 text-green-600 text-xs font-semibold rounded-lg border border-green-200 transition-colors">
                Marcar revisado
              </button>
            )}
            <button
              onClick={() => navigate("/new", { state: { prefill: s } })}
              className="px-4 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-semibold rounded-lg border border-blue-200 transition-colors">
              Crear cliente
            </button>
            <button onClick={() => onDelete(s.id)}
              className="px-4 py-1.5 bg-red-50 hover:bg-red-100 text-red-500 text-xs rounded-lg border border-red-200 transition-colors ml-auto">
              Eliminar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-gray-700">{value}</p>
    </div>
  );
}
