import { useEffect, useState } from 'react';
import { getImage, getFallbackImage } from '../services/imageService';

/**
 * Resolves an image from the image service (Unsplash/Pexels, or a curated
 * fallback), lazy-loads it, and never leaves a broken <img> on screen.
 */
export default function SmartImage({ query, fallbackId, alt, className = '', imgClassName = '', eager = false, ...rest }) {
  const [src, setSrc] = useState(() => getFallbackImage(fallbackId));
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  useEffect(() => {
    let active = true;
    getImage(query, fallbackId).then((url) => {
      if (active) setSrc(url);
    });
    return () => {
      active = false;
    };
  }, [query, fallbackId]);

  return (
    <div className={`relative overflow-hidden bg-line/60 ${className}`}>
      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-line/70 to-stone/20" aria-hidden="true" />
      )}
      <img
        src={errored ? getFallbackImage(fallbackId) : src}
        alt={alt}
        width={800}
        height={1000}
        loading={eager ? 'eager' : 'lazy'}
        onLoad={() => setLoaded(true)}
        onError={() => setErrored(true)}
        className={`w-full h-full object-cover transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'} ${imgClassName}`}
        {...rest}
      />
    </div>
  );
}
