import { useMemo, useState } from 'react';
import { TextInput } from '../components/inputs/TextInput';
import { DateInput } from '../components/inputs/DateInput';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { WeatherCard } from '../components/WeatherCard';

type Weather = {
  city: string;
  temperatureF: number;
  condition: 'Sunny' | 'Cloudy' | 'Rain' | 'Snow' | 'Windy';
};

const MOCK_WEATHER: Weather[] = [
  { city: 'Irving, TX', temperatureF: 78, condition: 'Sunny' },
  { city: 'McKinney, TX', temperatureF: 76, condition: 'Cloudy' },
  { city: 'Santa Clara, CA', temperatureF: 70, condition: 'Windy' },
  { city: 'Tampa, FL', temperatureF: 88, condition: 'Rain' },
  { city: 'Pittsburgh, PA', temperatureF: 68, condition: 'Sunny' },
];

export function EventManagement() {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalState, setModalState] = useState<'best' | 'none' | null>(null);
  const [confirmed, setConfirmed] = useState<{ city: string; date: string } | null>(null);

  const bestLocation = useMemo(() => MOCK_WEATHER[0], []);
  const others = useMemo(() => MOCK_WEATHER.slice(1), []);

  function onCheckWeather() {
    if (!date) {
      setModalState('none');
    } else {
      // Mock: alternate outcomes by simple heuristic
      const outcome = new Date(date).getDate() % 2 === 0 ? 'best' : 'none';
      setModalState(outcome as 'best' | 'none');
    }
    setModalOpen(true);
  }

  function onConfirm(city: string) {
    setConfirmed({ city, date: date || new Date().toISOString().slice(0, 10) });
    setModalOpen(false);
  }

  const suggestedAlternative = useMemo(() => {
    const d = date ? new Date(date) : new Date();
    d.setDate(d.getDate() + 1);
    return { date: d.toISOString().slice(0, 10), city: others[0].city };
  }, [date, others]);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h2 className="text-2xl font-semibold text-gray-900">Event Management</h2>
      <p className="text-gray-600 mt-1">Plan events with weather-aware suggestions.</p>

      <div className="mt-6 space-y-4">
        <TextInput label="Event title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <DateInput label="Event date" value={date} onChange={(e) => setDate((e.target as HTMLInputElement).value)} />
        <label className="block">
          <span className="block text-sm font-medium text-gray-700">Description</span>
          <textarea className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
        </label>
        <div className="pt-2">
          <Button type="button" onClick={onCheckWeather}>Check Weather & Suggest Location</Button>
        </div>
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
        {modalState === 'best' && (
          <div>
            <div className="grid gap-4">
              <WeatherCard city={bestLocation.city} temperatureF={bestLocation.temperatureF} condition={bestLocation.condition} highlight />
              <div className="grid sm:grid-cols-2 gap-3">
                {others.map(o => (
                  <WeatherCard key={o.city} city={o.city} temperatureF={o.temperatureF} condition={o.condition} />
                ))}
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button onClick={() => onConfirm(bestLocation.city)}>Confirm Location</Button>
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


