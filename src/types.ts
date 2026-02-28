export interface Location {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
}

export interface WeatherData {
  current: {
    temperature: number;
    weatherCode: number;
    humidity: number;
    windSpeed: number;
    isDay: boolean;
  };
  daily: {
    maxTemp: number;
    minTemp: number;
  };
  location: Location;
}
