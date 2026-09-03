export default function FilterBar({ categories, active, onSelect }) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filter destinations by category">
      {categories.map((cat) => {
        const isActive = active === cat;
        return (
          <button
            key={cat}
            onClick={() => onSelect(cat)}
            aria-pressed={isActive}
            className={`px-4 py-2 text-sm border transition-colors duration-200 ${
              isActive
                ? 'bg-charcoal text-ivory border-charcoal'
                : 'border-line text-charcoal hover:border-charcoal'
            }`}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}
