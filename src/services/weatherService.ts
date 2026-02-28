import { Location, WeatherData } from '../types';

export const searchLocations = async (query: string): Promise<Location[]> => {
  const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`);
  if (!response.ok) throw new Error('Failed to fetch locations');
  const data = await response.json();
  return data.results || [];
};

export const getWeatherData = async (location: Location, unit: 'C' | 'F'): Promise<WeatherData> => {
  const tempUnit = unit === 'F' ? '&temperature_unit=fahrenheit' : '';
  const windUnit = unit === 'F' ? '&wind_speed_unit=mph' : '';
  
  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,is_day,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min&timezone=auto${tempUnit}${windUnit}`
  );
  
  if (!response.ok) throw new Error('Failed to fetch weather data');
  const data = await response.json();
  
  return {
    current: {
      temperature: data.current.temperature_2m,
      weatherCode: data.current.weather_code,
      humidity: data.current.relative_humidity_2m,
      windSpeed: data.current.wind_speed_10m,
      isDay: data.current.is_day === 1,
    },
    daily: {
      maxTemp: data.daily.temperature_2m_max[0],
      minTemp: data.daily.temperature_2m_min[0],
    },
    location,
  };
};

export const getLocationByCoords = async (lat: number, lon: number): Promise<Location> => {
  const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
  if (!response.ok) throw new Error('Failed to reverse geocode');
  const data = await response.json();
  
  return {
    id: Date.now(),
    name: data.city || data.locality || 'Current Location',
    latitude: lat,
    longitude: lon,
    country: data.countryName,
    admin1: data.principalSubdivision,
  };
};
