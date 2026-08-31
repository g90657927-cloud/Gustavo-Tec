import React, { useState, useEffect, useRef } from 'react';
import { useNotifications } from '../context/NotificationContext';
import { 
  CloudSun, 
  CloudRain, 
  Sun, 
  Wind, 
  Droplets, 
  Thermometer, 
  Compass, 
  RefreshCw, 
  Activity, 
  MapPin, 
  Calendar,
  Search,
  Sunrise,
  Sunset,
  Gauge,
  Eye,
  Navigation,
  Sparkles,
  Bot,
  CloudLightning,
  CloudSnow,
  CloudFog,
  Check,
  Timer,
  Play,
  Pause,
  Filter,
  Layers,
  CheckCircle2,
  Clock,
  Radio,
  Zap,
  Globe
} from 'lucide-react';
import { 
  PORTUGAL_CONCELHOS, 
  WeatherLocation, 
  CityLiveSummary, 
  chunkLocations, 
  OPEN_METEO_CHUNK_LIMIT 
} from '../data/portugalConcelhos';

export type { WeatherLocation, CityLiveSummary };
export const ALL_PORTUGUESE_CITIES = PORTUGAL_CONCELHOS;

export interface CurrentWeather {
  temperature: number;
  apparentTemperature: number;
  relativeHumidity: number;
  weatherCode: number;
  windSpeed: number;
  windDirection: number;
  precipitation: number;
  surfacePressure: number;
  isDay: number;
  uvIndex: number;
  sunrise: string;
  sunset: string;
  tempMax: number;
  tempMin: number;
  precipitationProbMax: number;
}

export interface HourlyForecastItem {
  time: string;
  temperature: number;
  precipitationProbability: number;
  weatherCode: number;
  windSpeed: number;
}

export interface DailyForecastItem {
  date: string;
  dayName: string;
  weatherCode: number;
  tempMax: number;
  tempMin: number;
  precipitationProbMax: number;
  uvIndexMax: number;
  windSpeedMax: number;
}

export function getWeatherConditionInfo(code: number, isDay: number = 1): { label: string; icon: React.ReactNode; color: string } {
  switch (code) {
    case 0:
      return {
        label: isDay ? 'Céu Limpo / Ensolarado' : 'Noite Estrelada',
        icon: <Sun className="w-8 h-8 text-amber-400 animate-pulse" />,
        color: 'text-amber-400'
      };
    case 1:
      return {
        label: isDay ? 'Predominantemente Limpo' : 'Noite Pouco Nublada',
        icon: <Sun className="w-8 h-8 text-amber-300" />,
        color: 'text-amber-300'
      };
    case 2:
      return {
        label: 'Parcialmente Nublado',
        icon: <CloudSun className="w-8 h-8 text-cyan-300" />,
        color: 'text-cyan-300'
      };
    case 3:
      return {
        label: 'Nublado / Encoberto',
        icon: <CloudSun className="w-8 h-8 text-slate-300" />,
        color: 'text-slate-300'
      };
    case 45:
    case 48:
      return {
        label: 'Nevoeiro / Neblina',
        icon: <CloudFog className="w-8 h-8 text-indigo-300" />,
        color: 'text-indigo-300'
      };
    case 51:
    case 53:
    case 55:
      return {
        label: 'Chuvisco / Chuva Fraca',
        icon: <CloudRain className="w-8 h-8 text-blue-300" />,
        color: 'text-blue-300'
      };
    case 61:
    case 63:
    case 65:
      return {
        label: 'Chuva Contínua / Forte',
        icon: <CloudRain className="w-8 h-8 text-blue-400" />,
        color: 'text-blue-400'
      };
    case 71:
    case 73:
    case 75:
    case 77:
      return {
        label: 'Queda de Neve',
        icon: <CloudSnow className="w-8 h-8 text-teal-200" />,
        color: 'text-teal-200'
      };
    case 80:
    case 81:
    case 82:
      return {
        label: 'Aguaceiros / Pancadas de Chuva',
        icon: <CloudRain className="w-8 h-8 text-cyan-400" />,
        color: 'text-cyan-400'
      };
    case 95:
    case 96:
    case 99:
      return {
        label: 'Trovoada / Tempestade',
        icon: <CloudLightning className="w-8 h-8 text-yellow-400 animate-bounce" />,
        color: 'text-yellow-400'
      };
    default:
      return {
        label: 'Céu Variável',
        icon: <CloudSun className="w-8 h-8 text-cyan-300" />,
        color: 'text-cyan-300'
      };
  }
}

function getWindDirectionCardinal(degrees: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round((degrees % 360) / 22.5) % 16;
  return directions[index];
}

function getUvRiskLevel(uv: number): { label: string; color: string } {
  if (uv <= 2) return { label: 'Baixo', color: 'text-emerald-400' };
  if (uv <= 5) return { label: 'Moderado', color: 'text-yellow-400' };
  if (uv <= 7) return { label: 'Alto', color: 'text-amber-400' };
  if (uv <= 10) return { label: 'Muito Alto', color: 'text-orange-500' };
  return { label: 'Extremo', color: 'text-rose-500' };
}

function findClosestCity(lat: number, lon: number): WeatherLocation {
  let minDistance = Infinity;
  let closest = PORTUGAL_CONCELHOS[0];
  for (const city of PORTUGAL_CONCELHOS) {
    const dLat = (city.latitude - lat) * (Math.PI / 180);
    const dLon = (city.longitude - lon) * (Math.PI / 180);
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat * (Math.PI / 180)) * Math.cos(city.latitude * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = 6371 * c;
    if (d < minDistance) {
      minDistance = d;
      closest = city;
    }
  }
  return closest;
}

// 15 Minutes Auto-Refresh Interval in Seconds (15 * 60 = 900s)
const AUTO_REFRESH_INTERVAL_SEC = 15 * 60;

export const WeatherIpmaView: React.FC = () => {
  const { sendAlert } = useNotifications();
  const [selectedLocation, setSelectedLocation] = useState<WeatherLocation>(PORTUGAL_CONCELHOS[0]);
  const [currentWeather, setCurrentWeather] = useState<CurrentWeather | null>(null);
  const [hourlyForecast, setHourlyForecast] = useState<HourlyForecastItem[]>([]);
  const [dailyForecast, setDailyForecast] = useState<DailyForecastItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncingAllChunks, setIsSyncingAllChunks] = useState(false);
  
  // Real-time Weather Map for all concelhos (Loaded in multi-block chunks from Open-Meteo)
  const [citiesWeatherMap, setCitiesWeatherMap] = useState<Record<string, CityLiveSummary>>({});
  const [chunksLoadedCount, setChunksLoadedCount] = useState<number>(0);
  const [totalChunksCount, setTotalChunksCount] = useState<number>(0);

  // Search & Geocoding
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<WeatherLocation[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Real-Time Timestamps & Clock updated via JavaScript setInterval
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [liveClock, setLiveClock] = useState<string>('');
  const [nextSyncTime, setNextSyncTime] = useState<string>('');

  // AI & GPS States
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLocatingGps, setIsLocatingGps] = useState(false);
  const [gpsSuccessMessage, setGpsSuccessMessage] = useState<string | null>(null);

  // Regional Filter Tab
  const [selectedZone, setSelectedZone] = useState<'todas' | 'norte' | 'centro' | 'lisboa' | 'alentejo' | 'algarve' | 'ilhas' | 'global'>('todas');
  const [activeViewMode, setActiveViewMode] = useState<'destaque' | 'todos_concelhos'>('destaque');

  // Automatic Refresh Timer State (15 minutes)
  const [isAutoRefreshActive, setIsAutoRefreshActive] = useState(true);
  const [refreshCountdown, setRefreshCountdown] = useState(AUTO_REFRESH_INTERVAL_SEC);

  // Ref to hold current selectedLocation for intervals without stale closures
  const selectedLocationRef = useRef<WeatherLocation>(selectedLocation);
  useEffect(() => {
    selectedLocationRef.current = selectedLocation;
  }, [selectedLocation]);

  // Format seconds to mm:ss format
  const formatCountdown = (totalSec: number): string => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
  };

  // Helper parser for Open-Meteo or Server Weather payload
  const parseWeatherData = (data: any) => {
    if (!data || !data.current || !data.daily) return false;

    const cur = data.current;
    const daily = data.daily;
    const hourly = data.hourly;

    const sunriseFormatted = daily.sunrise && daily.sunrise[0]
      ? new Date(daily.sunrise[0]).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })
      : '06:30';

    const sunsetFormatted = daily.sunset && daily.sunset[0]
      ? new Date(daily.sunset[0]).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })
      : '20:15';

    setCurrentWeather({
      temperature: Math.round(cur.temperature_2m),
      apparentTemperature: Math.round(cur.apparent_temperature),
      relativeHumidity: Math.round(cur.relative_humidity_2m),
      weatherCode: cur.weather_code,
      windSpeed: Math.round(cur.wind_speed_10m),
      windDirection: Math.round(cur.wind_direction_10m || 0),
      precipitation: cur.precipitation || 0,
      surfacePressure: Math.round(cur.surface_pressure || 1015),
      isDay: cur.is_day !== undefined ? cur.is_day : 1,
      uvIndex: daily.uv_index_max && daily.uv_index_max[0] ? Math.round(daily.uv_index_max[0]) : 5,
      sunrise: sunriseFormatted,
      sunset: sunsetFormatted,
      tempMax: Math.round(daily.temperature_2m_max[0]),
      tempMin: Math.round(daily.temperature_2m_min[0]),
      precipitationProbMax: Math.round(daily.precipitation_probability_max?.[0] || 0)
    });

    // Parse Next 24 Hours
    if (hourly && Array.isArray(hourly.time)) {
      const next24: HourlyForecastItem[] = [];
      const length = Math.min(24, hourly.time.length);
      for (let i = 0; i < length; i++) {
        const timeObj = new Date(hourly.time[i]);
        next24.push({
          time: timeObj.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }),
          temperature: Math.round(hourly.temperature_2m[i]),
          precipitationProbability: Math.round(hourly.precipitation_probability?.[i] || 0),
          weatherCode: hourly.weather_code[i],
          windSpeed: Math.round(hourly.wind_speed_10m?.[i] || 10)
        });
      }
      setHourlyForecast(next24);
    }

    // Parse 7 Days
    if (daily && Array.isArray(daily.time)) {
      const days: DailyForecastItem[] = [];
      for (let i = 0; i < daily.time.length; i++) {
        const d = new Date(daily.time[i]);
        const dayName = i === 0 ? 'Hoje' : d.toLocaleDateString('pt-PT', { weekday: 'short' });
        days.push({
          date: d.toLocaleDateString('pt-PT', { day: 'numeric', month: 'short' }),
          dayName: (dayName || '').toUpperCase(),
          weatherCode: daily.weather_code[i],
          tempMax: Math.round(daily.temperature_2m_max[i]),
          tempMin: Math.round(daily.temperature_2m_min[i]),
          precipitationProbMax: Math.round(daily.precipitation_probability_max?.[i] || 0),
          uvIndexMax: Math.round(daily.uv_index_max?.[i] || 5),
          windSpeedMax: Math.round(daily.wind_speed_10m_max?.[i] || 15)
        });
      }
      setDailyForecast(days);
    }

    const nowStr = new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLastUpdated(nowStr);
    
    // Calculate next sync time (+15 mins)
    const nextDate = new Date(Date.now() + AUTO_REFRESH_INTERVAL_SEC * 1000);
    setNextSyncTime(nextDate.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    return true;
  };

  // 1. Fetch detailed single-location forecast (Current + 24h Hourly + 7-Day Daily)
  const fetchSingleLocationWeather = async (loc: WeatherLocation) => {
    setIsLoading(true);
    setLocationError(null);
    let parsedSuccessfully = false;

    // Attempt 1: Server proxy with in-memory caching
    try {
      const proxyUrl = `/api/weather?lat=${loc.latitude}&lon=${loc.longitude}&name=${encodeURIComponent(loc.name)}`;
      const res = await fetch(proxyUrl);
      if (res.ok) {
        const json = await res.json();
        if (json && json.data) {
          parsedSuccessfully = parseWeatherData(json.data);
        }
      }
    } catch (proxyErr) {
      console.warn('[Weather] Falha no proxy do servidor, tentando direto:', proxyErr);
    }

    // Attempt 2: Direct Open-Meteo API fallback
    if (!parsedSuccessfully) {
      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${loc.latitude}&longitude=${loc.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m,wind_direction_10m,surface_pressure&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_probability_max,wind_speed_10m_max&timezone=auto`;
        
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          parsedSuccessfully = parseWeatherData(data);
        }
      } catch (err: any) {
        console.warn('[Weather] Falha na chamada direta à Open-Meteo:', err);
      }
    }

    if (!parsedSuccessfully) {
      setLocationError('Sincronização temporariamente em segundo plano. Clique em Atualizar para forçar nova tentativa.');
    } else {
      setLocationError(null);
    }

    setIsLoading(false);
  };

  // 2. Multi-Block Batch Loader: Organizes all Portuguese concelhos
  const fetchAllPortugalWeatherChunks = async () => {
    setIsSyncingAllChunks(true);

    // Attempt 1: Server-side cached all concelhos
    try {
      const res = await fetch('/api/weather/all');
      if (res.ok) {
        const json = await res.json();
        if (json && json.cities && Object.keys(json.cities).length > 0) {
          setCitiesWeatherMap(json.cities);
          setTotalChunksCount(1);
          setChunksLoadedCount(1);
          const timestamp = new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
          setLastUpdated(timestamp);
          setIsSyncingAllChunks(false);
          return;
        }
      }
    } catch (err) {
      console.warn('[Weather] Fallback para chunks cliente:', err);
    }

    // Attempt 2: Client-side chunk loader
    const chunks = chunkLocations(PORTUGAL_CONCELHOS, OPEN_METEO_CHUNK_LIMIT);
    setTotalChunksCount(chunks.length);
    let loadedChunks = 0;

    const resultMap: Record<string, CityLiveSummary> = {};
    const timestamp = new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    try {
      for (let cIdx = 0; cIdx < chunks.length; cIdx++) {
        const chunk = chunks[cIdx];
        const lats = chunk.map(l => l.latitude).join(',');
        const lons = chunk.map(l => l.longitude).join(',');

        const batchUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lats}&longitude=${lons}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m,wind_direction_10m,surface_pressure&daily=temperature_2m_max,temperature_2m_min&timezone=auto`;

        try {
          const res = await fetch(batchUrl);
          if (res.ok) {
            const rawData = await res.json();
            const itemsArray = Array.isArray(rawData) ? rawData : [rawData];

            itemsArray.forEach((item, itemIdx) => {
              const targetCity = chunk[itemIdx];
              if (targetCity && item && item.current) {
                resultMap[targetCity.name] = {
                  name: targetCity.name,
                  temperature: Math.round(item.current.temperature_2m),
                  apparentTemperature: Math.round(item.current.apparent_temperature),
                  relativeHumidity: Math.round(item.current.relative_humidity_2m),
                  weatherCode: item.current.weather_code,
                  windSpeed: Math.round(item.current.wind_speed_10m),
                  precipitation: item.current.precipitation || 0,
                  isDay: item.current.is_day,
                  tempMax: item.daily?.temperature_2m_max?.[0] ? Math.round(item.daily.temperature_2m_max[0]) : undefined,
                  tempMin: item.daily?.temperature_2m_min?.[0] ? Math.round(item.daily.temperature_2m_min[0]) : undefined,
                  lastUpdated: timestamp
                };
              }
            });
          }
        } catch (chunkErr) {
          console.warn(`Erro no bloco ${cIdx + 1} da Open-Meteo:`, chunkErr);
        }

        loadedChunks += 1;
        setChunksLoadedCount(loadedChunks);
      }

      setCitiesWeatherMap(prev => ({ ...prev, ...resultMap }));
      setLastUpdated(timestamp);
      
      const nextDate = new Date(Date.now() + AUTO_REFRESH_INTERVAL_SEC * 1000);
      setNextSyncTime(nextDate.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    } catch (e) {
      console.error('Falha geral no lote de concelhos Open-Meteo:', e);
    } finally {
      setIsSyncingAllChunks(false);
    }
  };

  // Full Refresh Handler (both detailed city + all national chunks)
  const handleFullRefresh = async () => {
    setRefreshCountdown(AUTO_REFRESH_INTERVAL_SEC);
    await Promise.all([
      fetchSingleLocationWeather(selectedLocationRef.current),
      fetchAllPortugalWeatherChunks()
    ]);
  };

  // Initial Load: Fetch selected location and all Portugal chunks
  useEffect(() => {
    fetchSingleLocationWeather(selectedLocation);
    fetchAllPortugalWeatherChunks();
  }, []);

  // When user clicks a new city, fetch its full detailed weather
  useEffect(() => {
    fetchSingleLocationWeather(selectedLocation);
  }, [selectedLocation]);

  // Real-Time Interval Clock & 15-Minute Countdown using JavaScript setInterval
  useEffect(() => {
    // Initial clock render
    setLiveClock(new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));

    const interval = setInterval(() => {
      // 1. Live Clock update every second
      const nowStr = new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setLiveClock(nowStr);

      // 2. Countdown logic for 15-minute auto-refresh
      if (isAutoRefreshActive) {
        setRefreshCountdown(prev => {
          if (prev <= 1) {
            // Trigger auto-refresh of single location + all chunks without reloading page
            fetchSingleLocationWeather(selectedLocationRef.current);
            fetchAllPortugalWeatherChunks();
            return AUTO_REFRESH_INTERVAL_SEC;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isAutoRefreshActive]);

  // Geocoding search from Server API proxy or Open-Meteo API
  const handleSearchLocations = async (query: string) => {
    setSearchQuery(query);
    if (!query.trim() || query.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const res = await fetch(`/api/weather/search?q=${encodeURIComponent(query)}`);
      if (res.ok) {
        const json = await res.json();
        if (json && json.results && Array.isArray(json.results) && json.results.length > 0) {
          const formatted: WeatherLocation[] = json.results.map((item: any) => ({
            name: item.name,
            country: item.country || '',
            region: item.admin1 || item.country || '',
            district: item.admin2 || item.admin1,
            zone: item.country_code === 'PT' ? 'lisboa' : 'global',
            latitude: item.latitude,
            longitude: item.longitude
          }));
          setSearchResults(formatted);
          setIsSearching(false);
          return;
        }
      }

      // Fallback direct
      const directRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=8&language=pt&format=json`);
      if (directRes.ok) {
        const json = await directRes.json();
        if (json && json.results && Array.isArray(json.results)) {
          const formatted: WeatherLocation[] = json.results.map((item: any) => ({
            name: item.name,
            country: item.country || '',
            region: item.admin1 || item.country || '',
            district: item.admin2 || item.admin1,
            zone: item.country_code === 'PT' ? 'lisboa' : 'global',
            latitude: item.latitude,
            longitude: item.longitude
          }));
          setSearchResults(formatted);
        } else {
          setSearchResults([]);
        }
      }
    } catch (e) {
      console.warn('Erro ao pesquisar localidade:', e);
    } finally {
      setIsSearching(false);
    }
  };

  // Browser GPS Geolocation with High Accuracy & Reverse Geocoding
  const handleGetLiveLocation = () => {
    setLocationError(null);
    setGpsSuccessMessage(null);

    if (!navigator.geolocation) {
      setLocationError('Geolocalização não é suportada pelo seu navegador.');
      return;
    }

    setIsLocatingGps(true);
    setIsLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = Number(pos.coords.latitude.toFixed(4));
        const lon = Number(pos.coords.longitude.toFixed(4));
        const accuracy = Math.round(pos.coords.accuracy || 20);

        // Find closest known city as baseline reference
        const closestCity = findClosestCity(lat, lon);

        let detectedName = closestCity.name;
        let detectedRegion = closestCity.region;
        let detectedCountry = closestCity.country;
        let detectedZone = closestCity.zone;
        let detectedDistrict = closestCity.district;

        try {
          const revRes = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=pt`
          );
          if (revRes.ok) {
            const revData = await revRes.json();
            if (revData) {
              const locName = revData.city || revData.locality || revData.principalSubdivision || revData.localityInfo?.administrative?.[2]?.name;
              if (locName) {
                detectedName = locName;
              }
              if (revData.principalSubdivision) {
                detectedRegion = revData.principalSubdivision;
              }
              if (revData.countryName) {
                detectedCountry = revData.countryName;
              }
            }
          }
        } catch (revErr) {
          console.warn('Reverse geocoding fallback to closest city:', revErr);
        }

        const userLoc: WeatherLocation = {
          name: `${detectedName} (GPS Ativo)`,
          country: detectedCountry,
          region: `${detectedRegion} • Precisão ±${accuracy}m`,
          district: detectedDistrict,
          zone: detectedZone,
          latitude: lat,
          longitude: lon
        };

        setSelectedLocation(userLoc);
        setIsLocatingGps(false);
        setGpsSuccessMessage(`📍 Sinal GPS captado: ${detectedName} (${lat}°, ${lon}° • Precisão ±${accuracy}m)`);
        setTimeout(() => setGpsSuccessMessage(null), 6000);
      },
      (err) => {
        console.warn('Erro ao obter GPS:', err);
        setIsLocatingGps(false);
        setIsLoading(false);
        if (err.code === 1) {
          setLocationError('Permissão de GPS negada. Por favor, autorize a localização no seu navegador ou escolha uma cidade da lista.');
        } else if (err.code === 2) {
          setLocationError('Sinal GPS não pôde ser determinado. Selecione uma cidade na lista abaixo.');
        } else {
          setLocationError('Tempo limite excedido ao captar GPS. Tente novamente.');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 30000
      }
    );
  };

  // AI Weather Analysis
  const handleGenerateAiForecast = async () => {
    if (!currentWeather) return;
    setIsGeneratingAi(true);
    try {
      const summaryText = `Localização: ${selectedLocation.name} (${selectedLocation.country}, ${selectedLocation.region}).
Temperatura Atual: ${currentWeather.temperature}°C (Sensação: ${currentWeather.apparentTemperature}°C).
Condição WMO: ${getWeatherConditionInfo(currentWeather.weatherCode).label}.
Máxima de Hoje: ${currentWeather.tempMax}°C, Mínima: ${currentWeather.tempMin}°C.
Chuva: ${currentWeather.precipitationProbMax}% de probabilidade (${currentWeather.precipitation}mm).
Vento: ${currentWeather.windSpeed} km/h direção ${getWindDirectionCardinal(currentWeather.windDirection)}.
Humidade: ${currentWeather.relativeHumidity}%, UV Máx: ${currentWeather.uvIndex}.
Previsão 3 dias: ${dailyForecast.slice(0, 3).map(d => `${d.dayName}: ${d.tempMin}°C-${d.tempMax}°C, ${getWeatherConditionInfo(d.weatherCode).label}`).join('; ')}.`;

      const response = await fetch('/api/ai/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: `Gere uma análise meteorológica executiva, descontraída e com recomendações práticas para quem está em ${selectedLocation.name} (Portugal):\n\n${summaryText}`,
          mode: 'executive'
        })
      });

      const data = await response.json();
      if (data && data.output) {
        setAiAnalysis(data.output);
      }
    } catch (e) {
      console.error('Erro na síntese IA de clima:', e);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // Filter cities by zone & search
  const filteredPresetCities = PORTUGAL_CONCELHOS.filter(city => {
    const matchesZone = selectedZone === 'todas' ? true : city.zone === selectedZone;
    if (searchQuery.trim().length > 0 && searchResults.length === 0) {
      const q = searchQuery.toLowerCase();
      const matchesText = city.name.toLowerCase().includes(q) || 
                          city.region.toLowerCase().includes(q) || 
                          (city.district && city.district.toLowerCase().includes(q));
      return matchesZone && matchesText;
    }
    return matchesZone;
  });

  const condInfo = currentWeather ? getWeatherConditionInfo(currentWeather.weatherCode, currentWeather.isDay) : null;
  const uvInfo = currentWeather ? getUvRiskLevel(currentWeather.uvIndex) : null;

  // Percentage progress of 15 min cycle (0 to 100%)
  const countdownProgressPct = Math.min(100, Math.max(0, ((AUTO_REFRESH_INTERVAL_SEC - refreshCountdown) / AUTO_REFRESH_INTERVAL_SEC) * 100));

  return (
    <div className="space-y-6">
      
      {/* Top Banner with Open-Meteo Multi-Block Status & 15-Minute Real-Time Ticker */}
      <div className="liquid-glass-card rounded-3xl p-5 sm:p-7 border border-teal-500/30 shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
        
        {/* Real-time Status Header Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-400 via-cyan-500 to-blue-600 p-[1.5px] shadow-[0_0_20px_rgba(20,184,166,0.4)] flex items-center justify-center shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-teal-300">
                <CloudSun className="w-7 h-7" />
              </div>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Meteorologia de Portugal & Concelhos
                </h1>
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/40 font-bold flex items-center gap-1">
                  <Globe className="w-3 h-3 text-teal-400" />
                  Open-Meteo API
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  Multi-Bloco ({PORTUGAL_CONCELHOS.length} Concelhos)
                </span>
              </div>
              
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 mt-1">
                <span>Previsões automáticas sincronizadas a cada <strong>15 minutos</strong>.</span>
                <span className="text-slate-500">•</span>
                <span className="text-teal-300 font-mono flex items-center gap-1 font-bold">
                  <Clock className="w-3.5 h-3.5 text-teal-400" />
                  Hora Local: {liveClock || '--:--:--'}
                </span>
              </div>
            </div>
          </div>

          {/* Real-time Ticker, 15m Countdown & Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            
            {/* 15m Countdown Pill */}
            <div className="px-3.5 py-2 rounded-2xl bg-slate-900/90 border border-teal-500/30 flex flex-col justify-center min-w-[150px] shadow-inner">
              <div className="flex items-center justify-between gap-2 text-[10px] font-mono text-slate-400">
                <span className="flex items-center gap-1">
                  <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                  Auto (15m):
                </span>
                <span className="font-bold text-teal-300">{formatCountdown(refreshCountdown)}</span>
              </div>
              {/* Progress bar */}
              <div className="w-full h-1.5 bg-slate-800 rounded-full mt-1.5 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-teal-500 to-cyan-400 transition-all duration-1000 ease-linear rounded-full"
                  style={{ width: `${countdownProgressPct}%` }}
                ></div>
              </div>
            </div>

            {/* Pause/Resume Auto Refresh Button */}
            <button
              onClick={() => setIsAutoRefreshActive(!isAutoRefreshActive)}
              className={`p-2.5 rounded-2xl border text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
                isAutoRefreshActive
                  ? 'bg-slate-900/80 text-emerald-300 hover:text-white border-emerald-500/40 hover:border-emerald-400'
                  : 'bg-amber-950/40 text-amber-300 border-amber-500/40'
              }`}
              title={isAutoRefreshActive ? 'Pausar ciclo de 15 minutos' : 'Retomar ciclo de 15 minutos'}
            >
              {isAutoRefreshActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>

            {/* GPS Button */}
            <button
              onClick={handleGetLiveLocation}
              disabled={isLocatingGps}
              title="Obter minha localização GPS exata"
              className={`px-3.5 py-2 rounded-2xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md ${
                isLocatingGps
                  ? 'bg-cyan-950/80 text-cyan-300 border-cyan-400 animate-pulse'
                  : 'bg-slate-900/80 hover:bg-slate-800 text-cyan-300 hover:text-cyan-200 border-cyan-400/40 hover:border-cyan-400'
              }`}
            >
              <Navigation className={`w-3.5 h-3.5 text-cyan-400 ${isLocatingGps ? 'animate-spin' : ''}`} />
              <span>{isLocatingGps ? 'Buscando GPS...' : 'Meu GPS'}</span>
            </button>

            {/* Manual Full Refresh Button */}
            <button
              onClick={handleFullRefresh}
              disabled={isLoading || isSyncingAllChunks}
              className="px-4 py-2 rounded-2xl bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-600 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-[0_0_20px_rgba(20,184,166,0.35)] disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${(isLoading || isSyncingAllChunks) ? 'animate-spin' : ''}`} />
              <span>{(isLoading || isSyncingAllChunks) ? 'Sincronizando...' : 'Atualizar Tudo'}</span>
            </button>
          </div>

        </div>

        {/* Multi-Block Loading Info Bar */}
        <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-slate-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-emerald-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{Object.keys(citiesWeatherMap).length} concelhos carregados via Open-Meteo</span>
            </span>
            <span>•</span>
            <span className="text-cyan-300">
              Dividido em {totalChunksCount || 3} blocos (máx {OPEN_METEO_CHUNK_LIMIT} cidades/URL)
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span>Última leitura: <strong className="text-white">{lastUpdated || '--:--:--'}</strong></span>
            {nextSyncTime && (
              <>
                <span>•</span>
                <span>Próxima atualização: <strong className="text-teal-300">{nextSyncTime}</strong></span>
              </>
            )}
          </div>
        </div>

        {/* Search Bar & Autocomplete */}
        <div className="mt-5 pt-4 border-t border-white/10 space-y-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-teal-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => handleSearchLocations(e.target.value)}
              placeholder="Pesquisar qualquer concelho ou cidade de Portugal (ex: Lisboa, Sintra, Cascais, Porto, Guimarães, Coimbra, Funchal, Faro, Évora, Viseu)..."
              className="w-full bg-slate-900/80 border border-white/15 focus:border-teal-400/60 rounded-2xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 backdrop-blur-xl shadow-inner"
            />
            {isSearching && (
              <RefreshCw className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-teal-400 animate-spin" />
            )}

            {/* Live Autocomplete Results from Geocoding */}
            {searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 z-30 bg-slate-950/95 border border-white/20 rounded-2xl p-2 shadow-2xl backdrop-blur-2xl space-y-1 max-h-64 overflow-y-auto">
                <div className="text-[10px] font-mono font-bold text-slate-400 px-3 py-1 uppercase">Resultados Geocoding</div>
                {searchResults.map((result, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedLocation(result);
                      setSearchResults([]);
                      setSearchQuery('');
                    }}
                    className="w-full text-left p-2.5 hover:bg-teal-950/40 rounded-xl flex items-center justify-between text-xs text-white hover:text-teal-300 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-teal-400" />
                      <span className="font-bold">{result.name}</span>
                      <span className="text-slate-400 font-mono">({result.region}, {result.country})</span>
                    </div>
                    <span className="text-[10px] text-teal-400 font-mono">Lat {result.latitude}°</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Regional Categorization Tabs & View Mode */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              <span className="text-[10px] font-mono uppercase text-slate-400 font-bold whitespace-nowrap mr-1 flex items-center gap-1">
                <Filter className="w-3 h-3 text-teal-400" /> Regiões:
              </span>
              
              {[
                { id: 'todas', label: 'Todos os Concelhos' },
                { id: 'lisboa', label: 'Lisboa & Tejo' },
                { id: 'norte', label: 'Norte & Minho' },
                { id: 'centro', label: 'Centro & Beiras' },
                { id: 'alentejo', label: 'Alentejo' },
                { id: 'algarve', label: 'Algarve' },
                { id: 'ilhas', label: 'Açores & Madeira' },
                { id: 'global', label: 'Globais' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedZone(tab.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    selectedZone === tab.id
                      ? 'bg-teal-500/25 text-teal-200 border border-teal-400/50 shadow-[0_0_15px_rgba(20,184,166,0.3)]'
                      : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-white/5 border border-white/5'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-white/10 shrink-0 self-start sm:self-auto">
              <button
                onClick={() => setActiveViewMode('destaque')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeViewMode === 'destaque' ? 'bg-teal-500/30 text-teal-200 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Previsão Detalhada
              </button>
              <button
                onClick={() => setActiveViewMode('todos_concelhos')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                  activeViewMode === 'todos_concelhos' ? 'bg-teal-500/30 text-teal-200 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Layers className="w-3 h-3 text-cyan-400" />
                Grelha Nacional ({filteredPresetCities.length})
              </button>
            </div>
          </div>

          {/* Quick Select City Chips with Live Open-Meteo Temperatures */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 no-scrollbar">
            {filteredPresetCities.slice(0, 24).map((city, idx) => {
              const liveSummary = citiesWeatherMap[city.name];
              const isSelected = selectedLocation.name === city.name;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedLocation(city);
                    setActiveViewMode('destaque');
                  }}
                  className={`px-3 py-1 rounded-xl text-[11px] whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-gradient-to-r from-teal-500/30 to-cyan-500/30 text-teal-200 border border-teal-400/60 shadow-[0_0_12px_rgba(20,184,166,0.35)] font-bold'
                      : 'bg-slate-900/50 text-slate-300 hover:text-white hover:bg-white/5 border border-white/5'
                  }`}
                >
                  <span>{city.name}</span>
                  {liveSummary && (
                    <span className="font-mono text-cyan-300 font-bold text-[10px]">
                      {liveSummary.temperature}°
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {gpsSuccessMessage && (
        <div className="p-3.5 rounded-2xl bg-teal-950/60 border border-teal-500/40 text-teal-200 text-xs font-mono flex items-center justify-between gap-2 shadow-[0_0_15px_rgba(20,184,166,0.2)] animate-fade-in">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping"></span>
            <span>{gpsSuccessMessage}</span>
          </div>
          <button 
            onClick={() => setGpsSuccessMessage(null)}
            className="text-slate-400 hover:text-white text-xs px-2 py-0.5 rounded cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {locationError && (
        <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs flex flex-wrap items-center justify-between gap-3 animate-fade-in shadow-lg">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
            <span>{locationError}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setLocationError(null);
                fetchSingleLocationWeather(selectedLocation);
                fetchAllPortugalWeatherChunks();
              }}
              className="px-3 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-400/40 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1 text-[11px]"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Tentar Novamente</span>
            </button>
            <button 
              onClick={() => setLocationError(null)}
              className="text-amber-400 hover:text-amber-100 text-xs px-2 py-1 rounded cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Grid Mode: Visual Radar of All Concelhos in Portugal */}
      {activeViewMode === 'todos_concelhos' && (
        <div className="liquid-glass-card rounded-3xl p-6 sm:p-8 space-y-5 border border-cyan-500/30 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-teal-400" />
                Painel Meteorológico Nacional ({filteredPresetCities.length} Concelhos)
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Valores carregados da API Open-Meteo com sincronização automática a cada 15 minutos.
              </p>
            </div>
            <span className="text-xs font-mono text-teal-300 bg-teal-950/60 px-3 py-1 rounded-xl border border-teal-500/30 self-start sm:self-auto">
              Atualização: {lastUpdated || 'Em sincronização'}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {filteredPresetCities.map((city, idx) => {
              const liveData = citiesWeatherMap[city.name];
              const isSelected = selectedLocation.name === city.name;
              const cityCond = liveData ? getWeatherConditionInfo(liveData.weatherCode, liveData.isDay) : null;

              return (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedLocation(city);
                    setActiveViewMode('destaque');
                  }}
                  className={`p-3.5 rounded-2xl text-left space-y-2 transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-teal-950/80 border-teal-400 shadow-[0_0_20px_rgba(20,184,166,0.3)]'
                      : 'bg-slate-900/60 hover:bg-slate-900 border-white/10 hover:border-teal-500/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white truncate max-w-[100px]">{city.name}</span>
                    <span className="text-[10px] font-mono text-slate-400 uppercase">{city.zone}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-black font-mono text-white">
                      {liveData ? `${liveData.temperature}°` : '--°'}
                    </div>
                    <div className="scale-75 origin-right">
                      {cityCond ? cityCond.icon : <CloudSun className="w-6 h-6 text-slate-500" />}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1 border-t border-white/5">
                    <span className="text-teal-300 truncate">{city.district || city.region}</span>
                    {liveData && (
                      <span className="text-cyan-400 flex items-center gap-0.5">
                        <Wind className="w-2.5 h-2.5" />
                        {liveData.windSpeed}k
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Current Weather Display for Selected Concelho */}
      {currentWeather && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Card */}
          <div className="lg:col-span-2 liquid-glass-card rounded-3xl p-6 sm:p-8 space-y-6 border border-teal-400/30 relative overflow-hidden shadow-[0_16px_50px_rgba(0,0,0,0.6)]">
            
            {/* Background Ambient Orb */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
              <div>
                <div className="flex items-center gap-2 text-teal-300 font-mono text-xs font-bold">
                  <MapPin className="w-4 h-4" />
                  <span>{selectedLocation.name}, {selectedLocation.country}</span>
                  <span className="text-slate-400">• {selectedLocation.region}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
                  {condInfo?.label}
                </h2>
              </div>

              <div className="text-right flex sm:flex-col items-center sm:items-end justify-between gap-2">
                <div>
                  <span className="text-[11px] font-mono text-slate-400">Última leitura: </span>
                  <span className="text-xs text-teal-300 font-mono font-bold">{lastUpdated || '--:--:--'}</span>
                </div>
                <div className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Próxima sincronização: {isAutoRefreshActive ? formatCountdown(refreshCountdown) : 'Pausado'}
                </div>
              </div>
            </div>

            {/* Big Temperature & Icon Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 py-4 border-y border-white/10 relative z-10">
              <div className="flex items-center gap-5">
                <div className="text-6xl sm:text-7xl font-black text-white font-mono tracking-tighter drop-shadow-md">
                  {currentWeather.temperature}°<span className="text-3xl font-normal text-teal-300">C</span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Thermometer className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs text-slate-300">Sensação: <strong className="text-white">{currentWeather.apparentTemperature}°C</strong></span>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-mono">
                    <span className="text-emerald-400">Min: {currentWeather.tempMin}°C</span>
                    <span className="text-rose-400">Máx: {currentWeather.tempMax}°C</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-slate-900/60 p-4 rounded-2xl border border-white/10">
                {condInfo?.icon}
                <div>
                  <div className="text-xs font-bold text-slate-200">Condição Atual</div>
                  <div className="text-[11px] text-teal-300 font-mono">Código WMO {currentWeather.weatherCode}</div>
                </div>
              </div>
            </div>

            {/* Meteorological Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 relative z-10">
              
              {/* Rain */}
              <div className="p-3.5 bg-slate-900/70 border border-white/10 rounded-2xl space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-blue-300 font-semibold">
                  <Droplets className="w-3.5 h-3.5 text-blue-400" />
                  <span>Precipitação</span>
                </div>
                <div className="text-lg font-black text-white font-mono">{currentWeather.precipitationProbMax}%</div>
                <div className="text-[10px] text-slate-400 font-mono">{currentWeather.precipitation} mm acumulados</div>
              </div>

              {/* Wind */}
              <div className="p-3.5 bg-slate-900/70 border border-white/10 rounded-2xl space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-cyan-300 font-semibold">
                  <Wind className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Vento</span>
                </div>
                <div className="text-lg font-black text-white font-mono">{currentWeather.windSpeed} <span className="text-xs font-normal">km/h</span></div>
                <div className="text-[10px] text-slate-400 font-mono">Direção {getWindDirectionCardinal(currentWeather.windDirection)} ({currentWeather.windDirection}°)</div>
              </div>

              {/* Humidity */}
              <div className="p-3.5 bg-slate-900/70 border border-white/10 rounded-2xl space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-teal-300 font-semibold">
                  <Activity className="w-3.5 h-3.5 text-teal-400" />
                  <span>Humidade</span>
                </div>
                <div className="text-lg font-black text-white font-mono">{currentWeather.relativeHumidity}%</div>
                <div className="text-[10px] text-slate-400 font-mono">
                  {currentWeather.relativeHumidity > 70 ? 'Ar húmido' : currentWeather.relativeHumidity < 35 ? 'Ar seco' : 'Ideal'}
                </div>
              </div>

              {/* UV Index */}
              <div className="p-3.5 bg-slate-900/70 border border-white/10 rounded-2xl space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-amber-300 font-semibold">
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span>Índice UV</span>
                </div>
                <div className="text-lg font-black text-white font-mono">{currentWeather.uvIndex} <span className="text-xs font-normal">/ 11+</span></div>
                <div className={`text-[10px] font-bold ${uvInfo?.color}`}>Risco {uvInfo?.label}</div>
              </div>

            </div>

            {/* Extra Info: Sun & Pressure */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-900/50 border border-white/5 rounded-2xl text-xs text-slate-300 font-mono">
              <div className="flex items-center gap-2">
                <Sunrise className="w-4 h-4 text-amber-400" />
                <span>Nascer do Sol: <strong className="text-white">{currentWeather.sunrise}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Sunset className="w-4 h-4 text-orange-400" />
                <span>Pôr do Sol: <strong className="text-white">{currentWeather.sunset}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Gauge className="w-4 h-4 text-teal-400" />
                <span>Pressão: <strong className="text-white">{currentWeather.surfacePressure} hPa</strong></span>
              </div>
            </div>

          </div>

          {/* Side: AI Meteorologist Card */}
          <div className="liquid-glass-card rounded-3xl p-6 space-y-5 border border-cyan-500/30 flex flex-col justify-between shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Análise Meteorológica IA</h3>
                  <p className="text-xs text-slate-400">Insights gerados pelo ChatBot Gustavo Tec</p>
                </div>
              </div>

              {aiAnalysis ? (
                <div className="p-4 bg-slate-900/80 rounded-2xl border border-cyan-500/30 text-xs text-slate-200 leading-relaxed whitespace-pre-line shadow-inner max-h-72 overflow-y-auto">
                  {aiAnalysis}
                </div>
              ) : (
                <div className="p-5 bg-slate-900/40 rounded-2xl border border-white/10 text-xs text-slate-400 text-center space-y-2">
                  <Sparkles className="w-6 h-6 text-cyan-400 mx-auto" />
                  <p>Obtenha uma previsão inteligente adaptada para esportes, viagens, trabalho e roupas adequadas para o dia em {selectedLocation.name}.</p>
                </div>
              )}
            </div>

            <button
              onClick={handleGenerateAiForecast}
              disabled={isGeneratingAi}
              className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.35)] transition-all cursor-pointer disabled:opacity-50"
            >
              <Sparkles className={`w-4 h-4 ${isGeneratingAi ? 'animate-spin' : ''}`} />
              <span>{isGeneratingAi ? 'Processando Previsão...' : 'Gerar Análise IA'}</span>
            </button>
          </div>

        </div>
      )}

      {/* Hourly 24-Hour Forecast */}
      {hourlyForecast.length > 0 && (
        <div className="liquid-glass-card rounded-3xl p-6 space-y-4 border border-white/10 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-teal-400" /> Próximas 24 Horas em {selectedLocation.name}
            </h3>
            <span className="text-xs text-slate-400 font-mono">Intervalo de 1h</span>
          </div>

          <div className="flex items-center gap-3 overflow-x-auto pb-3 pt-1 no-scrollbar">
            {hourlyForecast.map((hour, idx) => {
              const hCond = getWeatherConditionInfo(hour.weatherCode);
              return (
                <div 
                  key={idx}
                  className="p-3.5 bg-slate-900/70 hover:bg-slate-900 border border-white/10 hover:border-teal-500/40 rounded-2xl min-w-[90px] text-center space-y-2 shrink-0 transition-all shadow-sm"
                >
                  <div className="text-xs font-mono font-bold text-slate-400">{hour.time}</div>
                  <div className="flex justify-center my-1 scale-75">
                    {hCond.icon}
                  </div>
                  <div className="text-base font-black text-white font-mono">{hour.temperature}°C</div>
                  <div className="text-[10px] text-blue-400 font-mono flex items-center justify-center gap-0.5 font-semibold">
                    <Droplets className="w-2.5 h-2.5" />
                    <span>{hour.precipitationProbability}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 7-Day Extended Forecast */}
      {dailyForecast.length > 0 && (
        <div className="liquid-glass-card rounded-3xl p-6 space-y-4 border border-white/10 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cyan-400" /> Previsão Estendida para os Próximos 7 Dias
            </h3>
            <span className="text-xs text-slate-400 font-mono">Open-Meteo High Resolution</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {dailyForecast.map((day, idx) => {
              const dCond = getWeatherConditionInfo(day.weatherCode);
              return (
                <div 
                  key={idx}
                  className="p-4 bg-slate-900/60 hover:bg-slate-900 border border-white/10 hover:border-cyan-500/40 rounded-2xl text-center space-y-2.5 transition-all shadow-sm"
                >
                  <div>
                    <div className="text-xs font-bold text-white">{day.dayName}</div>
                    <div className="text-[10px] font-mono text-slate-400">{day.date}</div>
                  </div>

                  <div className="flex justify-center scale-90">
                    {dCond.icon}
                  </div>

                  <div className="text-xs text-slate-300 font-medium truncate">
                    {dCond.label}
                  </div>

                  <div className="flex items-center justify-center gap-2 text-xs font-mono pt-1 border-t border-white/10">
                    <span className="text-rose-400 font-bold">{day.tempMax}°</span>
                    <span className="text-slate-500">/</span>
                    <span className="text-cyan-400 font-bold">{day.tempMin}°</span>
                  </div>

                  <div className="text-[10px] text-blue-300 font-mono flex items-center justify-center gap-1 font-semibold">
                    <Droplets className="w-3 h-3 text-blue-400" />
                    <span>{day.precipitationProbMax}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
