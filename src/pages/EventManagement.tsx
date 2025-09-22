import React, { useMemo, useState } from 'react';
import TextInput from '../components/inputs/TextInput';
import DateInput from '../components/inputs/DateInput';
import Button from '../components/Button';
import Modal from '../components/Modal';
import WeatherCard from '../components/WeatherCard';

const OFFICES = ['Irving', 'McKinney', 'Santa Clara', 'Tampa', 'Pittsburgh'];

export default function EventManagement() {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [open, setOpen] = useState(false);
  const [modalState, setModalState] = useState<'best' | 'none' | null>(null);
  const [confirmed, setConfirmed] = useState<{ city: string; date: string } | null>(null);

  const mockedWeather = useMemo(() => {
    return OFFICES.map((city, idx) => ({ city, temperature: 68 + idx * 2, icon: idx % 2 ? '🌤️' : '☀️' }));
  }, []);

  const bestLocation = mockedWeather[2]; // arbitrary best

  const onCheck = () => {
    // Mock branching: if day is an odd day -> best, else none
    if (!date) {
      setModalState('none');
    } else {
      const day = new Date(date).getDate();
      setModalState(day % 2 === 1 ? 'best' : 'none');
    }
    setOpen(true);
  };

  const nextSuggestion = useMemo(() => {
    const d = date ? new Date(date) : new Date();
    d.setDate(d.getDate() + 1);
    const suggestCity = mockedWeather[0].city;
    return { date: d.toISOString().slice(0, 10), city: suggestCity };
  }, [date, mockedWeather]);

  return (
    <div className="container-px mx-auto py-10">
      <h2 className="text-2xl font-bold">Event Management</h2>
      <div className="mt-6 grid gap-4 max-w-2xl">
        <TextInput label="Event Title" value={title} onChange={e => setTitle(e.target.value)} />
        <DateInput label="Date" value={date} onChange={e => setDate(e.target.value)} />
        <label className="block">
          <span className="block text-sm font-medium text-gray-700">Description</span>
          <textarea className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500" rows={4} value={description} onChange={e => setDescription(e.target.value)} />
        </label>
        <div>
          <Button onClick={onCheck}>Check Weather & Suggest Location</Button>
        </div>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Suggested Locations">
        {modalState === 'best' && (
          <div className="grid gap-4">
            <div>
              <div className="text-sm font-medium text-gray-700 mb-2">Best Location</div>
              <WeatherCard city={bestLocation.city} temperature={bestLocation.temperature} icon={bestLocation.icon} highlight />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-700 mb-2">Other Options</div>
              <div className="grid sm:grid-cols-2 gap-3">
                {mockedWeather.filter(w => w.city !== bestLocation.city).map(w => (
                  <WeatherCard key={w.city} city={w.city} temperature={w.temperature} icon={w.icon} />
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={() => { setConfirmed({ city: bestLocation.city, date }); setOpen(false); }}>Confirm Location</Button>
            </div>
          </div>
        )}
        {modalState === 'none' && (
          <div className="grid gap-4">
            <div className="text-gray-800">No location suitable on chosen date. Suggested: <span className="font-semibold">{nextSuggestion.date} — {nextSuggestion.city}</span></div>
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setOpen(false)}>Close</Button>
              <Button onClick={() => { setConfirmed({ city: nextSuggestion.city, date: nextSuggestion.date }); setOpen(false); }}>Confirm Suggested</Button>
            </div>
          </div>
        )}
      </Modal>

      {confirmed && (
        <div className="mt-8 max-w-2xl rounded-lg border border-blue-200 bg-blue-50 p-4">
          <div className="font-semibold text-blue-800">Event confirmed!</div>
          <div className="mt-1 text-sm text-blue-700">{title || 'Untitled Event'} on <span className="font-medium">{confirmed.date || date}</span> at <span className="font-medium">{confirmed.city}</span>.</div>
        </div>
      )}
    </div>
  );
}


