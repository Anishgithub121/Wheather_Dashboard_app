import { WeatherData } from '../types';
import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  Droplets,
  Moon,
  Sun,
  Thermometer,
  Wind,
} from 'lucide-react';

interface WeatherCardProps {
  data: WeatherData;
  unit: 'C' | 'F';
  onToggleUnit: () => void;
}

const getWeatherIcon = (code: number, isDay: boolean) => {
  if (code === 0) return isDay ? <Sun className="w-24 h-24 text-yellow-400" /> : <Moon className="w-24 h-24 text-blue-200" />;
  if ([1, 2, 3].includes(code)) return <Cloud className="w-24 h-24 text-gray-400" />;
  if ([45, 48].includes(code)) return <CloudFog className="w-24 h-24 text-gray-400" />;
  if ([51, 53, 55, 56, 57].includes(code)) return <CloudDrizzle className="w-24 h-24 text-blue-400" />;
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return <CloudRain className="w-24 h-24 text-blue-500" />;
  if ([71, 73, 75, 77, 85, 86].includes(code)) return <CloudSnow className="w-24 h-24 text-blue-200" />;
  if ([95, 96, 99].includes(code)) return <CloudLightning className="w-24 h-24 text-purple-500" />;
  return <Cloud className="w-24 h-24 text-gray-400" />;
};

const getWeatherDescription = (code: number) => {
  if (code === 0) return 'Clear sky';
  if ([1, 2, 3].includes(code)) return 'Partly cloudy';
  if ([45, 48].includes(code)) return 'Foggy';
  if ([51, 53, 55, 56, 57].includes(code)) return 'Drizzle';
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return 'Rainy';
  if ([71, 73, 75, 77, 85, 86].includes(code)) return 'Snowy';
  if ([95, 96, 99].includes(code)) return 'Thunderstorm';
  return 'Unknown';
};

export default function WeatherCard({ data, unit, onToggleUnit }: WeatherCardProps) {
  const { current, daily, location } = data;

  return (
    <div className="w-full max-w-md mx-auto mt-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20 dark:border-gray-700/50">
      <div className="p-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
              {location.name}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 font-medium">
              {[location.admin1, location.country].filter(Boolean).join(', ')}
            </p>
          </div>
          <button
            onClick={onToggleUnit}
            className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full text-sm font-bold text-gray-700 dark:text-gray-200 transition-colors shadow-inner"
            title="Toggle Temperature Unit"
          >
            °{unit === 'C' ? 'F' : 'C'}
          </button>
        </div>

        <div className="flex items-center justify-between mb-8">
          <div className="flex flex-col">
            <div className="flex items-start">
              <span className="text-7xl font-black text-gray-900 dark:text-white tracking-tighter">
                {Math.round(current.temperature)}
              </span>
              <span className="text-3xl font-bold text-gray-400 dark:text-gray-500 mt-2 ml-1">
                °{unit}
              </span>
            </div>
            <p className="text-xl font-medium text-gray-600 dark:text-gray-300 mt-2 capitalize">
              {getWeatherDescription(current.weatherCode)}
            </p>
          </div>
          <div className="drop-shadow-2xl animate-pulse-slow">
            {getWeatherIcon(current.weatherCode, current.isDay)}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50/50 dark:bg-blue-900/20 rounded-2xl p-4 flex items-center gap-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-800/50 rounded-xl text-blue-600 dark:text-blue-400">
              <Droplets className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Humidity</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{current.humidity}%</p>
            </div>
          </div>
          <div className="bg-teal-50/50 dark:bg-teal-900/20 rounded-2xl p-4 flex items-center gap-4">
            <div className="p-3 bg-teal-100 dark:bg-teal-800/50 rounded-xl text-teal-600 dark:text-teal-400">
              <Wind className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Wind</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {current.windSpeed} <span className="text-sm font-medium">{unit === 'C' ? 'km/h' : 'mph'}</span>
              </p>
            </div>
          </div>
          <div className="col-span-2 bg-orange-50/50 dark:bg-orange-900/20 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 dark:bg-orange-800/50 rounded-xl text-orange-600 dark:text-orange-400">
                <Thermometer className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">High / Low</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {Math.round(daily.maxTemp)}° / {Math.round(daily.minTemp)}°
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
