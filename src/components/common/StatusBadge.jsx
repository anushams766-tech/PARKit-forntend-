import { SLOT_STATUS } from '../../utils/constants';

export default function StatusBadge({ status, showDot = true, size = 'sm', className = '' }) {
  const normalized = status ? status.toUpperCase() : 'UNCERTAIN';

  let config = {
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
    dotColor: 'bg-amber-500',
    label: 'Uncertain',
  };

  if (normalized === SLOT_STATUS.EMPTY) {
    config = {
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      dotColor: 'bg-emerald-600',
      label: 'Empty',
    };
  } else if (normalized === SLOT_STATUS.OCCUPIED) {
    config = {
      badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
      dotColor: 'bg-rose-600',
      label: 'Occupied',
    };
  }

  const sizeClasses = {
    xs: 'px-2 py-0.5 text-[10px]',
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-bold rounded-full tracking-wide uppercase border transition-colors ${config.badgeClass} ${sizeClasses[size] || sizeClasses.sm} ${className}`}
    >
      {showDot && <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor}`} />}
      {config.label}
    </span>
  );
}
