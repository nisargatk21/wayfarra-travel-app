import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { destinations } from '../data/destinations';
import ItineraryDay from '../components/ItineraryDay';
import ErrorState from '../components/ErrorState';
import { generateItinerary } from '../services/geminiService';

const STYLES = ['Slow & Scenic', 'Culture', 'Adventure', 'Food', 'Romantic', 'First-time Explorer'];
const DAY_OPTIONS = [2, 3, 4, 5, 6, 7];

export default function Planner() {
  const [searchParams, setSearchParams] = useSearchParams();
  const preselected = searchParams.get('destination');

  const [destinationId, setDestinationId] = useState(preselected || destinations[0].id);
  const [days, setDays] = useState(3);
  const [style, setStyle] = useState('First-time Explorer');
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (preselected) {
      setDestinationId(preselected);
    } else {
      setSearchParams({ destination: destinations[0].id }, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep the URL in sync so the destination choice can be read elsewhere
  // (the Travel Companion chat uses this to know what you're planning for).
  function selectDestination(id) {
    setDestinationId(id);
    setSearchParams({ destination: id }, { replace: true });
  }

  const destination = destinations.find((d) => d.id === destinationId);

  async function handleGenerate() {
    setLoading(true);
    setError(false);
    setItinerary(null);
    try {
      const result = await generateItinerary({ destination, days, style });
      setItinerary(result);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="pt-28 md:pt-36 pb-24">
      <div className="max-w-content mx-auto px-6 md:px-10">
        <span className="text-xs uppercase tracking-[0.15em] text-terracotta">Plan</span>
        <h1 className="font-display text-4xl md:text-6xl text-charcoal mt-2 mb-4 text-balance">
          Build my journey.
        </h1>
        <p className="text-stone max-w-lg mb-12 md:mb-16 leading-relaxed">
          Choose a destination, how long you have, and the kind of traveller you are. WANDER builds a day-by-day
          plan grounded in real places.
        </p>

        {/* FORM */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16 mb-16 md:mb-20">
          <div>
            <label className="block text-sm text-stone mb-3">Destination</label>
            <div className="flex flex-col gap-1 max-h-64 overflow-y-auto pr-2">
              {destinations.map((d) => (
                <button
                  key={d.id}
                  onClick={() => selectDestination(d.id)}
                  className={`text-left px-3 py-2.5 text-sm transition-colors border-l-2 ${
                    destinationId === d.id
                      ? 'border-terracotta text-charcoal bg-line/30'
                      : 'border-transparent text-stone hover:text-charcoal'
                  }`}
                >
                  {d.name}, <span className="text-stone/70">{d.country}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm text-stone mb-3">Number of days</label>
            <div className="flex flex-wrap gap-2">
              {DAY_OPTIONS.map((n) => (
                <button
                  key={n}
                  onClick={() => setDays(n)}
                  aria-pressed={days === n}
                  className={`w-11 h-11 text-sm border transition-colors ${
                    days === n ? 'bg-charcoal text-ivory border-charcoal' : 'border-line text-charcoal hover:border-charcoal'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>

            <label className="block text-sm text-stone mb-3 mt-8">Travel style</label>
            <div className="flex flex-wrap gap-2">
              {STYLES.map((s) => (
                <button
                  key={s}
                  onClick={() => setStyle(s)}
                  aria-pressed={style === s}
                  className={`px-3 py-2 text-sm border transition-colors ${
                    style === s ? 'bg-charcoal text-ivory border-charcoal' : 'border-line text-charcoal hover:border-charcoal'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col justify-end">
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full bg-terracotta text-ivory py-4 text-sm hover:bg-terracotta-dark transition-colors disabled:opacity-60"
            >
              {loading ? 'Generating your itinerary...' : 'Generate itinerary'}
            </button>
            {destination && (
              <p className="text-xs text-stone mt-3">
                {days} days in {destination.name}, {style.toLowerCase()} style.
              </p>
            )}
          </div>
        </div>

        {/* RESULT */}
        {loading && (
          <div className="flex flex-col gap-4" role="status" aria-label="Generating itinerary">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="h-24 bg-line/40 animate-pulse" />
            ))}
          </div>
        )}

        {error && (
          <ErrorState
            title="Your itinerary hit a snag."
            description="Something interrupted the plan. Try generating again."
            onAction={handleGenerate}
          />
        )}

        <AnimatePresence>
          {itinerary && !loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="border-t border-line"
            >
              {itinerary.map((day, i) => (
                <ItineraryDay key={day.day} day={day.day} title={day.title} activities={day.activities} index={i} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
