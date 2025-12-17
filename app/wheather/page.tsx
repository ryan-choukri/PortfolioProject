"use client";
import React, { useEffect, useState, useMemo } from "react";
import DomeGallery from "@/app/components/DomeGallery";


type City = {
   name: string, lat: number, lon: number, src: string;
};

type CurrentWeather = {
  temperature: number;
  windspeed: number;
  winddirection: number;
  weathercode: number;
} & City;

const ALL_CITIES: City[] = [
  {name: "Paris", lat: 48.8566, lon: 2.3522, src: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80"},
  {name: "London", lat: 51.5074, lon: -0.1278, src: "https://images.unsplash.com/photo-1529655683826-aba9b3e77383?auto=format&fit=crop&w=800&q=80"},
  {name: "Madrid", lat: 40.4168, lon: -3.7038, src: "https://images.unsplash.com/photo-1574556462575-eb106a5865a0?auto=format&fit=crop&w=800&q=80"},
  {name: "Moscow", lat: 55.7558, lon: 37.6173, src: "https://images.unsplash.com/photo-1513326738677-b964603b136d?auto=format&fit=crop&w=800&q=80"},
  {name: "Istanbul", lat: 41.0082, lon: 28.9784, src: "https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=800&q=80"},

  // Amérique du Nord
  {name: "New York", lat: 40.7128, lon: -74.006, src: "https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?auto=format&fit=crop&w=800&q=80"},
  {name: "Los Angeles", lat: 34.0522, lon: -118.2437, src: "https://images.unsplash.com/photo-1545108629-89e675f81d96?auto=format&fit=crop&w=800&q=80"},
  {name: "Chicago", lat: 41.8781, lon: -87.6298, src: "https://images.unsplash.com/photo-1597933534024-debb6104af15?auto=format&fit=crop&w=800&q=80"},
  {name: "Toronto", lat: 43.65107, lon: -79.347015, src: "https://images.unsplash.com/photo-1517935706615-2717063c2225?auto=format&fit=crop&w=800&q=80"},

  // Amérique du Sud
  {name: "Rio de Janeiro", lat: -22.9068, lon: -43.1729, src: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=800&q=80"},
  {name: "Buenos Aires", lat: -34.6037, lon: -58.3816, src: "https://images.unsplash.com/photo-1612294037637-ec328d0e075e?auto=format&fit=crop&w=800&q=80"},

  // Asie
  {name: "Tokyo", lat: 35.6895, lon: 139.6917, src: "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?auto=format&fit=crop&w=800&q=80"},
  {name: "Beijing", lat: 39.9042, lon: 116.4074, src: "https://images.unsplash.com/photo-1713173642147-30cbbdb176d5?auto=format&fit=crop&w=800&q=80"},
  {name: "Seoul", lat: 37.5665, lon: 126.978, src: "https://images.unsplash.com/photo-1595185515922-9b79af1ef52d?auto=format&fit=crop&w=800&q=80"},
  {name: "Delhi", lat: 28.6139, lon: 77.209, src: "https://images.unsplash.com/photo-1624858020896-4a558c5d7042?auto=format&fit=crop&w=800&q=80"},
  {name: "Singapore", lat: 1.3521, lon: 103.8198, src: "https://images.unsplash.com/photo-1508964942454-1a56651d54ac?auto=format&fit=crop&w=800&q=80"},

  // Océanie
  {name: "Sydney", lat: -33.8688, lon: 151.2093, src: "https://images.unsplash.com/photo-1590716209211-ea74d5f63573?auto=format&fit=crop&w=800&q=80"},
//   {name: "Melbourne", lat: -37.8136, lon: 144.9631, src: "https://images.unsplash.com/photo-1546868762-b61266729c8a?auto=format&fit=crop&w=800&q=80"},
//   {name: "Auckland", lat: -36.8485, lon: 174.7633, src: "https://images.unsplash.com/photo-1595125990323-885cec5217ff?auto=format&fit=crop&w=800&q=80"},

  // Afrique
  {name: "Cairo", lat: 30.0444, lon: 31.2357, src: "https://images.unsplash.com/photo-1553913861-c0fddf2619ee?auto=format&fit=crop&w=800&q=80"},
  {name: "Cape Town", lat: -33.9249, lon: 18.4241, src: "https://images.unsplash.com/photo-1576485375217-d6a95e34d043?auto=format&fit=crop&w=800&q=80"},

  // Moyen-Orient
//   {name: "Dubai", lat: 25.2048, lon: 55.2708, src: "https://images.unsplash.com/photo-photo-1559717201-fbb671ff56b7?auto=format&fit=crop&w=800&q=80"},

  // Autres villes notables
  {name: "Honolulu", lat: 21.3069, lon: -157.8583, src: "https://images.unsplash.com/photo-1573993228224-5ffd3f00511c?auto=format&fit=crop&w=800&q=80"}
];



const WheatherPage = () => {
  const [weatherData, setWeatherData] = useState<CurrentWeather[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  const filteredCities = useMemo(() => {
    return ALL_CITIES.filter(city =>
      city.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

   useEffect(() => {
   if (!filteredCities.length) return;

   const fetchWeather = async () => {
      const newData: CurrentWeather[] = [];

      await Promise.all(
         filteredCities.map(async (city) => {
         try {
            const res = await fetch(
               `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current_weather=true&timezone=auto`
            );
            const data = await res.json();
            if (data?.current_weather) {
               newData.push({ ...data.current_weather, ...city });
               //newData[city.name] = ;
            }
         } catch {

         }
         })
      );

      setWeatherData(newData);
   };

   fetchWeather();
   }, [filteredCities]);
   console.log('weatherData', weatherData);
  
  return (
    <div className="h-[80svh] max-w-[800px] max-h-[800px]">
      <DomeGallery allCities={weatherData} />
    </div>
  );
};

export default WheatherPage;
