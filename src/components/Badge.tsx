import type { ClientStatus, TaskStatus, TaskPriority, Package, ClientPhase } from "@/data/types";

const STATUS_STYLES: Record<ClientStatus, string> = {
  active:  "bg-green-50 text-green-600 border-green-200",
  pending: "bg-yellow-50 text-yellow-600 border-yellow-200",
  paused:  "bg-gray-100 text-gray-500 border-gray-200",
  churned: "bg-red-50 text-red-500 border-red-200",
};
const STATUS_LABELS: Record<ClientStatus, string> = {
  active: "Activo", pending: "Pendiente", paused: "Pausado", churned: "Inactivo"
};

const TASK_STYLES: Record<TaskStatus, string> = {
  todo:        "bg-gray-100 text-gray-500 border-gray-200",
  in_progress: "bg-blue-50 text-blue-600 border-blue-200",
  done:        "bg-green-50 text-green-600 border-green-200",
};
const TASK_LABELS: Record<TaskStatus, string> = {
  todo: "Pendiente", in_progress: "En progreso", done: "Completado"
};

const PRIORITY_STYLES: Record<TaskPriority, string> = {
  low:    "bg-gray-50 text-gray-500",
  medium: "bg-yellow-50 text-yellow-600",
  high:   "bg-red-50 text-red-500",
};
const PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: "Baja", medium: "Media", high: "Alta"
};

const PACKAGE_STYLES: Record<Package, string> = {
  basic:    "bg-gray-100 text-gray-500",
  standard: "bg-blue-50 text-blue-600",
  premium:  "bg-purple-50 text-purple-600",
  custom:   "bg-orange-50 text-orange-600",
};
const PACKAGE_LABELS: Record<Package, string> = {
  basic: "Basic", standard: "Standard", premium: "Premium", custom: "Custom"
};

const PHASE_STYLES: Record<ClientPhase, string> = {
  prospeccion:  "bg-gray-100 text-gray-500",
  recoleccion:  "bg-cyan-50 text-cyan-600",
  propuesta:    "bg-yellow-50 text-yellow-600",
  desarrollo:   "bg-blue-50 text-blue-600",
  revision:     "bg-purple-50 text-purple-600",
  entrega:      "bg-orange-50 text-orange-600",
  mantenimiento:"bg-green-50 text-green-600",
};
const PHASE_LABELS: Record<ClientPhase, string> = {
  prospeccion:  "Prospección",
  recoleccion:  "Recolección",
  propuesta:    "Propuesta",
  desarrollo:   "Desarrollo",
  revision:     "Revisión",
  entrega:      "Entrega",
  mantenimiento:"Mantenimiento",
};

const base  = "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border border-transparent";
const flat  = "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium";

export function StatusBadge({ status }: { status: ClientStatus }) {
  return <span className={`${base} ${STATUS_STYLES[status]}`}>{STATUS_LABELS[status]}</span>;
}
export function TaskBadge({ status }: { status: TaskStatus }) {
  return <span className={`${base} ${TASK_STYLES[status]}`}>{TASK_LABELS[status]}</span>;
}
export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  return <span className={`${flat} ${PRIORITY_STYLES[priority]}`}>{PRIORITY_LABELS[priority]}</span>;
}
export function PackageBadge({ pkg }: { pkg: Package }) {
  return <span className={`${flat} ${PACKAGE_STYLES[pkg]}`}>{PACKAGE_LABELS[pkg]}</span>;
}
export function PhaseBadge({ phase }: { phase: ClientPhase }) {
  return <span className={`${flat} ${PHASE_STYLES[phase]}`}>{PHASE_LABELS[phase]}</span>;
}
