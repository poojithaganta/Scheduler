// Weather service for real-time weather data using WeatherAPI.com
const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const CURRENT_URL = 'https://api.weatherapi.com/v1/current.json';
const FORECAST_URL = 'https://api.weatherapi.com/v1/forecast.json';

export interface WeatherData {
  city: string;
  temperatureF: number;
  temperatureC: number;
  condition: string;
  description: string;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
  date?: string; // For forecast data
  isForecast?: boolean;
}

export interface WeatherSuitability {
  score: number; // 0-100, higher is better
  reason: string;
  isSuitable: boolean;
}

// Office locations with their coordinates
export const OFFICE_LOCATIONS = [
  { city: 'Irving, TX', lat: 32.8140, lng: -96.9489 },
  { city: 'McKinney, TX', lat: 33.1976, lng: -96.6153 },
  { city: 'Santa Clara, CA', lat: 37.3541, lng: -121.9552 },
  { city: 'Tampa, FL', lat: 27.9506, lng: -82.4572 },
  { city: 'Pittsburgh, PA', lat: 40.4406, lng: -79.9959 },
];

export async function fetchWeatherForLocation(lat: number, lng: number, city: string): Promise<WeatherData> {
  if (!API_KEY) {
    throw new Error('WeatherAPI.com API key not found. Please set VITE_WEATHER_API_KEY in your .env file');
  }

  const url = `${CURRENT_URL}?key=${API_KEY}&q=${lat},${lng}&aqi=no`;
  console.log(`Fetching weather for ${city} at ${lat},${lng}:`, url);
  
  try {
    const response = await fetch(url);
    console.log(`Response status for ${city}:`, response.status);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Weather API error: ${response.status} ${errorData.error?.message || response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`Weather data for ${city}:`, data);
    
    const weatherData = {
      city,
      temperatureF: Math.round(data.current.temp_f),
      temperatureC: Math.round(data.current.temp_c),
      condition: data.current.condition.text,
      description: data.current.condition.text,
      humidity: data.current.humidity,
      windSpeed: data.current.wind_mph,
      weatherCode: data.current.condition.code,
    };
    
    console.log(`Processed weather data for ${city}:`, weatherData);
    return weatherData;
  } catch (error) {
    console.error(`Error fetching weather for ${city}:`, error);
    throw error;
  }
}

export async function fetchAllOfficeWeather(): Promise<WeatherData[]> {
  console.log('Fetching weather for all office locations:', OFFICE_LOCATIONS.map(l => l.city));
  const weatherPromises = OFFICE_LOCATIONS.map(location => 
    fetchWeatherForLocation(location.lat, location.lng, location.city)
  );
  
  try {
    const results = await Promise.allSettled(weatherPromises);
    const successfulResults = results
      .filter((result): result is PromiseFulfilledResult<WeatherData> => result.status === 'fulfilled')
      .map(result => result.value);
    
    console.log('Successfully fetched weather for:', successfulResults.map(w => w.city));
    console.log('Failed to fetch weather for:', results
      .filter(result => result.status === 'rejected')
      .map((result, index) => OFFICE_LOCATIONS[index].city)
    );
    
    return successfulResults;
  } catch (error) {
    console.error('Error fetching weather for all offices:', error);
    throw error;
  }
}

export function calculateWeatherSuitability(weather: WeatherData): WeatherSuitability {
  let score = 100;
  const reasons: string[] = [];

  // TEMPERATURE SCORING - Optimal range: 65-75°F
  if (weather.temperatureF < 45) {
    score -= 40;
    reasons.push('Too cold for outdoor events');
  } else if (weather.temperatureF < 55) {
    score -= 25;
    reasons.push('Cold - bring jackets');
  } else if (weather.temperatureF >= 65 && weather.temperatureF <= 75) {
    score += 15;
    reasons.push('Perfect temperature');
  } else if (weather.temperatureF > 85) {
    score -= 30;
    reasons.push('Too hot for comfort');
  } else if (weather.temperatureF > 80) {
    score -= 15;
    reasons.push('Warm - consider shade');
  }

  // WEATHER CONDITIONS - Most important factor
  const condition = weather.condition.toLowerCase();
  
  // DANGEROUS CONDITIONS (avoid at all costs)
  if (condition.includes('thunder') || condition.includes('storm')) {
    score -= 60;
    reasons.push('DANGER: Thunderstorms - postpone event');
  } else if (condition.includes('heavy rain') || condition.includes('torrential')) {
    score -= 50;
    reasons.push('Heavy rain - event will be ruined');
  } else if (condition.includes('snow') || condition.includes('blizzard')) {
    score -= 40;
    reasons.push('Snow - cold and slippery');
  } 
  // EXCELLENT CONDITIONS (highest scores)
  else if (condition.includes('overcast') || condition.includes('cloudy')) {
    score += 25;
    reasons.push('Perfect overcast - ideal for events');
  } else if (condition.includes('partly cloudy') || condition.includes('partly cloud')) {
    score += 20;
    reasons.push('Great partly cloudy conditions');
  } 
  // ACCEPTABLE CONDITIONS
  else if (condition.includes('light rain') || condition.includes('drizzle')) {
    score += 5;
    reasons.push('Light rain - bring umbrellas');
  } else if (condition.includes('rain')) {
    score -= 10;
    reasons.push('Moderate rain - consider indoor backup');
  } else if (condition.includes('fog') || condition.includes('mist')) {
    score -= 15;
    reasons.push('Poor visibility');
  } 
  // SUNNY CONDITIONS (depends on temperature)
  else if (condition.includes('clear') || condition.includes('sunny')) {
    if (weather.temperatureF > 80) {
      score -= 20;
      reasons.push('Hot and sunny - need shade');
    } else if (weather.temperatureF < 65) {
      score += 10;
      reasons.push('Sunny and pleasant');
    } else {
      score -= 5;
      reasons.push('Sunny - consider shade options');
    }
  }

  // WIND SCORING - Safety and comfort
  if (weather.windSpeed > 25) {
    score -= 30;
    reasons.push('DANGER: High winds - unsafe');
  } else if (weather.windSpeed > 20) {
    score -= 20;
    reasons.push('Strong winds - difficult conditions');
  } else if (weather.windSpeed > 15) {
    score -= 10;
    reasons.push('Moderate winds - manageable');
  } else if (weather.windSpeed >= 5 && weather.windSpeed <= 10) {
    score += 5;
    reasons.push('Pleasant breeze');
  }

  // HUMIDITY SCORING - Comfort factor
  if (weather.humidity > 85) {
    score -= 20;
    reasons.push('Very humid - uncomfortable');
  } else if (weather.humidity > 70) {
    score -= 10;
    reasons.push('High humidity');
  } else if (weather.humidity >= 40 && weather.humidity <= 60) {
    score += 10;
    reasons.push('Perfect humidity');
  } else if (weather.humidity < 25) {
    score -= 5;
    reasons.push('Very dry air');
  }

  // FINAL SCORING
  const isSuitable = score >= 75; // Higher threshold for better events
  const reason = reasons.length > 0 ? reasons.join(', ') : 'Excellent conditions';

  return {
    score: Math.max(0, Math.min(100, score)),
    reason,
    isSuitable,
  };
}

export function findBestLocation(weatherData: WeatherData[]): WeatherData | null {
  if (weatherData.length === 0) return null;

  let bestWeather = weatherData[0];
  let bestScore = calculateWeatherSuitability(bestWeather).score;
  
  console.log(`Initial best: ${bestWeather.city} with score ${bestScore}`);

  for (const weather of weatherData.slice(1)) {
    const suitability = calculateWeatherSuitability(weather);
    console.log(`Comparing ${weather.city}: score ${suitability.score} vs current best ${bestScore}`);
    if (suitability.score > bestScore) {
      console.log(`New best found: ${weather.city} with score ${suitability.score}`);
      bestWeather = weather;
      bestScore = suitability.score;
    }
  }

  console.log(`Final best location: ${bestWeather.city} with score ${bestScore}`);
  return bestWeather;
}

export function getSuggestedAlternativeDate(originalDate: string): string {
  const date = new Date(originalDate);
  date.setDate(date.getDate() + 1);
  return date.toISOString().slice(0, 10);
}

// Fetch weather forecast for a specific date (up to 10 days ahead)
export async function fetchWeatherForecastForDate(lat: number, lng: number, city: string, targetDate: string): Promise<WeatherData | null> {
  if (!API_KEY) {
    throw new Error('WeatherAPI.com API key not found. Please set VITE_WEATHER_API_KEY in your .env file');
  }

  const url = `${FORECAST_URL}?key=${API_KEY}&q=${lat},${lng}&days=10&aqi=no`;
  console.log(`Fetching forecast for ${city} on ${targetDate}:`, url);
  
  try {
    const response = await fetch(url);
    console.log(`Forecast response status for ${city}:`, response.status);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Weather API error: ${response.status} ${errorData.error?.message || response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`Forecast data for ${city}:`, data);
    
    // Find the forecast for the target date
    const targetDateObj = new Date(targetDate);
    const forecastDay = data.forecast.forecastday.find((day: any) => {
      const forecastDate = new Date(day.date);
      return forecastDate.toDateString() === targetDateObj.toDateString();
    });
    
    if (!forecastDay) {
      console.log(`No forecast found for ${targetDate} in ${city}`);
      return null;
    }
    
    // Use the day's average conditions
    const dayData = forecastDay.day;
    const weatherData = {
      city,
      temperatureF: Math.round(dayData.avgtemp_f),
      temperatureC: Math.round(dayData.avgtemp_c),
      condition: dayData.condition.text,
      description: dayData.condition.text,
      humidity: dayData.avghumidity,
      windSpeed: dayData.maxwind_mph,
      weatherCode: dayData.condition.code,
      date: targetDate,
      isForecast: true,
    };
    
    console.log(`Processed forecast data for ${city} on ${targetDate}:`, weatherData);
    return weatherData;
  } catch (error) {
    console.error(`Error fetching forecast for ${city} on ${targetDate}:`, error);
    throw error;
  }
}

// Fetch weather forecast for all office locations on a specific date
export async function fetchAllOfficeWeatherForDate(targetDate: string): Promise<WeatherData[]> {
  const weatherPromises = OFFICE_LOCATIONS.map(location => 
    fetchWeatherForecastForDate(location.lat, location.lng, location.city, targetDate)
  );
  
  try {
    const results = await Promise.allSettled(weatherPromises);
    return results
      .filter((result): result is PromiseFulfilledResult<WeatherData> => 
        result.status === 'fulfilled' && result.value !== null
      )
      .map(result => result.value);
  } catch (error) {
    console.error('Error fetching forecast for all offices:', error);
    throw error;
  }
}

// Check if a date is within forecast range (10 days from today)
export function isDateWithinForecastRange(targetDate: string): boolean {
  const today = new Date();
  const target = new Date(targetDate);
  const diffTime = target.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays >= 0 && diffDays <= 10;
}
