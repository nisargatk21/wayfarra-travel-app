import { Droplets, Wind, ThermometerSun } from 'lucide-react';
import { WEATHER_STATUS, iconUrl } from '../services/weatherService';
import { WeatherSkeleton } from './LoadingState';
import ErrorState from './ErrorState';

export default function WeatherCard({ status, weather, onRetry, destinationName }) {
  if (status === WEATHER_STATUS.LOADING) {
    return (
      <div className="border border-line p-6 md:p-8 bg-ivory">
        <WeatherSkeleton />
      </div>
    );
  }

  if (status === WEATHER_STATUS.NO_KEY) {
    return (
      <div className="border border-line p-6 md:p-8 bg-ivory">
        <p className="font-display text-lg text-charcoal mb-1">Live weather isn't connected yet.</p>
        <p className="text-stone text-sm leading-relaxed max-w-md">
          Add a free OpenWeather API key as <code className="text-terracotta">VITE_OPENWEATHER_API_KEY</code> in your
          <code className="text-terracotta"> .env</code> file to see current conditions for {destinationName}.
        </p>
      </div>
    );
  }

  if (status === WEATHER_STATUS.ERROR) {
    return (
      <div className="border border-line p-6 md:p-8 bg-ivory">
        <ErrorState
          title="Weather is taking a detour."
          description="We couldn't reach the forecast just now."
          onAction={onRetry}
        />
      </div>
    );
  }

  if (!weather) return null;

  return (
    <div className="border border-line p-6 md:p-8 bg-ivory flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-10">
      <div className="flex items-center gap-4">
        <img src={iconUrl(weather.icon)} alt={weather.description} className="w-16 h-16" />
        <div>
          <p className="font-display text-4xl text-charcoal leading-none">{weather.temp}°</p>
          <p className="text-stone text-sm mt-1 capitalize">{weather.description || weather.condition}</p>
        </div>
      </div>

      <div className="hidden sm:block w-px h-12 bg-line" />

      <div className="grid grid-cols-3 gap-6 text-sm">
        <div className="flex flex-col gap-1">
          <span className="flex items-center gap-1.5 text-stone"><ThermometerSun size={14} strokeWidth={1.75} /> Feels like</span>
          <span className="text-charcoal font-medium">{weather.feelsLike}°</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="flex items-center gap-1.5 text-stone"><Droplets size={14} strokeWidth={1.75} /> Humidity</span>
          <span className="text-charcoal font-medium">{weather.humidity}%</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="flex items-center gap-1.5 text-stone"><Wind size={14} strokeWidth={1.75} /> Wind</span>
          <span className="text-charcoal font-medium">{weather.windSpeed} m/s</span>
        </div>
      </div>
    </div>
  );
}
