import { Search } from 'lucide-react';

export default function SearchBar({ value, onChange, placeholder = 'Search a destination...' }) {
  return (
    <div className="relative w-full">
      <Search
        size={18}
        strokeWidth={1.75}
        className="absolute left-0 top-1/2 -translate-y-1/2 text-stone pointer-events-none"
      />
      <input
        type="text"
        id="destination-search"
        name="destination-search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Search destinations"
        className="w-full bg-transparent border-b border-line focus-visible:border-terracotta pl-7 pr-2 py-3 text-lg md:text-xl font-display placeholder:text-stone/60 outline-none transition-colors"
      />
    </div>
  );
}
