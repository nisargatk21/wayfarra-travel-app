export default function EmptyState({ title, description, actionLabel, onAction }) {
  return (
    <div className="flex flex-col items-center text-center gap-3 py-20 border-t border-line">
      <p className="font-display text-2xl text-charcoal">{title}</p>
      {description && <p className="text-stone text-sm max-w-sm leading-relaxed">{description}</p>}
      {onAction && (
        <button
          onClick={onAction}
          className="mt-2 text-sm border-b border-charcoal pb-0.5 hover:text-terracotta hover:border-terracotta transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
