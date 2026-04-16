interface Props {
  href: string;
  label: string;
  icon: string;
  color?: string;
}

export function ExternalLink({ href, label, icon, color = "text-slate-400 hover:text-white" }: Props) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-sm font-medium ${color}`}
    >
      <span className="text-base">{icon}</span>
      {label}
    </a>
  );
}
