"use client";
import React, { useEffect, useState } from "react";

type CurrentWeather = {
  temperature: number;
  windspeed: number;
  winddirection: number;
  weathercode: number;
};

type City = {
  name: string;
  lat: number;
  lon: number;
};

// Liste de villes initiale
const ALL_CITIES: City[] = [
  { name: "Paris", lat: 48.8566, lon: 2.3522 },
  { name: "New York", lat: 40.7128, lon: -74.006 },
  { name: "Tokyo", lat: 35.6895, lon: 139.6917 },
  { name: "Sydney", lat: -33.8688, lon: 151.2093 },
  { name: "Rio de Janeiro", lat: -22.9068, lon: -43.1729 },
  { name: "London", lat: 51.5074, lon: -0.1278 },
  { name: "Berlin", lat: 52.52, lon: 13.405 },
];

const getTempStyle = (temp: number) => {
  if (temp < 0) return { color: "bg-blue-800", text: "text-white", emoji: "❄️" };
  if (temp <= 10) return { color: "bg-blue-600", text: "text-white", emoji: "🥶" };
  if (temp <= 20) return { color: "bg-green-600", text: "text-white", emoji: "🌿" };
  if (temp <= 30) return { color: "bg-yellow-500", text: "text-gray-900", emoji: "🌞" };
  return { color: "bg-orange-600", text: "text-white", emoji: "🔥" };
};

const WeatherInteractive = () => {
  const [weatherData, setWeatherData] = useState<Record<string, CurrentWeather | null>>({});
  const [search, setSearch] = useState("");
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  const filteredCities = ALL_CITIES.filter(city =>
    city.name.toLowerCase().includes(search.toLowerCase())
  );

  const fetchWeather = async (cities: City[]) => {
    const newData: Record<string, CurrentWeather | null> = {};
    for (const city of cities) {
      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current_weather=true&timezone=auto`
        );
        const data = await res.json();
        newData[city.name] = data.current_weather || null;
      } catch {
        newData[city.name] = null;
      }
    }
    setWeatherData(newData);
  };

  useEffect(() => {
    fetchWeather(filteredCities);
  }, [search]);

  return (
    <div className="min-h-screen bg-gray-900 p-6 flex flex-col items-center space-y-6 text-white">
      <h1 className="text-4xl font-bold text-cyan-400">Météo Interactive</h1>

      {/* Search / autocomplete */}
      <input
        type="text"
        placeholder="Rechercher une ville..."
        className="p-3 rounded-lg w-full max-w-md text-gray-900"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
        {filteredCities.map(city => {
          const weather = weatherData[city.name];
          const temp = weather?.temperature ?? 0;
          const style = getTempStyle(temp);

          return (
            <div
              key={city.name}
              onClick={() => setSelectedCity(selectedCity === city.name ? null : city.name)}
              className={`rounded-xl p-6 shadow-lg flex flex-col items-center justify-center space-y-2 transition-transform hover:scale-105 cursor-pointer ${style.color} ${style.text}`}
            >
              <div className="text-3xl">{style.emoji}</div>
              <div className="text-xl font-semibold">{city.name}</div>
              {weather ? (
                <>
                  <div className="text-2xl font-bold">{weather.temperature}°C</div>
                  <div className="text-sm">Vent: {weather.windspeed} km/h</div>

                  {/* Détails supplémentaires si la carte est sélectionnée */}
                  {selectedCity === city.name && (
                    <div className="mt-2 p-2 w-full bg-gray-800 rounded-lg text-sm flex flex-col items-start space-y-1">
                      <div>Direction du vent: {weather.winddirection}°</div>
                      <div>Weather code: {weather.weathercode}</div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-sm text-red-400">Données indisponibles</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeatherInteractive;
