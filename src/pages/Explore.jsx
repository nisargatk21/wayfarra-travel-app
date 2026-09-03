import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { destinations, CATEGORIES } from '../data/destinations';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import DestinationGrid from '../components/DestinationGrid';
import { useDebounce } from '../hooks/useDebounce';

export default function Explore() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const debouncedQuery = useDebounce(query, 250);

  const filtered = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    return destinations.filter((d) => {
      const matchesCategory = category === 'All' || d.category === category;
      const matchesQuery =
        !q ||
        d.name.toLowerCase().includes(q) ||
        d.country.toLowerCase().includes(q) ||
        d.tags.some((t) => t.toLowerCase().includes(q));
      return matchesCategory && matchesQuery;
    });
  }, [debouncedQuery, category]);

  return (
    <div className="pt-28 md:pt-36 pb-24">
      <div className="max-w-content mx-auto px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1] }}
        >
          <span className="text-xs uppercase tracking-[0.15em] text-terracotta">Explore</span>
          <h1 className="font-display text-4xl md:text-6xl text-charcoal mt-2 mb-10 md:mb-14 text-balance">
            Where next?
          </h1>
        </motion.div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="max-w-md w-full">
            <SearchBar value={query} onChange={setQuery} />
          </div>
          <FilterBar categories={CATEGORIES} active={category} onSelect={setCategory} />
        </div>

        <p className="text-stone text-sm mb-6">
          {filtered.length} {filtered.length === 1 ? 'destination' : 'destinations'}
        </p>

        <DestinationGrid
          destinations={filtered}
          onClearFilters={() => {
            setQuery('');
            setCategory('All');
          }}
        />
      </div>
    </div>
  );
}
