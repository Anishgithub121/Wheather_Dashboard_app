import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import Loader from './components/Loader';
import ErrorMessage from './components/ErrorMessage';
import RecentSearches from './components/RecentSearches';
import { Location, WeatherData } from './types';
import { getWeatherData, getLocationByCoords } from './services/weatherService';

export default function App() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unit, setUnit] = useState<'C' | 'F'>('C');
  const [recentSearches, setRecentSearches] = useState<Location[]>([]);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedSearches = localStorage.getItem('recentSearches');
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(isDark);
    if (isDark) document.documentElement.classList.add('dark');
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleLocationSelect = async (location: Location) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getWeatherData(location, unit);
      setWeatherData(data);
      
      const updatedSearches = [
        location,
        ...recentSearches.filter((s) => s.id !== location.id),
      ].slice(0, 5);
      
      setRecentSearches(updatedSearches);
      localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
    } catch (err) {
      setError('Failed to fetch weather data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLocationDetect = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const location = await getLocationByCoords(latitude, longitude);
          await handleLocationSelect(location);
        } catch (err) {
          setError('Failed to detect location or fetch weather data.');
          setLoading(false);
        }
      },
      (err) => {
        setError('Location access denied. Please search manually.');
        setLoading(false);
      }
    );
  };

  const handleToggleUnit = async () => {
    const newUnit = unit === 'C' ? 'F' : 'C';
    setUnit(newUnit);
    if (weatherData) {
      setLoading(true);
      try {
        const data = await getWeatherData(weatherData.location, newUnit);
        setWeatherData(data);
      } catch (err) {
        setError('Failed to update temperature unit.');
      } finally {
        setLoading(false);
      }
    }
  };

  const getBackgroundClass = () => {
    if (!weatherData) return 'bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800';
    
    const code = weatherData.current.weatherCode;
    const isDay = weatherData.current.isDay;

    if (!isDay) return 'bg-gradient-to-br from-gray-900 via-indigo-900 to-black';
    if (code === 0) return 'bg-gradient-to-br from-blue-400 via-blue-200 to-yellow-100';
    if ([1, 2, 3].includes(code)) return 'bg-gradient-to-br from-gray-300 via-gray-200 to-blue-100';
    if ([45, 48].includes(code)) return 'bg-gradient-to-br from-gray-400 via-gray-300 to-gray-200';
    if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return 'bg-gradient-to-br from-blue-800 via-blue-600 to-gray-400';
    if ([71, 73, 75, 77, 85, 86].includes(code)) return 'bg-gradient-to-br from-blue-100 via-white to-gray-100';
    if ([95, 96, 99].includes(code)) return 'bg-gradient-to-br from-gray-900 via-purple-900 to-gray-800';
    
    return 'bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800';
  };

  return (
    <div className={`min-h-screen transition-colors duration-1000 ${getBackgroundClass()}`}>
      <div className="container mx-auto px-4 py-8 md:py-16 min-h-screen flex flex-col">
        <header className="flex justify-between items-center mb-12 max-w-4xl mx-auto w-full">
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-gray-900 dark:text-white drop-shadow-sm">
            SkyCast
          </h1>
          <button
            onClick={toggleDarkMode}
            className="p-3 bg-white/30 dark:bg-black/30 backdrop-blur-md rounded-full text-gray-800 dark:text-white hover:bg-white/50 dark:hover:bg-black/50 transition-colors shadow-sm"
            aria-label="Toggle Dark Mode"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </header>

        <main className="flex-1 flex flex-col items-center w-full max-w-4xl mx-auto">
          <SearchBar
            onLocationSelect={handleLocationSelect}
            onLocationDetect={handleLocationDetect}
          />

          <div className="w-full mt-8 flex flex-col items-center">
            {loading && <Loader />}
            {error && !loading && <ErrorMessage message={error} />}
            {weatherData && !loading && !error && (
              <WeatherCard
                data={weatherData}
                unit={unit}
                onToggleUnit={handleToggleUnit}
              />
            )}
          </div>

          {!weatherData && !loading && !error && (
            <RecentSearches
              searches={recentSearches}
              onSelect={handleLocationSelect}
              onClear={() => {
                setRecentSearches([]);
                localStorage.removeItem('recentSearches');
              }}
            />
          )}
        </main>
      </div>
    </div>
  );
}
