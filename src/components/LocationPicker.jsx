import { useState } from 'react';
import { MapPin, Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LOCATION_STATUS } from '../hooks/useLocation';
import { searchLocation } from '../services/locationService';
import { useDebounce } from '../hooks/useDebounce';
import { useEffect } from 'react';

export default function LocationPicker({ status, place, onDetect, onManualSelect, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const debounced = useDebounce(query, 350);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (debounced.trim().length < 2) {
      setResults([]);
      return;
    }
    let active = true;
    setSearching(true);
    searchLocation(debounced).then((res) => {
      if (active) {
        setResults(res);
        setSearching(false);
      }
    });
    return () => {
      active = false;
    };
  }, [debounced]);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 md:pt-32 px-4" role="dialog" aria-modal="true" aria-label="Choose your location">
      <button
        className="absolute inset-0 bg-charcoal/60 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close location picker"
      />
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.25, ease: [0.65, 0, 0.35, 1] }}
        className="relative bg-ivory w-full max-w-md p-6 md:p-8 border border-line"
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display text-xl text-charcoal">Where are you exploring from?</h3>
          <button onClick={onClose} aria-label="Close" className="text-stone hover:text-charcoal">
            <X size={20} />
          </button>
        </div>

        {status === LOCATION_STATUS.LOADING && (
          <p className="text-stone text-sm py-2">Finding your location...</p>
        )}
        {status === LOCATION_STATUS.DENIED && (
          <p className="text-terracotta text-sm py-2">We couldn't access your location. Search for it manually below.</p>
        )}
        {status === LOCATION_STATUS.UNSUPPORTED && (
          <p className="text-terracotta text-sm py-2">Your browser doesn't support location detection. Search manually below.</p>
        )}
        {status === LOCATION_STATUS.SUCCESS && place && (
          <p className="text-charcoal text-sm py-2">You're exploring from <strong className="font-medium">{place}</strong>.</p>
        )}

        <button
          onClick={onDetect}
          className="w-full flex items-center justify-center gap-2 border border-charcoal text-charcoal py-3 text-sm mt-2 hover:bg-charcoal hover:text-ivory transition-colors"
        >
          <MapPin size={16} strokeWidth={1.75} /> Use my current location
        </button>

        <div className="relative mt-6">
          <Search size={16} className="absolute left-0 top-1/2 -translate-y-1/2 text-stone" />
          <input
            id="manual-location-search"
            name="manual-location-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search manually — try a city..."
            className="w-full bg-transparent border-b border-line focus-visible:border-terracotta pl-6 py-2.5 text-sm outline-none"
          />
        </div>

        <AnimatePresence>
          {results.length > 0 && (
            <motion.ul
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-2 max-h-48 overflow-y-auto"
            >
              {results.map((r) => (
                <li key={`${r.name}-${r.lat}`}>
                  <button
                    onClick={() => onManualSelect(r)}
                    className="w-full text-left py-2 text-sm text-charcoal hover:text-terracotta transition-colors"
                  >
                    {r.name}
                  </button>
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
        {searching && <p className="text-xs text-stone mt-2">Searching...</p>}
      </motion.div>
    </div>
  );
}
