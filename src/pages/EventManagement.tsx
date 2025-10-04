import { useMemo, useState, useEffect } from 'react';
import { TextInput } from '../components/inputs/TextInput';
import { DateInput } from '../components/inputs/DateInput';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { WeatherCard } from '../components/WeatherCard';
import { 
  fetchAllOfficeWeather, 
  fetchAllOfficeWeatherForDate,
  findBestLocation, 
  getSuggestedAlternativeDate,
  isDateWithinForecastRange,
  WeatherData,
  WeatherSuitability,
  calculateWeatherSuitability
} from '../services/weatherService';

export function EventManagement() {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalState, setModalState] = useState<'best' | 'none' | null>(null);
  const [confirmed, setConfirmed] = useState<{ city: string; date: string } | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<WeatherData | null>(null);

  const bestLocation = useMemo(() => {
    if (weatherData.length === 0) return null;
    return findBestLocation(weatherData);
  }, [weatherData]);

  const others = useMemo(() => {
    if (!bestLocation || weatherData.length <= 1) return weatherData;
    return weatherData.filter(w => w.city !== bestLocation.city);
  }, [weatherData, bestLocation]);

  async function onCheckWeather() {
    if (!date) {
      setModalState('none');
      setModalOpen(true);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('Fetching weather data for date:', date);
      
      // Check if the date is within forecast range (10 days)
      const isForecast = isDateWithinForecastRange(date);
      console.log('Is forecast date:', isForecast);
      
      let weather: WeatherData[];
      
      if (isForecast) {
        // Use forecast data for future dates
        weather = await fetchAllOfficeWeatherForDate(date);
        console.log('Forecast data received:', weather);
      } else {
        // Use current weather for today or past dates
        weather = await fetchAllOfficeWeather();
        console.log('Current weather data received:', weather);
      }
      
      setWeatherData(weather);
      
      if (weather.length === 0) {
        console.log('No weather data received');
        setModalState('none');
      } else {
        const best = findBestLocation(weather);
        console.log('Best location found:', best);
        console.log('All weather data with scores:');
        weather.forEach(w => {
          const suitability = calculateWeatherSuitability(w);
          console.log(`${w.city}: Score ${suitability.score} (${suitability.reason})`);
        });
        
        if (best) {
          const suitability = calculateWeatherSuitability(best);
          console.log('Weather suitability for best location:', suitability);
          setModalState(suitability.isSuitable ? 'best' : 'none');
          // Set the best location as selected by default
          setSelectedLocation(best);
        } else {
          console.log('No suitable location found');
          setModalState('none');
          setSelectedLocation(null);
        }
      }
    } catch (err) {
      console.error('Error fetching weather:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
      setModalState('none');
    } finally {
      setLoading(false);
      setModalOpen(true);
    }
  }

  function onConfirm(city?: string) {
    const locationToConfirm = city || selectedLocation?.city;
    if (locationToConfirm) {
      setConfirmed({ city: locationToConfirm, date: date || new Date().toISOString().slice(0, 10) });
      setModalOpen(false);
    }
  }

  function onSelectLocation(location: WeatherData) {
    setSelectedLocation(location);
  }

  const suggestedAlternative = useMemo(() => {
    const alternativeDate = date ? getSuggestedAlternativeDate(date) : new Date().toISOString().slice(0, 10);
    const alternativeCity = others.length > 0 ? others[0].city : 'Irving, TX';
    return { date: alternativeDate, city: alternativeCity };
  }, [date, others]);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h2 className="text-2xl font-semibold text-gray-900">Event Management</h2>
      <p className="text-gray-600 mt-1">Plan events with weather-aware suggestions.</p>
      <div className="mt-2 text-sm text-blue-600">
        💡 <strong>Forecast Support:</strong> Get weather predictions up to 10 days ahead for better planning!
      </div>

      <div className="mt-6 space-y-4">
        <TextInput label="Event title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <DateInput label="Event date" value={date} onChange={(e) => setDate((e.target as HTMLInputElement).value)} />
        <label className="block">
          <span className="block text-sm font-medium text-gray-700">Description</span>
          <textarea className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
        </label>
        <div className="pt-2">
          <Button 
            type="button" 
            onClick={onCheckWeather}
            disabled={loading}
          >
            {loading ? 'Checking Weather...' : 'Check Weather & Suggest Location'}
          </Button>
        </div>
        
        {error && (
          <div className="mt-4 rounded-lg border bg-red-50 border-red-200 p-4">
            <div className="font-semibold text-red-800">Weather Error</div>
            <div className="text-sm text-red-900 mt-1">{error}</div>
          </div>
        )}
      </div>

      {confirmed && (
        <div className="mt-8 rounded-lg border bg-blue-50 border-blue-200 p-4">
          <div className="font-semibold text-blue-800">Location Confirmed</div>
          <div className="text-sm text-blue-900 mt-1">
            Event "{title || 'Untitled'}" scheduled on {confirmed.date} at {confirmed.city}.
          </div>
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Suggested Location">
        {modalState === 'best' && bestLocation && (
          <div>
            {bestLocation.isForecast && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center text-blue-800">
                  <span className="text-lg mr-2">🔮</span>
                  <span className="text-sm font-medium">Forecast Data for {bestLocation.date}</span>
                </div>
              </div>
            )}
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-3">Click on any location to select it for your event:</p>
            </div>
            <div className="grid gap-3">
              <WeatherCard 
                city={bestLocation.city} 
                temperatureF={bestLocation.temperatureF} 
                condition={bestLocation.condition} 
                selected={selectedLocation?.city === bestLocation.city}
                onClick={() => onSelectLocation(bestLocation)}
              />
              <div className="grid sm:grid-cols-2 gap-3">
                {others.map(o => (
                  <WeatherCard 
                    key={o.city} 
                    city={o.city} 
                    temperatureF={o.temperatureF} 
                    condition={o.condition}
                    selected={selectedLocation?.city === o.city}
                    onClick={() => onSelectLocation(o)}
                  />
                ))}
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button onClick={() => onConfirm()} disabled={!selectedLocation}>
                Confirm Location
              </Button>
            </div>
          </div>
        )}

        {modalState === 'none' && (
          <div>
            <p className="text-gray-800">No location suitable on chosen date. Suggested: {suggestedAlternative.date} at {suggestedAlternative.city}.</p>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setModalOpen(false)}>Close</Button>
              <Button onClick={() => onConfirm(suggestedAlternative.city)}>Confirm Location</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}


