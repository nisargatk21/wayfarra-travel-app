// OpenWeather integration.
// Requires VITE_OPENWEATHER_API_KEY. If it isn't set, we surface a clear,
// well-designed "no key configured" state rather than faking live data.

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

export const WEATHER_STATUS = {
  NO_KEY: 'no_key',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
};

export async function fetchWeather({ lat, lng, units = 'metric' }) {
  if (!API_KEY) {
    const err = new Error('missing_key');
    err.code = WEATHER_STATUS.NO_KEY;
    throw err;
  }

  const url = `${BASE_URL}?lat=${lat}&lon=${lng}&units=${units}&appid=${API_KEY}`;
  const res = await fetch(url);

  if (!res.ok) {
    const err = new Error('Weather request failed');
    err.code = WEATHER_STATUS.ERROR;
    throw err;
  }

  const data = await res.json();

  return {
    temp: Math.round(data.main.temp),
    feelsLike: Math.round(data.main.feels_like),
    condition: data.weather?.[0]?.main ?? 'Unknown',
    description: data.weather?.[0]?.description ?? '',
    humidity: data.main.humidity,
    windSpeed: Math.round(data.wind?.speed ?? 0),
    icon: data.weather?.[0]?.icon,
    units,
  };
}

export function iconUrl(icon) {
  return `https://openweathermap.org/img/wn/${icon}@2x.png`;
}
