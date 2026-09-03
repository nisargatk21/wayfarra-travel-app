import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer id="about" className="bg-charcoal text-ivory">
      <div className="max-w-content mx-auto px-6 md:px-10 py-16 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <span className="font-display text-2xl">WANDER</span>
          <p className="mt-3 text-ivory/60 text-sm max-w-xs leading-relaxed">
            Go somewhere worth remembering.
          </p>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <span className="text-ivory/40 mb-1">Product</span>
          <Link to="/explore" className="text-ivory/80 hover:text-ivory transition-colors w-fit">Explore</Link>
          <Link to="/plan" className="text-ivory/80 hover:text-ivory transition-colors w-fit">Plan</Link>
          <a href="#about" className="text-ivory/80 hover:text-ivory transition-colors w-fit">About</a>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <span className="text-ivory/40 mb-1">About</span>
          <p className="text-ivory/70 leading-relaxed max-w-xs">
            WANDER is a design study in editorial travel experiences — built to explore, plan, and imagine a trip, powered by live weather and an AI travel companion.
          </p>
        </div>
      </div>
      <div className="border-t border-ivory/10">
        <div className="max-w-content mx-auto px-6 md:px-10 py-6 text-xs text-ivory/40">
          © {new Date().getFullYear()} WANDER. A design & engineering exercise.
        </div>
      </div>
    </footer>
  );
}
