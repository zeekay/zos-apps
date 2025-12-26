import React, { useState, useEffect } from 'react';

interface WeatherProps {
  onClose: () => void;
}

interface WeatherData {
  location: string;
  temp: number;
  condition: string;
  icon: string;
  humidity: number;
  wind: number;
  forecast: { day: string; high: number; low: number; icon: string }[];
}

// Mock weather data - in real app, fetch from weather API
const mockWeather: WeatherData = {
  location: 'San Francisco',
  temp: 18,
  condition: 'Partly Cloudy',
  icon: '⛅',
  humidity: 65,
  wind: 12,
  forecast: [
    { day: 'Mon', high: 19, low: 12, icon: '🌤️' },
    { day: 'Tue', high: 21, low: 13, icon: '☀️' },
    { day: 'Wed', high: 20, low: 14, icon: '🌥️' },
    { day: 'Thu', high: 17, low: 11, icon: '🌧️' },
    { day: 'Fri', high: 16, low: 10, icon: '🌧️' },
    { day: 'Sat', high: 18, low: 11, icon: '⛅' },
    { day: 'Sun', high: 20, low: 12, icon: '☀️' },
  ],
};

const Weather: React.FC<WeatherProps> = ({ onClose }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch
    const timer = setTimeout(() => {
      setWeather(mockWeather);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-700">
        <div className="text-white text-lg animate-pulse">Loading weather...</div>
      </div>
    );
  }

  if (!weather) return null;

  return (
    <div className="h-full bg-gradient-to-br from-blue-500 to-blue-700 text-white overflow-hidden">
      {/* Current Weather */}
      <div className="p-6 text-center">
        <div className="text-sm opacity-80">{weather.location}</div>
        <div className="text-8xl my-4">{weather.icon}</div>
        <div className="text-6xl font-light">{weather.temp}°</div>
        <div className="text-lg opacity-80 mt-2">{weather.condition}</div>

        <div className="flex justify-center gap-8 mt-6 text-sm">
          <div>
            <div className="opacity-60">Humidity</div>
            <div className="font-medium">{weather.humidity}%</div>
          </div>
          <div>
            <div className="opacity-60">Wind</div>
            <div className="font-medium">{weather.wind} km/h</div>
          </div>
        </div>
      </div>

      {/* Forecast */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/20 backdrop-blur-sm">
        <div className="flex justify-around py-4 px-2">
          {weather.forecast.slice(0, 7).map(day => (
            <div key={day.day} className="text-center">
              <div className="text-xs opacity-70">{day.day}</div>
              <div className="text-2xl my-2">{day.icon}</div>
              <div className="text-xs">
                <span className="opacity-90">{day.high}°</span>
                <span className="opacity-50 ml-1">{day.low}°</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Weather;
