import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import SmartImage from './SmartImage';

/**
 * A single destination card. `size` controls the editorial layout weight —
 * "large" spans more of the grid, "small" is a compact secondary card.
 */
export default function DestinationCard({ destination, size = 'small' }) {
  const isLarge = size === 'large';

  return (
    <Link
      to={`/destination/${destination.id}`}
      className={`group relative block overflow-hidden ${isLarge ? 'aspect-[4/5] md:aspect-[16/11]' : 'aspect-[4/5]'}`}
    >
      <SmartImage
        query={destination.imageQuery}
        fallbackId={destination.exploreImageId ?? destination.imageId}
        alt={`${destination.name}, ${destination.country}`}
        className="absolute inset-0"
        imgClassName="transition-transform duration-700 ease-editorial group-hover:scale-[1.06]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/10 to-transparent" />

      <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-7">
        <span className="text-ivory/70 text-xs tracking-wide uppercase mb-1">
          {destination.country}
        </span>
        <div className="flex items-end justify-between gap-3">
          <h3 className={`font-display text-ivory ${isLarge ? 'text-3xl md:text-4xl' : 'text-2xl'}`}>
            {destination.name}
          </h3>
          <span className="flex items-center justify-center w-9 h-9 shrink-0 border border-ivory/40 rounded-full text-ivory transition-all duration-300 group-hover:bg-ivory group-hover:text-charcoal group-hover:border-ivory">
            <ArrowUpRight size={16} strokeWidth={1.75} />
          </span>
        </div>

        <p className="text-ivory/0 group-hover:text-ivory/75 max-h-0 group-hover:max-h-16 overflow-hidden transition-all duration-400 text-sm mt-2 leading-relaxed">
          {destination.description}
        </p>
      </div>
    </Link>
  );
}
