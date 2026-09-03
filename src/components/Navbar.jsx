import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { MapPin, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const links = [
  { to: '/explore', label: 'Explore' },
  { to: '/plan', label: 'Plan a Trip' },
];

export default function Navbar({ transparent = false, onUseLocation, locationLabel }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const dark = !transparent || scrolled;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-colors duration-500 ${
        dark ? 'bg-ivory/95 backdrop-blur border-b border-line' : 'bg-transparent'
      }`}
    >
      <div className={`max-w-content mx-auto flex items-center justify-between px-6 md:px-10 ${dark ? 'py-4' : 'py-6'} transition-all`}>
        <Link to="/" className="flex items-center gap-2 group" aria-label="WANDER home">
          <span className={`font-display text-xl tracking-tight ${dark ? 'text-charcoal' : 'text-ivory'}`}>
            WANDER
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8" aria-label="Primary">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `relative text-[15px] pb-1 transition-colors ${dark ? 'text-charcoal' : 'text-ivory'} ${
                  isActive ? 'after:w-full' : 'after:w-0'
                } after:absolute after:left-0 after:-bottom-0.5 after:h-px after:bg-terracotta after:transition-all after:duration-300 hover:after:w-full`
              }
            >
              {l.label}
            </NavLink>
          ))}
          <a href="#about" className={`relative text-[15px] pb-1 transition-colors ${dark ? 'text-charcoal' : 'text-ivory'} after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-0 after:bg-terracotta after:transition-all after:duration-300 hover:after:w-full`}>
            About
          </a>
        </nav>

        <div className="flex items-center gap-4">
          <button
            onClick={onUseLocation}
            className={`hidden sm:flex items-center gap-1.5 text-sm border-b border-transparent hover:border-current pb-0.5 transition-colors ${
              dark ? 'text-charcoal' : 'text-ivory'
            }`}
          >
            <MapPin size={15} strokeWidth={1.75} />
            {locationLabel ? locationLabel : 'Use my location'}
          </button>
          <button
            className={`md:hidden ${dark ? 'text-charcoal' : 'text-ivory'}`}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.65, 0, 0.35, 1] }}
            className="md:hidden bg-ivory border-t border-line overflow-hidden"
            aria-label="Mobile"
          >
            <div className="flex flex-col px-6 py-4 gap-4">
              {links.map((l) => (
                <Link key={l.to} to={l.to} className="text-lg font-display text-charcoal" onClick={() => setMenuOpen(false)}>
                  {l.label}
                </Link>
              ))}
              <a href="#about" className="text-lg font-display text-charcoal" onClick={() => setMenuOpen(false)}>About</a>
              <button
                onClick={() => { onUseLocation?.(); setMenuOpen(false); }}
                className="flex items-center gap-2 text-sm text-stone mt-2"
              >
                <MapPin size={15} /> {locationLabel ? locationLabel : 'Use my location'}
              </button>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
