// Browser Geolocation + lightweight reverse geocoding (via Open-Meteo's free
// geocoding endpoint, no key required) so we can show a human-readable place
// name rather than raw coordinates.

export function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) {
      reject(new Error('unsupported'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => reject(err),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 5 * 60 * 1000 }
    );
  });
}

export async function reverseGeocode({ lat, lng }) {
  try {
    const res = await fetch(
      `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${lat}&longitude=${lng}&count=1`
    );
    if (!res.ok) throw new Error('reverse geocode failed');
    const data = await res.json();
    const place = data?.results?.[0];
    if (!place) return null;
    return place.admin1 ? `${place.name}, ${place.admin1}` : place.name;
  } catch {
    return null;
  }
}

export async function searchLocation(query) {
  try {
    const res = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5`
    );
    if (!res.ok) throw new Error('search failed');
    const data = await res.json();
    return (data?.results ?? []).map((r) => ({
      name: r.admin1 ? `${r.name}, ${r.admin1}, ${r.country}` : `${r.name}, ${r.country}`,
      lat: r.latitude,
      lng: r.longitude,
    }));
  } catch {
    return [];
  }
}
