import { useParams, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { StatusBadge, PackageBadge, PhaseBadge, TaskBadge, PriorityBadge } from "@/components/Badge";
import { ExternalLink } from "@/components/ExternalLink";
import type { TaskPriority, ClientStatus, Package, ClientPhase, TemplateUsed, Client } from "@/data/types";

const LINK_META: Record<string, { icon: string; label: string }> = {
  github:    { icon: "🐙", label: "GitHub" },
  vercel:    { icon: "▲",  label: "Vercel" },
  figma:     { icon: "🎨", label: "Figma" },
  notion:    { icon: "📝", label: "Notion" },
  analytics: { icon: "📊", label: "Analytics" },
  drive:     { icon: "📁", label: "Google Drive" },
  whatsapp:  { icon: "💬", label: "WhatsApp" },
  website:   { icon: "🌐", label: "Sitio web" },
  forms:     { icon: "📋", label: "Form onboarding" },
};

const LINK_KEYS = ["github", "vercel", "website", "figma", "notion", "analytics", "drive", "whatsapp", "forms"] as const;

const PHASES: ClientPhase[] = ["prospeccion","recoleccion","propuesta","desarrollo","revision","entrega","mantenimiento"];
const PHASE_LABELS: Record<ClientPhase, string> = {
  prospeccion:"Prospección", recoleccion:"Recolección", propuesta:"Propuesta",
  desarrollo:"Desarrollo", revision:"Revisión", entrega:"Entrega", mantenimiento:"Mantenimiento"
};

// ── Edit form ─────────────────────────────────────────────────────────────────
type EditForm = {
  name: string; industry: string; contactName: string; contactEmail: string;
  contactWhatsApp: string; domain: string; domainRegistrar: string; domainRenewalDate: string;
  status: ClientStatus; phase: ClientPhase; package: Package; templateUsed: string;
  monthlyFee: string; deliveryDate: string; mensualidadActive: boolean;
  anticipoAmount: string; anticipoReceived: boolean; anticipoDate: string;
  finalAmount: string; finalReceived: boolean; finalDate: string;
  github: string; vercel: string; website: string; figma: string;
  notion: string; analytics: string; drive: string; whatsapp: string; forms: string;
};

function clientToForm(c: Client): EditForm {
  return {
    name: c.name, industry: c.industry, contactName: c.contactName,
    contactEmail: c.contactEmail, contactWhatsApp: c.contactWhatsApp ?? "",
    domain: c.domain ?? "", domainRegistrar: c.domainRegistrar ?? "",
    domainRenewalDate: c.domainRenewalDate ?? "",
    status: c.status, phase: c.phase, package: c.package,
    templateUsed: c.templateUsed ?? "",
    monthlyFee: String(c.monthlyFee), deliveryDate: c.deliveryDate ?? "",
    mensualidadActive: c.mensualidadActive,
    anticipoAmount:   String(c.anticipo?.amount  ?? ""),
    anticipoReceived: c.anticipo?.received ?? false,
    anticipoDate:     c.anticipo?.date     ?? "",
    finalAmount:      String(c.finalPayment?.amount  ?? ""),
    finalReceived:    c.finalPayment?.received ?? false,
    finalDate:        c.finalPayment?.date     ?? "",
    github:    c.links.github    ?? "", vercel:    c.links.vercel    ?? "",
    website:   c.links.website   ?? "", figma:     c.links.figma     ?? "",
    notion:    c.links.notion    ?? "", analytics: c.links.analytics ?? "",
    drive:     c.links.drive     ?? "", whatsapp:  c.links.whatsapp  ?? "",
    forms:     c.links.forms     ?? "",
  };
}

// ── Component ─────────────────────────────────────────────────────────────────
export function ClientDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    getClient, addTask, updateTaskStatus, deleteTask,
    toggleCheck, addCheck, deleteCheck, resetChecklist,
    addLog, deleteLog, updateNotes, updateClientField, deleteClient,
  } = useApp();

  const client = getClient(id!);

  const [newTask, setNewTask]           = useState("");
  const [newPriority, setNewPriority]   = useState<TaskPriority>("medium");
  const [newLog, setNewLog]             = useState("");
  const [notesVal, setNotesVal]         = useState(client?.notes ?? "");
  const [notesSaved, setNotesSaved]     = useState(true);
  const [editing, setEditing]           = useState(false);
  const [editForm, setEditForm]         = useState<EditForm>(() => client ? clientToForm(client) : {} as EditForm);
  const [managingChecks, setManagingChecks] = useState(false);
  const [newCheck, setNewCheck]         = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!client) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-500">
      Cliente no encontrado. <Link to="/" className="text-blue-600 ml-2">Volver</Link>
    </div>
  );

  const c         = client;
  const openTasks = c.tasks.filter(t => t.status !== "done");
  const doneTasks = c.tasks.filter(t => t.status === "done");
  const links     = Object.entries(c.links).filter(([, v]) => !!v) as [string, string][];

  // Domain expiry warning (within 60 days)
  const domainWarning = (() => {
    if (!c.domainRenewalDate) return false;
    const days = (new Date(c.domainRenewalDate).getTime() - Date.now()) / 86400000;
    return days <= 60;
  })();

  function handleAddTask(e: React.FormEvent) {
    e.preventDefault();
    if (!newTask.trim()) return;
    addTask(c.id, newTask.trim(), newPriority);
    setNewTask("");
  }

  function handleAddLog(e: React.FormEvent) {
    e.preventDefault();
    if (!newLog.trim()) return;
    addLog(c.id, newLog.trim());
    setNewLog("");
  }

  function handleSaveNotes() { updateNotes(c.id, notesVal); setNotesSaved(true); }

  function setField(k: keyof EditForm) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setEditForm(f => ({ ...f, [k]: e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value }));
  }

  function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault();
    const f = editForm;
    updateClientField(c.id, {
      name: f.name.trim(), industry: f.industry.trim(),
      contactName: f.contactName.trim(), contactEmail: f.contactEmail.trim(),
      contactWhatsApp: f.contactWhatsApp.trim(),
      domain: f.domain.trim(), domainRegistrar: f.domainRegistrar.trim(),
      domainRenewalDate: f.domainRenewalDate,
      status: f.status, phase: f.phase, package: f.package,
      templateUsed: f.templateUsed as TemplateUsed || undefined,
      monthlyFee: parseInt(f.monthlyFee) || 0,
      deliveryDate: f.deliveryDate || undefined,
      mensualidadActive: f.mensualidadActive,
      anticipo: f.anticipoAmount ? { amount: parseInt(f.anticipoAmount)||0, received: f.anticipoReceived, date: f.anticipoDate||undefined } : undefined,
      finalPayment: f.finalAmount ? { amount: parseInt(f.finalAmount)||0, received: f.finalReceived, date: f.finalDate||undefined } : undefined,
      links: {
        github: f.github||undefined, vercel: f.vercel||undefined, website: f.website||undefined,
        figma: f.figma||undefined, notion: f.notion||undefined, analytics: f.analytics||undefined,
        drive: f.drive||undefined, whatsapp: f.whatsapp||undefined, forms: f.forms||undefined,
      },
    });
    setEditing(false);
  }

  function handleAddCheck(e: React.FormEvent) {
    e.preventDefault();
    if (!newCheck.trim()) return;
    addCheck(c.id, newCheck.trim());
    setNewCheck("");
  }

  function handleDelete() { deleteClient(c.id); navigate("/"); }

  const inputCls = "w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-blue-500";

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-8 py-5">
        <div className="max-w-6xl mx-auto flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1 text-sm text-gray-500">
              <Link to="/" className="hover:text-gray-900 transition-colors">Dashboard</Link>
              <span>/</span>
              <span className="text-gray-700">{c.name}</span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold text-gray-900">{c.name}</h1>
              <StatusBadge status={c.status} />
              <PhaseBadge phase={c.phase} />
              <PackageBadge pkg={c.package} />
            </div>
            <p className="text-sm text-gray-500 mt-0.5">
              {c.industry} · {c.contactName} · {c.contactEmail}
              {c.domain && <> · <span className={domainWarning ? "text-red-500 font-medium" : "text-gray-400"}>{c.domain}{domainWarning && " ⚠ renueva pronto"}</span></>}
            </p>
          </div>
          <div className="flex items-start gap-3 shrink-0">
            <div className="text-right">
              <p className="text-xs text-gray-400 mb-0.5">Mensualidad</p>
              <p className="text-lg font-bold text-gray-900">
                {c.monthlyFee === 0 ? "Pro bono" : `$${c.monthlyFee.toLocaleString("es-MX")} MXN`}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">Desde {c.startDate}</p>
            </div>
            <button
              onClick={() => { setEditForm(clientToForm(c)); setEditing(true); }}
              className="mt-1 px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg transition-colors"
            >Editar</button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-8 py-8 grid grid-cols-3 gap-6">

        {/* ── Left column ── */}
        <div className="col-span-2 space-y-6">

          {/* Quick links */}
          {links.length > 0 && (
            <section className="bg-white border border-gray-200 shadow-sm rounded-xl p-5">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Accesos rápidos</h2>
              <div className="flex flex-wrap gap-2">
                {links.map(([key, url]) => (
                  <ExternalLink key={key} href={url} label={LINK_META[key]?.label ?? key} icon={LINK_META[key]?.icon ?? "🔗"} />
                ))}
              </div>
            </section>
          )}

          {/* Pipeline phase stepper */}
          <section className="bg-white border border-gray-200 shadow-sm rounded-xl p-5">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Fase del proyecto</h2>
            <div className="flex items-center gap-0">
              {PHASES.map((ph, i) => {
                const idx     = PHASES.indexOf(c.phase);
                const isDone  = i < idx;
                const isCur   = i === idx;
                const isLast  = i === PHASES.length - 1;
                return (
                  <div key={ph} className="flex items-center flex-1 min-w-0">
                    <div className="flex flex-col items-center flex-1">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                        isCur ? "bg-blue-500 text-white ring-2 ring-blue-400/40" :
                        isDone ? "bg-green-100 text-green-600" :
                        "bg-gray-100 text-gray-400"
                      }`}>
                        {isDone ? "✓" : i + 1}
                      </div>
                      <p className={`text-[10px] mt-1 text-center leading-tight hidden md:block ${isCur ? "text-blue-600 font-semibold" : isDone ? "text-green-600" : "text-gray-400"}`}>
                        {PHASE_LABELS[ph]}
                      </p>
                    </div>
                    {!isLast && (
                      <div className={`h-px flex-1 mx-1 ${isDone || isCur ? "bg-blue-300" : "bg-gray-200"}`} />
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Open tasks */}
          <section className="bg-white border border-gray-200 shadow-sm rounded-xl p-5">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Tareas abiertas <span className="text-blue-600 ml-1">{openTasks.length}</span>
            </h2>
            {openTasks.length === 0 && <p className="text-sm text-gray-400 py-2">Sin tareas pendientes.</p>}
            <div className="space-y-2 mb-4">
              {openTasks.map(t => (
                <div key={t.id} className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-lg px-4 py-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 leading-snug">{t.title}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <TaskBadge status={t.status} />
                      <PriorityBadge priority={t.priority} />
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    {t.status === "todo" && (
                      <button onClick={() => updateTaskStatus(c.id, t.id, "in_progress")}
                        className="px-2 py-1 text-xs bg-blue-50 hover:bg-blue-100 text-blue-600 rounded transition-colors">En progreso</button>
                    )}
                    <button onClick={() => updateTaskStatus(c.id, t.id, "done")}
                      className="px-2 py-1 text-xs bg-green-50 hover:bg-green-100 text-green-600 rounded transition-colors">Completar</button>
                    <button onClick={() => deleteTask(c.id, t.id)}
                      className="px-2 py-1 text-xs bg-red-50 hover:bg-red-100 text-red-500 rounded transition-colors">✕</button>
                  </div>
                </div>
              ))}
            </div>
            <form onSubmit={handleAddTask} className="flex gap-2">
              <input value={newTask} onChange={e => setNewTask(e.target.value)} placeholder="Nueva tarea..."
                className="flex-1 bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-500" />
              <select value={newPriority} onChange={e => setNewPriority(e.target.value as TaskPriority)}
                className="bg-white border border-gray-300 rounded-lg px-2 py-2 text-sm text-gray-700 focus:outline-none">
                <option value="low">Baja</option>
                <option value="medium">Media</option>
                <option value="high">Alta</option>
              </select>
              <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors">Agregar</button>
            </form>
          </section>

          {/* Done tasks */}
          {doneTasks.length > 0 && (
            <details className="bg-white border border-gray-100 rounded-xl">
              <summary className="px-5 py-3.5 text-sm text-gray-500 cursor-pointer hover:text-gray-700 transition-colors list-none flex items-center gap-2">
                <span className="text-gray-400">▸</span> Tareas completadas ({doneTasks.length})
              </summary>
              <div className="px-5 pb-4 space-y-2">
                {doneTasks.map(t => (
                  <div key={t.id} className="flex items-center gap-3 opacity-50">
                    <span className="text-green-500 text-sm">✓</span>
                    <p className="text-sm text-gray-500 line-through flex-1">{t.title}</p>
                    {t.completedAt && <span className="text-xs text-gray-400">{t.completedAt}</span>}
                    <button onClick={() => deleteTask(c.id, t.id)} className="text-xs text-red-400 hover:text-red-500 transition-colors">✕</button>
                  </div>
                ))}
              </div>
            </details>
          )}

          {/* Activity log */}
          <section className="bg-white border border-gray-200 shadow-sm rounded-xl p-5">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Historial de actividad</h2>
            <form onSubmit={handleAddLog} className="flex gap-2 mb-4">
              <input value={newLog} onChange={e => setNewLog(e.target.value)} placeholder="Agregar nota de actividad..."
                className="flex-1 bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-500" />
              <button type="submit" className="px-4 py-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-sm font-semibold rounded-lg transition-colors">Agregar</button>
            </form>
            {c.logs.length === 0 && <p className="text-sm text-gray-400">Sin actividad registrada.</p>}
            <div className="space-y-3">
              {c.logs.map(l => (
                <div key={l.id} className="flex gap-3 group">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-700 leading-relaxed">{l.note}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{l.date}</p>
                  </div>
                  <button onClick={() => deleteLog(c.id, l.id)}
                    className="opacity-0 group-hover:opacity-100 text-xs text-red-400 hover:text-red-500 transition-all shrink-0">✕</button>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* ── Right column ── */}
        <div className="space-y-5">

          {/* Payments */}
          {c.monthlyFee > 0 && (
            <section className="bg-white border border-gray-200 shadow-sm rounded-xl p-5">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Cobros</h2>
              <div className="space-y-3">
                {c.anticipo && (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500">Anticipo 50%</p>
                      <p className="text-sm text-gray-900 font-medium">${c.anticipo.amount.toLocaleString("es-MX")} MXN</p>
                      {c.anticipo.date && <p className="text-xs text-gray-400">{c.anticipo.date}</p>}
                    </div>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${c.anticipo.received ? "bg-green-50 text-green-600" : "bg-yellow-50 text-yellow-600"}`}>
                      {c.anticipo.received ? "Recibido" : "Pendiente"}
                    </span>
                  </div>
                )}
                {c.finalPayment && (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500">Pago final 50%</p>
                      <p className="text-sm text-gray-900 font-medium">${c.finalPayment.amount.toLocaleString("es-MX")} MXN</p>
                      {c.finalPayment.date && <p className="text-xs text-gray-400">{c.finalPayment.date}</p>}
                    </div>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${c.finalPayment.received ? "bg-green-50 text-green-600" : "bg-yellow-50 text-yellow-600"}`}>
                      {c.finalPayment.received ? "Recibido" : "Pendiente"}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between pt-1 border-t border-gray-100">
                  <p className="text-xs text-gray-500">Mensualidad ${c.monthlyFee.toLocaleString("es-MX")}/mes</p>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${c.mensualidadActive ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-500"}`}>
                    {c.mensualidadActive ? "Activa" : "Inactiva"}
                  </span>
                </div>
              </div>
            </section>
          )}

          {/* Monthly checklist */}
          <section className="bg-white border border-gray-200 shadow-sm rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Checklist mensual</h2>
              <div className="flex gap-1.5">
                <button onClick={() => setManagingChecks(v => !v)}
                  className={`text-xs px-2 py-1 rounded transition-colors ${managingChecks ? "bg-blue-600 text-white" : "bg-white border border-gray-200 text-gray-500 hover:text-gray-900"}`}>
                  Gestionar
                </button>
                <button onClick={() => { if (window.confirm("¿Reiniciar todos los checks del mes?")) resetChecklist(c.id); }}
                  className="text-xs px-2 py-1 bg-white border border-gray-200 text-gray-500 hover:text-gray-900 rounded transition-colors">
                  ↺ Mes nuevo
                </button>
              </div>
            </div>
            {c.monthlyChecks.length === 0 && !managingChecks && (
              <p className="text-sm text-gray-400">Sin items. Usa "Gestionar" para agregar.</p>
            )}
            <div className="space-y-2">
              {c.monthlyChecks.map(ch => (
                <div key={ch.id} className="flex items-center gap-2 group">
                  {!managingChecks ? (
                    <label className="flex items-center gap-2.5 cursor-pointer flex-1">
                      <input type="checkbox" checked={ch.done} onChange={() => toggleCheck(c.id, ch.id)} className="accent-blue-500 cursor-pointer shrink-0" />
                      <span className={`text-sm transition-colors ${ch.done ? "text-gray-400 line-through" : "text-gray-700 group-hover:text-gray-900"}`}>{ch.label}</span>
                    </label>
                  ) : (
                    <>
                      <span className="text-sm text-gray-500 flex-1">{ch.label}</span>
                      <button onClick={() => deleteCheck(c.id, ch.id)} className="text-xs text-red-400 hover:text-red-500 transition-colors shrink-0">✕</button>
                    </>
                  )}
                </div>
              ))}
            </div>
            {managingChecks && (
              <form onSubmit={handleAddCheck} className="flex gap-2 mt-3">
                <input value={newCheck} onChange={e => setNewCheck(e.target.value)} placeholder="Nuevo item..."
                  className="flex-1 bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-500" />
                <button type="submit" className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors">+</button>
              </form>
            )}
            {c.monthlyChecks.length > 0 && !managingChecks && (
              <div className="mt-4">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Progreso</span>
                  <span>{c.monthlyChecks.filter(ch => ch.done).length}/{c.monthlyChecks.length}</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full transition-all"
                    style={{ width: `${(c.monthlyChecks.filter(ch => ch.done).length / c.monthlyChecks.length) * 100}%` }} />
                </div>
              </div>
            )}
          </section>

          {/* Client info */}
          <section className="bg-white border border-gray-200 shadow-sm rounded-xl p-5">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Info del cliente</h2>
            <dl className="space-y-2.5 text-sm">
              <div><dt className="text-xs text-gray-400 mb-0.5">Contacto</dt><dd className="text-gray-700">{c.contactName}</dd></div>
              <div><dt className="text-xs text-gray-400 mb-0.5">Email</dt>
                <dd><a href={`mailto:${c.contactEmail}`} className="text-gray-700 hover:text-gray-900 transition-colors">{c.contactEmail}</a></dd>
              </div>
              {c.contactWhatsApp && (
                <div><dt className="text-xs text-gray-400 mb-0.5">WhatsApp</dt>
                  <dd><a href={`https://wa.me/${c.contactWhatsApp.replace(/\D/g,"")}`} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-700 transition-colors">{c.contactWhatsApp}</a></dd>
                </div>
              )}
              {c.domain && (
                <div><dt className="text-xs text-gray-400 mb-0.5">Dominio</dt>
                  <dd className="text-gray-700">
                    {c.domain}
                    {c.domainRegistrar && <span className="text-gray-400 ml-1">({c.domainRegistrar})</span>}
                  </dd>
                  {c.domainRenewalDate && (
                    <dd className={`text-xs mt-0.5 ${domainWarning ? "text-red-500 font-medium" : "text-gray-400"}`}>
                      Renueva: {c.domainRenewalDate}{domainWarning && " ⚠"}
                    </dd>
                  )}
                </div>
              )}
              {c.templateUsed && <div><dt className="text-xs text-gray-400 mb-0.5">Plantilla</dt><dd className="text-gray-700 capitalize">{c.templateUsed}</dd></div>}
              <div><dt className="text-xs text-gray-400 mb-0.5">Inicio</dt><dd className="text-gray-700">{c.startDate}</dd></div>
              {c.deliveryDate && <div><dt className="text-xs text-gray-400 mb-0.5">Entrega</dt><dd className="text-gray-700">{c.deliveryDate}</dd></div>}
            </dl>
          </section>

          {/* Notes */}
          <section className="bg-white border border-gray-200 shadow-sm rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Notas internas</h2>
              {!notesSaved && (
                <button onClick={handleSaveNotes} className="text-xs px-2 py-1 bg-blue-600 text-white rounded transition-colors hover:bg-blue-700">Guardar</button>
              )}
            </div>
            <textarea value={notesVal} onChange={e => { setNotesVal(e.target.value); setNotesSaved(false); }}
              onBlur={handleSaveNotes} rows={5}
              className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-blue-500 resize-none"
              placeholder="Notas sobre el cliente, acuerdos, preferencias..." />
          </section>

          {/* Danger zone */}
          <section className="border border-red-200 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-red-400 uppercase tracking-wider mb-3">Zona de peligro</h2>
            {!confirmDelete ? (
              <button onClick={() => setConfirmDelete(true)} className="text-sm text-red-500 hover:text-red-600 transition-colors">Eliminar cliente...</button>
            ) : (
              <div>
                <p className="text-xs text-gray-500 mb-3">¿Eliminar <span className="text-gray-900 font-semibold">{c.name}</span> permanentemente?</p>
                <div className="flex gap-2">
                  <button onClick={handleDelete} className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition-colors">Sí, eliminar</button>
                  <button onClick={() => setConfirmDelete(false)} className="px-3 py-1.5 bg-white border border-gray-200 text-gray-500 hover:text-gray-900 text-xs rounded-lg transition-colors">Cancelar</button>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>

      {/* ── Edit modal ── */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white border border-gray-200 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-base font-bold text-gray-900">Editar cliente</h2>
              <button onClick={() => setEditing(false)} className="text-gray-400 hover:text-gray-900 transition-colors text-lg">✕</button>
            </div>
            <form onSubmit={handleSaveEdit} className="px-6 py-5 space-y-6">

              {/* General */}
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Datos generales</p>
                <div className="grid grid-cols-2 gap-3">
                  {([["Nombre", "name"], ["Industria", "industry"], ["Contacto", "contactName"], ["Email", "contactEmail"], ["WhatsApp", "contactWhatsApp"]] as [string, keyof EditForm][]).map(([label, key]) => (
                    <div key={key}>
                      <label className="block text-xs text-gray-400 mb-1">{label}</label>
                      <input value={editForm[key] as string} onChange={setField(key)}
                        className={inputCls} />
                    </div>
                  ))}
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Estado</label>
                    <select value={editForm.status} onChange={setField("status")} className={inputCls}>
                      <option value="active">Activo</option><option value="pending">Pendiente</option>
                      <option value="paused">Pausado</option><option value="churned">Inactivo</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Fase</label>
                    <select value={editForm.phase} onChange={setField("phase")} className={inputCls}>
                      {PHASES.map(ph => <option key={ph} value={ph}>{PHASE_LABELS[ph]}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Paquete</label>
                    <select value={editForm.package} onChange={setField("package")} className={inputCls}>
                      <option value="basic">Basic</option><option value="standard">Standard</option>
                      <option value="premium">Premium</option><option value="custom">Custom</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Plantilla usada</label>
                    <select value={editForm.templateUsed} onChange={setField("templateUsed")} className={inputCls}>
                      <option value="">—</option><option value="basico">Presencia</option>
                      <option value="pro">Total</option>
                      <option value="personalizado">Personalizado</option>
                      <option value="custom">Custom</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Mensualidad (MXN)</label>
                    <input type="number" value={editForm.monthlyFee} onChange={setField("monthlyFee")} className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Fecha de entrega</label>
                    <input type="date" value={editForm.deliveryDate} onChange={setField("deliveryDate")} className={inputCls} />
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <input type="checkbox" id="mensualidadActive" checked={editForm.mensualidadActive} onChange={setField("mensualidadActive")} className="accent-blue-500" />
                    <label htmlFor="mensualidadActive" className="text-sm text-gray-700 cursor-pointer">Mensualidad activa</label>
                  </div>
                </div>
              </div>

              {/* Domain */}
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Dominio</p>
                <div className="grid grid-cols-2 gap-3">
                  {([["Dominio", "domain"], ["Registrador", "domainRegistrar"]] as [string, keyof EditForm][]).map(([label, key]) => (
                    <div key={key}>
                      <label className="block text-xs text-gray-400 mb-1">{label}</label>
                      <input value={editForm[key] as string} onChange={setField(key)} placeholder={key === "domainRegistrar" ? "namecheap, cloudflare..." : "empresa.com"}
                        className={inputCls} />
                    </div>
                  ))}
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Fecha de renovación</label>
                    <input type="date" value={editForm.domainRenewalDate} onChange={setField("domainRenewalDate")} className={inputCls} />
                  </div>
                </div>
              </div>

              {/* Payments */}
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Cobros del proyecto</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-xs text-gray-500 font-medium">Anticipo (50%)</p>
                    <input type="number" value={editForm.anticipoAmount} onChange={setField("anticipoAmount")} placeholder="Monto MXN" className={inputCls} />
                    <input type="date" value={editForm.anticipoDate} onChange={setField("anticipoDate")} className={inputCls} />
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={editForm.anticipoReceived} onChange={setField("anticipoReceived")} className="accent-blue-500" />
                      <span className="text-xs text-gray-700">Recibido</span>
                    </label>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs text-gray-500 font-medium">Pago final (50%)</p>
                    <input type="number" value={editForm.finalAmount} onChange={setField("finalAmount")} placeholder="Monto MXN" className={inputCls} />
                    <input type="date" value={editForm.finalDate} onChange={setField("finalDate")} className={inputCls} />
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={editForm.finalReceived} onChange={setField("finalReceived")} className="accent-blue-500" />
                      <span className="text-xs text-gray-700">Recibido</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Links */}
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Links del proyecto</p>
                <div className="grid grid-cols-2 gap-3">
                  {LINK_KEYS.map(key => (
                    <div key={key}>
                      <label className="block text-xs text-gray-400 mb-1">{LINK_META[key].icon} {LINK_META[key].label}</label>
                      <input value={editForm[key]} onChange={setField(key)} placeholder="https://..."
                        className={inputCls} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t border-gray-200">
                <button type="button" onClick={() => setEditing(false)} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-900 transition-colors">Cancelar</button>
                <button type="submit" className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors">Guardar cambios</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
