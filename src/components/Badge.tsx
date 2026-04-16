import type { ClientStatus, TaskStatus, TaskPriority, Package } from "@/data/types";

const STATUS_STYLES: Record<ClientStatus, string> = {
  active:  "bg-green-500/15 text-green-400 border-green-500/30",
  pending: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  paused:  "bg-slate-500/15 text-slate-400 border-slate-500/30",
  churned: "bg-red-500/15 text-red-400 border-red-500/30",
};
const STATUS_LABELS: Record<ClientStatus, string> = {
  active: "Activo", pending: "Pendiente", paused: "Pausado", churned: "Inactivo"
};

const TASK_STYLES: Record<TaskStatus, string> = {
  todo:        "bg-slate-500/15 text-slate-400 border-slate-500/30",
  in_progress: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  done:        "bg-green-500/15 text-green-400 border-green-500/30",
};
const TASK_LABELS: Record<TaskStatus, string> = {
  todo: "Pendiente", in_progress: "En progreso", done: "Completado"
};

const PRIORITY_STYLES: Record<TaskPriority, string> = {
  low:    "bg-slate-500/10 text-slate-500",
  medium: "bg-yellow-500/15 text-yellow-500",
  high:   "bg-red-500/15 text-red-400",
};
const PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: "Baja", medium: "Media", high: "Alta"
};

const PACKAGE_STYLES: Record<Package, string> = {
  basic:    "bg-slate-500/10 text-slate-400",
  standard: "bg-blue-500/15 text-blue-400",
  premium:  "bg-purple-500/15 text-purple-400",
  custom:   "bg-orange-500/15 text-orange-400",
};
const PACKAGE_LABELS: Record<Package, string> = {
  basic: "Basic", standard: "Standard", premium: "Premium", custom: "Custom"
};

const base = "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border";

export function StatusBadge({ status }: { status: ClientStatus }) {
  return <span className={`${base} ${STATUS_STYLES[status]}`}>{STATUS_LABELS[status]}</span>;
}
export function TaskBadge({ status }: { status: TaskStatus }) {
  return <span className={`${base} ${TASK_STYLES[status]}`}>{TASK_LABELS[status]}</span>;
}
export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  return <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${PRIORITY_STYLES[priority]}`}>{PRIORITY_LABELS[priority]}</span>;
}
export function PackageBadge({ pkg }: { pkg: Package }) {
  return <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${PACKAGE_STYLES[pkg]}`}>{PACKAGE_LABELS[pkg]}</span>;
}
