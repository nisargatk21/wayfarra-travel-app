export function ImageSkeleton({ className = '' }) {
  return <div className={`animate-pulse bg-gradient-to-br from-line/70 to-stone/20 ${className}`} />;
}

export function TextSkeleton({ lines = 3, className = '' }) {
  return (
    <div className={`flex flex-col gap-2 ${className}`} aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-3 bg-line/70 animate-pulse"
          style={{ width: i === lines - 1 ? '60%' : '100%' }}
        />
      ))}
    </div>
  );
}

export function WeatherSkeleton() {
  return (
    <div className="flex items-center gap-6 animate-pulse" role="status" aria-label="Loading weather">
      <div className="w-16 h-16 rounded-full bg-line/70" />
      <div className="flex flex-col gap-2 flex-1">
        <div className="h-6 w-24 bg-line/70" />
        <div className="h-3 w-40 bg-line/50" />
      </div>
    </div>
  );
}

export function CardGridSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5" role="status" aria-label="Loading destinations">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="aspect-[4/5] bg-line/50 animate-pulse" />
      ))}
    </div>
  );
}

export function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-3 py-2" role="status" aria-label="Travel companion is typing">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-stone animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );
}
