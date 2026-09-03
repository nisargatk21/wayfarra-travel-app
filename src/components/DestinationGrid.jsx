import DestinationCard from './DestinationCard';
import EmptyState from './EmptyState';

/**
 * Editorial, asymmetric grid rather than a uniform card wall — every third
 * card spans wider to break the rhythm on desktop.
 */
export default function DestinationGrid({ destinations, onClearFilters }) {
  if (destinations.length === 0) {
    return (
      <EmptyState
        title="No journeys found."
        description="Try a different search term or clear your filters to see every destination."
        actionLabel="Clear search"
        onAction={onClearFilters}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
      {destinations.map((d, i) => {
        const isLarge = i % 5 === 0;
        return (
          <div key={d.id} className={isLarge ? 'sm:col-span-2' : ''}>
            <DestinationCard destination={d} size={isLarge ? 'large' : 'small'} />
          </div>
        );
      })}
    </div>
  );
}
