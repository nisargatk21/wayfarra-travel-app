import { RefreshCcw } from 'lucide-react';

export default function ErrorState({ title, description, actionLabel = 'Try again', onAction }) {
  return (
    <div className="flex flex-col items-start gap-3 py-8 border-t border-line" role="alert">
      <p className="font-display text-xl text-charcoal">{title}</p>
      {description && <p className="text-stone text-sm max-w-sm leading-relaxed">{description}</p>}
      {onAction && (
        <button
          onClick={onAction}
          className="flex items-center gap-2 text-sm text-terracotta border-b border-terracotta/40 hover:border-terracotta pb-0.5 transition-colors mt-1"
        >
          <RefreshCcw size={14} strokeWidth={1.75} />
          {actionLabel}
        </button>
      )}
    </div>
  );
}
