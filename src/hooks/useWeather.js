import { useEffect, useState, useCallback } from 'react';
import { fetchWeather, WEATHER_STATUS } from '../services/weatherService';

export function useWeather(coordinates) {
  const [status, setStatus] = useState(WEATHER_STATUS.LOADING);
  const [weather, setWeather] = useState(null);

  const load = useCallback(async () => {
    if (!coordinates) return;
    setStatus(WEATHER_STATUS.LOADING);
    try {
      const data = await fetchWeather(coordinates);
      setWeather(data);
      setStatus(WEATHER_STATUS.SUCCESS);
    } catch (err) {
      setStatus(err.code ?? WEATHER_STATUS.ERROR);
    }
  }, [coordinates?.lat, coordinates?.lng]);

  useEffect(() => {
    load();
  }, [load]);

  return { status, weather, retry: load };
}
