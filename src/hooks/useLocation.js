import { useCallback, useState } from 'react';
import { getCurrentPosition, reverseGeocode } from '../services/locationService';

export const LOCATION_STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  DENIED: 'denied',
  UNSUPPORTED: 'unsupported',
};

export function useLocation() {
  const [status, setStatus] = useState(LOCATION_STATUS.IDLE);
  const [place, setPlace] = useState(null);
  const [coords, setCoords] = useState(null);

  const detect = useCallback(async () => {
    setStatus(LOCATION_STATUS.LOADING);
    try {
      const position = await getCurrentPosition();
      setCoords(position);
      const name = await reverseGeocode(position);
      setPlace(name ?? 'your location');
      setStatus(LOCATION_STATUS.SUCCESS);
    } catch (err) {
      if (err.message === 'unsupported') {
        setStatus(LOCATION_STATUS.UNSUPPORTED);
      } else {
        setStatus(LOCATION_STATUS.DENIED);
      }
    }
  }, []);

  const setManual = useCallback((name, position) => {
    setPlace(name);
    if (position) setCoords(position);
    setStatus(LOCATION_STATUS.SUCCESS);
  }, []);

  const reset = useCallback(() => {
    setStatus(LOCATION_STATUS.IDLE);
    setPlace(null);
    setCoords(null);
  }, []);

  return { status, place, coords, detect, setManual, reset };
}
