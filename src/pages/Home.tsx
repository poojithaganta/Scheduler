import { Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { useMemo, useState } from 'react';
import { Map } from '../components/Map';

export function Home() {
  const offices = useMemo(() => ({
    Irving: { lat: 32.8140, lng: -96.9489 },
    McKinney: { lat: 33.1976, lng: -96.6153 },
    'Santa Clara': { lat: 37.3541, lng: -121.9552 },
    Tampa: { lat: 27.9506, lng: -82.4572 },
    Pittsburgh: { lat: 40.4406, lng: -79.9959 },
  }), []);
  const [activeCity, setActiveCity] = useState<keyof typeof offices>('Irving');

  return (
    <div>
      <section className="bg-gradient-to-br from-blue-50 to-white border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid gap-8 lg:grid-cols-2 items-center">
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight">TARDUS — Build with confidence.</h1>
            <p className="mt-4 text-lg text-gray-700">Modern engineering for high-impact teams. We craft resilient systems and delightful experiences.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/job-application"><Button variant="primary">Apply for a Job</Button></Link>
              <Link to="/event"><Button variant="secondary">Organize an Event</Button></Link>
            </div>
          </div>
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="text-sm text-gray-600 mb-3">Our Offices</div>
            <Map className="rounded-lg overflow-hidden" center={offices[activeCity]} markerTitle={`${activeCity} Office`} />
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm text-gray-700">
              {Object.keys(offices).map((city) => (
                <button
                  key={city}
                  type="button"
                  onClick={() => setActiveCity(city as keyof typeof offices)}
                  className={`px-2 py-2 rounded border text-center transition-colors ${activeCity === city ? 'bg-blue-50 border-blue-600 text-blue-800' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}`}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}


