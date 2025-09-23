import { useEffect, useMemo, useState } from 'react';
import { TextInput } from '../components/inputs/TextInput';
import { FileInput } from '../components/inputs/FileInput';
import { Dropdown } from '../components/Dropdown';
import { Button } from '../components/Button';

type Office = { id: string; label: string; lat: number; lng: number };
const OFFICES: Office[] = [
  { id: 'irving', label: 'Irving, TX', lat: 32.8140, lng: -96.9489 },
  { id: 'mckinney', label: 'McKinney, TX', lat: 33.1976, lng: -96.6153 },
  { id: 'santa-clara', label: 'Santa Clara, CA', lat: 37.3541, lng: -121.9552 },
  { id: 'tampa', label: 'Tampa, FL', lat: 27.9506, lng: -82.4572 },
  { id: 'pittsburgh', label: 'Pittsburgh, PA', lat: 40.4406, lng: -79.9959 },
];

function haversineMiles(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 3958.8; // miles
  const dLat = (b.lat - a.lat) * Math.PI / 180;
  const dLng = (b.lng - a.lng) * Math.PI / 180;
  const lat1 = a.lat * Math.PI / 180;
  const lat2 = b.lat * Math.PI / 180;
  const sinDLat = Math.sin(dLat / 2);
  const sinDLng = Math.sin(dLng / 2);
  const h = sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLng * sinDLng;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

export function JobApplication() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [resume, setResume] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [nearestOfficeId, setNearestOfficeId] = useState<string>('irving');
  const [officeId, setOfficeId] = useState<string>('irving');
  const [userChangedOffice, setUserChangedOffice] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [geocoding, setGeocoding] = useState(false);

  const selectedOffice = useMemo(() => {
    return OFFICES.find(o => o.id === officeId) ?? OFFICES[0];
  }, [officeId]);

  useEffect(() => {
    const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;
    const query = address.trim();
    if (!query || query.length < 4) {
      setGeoError(null);
      setGeocoding(false);
      return;
    }
    let cancelled = false;
    setGeocoding(true);
    const timeout = setTimeout(async () => {
      try {
        if (!key) throw new Error('Missing Google Maps API key');
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&key=${key}`;
        const res = await fetch(url);
        const data = await res.json();
        if (cancelled) return;
        if (data.status !== 'OK' || !data.results?.[0]?.geometry?.location) {
          throw new Error('Address not found');
        }
        const { lat, lng } = data.results[0].geometry.location as { lat: number; lng: number };
        // Compute nearest
        let nearestId = OFFICES[0].id;
        let nearestDist = Infinity;
        for (const office of OFFICES) {
          const d = haversineMiles({ lat, lng }, { lat: office.lat, lng: office.lng });
          if (d < nearestDist) {
            nearestDist = d;
            nearestId = office.id;
          }
        }
        setNearestOfficeId(nearestId);
        if (!userChangedOffice) setOfficeId(nearestId);
        setGeoError(null);
      } catch (e: any) {
        setGeoError(e?.message || 'Failed to resolve address');
      } finally {
        if (!cancelled) setGeocoding(false);
      }
    }, 500);
    return () => { cancelled = true; clearTimeout(timeout); };
  }, [address, userChangedOffice]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('phone', phone);
      formData.append('address', address);
      formData.append('officeLocation', selectedOffice.label);
      
      if (resume) {
        formData.append('resume', resume);
      }

      const response = await fetch('/api/employees', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Application submitted successfully:', result);
        setSubmitted(true);
      } else {
        console.error('Failed to submit application:', response.statusText);
        alert('Failed to submit application. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Error submitting application. Please try again.');
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h2 className="text-2xl font-semibold text-gray-900">Job Application</h2>
      <p className="text-gray-600 mt-1">Join xyz at Tardus Inc.</p>
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <TextInput label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <TextInput label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <TextInput label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
        <TextInput label="Address" value={address} onChange={(e) => { setAddress(e.target.value); setUserChangedOffice(false); }} placeholder="Enter your address" required />
        <div>
          <Dropdown
            label="Office Location"
            value={OFFICES.find(o => o.id === officeId)?.label || ''}
            onChange={(label) => { const o = OFFICES.find(x => x.label === label); if (o) { setOfficeId(o.id); setUserChangedOffice(true); } }}
            options={OFFICES.map(o => ({ id: o.id, label: o.label, isNearest: o.id === nearestOfficeId }))}
            placeholder="Select office"
          />
          <div className="mt-1 text-xs">
            {geocoding && <span className="text-gray-500">Detecting nearest office…</span>}
            {!geocoding && !geoError && address && (
              <span className="text-gray-600">Suggested nearest: {OFFICES.find(o => o.id === nearestOfficeId)?.label}</span>
            )}
            {geoError && <span className="text-red-600">{geoError}</span>}
          </div>
        </div>
        <FileInput label="Resume" onChange={(e) => setResume(e.target.files?.[0] ?? null)} required />
        <div className="pt-2">
          <Button type="submit">Submit Application</Button>
        </div>
      </form>

      {submitted && (
        <div className="mt-8 rounded-lg border bg-green-50 border-green-200 p-4">
          <div className="font-semibold text-green-800">Application Submitted!</div>
          <div className="text-sm text-green-900 mt-1">
            Thank you, {name || 'Applicant'}. We routed your application to our {selectedOffice.label} office.
          </div>
          {resume && <div className="text-xs text-green-900 mt-1">Attached: {resume.name}</div>}
        </div>
      )}
    </div>
  );
}


