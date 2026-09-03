import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { destinations } from '../data/destinations';
import SmartImage from '../components/SmartImage';
import DestinationCard from '../components/DestinationCard';

const HERO_SLIDES = ['kyoto', 'bali', 'queenstown'].map((id) => destinations.find((d) => d.id === id));
// A looping video background is the ideal, but it means depending on a
// specific third-party CDN URL staying online. Rather than risk a broken
// hero on a real deployment, the hero defaults to a slow Ken Burns-style
// photo crossfade — visually cinematic without an external video dependency.
// Drop a verified .mp4 URL into VIDEO_URL to switch back to true video.
const VIDEO_URL = '';

export default function Home() {
  const [slide, setSlide] = useState(0);
  const [videoFailed, setVideoFailed] = useState(!VIDEO_URL);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.2]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 120]);

  useEffect(() => {
    if (!videoFailed) return;
    const t = setInterval(() => setSlide((s) => (s + 1) % HERO_SLIDES.length), 6000);
    return () => clearInterval(t);
  }, [videoFailed]);

  const featured = destinations.slice(0, 4);

  return (
    <div>
      {/* HERO */}
      <section ref={heroRef} className="relative h-screen min-h-[640px] w-full overflow-hidden bg-charcoal">
        <motion.div style={{ opacity: heroOpacity, y: heroY }} className="absolute inset-0">
          {!videoFailed ? (
            <video
              className="w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              onError={() => setVideoFailed(true)}
            >
              <source src={VIDEO_URL} type="video/mp4" />
            </video>
          ) : (
            HERO_SLIDES.map((d, i) => (
              <SmartImage
                key={d.id}
                query={d.imageQuery}
                fallbackId={d.imageId}
                alt=""
                eager={i === 0}
                className={`absolute inset-0 transition-opacity duration-[1500ms] ${i === slide ? 'opacity-100' : 'opacity-0'}`}
                imgClassName={i === slide ? 'animate-kenburns' : ''}
              />
            ))
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/30 to-charcoal/50" />
        </motion.div>

        <div className="relative h-full flex flex-col justify-end max-w-content mx-auto px-6 md:px-10 pb-24 md:pb-28">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-ivory/70 text-xs md:text-sm tracking-[0.15em] uppercase mb-4"
          >
            Your next escape
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.35, ease: [0.65, 0, 0.35, 1] }}
            className="font-display text-ivory text-[13vw] leading-[0.95] sm:text-6xl md:text-7xl lg:text-8xl max-w-3xl text-balance"
          >
            Go somewhere worth remembering.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="text-ivory/80 mt-6 max-w-md text-base md:text-lg leading-relaxed"
          >
            Discover remarkable places, understand the moment, and let your journey take shape.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
            className="flex flex-wrap gap-4 mt-9"
          >
            <Link
              to="/explore"
              className="group inline-flex items-center gap-2 bg-ivory text-charcoal px-6 py-3.5 text-sm hover:bg-terracotta hover:text-ivory transition-colors"
            >
              Explore destinations
              <ArrowRight size={16} strokeWidth={1.75} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              to="/plan"
              className="group inline-flex items-center gap-2 border border-ivory/50 text-ivory px-6 py-3.5 text-sm hover:border-ivory transition-colors"
            >
              Build my journey
              <ArrowRight size={16} strokeWidth={1.75} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-ivory/50"
          aria-hidden="true"
        >
          <span className="text-[10px] tracking-[0.2em] uppercase">Scroll</span>
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.8 }}>
            <ChevronDown size={16} />
          </motion.div>
        </motion.div>
      </section>

      {/* FEATURED */}
      <section className="max-w-content mx-auto px-6 md:px-10 py-20 md:py-28">
        <div className="flex items-end justify-between mb-10 md:mb-14">
          <div>
            <h2 className="font-display text-3xl md:text-5xl text-charcoal max-w-xl text-balance">
              A handful of places worth the flight.
            </h2>
          </div>
          <Link
            to="/explore"
            className="hidden md:inline-flex items-center gap-1.5 text-sm text-charcoal border-b border-charcoal/30 hover:border-charcoal pb-0.5 shrink-0"
          >
            View all <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {featured.map((d) => (
            <DestinationCard key={d.id} destination={d} />
          ))}
        </div>

        <Link to="/explore" className="md:hidden inline-flex items-center gap-1.5 text-sm text-charcoal border-b border-charcoal/30 mt-8">
          View all destinations <ArrowRight size={14} />
        </Link>
      </section>

      {/* EDITORIAL STRIP */}
      <section className="bg-charcoal-soft text-ivory">
        <div className="max-w-content mx-auto px-6 md:px-10 py-20 md:py-28 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <h2 className="font-display text-3xl md:text-5xl leading-tight text-balance">
            Plan a trip that feels like it was made for you, not sold to you.
          </h2>
          <div className="flex flex-col gap-6">
            <p className="text-ivory/70 leading-relaxed max-w-md">
              Tell WANDER how many days you have and what kind of traveller you are. It builds a day-by-day
              itinerary grounded in real places — not a generic checklist.
            </p>
            <Link
              to="/plan"
              className="group inline-flex items-center gap-2 w-fit border border-ivory/50 text-ivory px-6 py-3.5 text-sm hover:border-ivory transition-colors"
            >
              Build my journey
              <ArrowRight size={16} strokeWidth={1.75} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
