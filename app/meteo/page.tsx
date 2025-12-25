'use client';
import React, { useEffect, useState, useMemo } from 'react';
import DomeGallery from '@/components/DomeGallery';
import AllCities from './allCities';

type City = {
  name: string;
  lat: number;
  lon: number;
  src: string;
};

type CurrentWeather = {
  time: number;
  temperature: number;
  windspeed: number;
  winddirection: number;
  weathercode: number;
} & City;

const ALL_CITIES: City[] = AllCities;

const WheatherPage = () => {
  const [weatherData, setWeatherData] = useState<CurrentWeather[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  const filteredCities = useMemo(() => {
    return ALL_CITIES.filter((city) => city.name.toLowerCase().includes(search.toLowerCase()));
  }, [search]);

  useEffect(() => {
    if (!filteredCities.length) return;

    const fetchWeather = async () => {
      const newData: CurrentWeather[] = [];

      await Promise.all(
        filteredCities.map(async (city) => {
          try {
            const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current_weather=true&timezone=auto`);
            const data = await res.json();
            if (data?.current_weather) {
              newData.push({ ...data.current_weather, time: Date.now(), ...city });
              //newData[city.name] = ;
            }
          } catch {}
        })
      );

      setWeatherData(newData);
    };

    fetchWeather();
  }, [filteredCities]);
  console.log('weatherData', weatherData);

  return (
    <>
      <div className="relative flex flex-col items-center">
        {/* Headline */}
        <div className="pointer-events-none mx-4 text-center">
          <h1 className="mt-6 text-2xl font-bold text-white drop-shadow-md sm:mt-6 sm:text-4xl">Météo du monde</h1>
          <p className="mt-1 text-sm text-white opacity-80 drop-shadow-sm">Explorez la météo de différentes villes en balayant la sphère</p>
          <p className="mt-1 text-xs text-white opacity-60 drop-shadow-sm">Swipe à fond pour découvrir !</p>
        </div>

        {/* DomeGallery */}
        <div className="flex h-[80svh] max-h-[600px] w-full max-w-[600px] items-center justify-center">
          <DomeGallery allCities={weatherData} />
        </div>
      </div>
    </>
  );
};

export default WheatherPage;
