import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CloudSun, MessageCircleQuestion, Route } from 'lucide-react';
import { getDestinationById } from '../data/destinations';
import SmartImage from '../components/SmartImage';
import WeatherCard from '../components/WeatherCard';
import PlaceCard from '../components/PlaceCard';
import EmptyState from '../components/EmptyState';
import { useWeather } from '../hooks/useWeather';

export default function Destination() {
  const { id } = useParams();
  const navigate = useNavigate();
  const destination = getDestinationById(id);

  const { status, weather, retry } = useWeather(destination?.coordinates);

  if (!destination) {
    return (
      <div className="pt-40 max-w-content mx-auto px-6">
        <EmptyState
          title="We couldn't find that destination."
          description="It may have been moved or doesn't exist."
          actionLabel="Back to Explore"
          onAction={() => navigate('/explore')}
        />
      </div>
    );
  }

  return (
    <div>
      {/* HERO */}
      <section className="relative h-[70vh] min-h-[480px] w-full overflow-hidden bg-charcoal">
        <SmartImage
          query={destination.imageQuery}
          fallbackId={destination.imageId}
          alt={`${destination.name}, ${destination.country}`}
          eager
          className="absolute inset-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/20 to-charcoal/40" />

        <div className="relative h-full flex flex-col justify-end max-w-content mx-auto px-6 md:px-10 pb-14 md:pb-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.65, 0, 0.35, 1] }}>
            <span className="text-ivory/70 text-sm uppercase tracking-wide">{destination.country}</span>
            <h1 className="font-display text-ivory text-5xl md:text-7xl mt-2 mb-4">{destination.name}</h1>
            <p className="text-ivory/85 max-w-lg text-base md:text-lg leading-relaxed">{destination.story}</p>

            <div className="flex flex-wrap gap-3 mt-8">
              <a href="#weather" className="flex items-center gap-2 bg-ivory text-charcoal px-5 py-3 text-sm hover:bg-terracotta hover:text-ivory transition-colors">
                <CloudSun size={16} strokeWidth={1.75} /> Check weather
              </a>
              <a href="#companion" className="flex items-center gap-2 border border-ivory/50 text-ivory px-5 py-3 text-sm hover:border-ivory transition-colors">
                <MessageCircleQuestion size={16} strokeWidth={1.75} /> Ask Travel Companion
              </a>
              <Link to={`/plan?destination=${destination.id}`} className="flex items-center gap-2 border border-ivory/50 text-ivory px-5 py-3 text-sm hover:border-ivory transition-colors">
                <Route size={16} strokeWidth={1.75} /> Build itinerary
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-content mx-auto px-6 md:px-10">
        {/* OVERVIEW */}
        <section className="py-16 md:py-20 grid grid-cols-1 md:grid-cols-3 gap-10 border-b border-line">
          <h2 className="font-display text-2xl text-charcoal">Overview</h2>
          <p className="md:col-span-2 text-charcoal/80 text-lg leading-relaxed max-w-2xl">
            {destination.description}
          </p>
        </section>

        {/* WEATHER */}
        <section id="weather" className="py-16 md:py-20 border-b border-line scroll-mt-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <h2 className="font-display text-2xl text-charcoal">Current weather</h2>
            <div className="md:col-span-2">
              <WeatherCard status={status} weather={weather} onRetry={retry} destinationName={destination.name} />
            </div>
          </div>
        </section>

        {/* PLACES */}
        <section className="py-16 md:py-20 border-b border-line">
          <h2 className="font-display text-2xl text-charcoal mb-8 md:mb-10">Places worth seeing</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {destination.places.map((p) => (
              <PlaceCard key={p.name} place={p} />
            ))}
          </div>
        </section>

        {/* WHEN TO GO */}
        <section className="py-16 md:py-20 border-b border-line grid grid-cols-1 md:grid-cols-3 gap-10">
          <h2 className="font-display text-2xl text-charcoal">When to go</h2>
          <div className="md:col-span-2 flex flex-col gap-4 max-w-2xl">
            <p className="text-charcoal/80 leading-relaxed"><span className="text-terracotta">Best time to visit — </span>{destination.bestTime}</p>
            <p className="text-charcoal/80 leading-relaxed"><span className="text-terracotta">Climate — </span>{destination.climate}</p>
          </div>
        </section>

        {/* COMPANION TEASER */}
        <section id="companion" className="py-16 md:py-24 text-center scroll-mt-24">
          <span className="text-xs uppercase tracking-[0.15em] text-terracotta">Travel Companion</span>
          <h2 className="font-display text-3xl md:text-4xl text-charcoal mt-3 mb-4 max-w-lg mx-auto text-balance">
            Not sure where to begin? Ask WANDER.
          </h2>
          <p className="text-stone max-w-md mx-auto leading-relaxed">
            Use the chat in the bottom corner to ask anything about {destination.name} — it already knows what
            you're looking at.
          </p>
        </section>
      </div>
    </div>
  );
}
