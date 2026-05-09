import { AlertTriangle, Info, X } from 'lucide-react';

interface AlertCardProps {
  type: 'warning' | 'info';
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  onDismiss?: () => void;
}

export function AlertCard({
  type,
  title,
  message,
  actionLabel,
  onAction,
  onDismiss,
}: AlertCardProps) {
  const config =
    type === 'warning'
      ? {
          icon: AlertTriangle,
          color: 'rgb(250, 115, 25)',
          bgColor: 'rgb(250, 115, 25, 0.1)',
          borderColor: 'rgb(250, 115, 25)',
        }
      : {
          icon: Info,
          color: 'rgb(71, 194, 255)',
          bgColor: 'rgb(71, 194, 255, 0.1)',
          borderColor: 'rgb(71, 194, 255)',
        };

  const Icon = config.icon;

  return (
    <div
      className="px-3 py-2 rounded-lg border border-[#e5e5e5] flex items-center gap-2"
      style={{
        backgroundColor: config.bgColor,
      }}
    >
      <Icon className="w-4 h-4 flex-shrink-0" style={{ color: config.color }} />
      <div className="flex-1 min-w-0">
        <p style={{ fontSize: '14px', fontWeight: '500', color: config.color }}>{title}</p>
        <p className="text-muted-foreground text-[#404040]" style={{ fontSize: '13px' }}>{message}</p>
      </div>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-2.5 py-1 rounded-md flex-shrink-0"
          style={{
            backgroundColor: config.color,
            color: 'white',
            fontSize: '13px',
            fontWeight: '500',
          }}
        >
          {actionLabel}
        </button>
      )}
      {onDismiss && (
        <button onClick={onDismiss} className="p-0.5 hover:bg-black/5 rounded flex-shrink-0">
          <X className="w-3.5 h-3.5" style={{ color: config.color }} />
        </button>
      )}
    </div>
  );
}
