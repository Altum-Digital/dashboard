import { useParams, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { StatusBadge, PackageBadge, TaskBadge, PriorityBadge } from "@/components/Badge";
import { ExternalLink } from "@/components/ExternalLink";
import type { TaskPriority, ClientStatus, Package, Client } from "@/data/types";

const LINK_META: Record<string, { icon: string; label: string }> = {
  github:    { icon: "🐙", label: "GitHub" },
  vercel:    { icon: "▲",  label: "Vercel" },
  figma:     { icon: "🎨", label: "Figma" },
  notion:    { icon: "📝", label: "Notion" },
  analytics: { icon: "📊", label: "Analytics" },
  drive:     { icon: "📁", label: "Google Drive" },
  whatsapp:  { icon: "💬", label: "WhatsApp" },
  website:   { icon: "🌐", label: "Sitio web" },
};

const LINK_KEYS = ["github", "vercel", "website", "figma", "notion", "analytics", "drive", "whatsapp"] as const;

// ── Edit form state ──────────────────────────────────────────────────────────
type EditForm = {
  name: string; industry: string; contactName: string; contactEmail: string;
  contactWhatsApp: string; domain: string; status: ClientStatus; package: Package;
  monthlyFee: string;
  github: string; vercel: string; website: string; figma: string;
  notion: string; analytics: string; drive: string; whatsapp: string;
};

function clientToForm(c: Client): EditForm {
  return {
    name: c.name, industry: c.industry, contactName: c.contactName,
    contactEmail: c.contactEmail, contactWhatsApp: c.contactWhatsApp ?? "",
    domain: c.domain ?? "", status: c.status, package: c.package,
    monthlyFee: String(c.monthlyFee),
    github:    c.links.github    ?? "",
    vercel:    c.links.vercel    ?? "",
    website:   c.links.website   ?? "",
    figma:     c.links.figma     ?? "",
    notion:    c.links.notion    ?? "",
    analytics: c.links.analytics ?? "",
    drive:     c.links.drive     ?? "",
    whatsapp:  c.links.whatsapp  ?? "",
  };
}

// ── Component ────────────────────────────────────────────────────────────────
export function ClientDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    getClient, addTask, updateTaskStatus, deleteTask,
    toggleCheck, addCheck, deleteCheck, resetChecklist,
    addLog, deleteLog, updateNotes, updateClientField, deleteClient,
  } = useApp();

  const client = getClient(id!);

  // Task form
  const [newTask, setNewTask]         = useState("");
  const [newPriority, setNewPriority] = useState<TaskPriority>("medium");
  // Log form
  const [newLog, setNewLog]           = useState("");
  // Notes
  const [notesVal, setNotesVal]       = useState(client?.notes ?? "");
  const [notesSaved, setNotesSaved]   = useState(true);
  // Edit mode
  const [editing, setEditing]         = useState(false);
  const [editForm, setEditForm]       = useState<EditForm>(() => client ? clientToForm(client) : {} as EditForm);
  // Checklist management
  const [managingChecks, setManagingChecks] = useState(false);
  const [newCheck, setNewCheck]       = useState("");
  // Delete confirm
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!client) return (
    <div className="min-h-screen bg-[#0f1117] flex items-center justify-center text-slate-400">
      Cliente no encontrado. <Link to="/" className="text-blue-400 ml-2">Volver</Link>
    </div>
  );

  // Non-null binding after early return — safe to use without optional chaining
  const c = client;
  const openTasks = c.tasks.filter(t => t.status !== "done");
  const doneTasks = c.tasks.filter(t => t.status === "done");
  const links     = Object.entries(c.links).filter(([, v]) => !!v) as [string, string][];

  // ── Handlers ────────────────────────────────────────────────────────────────
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

  function handleSaveNotes() {
    updateNotes(c.id, notesVal);
    setNotesSaved(true);
  }

  function setField(k: keyof EditForm) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setEditForm(f => ({ ...f, [k]: e.target.value }));
  }

  function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault();
    updateClientField(c.id, {
      name: editForm.name.trim(),
      industry: editForm.industry.trim(),
      contactName: editForm.contactName.trim(),
      contactEmail: editForm.contactEmail.trim(),
      contactWhatsApp: editForm.contactWhatsApp.trim(),
      domain: editForm.domain.trim(),
      status: editForm.status,
      package: editForm.package,
      monthlyFee: parseInt(editForm.monthlyFee) || 0,
      links: {
        github:    editForm.github.trim()    || undefined,
        vercel:    editForm.vercel.trim()    || undefined,
        website:   editForm.website.trim()   || undefined,
        figma:     editForm.figma.trim()     || undefined,
        notion:    editForm.notion.trim()    || undefined,
        analytics: editForm.analytics.trim() || undefined,
        drive:     editForm.drive.trim()     || undefined,
        whatsapp:  editForm.whatsapp.trim()  || undefined,
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

  function handleDelete() {
    deleteClient(c.id);
    navigate("/");
  }

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0f1117]">

      {/* Header */}
      <header className="border-b border-white/8 px-8 py-5">
        <div className="max-w-6xl mx-auto flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1 text-sm text-slate-500">
              <Link to="/" className="hover:text-white transition-colors">Dashboard</Link>
              <span>/</span>
              <span className="text-slate-300">{client.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-white">{client.name}</h1>
              <StatusBadge status={client.status} />
              <PackageBadge pkg={client.package} />
            </div>
            <p className="text-sm text-slate-500 mt-0.5">
              {client.industry} · {client.contactName} · {client.contactEmail}
              {client.domain && <> · <span className="text-slate-400">{client.domain}</span></>}
            </p>
          </div>
          <div className="flex items-start gap-3 shrink-0">
            <div className="text-right">
              <p className="text-xs text-slate-600 mb-0.5">Mensualidad</p>
              <p className="text-lg font-bold text-white">
                {client.monthlyFee === 0 ? "Pro bono" : `$${client.monthlyFee} USD`}
              </p>
              <p className="text-xs text-slate-600 mt-0.5">Desde {client.startDate}</p>
            </div>
            <button
              onClick={() => { setEditForm(clientToForm(client)); setEditing(true); }}
              className="mt-1 px-3 py-1.5 text-xs font-semibold text-slate-300 bg-white/6 hover:bg-white/12 border border-white/10 rounded-lg transition-colors"
            >Editar</button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-8 py-8 grid grid-cols-3 gap-6">

        {/* ── Left column ── */}
        <div className="col-span-2 space-y-6">

          {/* Quick links */}
          {links.length > 0 && (
            <section className="bg-white/4 border border-white/8 rounded-xl p-5">
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Accesos rápidos</h2>
              <div className="flex flex-wrap gap-2">
                {links.map(([key, url]) => (
                  <ExternalLink key={key} href={url} label={LINK_META[key]?.label ?? key} icon={LINK_META[key]?.icon ?? "🔗"} />
                ))}
              </div>
            </section>
          )}

          {/* Open tasks */}
          <section className="bg-white/4 border border-white/8 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
              Tareas abiertas <span className="text-blue-400 ml-1">{openTasks.length}</span>
            </h2>

            {openTasks.length === 0 && (
              <p className="text-sm text-slate-600 py-2">Sin tareas pendientes.</p>
            )}

            <div className="space-y-2 mb-4">
              {openTasks.map(t => (
                <div key={t.id} className="flex items-center gap-3 bg-white/3 border border-white/6 rounded-lg px-4 py-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white leading-snug">{t.title}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <TaskBadge status={t.status} />
                      <PriorityBadge priority={t.priority} />
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    {t.status === "todo" && (
                      <button onClick={() => updateTaskStatus(c.id, t.id, "in_progress")}
                        className="px-2 py-1 text-xs bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 rounded transition-colors">
                        En progreso
                      </button>
                    )}
                    <button onClick={() => updateTaskStatus(c.id, t.id, "done")}
                      className="px-2 py-1 text-xs bg-green-600/20 hover:bg-green-600/40 text-green-400 rounded transition-colors">
                      Completar
                    </button>
                    <button onClick={() => deleteTask(c.id, t.id)}
                      className="px-2 py-1 text-xs bg-red-600/10 hover:bg-red-600/30 text-red-500 rounded transition-colors">
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddTask} className="flex gap-2">
              <input value={newTask} onChange={e => setNewTask(e.target.value)} placeholder="Nueva tarea..."
                className="flex-1 bg-white/6 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50" />
              <select value={newPriority} onChange={e => setNewPriority(e.target.value as TaskPriority)}
                className="bg-white/6 border border-white/10 rounded-lg px-2 py-2 text-sm text-slate-300 focus:outline-none">
                <option value="low">Baja</option>
                <option value="medium">Media</option>
                <option value="high">Alta</option>
              </select>
              <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg transition-colors">
                Agregar
              </button>
            </form>
          </section>

          {/* Done tasks */}
          {doneTasks.length > 0 && (
            <details className="bg-white/2 border border-white/6 rounded-xl">
              <summary className="px-5 py-3.5 text-sm text-slate-500 cursor-pointer hover:text-slate-300 transition-colors list-none flex items-center gap-2">
                <span className="text-slate-600">▸</span>
                Tareas completadas ({doneTasks.length})
              </summary>
              <div className="px-5 pb-4 space-y-2">
                {doneTasks.map(t => (
                  <div key={t.id} className="flex items-center gap-3 opacity-50">
                    <span className="text-green-500 text-sm">✓</span>
                    <p className="text-sm text-slate-400 line-through flex-1">{t.title}</p>
                    {t.completedAt && <span className="text-xs text-slate-600">{t.completedAt}</span>}
                    <button onClick={() => deleteTask(c.id, t.id)}
                      className="text-xs text-red-700 hover:text-red-500 transition-colors">✕</button>
                  </div>
                ))}
              </div>
            </details>
          )}

          {/* Activity log */}
          <section className="bg-white/4 border border-white/8 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Historial de actividad</h2>
            <form onSubmit={handleAddLog} className="flex gap-2 mb-4">
              <input value={newLog} onChange={e => setNewLog(e.target.value)} placeholder="Agregar nota de actividad..."
                className="flex-1 bg-white/6 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50" />
              <button type="submit" className="px-4 py-2 bg-white/8 hover:bg-white/15 text-slate-300 text-sm font-semibold rounded-lg transition-colors">
                Agregar
              </button>
            </form>
            {client.logs.length === 0 && <p className="text-sm text-slate-600">Sin actividad registrada.</p>}
            <div className="space-y-3">
              {client.logs.map(l => (
                <div key={l.id} className="flex gap-3 group">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-300 leading-relaxed">{l.note}</p>
                    <p className="text-xs text-slate-600 mt-0.5">{l.date}</p>
                  </div>
                  <button onClick={() => deleteLog(c.id, l.id)}
                    className="opacity-0 group-hover:opacity-100 text-xs text-red-700 hover:text-red-500 transition-all shrink-0">✕</button>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* ── Right column ── */}
        <div className="space-y-5">

          {/* Monthly checklist */}
          <section className="bg-white/4 border border-white/8 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Checklist mensual</h2>
              <div className="flex gap-1.5">
                <button onClick={() => setManagingChecks(v => !v)}
                  className={`text-xs px-2 py-1 rounded transition-colors ${managingChecks ? "bg-blue-600 text-white" : "bg-white/6 text-slate-400 hover:text-white"}`}>
                  Gestionar
                </button>
                <button
                  onClick={() => { if (window.confirm("¿Reiniciar todos los checks del mes?")) resetChecklist(c.id); }}
                  className="text-xs px-2 py-1 bg-white/6 text-slate-400 hover:text-white rounded transition-colors"
                  title="Reiniciar para nuevo mes">
                  ↺ Mes nuevo
                </button>
              </div>
            </div>

            {client.monthlyChecks.length === 0 && !managingChecks && (
              <p className="text-sm text-slate-600">Sin items. Usa "Gestionar" para agregar.</p>
            )}

            <div className="space-y-2">
              {client.monthlyChecks.map(ch => (
                <div key={ch.id} className="flex items-center gap-2 group">
                  {!managingChecks ? (
                    <label className="flex items-center gap-2.5 cursor-pointer flex-1">
                      <input type="checkbox" checked={ch.done} onChange={() => toggleCheck(c.id, ch.id)}
                        className="accent-blue-500 cursor-pointer shrink-0" />
                      <span className={`text-sm transition-colors ${ch.done ? "text-slate-500 line-through" : "text-slate-300 group-hover:text-white"}`}>
                        {ch.label}
                      </span>
                    </label>
                  ) : (
                    <>
                      <span className="text-sm text-slate-400 flex-1">{ch.label}</span>
                      <button onClick={() => deleteCheck(c.id, ch.id)}
                        className="text-xs text-red-700 hover:text-red-400 transition-colors shrink-0">✕</button>
                    </>
                  )}
                </div>
              ))}
            </div>

            {managingChecks && (
              <form onSubmit={handleAddCheck} className="flex gap-2 mt-3">
                <input value={newCheck} onChange={e => setNewCheck(e.target.value)} placeholder="Nuevo item..."
                  className="flex-1 bg-white/6 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50" />
                <button type="submit" className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition-colors">
                  +
                </button>
              </form>
            )}

            {client.monthlyChecks.length > 0 && !managingChecks && (
              <div className="mt-4">
                <div className="flex justify-between text-xs text-slate-600 mb-1">
                  <span>Progreso</span>
                  <span>{client.monthlyChecks.filter(c => c.done).length}/{client.monthlyChecks.length}</span>
                </div>
                <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full transition-all"
                    style={{ width: `${(client.monthlyChecks.filter(c => c.done).length / client.monthlyChecks.length) * 100}%` }} />
                </div>
              </div>
            )}
          </section>

          {/* Client info */}
          <section className="bg-white/4 border border-white/8 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Info del cliente</h2>
            <dl className="space-y-2.5 text-sm">
              <div><dt className="text-xs text-slate-600 mb-0.5">Contacto</dt><dd className="text-slate-300">{client.contactName}</dd></div>
              <div>
                <dt className="text-xs text-slate-600 mb-0.5">Email</dt>
                <dd><a href={`mailto:${client.contactEmail}`} className="text-slate-300 hover:text-white transition-colors">{client.contactEmail}</a></dd>
              </div>
              {client.contactWhatsApp && (
                <div>
                  <dt className="text-xs text-slate-600 mb-0.5">WhatsApp</dt>
                  <dd><a href={`https://wa.me/${client.contactWhatsApp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer"
                    className="text-green-400 hover:text-green-300 transition-colors">{client.contactWhatsApp}</a></dd>
                </div>
              )}
              {client.domain && <div><dt className="text-xs text-slate-600 mb-0.5">Dominio</dt><dd className="text-slate-300">{client.domain}</dd></div>}
              <div><dt className="text-xs text-slate-600 mb-0.5">Inicio</dt><dd className="text-slate-300">{client.startDate}</dd></div>
            </dl>
          </section>

          {/* Notes */}
          <section className="bg-white/4 border border-white/8 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Notas internas</h2>
              {!notesSaved && (
                <button onClick={handleSaveNotes}
                  className="text-xs px-2 py-1 bg-blue-600 text-white rounded transition-colors hover:bg-blue-500">Guardar</button>
              )}
            </div>
            <textarea value={notesVal}
              onChange={e => { setNotesVal(e.target.value); setNotesSaved(false); }}
              onBlur={handleSaveNotes} rows={5}
              className="w-full bg-white/5 border border-white/8 rounded-lg px-3 py-2 text-sm text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-blue-500/40 resize-none"
              placeholder="Notas sobre el cliente, acuerdos, preferencias..." />
          </section>

          {/* Danger zone */}
          <section className="border border-red-500/20 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-red-500/70 uppercase tracking-wider mb-3">Zona de peligro</h2>
            {!confirmDelete ? (
              <button onClick={() => setConfirmDelete(true)}
                className="text-sm text-red-500 hover:text-red-400 transition-colors">
                Eliminar cliente...
              </button>
            ) : (
              <div>
                <p className="text-xs text-slate-400 mb-3">¿Eliminar <span className="text-white font-semibold">{c.name}</span> permanentemente? No se puede deshacer.</p>
                <div className="flex gap-2">
                  <button onClick={handleDelete}
                    className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold rounded-lg transition-colors">
                    Sí, eliminar
                  </button>
                  <button onClick={() => setConfirmDelete(false)}
                    className="px-3 py-1.5 bg-white/6 text-slate-400 hover:text-white text-xs rounded-lg transition-colors">
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </section>

        </div>
      </div>

      {/* ── Edit modal ── */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="bg-[#1a1d27] border border-white/12 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-[#1a1d27] border-b border-white/8 px-6 py-4 flex items-center justify-between">
              <h2 className="text-base font-bold text-white">Editar cliente</h2>
              <button onClick={() => setEditing(false)} className="text-slate-500 hover:text-white transition-colors text-lg">✕</button>
            </div>
            <form onSubmit={handleSaveEdit} className="px-6 py-5 space-y-5">

              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-3">Datos generales</p>
                <div className="grid grid-cols-2 gap-3">
                  {([ ["Nombre", "name"], ["Industria", "industry"], ["Contacto", "contactName"], ["Email", "contactEmail"], ["WhatsApp", "contactWhatsApp"], ["Dominio", "domain"] ] as [string, keyof EditForm][]).map(([label, key]) => (
                    <div key={key}>
                      <label className="block text-xs text-slate-600 mb-1">{label}</label>
                      <input value={editForm[key]} onChange={setField(key)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50" />
                    </div>
                  ))}
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">Estado</label>
                    <select value={editForm.status} onChange={setField("status")}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none">
                      <option value="active">Activo</option>
                      <option value="pending">Pendiente</option>
                      <option value="paused">Pausado</option>
                      <option value="churned">Inactivo</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">Paquete</label>
                    <select value={editForm.package} onChange={setField("package")}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none">
                      <option value="basic">Basic</option>
                      <option value="standard">Standard</option>
                      <option value="premium">Premium</option>
                      <option value="custom">Custom</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">Mensualidad (USD)</label>
                    <input type="number" value={editForm.monthlyFee} onChange={setField("monthlyFee")}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50" />
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-3">Links del proyecto</p>
                <div className="grid grid-cols-2 gap-3">
                  {LINK_KEYS.map(key => (
                    <div key={key}>
                      <label className="block text-xs text-slate-600 mb-1">{LINK_META[key].icon} {LINK_META[key].label}</label>
                      <input value={editForm[key]} onChange={setField(key)}
                        placeholder="https://..."
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-700 focus:outline-none focus:border-blue-500/50" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t border-white/8">
                <button type="button" onClick={() => setEditing(false)}
                  className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors">Cancelar</button>
                <button type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg transition-colors">
                  Guardar cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
