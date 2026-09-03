import { useEffect, useState, useCallback } from 'react';
import { fetchWeather, WEATHER_STATUS } from '../services/weatherService';

export function useWeather(coordinates) {
  const [status, setStatus] = useState(WEATHER_STATUS.LOADING);
  const [weather, setWeather] = useState(null);

  const load = useCallback(async () => {
    if (!coordinates) return;
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

  const retry = useCallback(() => {
    setStatus(WEATHER_STATUS.LOADING);
    return load();
  }, [load]);

  return { status, weather, retry };
}
