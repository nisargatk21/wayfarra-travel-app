import SmartImage from './SmartImage';

export default function PlaceCard({ place }) {
  return (
    <div className="group">
      <SmartImage
        query={place.imageQuery}
        fallbackId={place.imageId}
        alt={place.name}
        className="aspect-[4/5]"
        imgClassName="transition-transform duration-700 ease-editorial group-hover:scale-105"
      />
      <div className="pt-4">
        <span className="text-xs uppercase tracking-wide text-terracotta">{place.category}</span>
        <h4 className="font-display text-xl text-charcoal mt-1">{place.name}</h4>
        <p className="text-stone text-sm mt-1.5 leading-relaxed">{place.description}</p>
      </div>
    </div>
  );
}
