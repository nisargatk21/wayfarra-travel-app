import { Coffee, Landmark, Palette, Trees, Mountain, Moon } from 'lucide-react';

const CATEGORY_ICON = {
  Food: Coffee,
  Landmark: Landmark,
  Culture: Palette,
  Nature: Trees,
  Adventure: Mountain,
  Rest: Moon,
};

export default function ActivityCard({ time, title, description, category }) {
  const Icon = CATEGORY_ICON[category] ?? Landmark;
  return (
    <div className="flex gap-4 md:gap-6">
      <div className="flex flex-col items-center w-16 md:w-20 shrink-0 pt-1">
        <span className="text-xs md:text-sm text-stone font-medium">{time}</span>
      </div>
      <div className="flex flex-col items-center shrink-0">
        <span className="w-8 h-8 rounded-full border border-line flex items-center justify-center text-terracotta bg-ivory">
          <Icon size={15} strokeWidth={1.75} />
        </span>
        <span className="w-px flex-1 bg-line mt-2" />
      </div>
      <div className="pb-8 flex-1">
        <h4 className="font-display text-lg text-charcoal">{title}</h4>
        <p className="text-stone text-sm mt-1 leading-relaxed max-w-md">{description}</p>
      </div>
    </div>
  );
}
