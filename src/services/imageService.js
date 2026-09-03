// Reusable image service.
// If VITE_UNSPLASH_ACCESS_KEY is present, resolve images dynamically via the
// Unsplash API. Otherwise (or on failure), fall back to a curated Unsplash
// photo ID baked into the destination data — still a real, hotlinked photo,
// just not a live search. This keeps the product fully demoable without keys.

const UNSPLASH_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
const PEXELS_KEY = import.meta.env.VITE_PEXELS_API_KEY;

const cache = new Map();

function unsplashUrlFromId(id, { w = 1600, h = 2000, fit = 'crop' } = {}) {
  return `https://images.unsplash.com/${id}?auto=format&fit=${fit}&w=${w}&h=${h}&q=80`;
}

/**
 * Resolve a photo for a given query, with a guaranteed fallback ID so the UI
 * never shows a broken image.
 */
export async function getImage(query, fallbackId, opts = {}) {
  const cacheKey = `${query}-${JSON.stringify(opts)}`;
  if (cache.has(cacheKey)) return cache.get(cacheKey);

  const fallback = unsplashUrlFromId(fallbackId, opts);

  if (!UNSPLASH_KEY && !PEXELS_KEY) {
    cache.set(cacheKey, fallback);
    return fallback;
  }

  try {
    if (UNSPLASH_KEY) {
      const res = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=portrait`,
        { headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` } }
      );
      if (!res.ok) throw new Error('Unsplash request failed');
      const data = await res.json();
      const url = data?.results?.[0]?.urls?.regular;
      if (url) {
        cache.set(cacheKey, url);
        return url;
      }
    } else if (PEXELS_KEY) {
      const res = await fetch(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1`,
        { headers: { Authorization: PEXELS_KEY } }
      );
      if (!res.ok) throw new Error('Pexels request failed');
      const data = await res.json();
      const url = data?.photos?.[0]?.src?.large2x;
      if (url) {
        cache.set(cacheKey, url);
        return url;
      }
    }
  } catch (err) {
    // Silently degrade to the fallback image — never break the layout.
  }

  cache.set(cacheKey, fallback);
  return fallback;
}

export function getFallbackImage(fallbackId, opts = {}) {
  return unsplashUrlFromId(fallbackId, opts);
}
