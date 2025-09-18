import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';

const OFFICES = ['Irving', 'McKinney', 'Santa Clara', 'Tampa', 'Pittsburgh'];

export default function Home() {
  return (
    <div>
      <section className="container-px mx-auto py-16 grid gap-8 md:grid-cols-2 items-center">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Building the future at TARDUS Inc</h1>
          <div className="mt-6 flex gap-3">
            <Link to="/job-application"><Button>Apply for a Job</Button></Link>
            <Link to="/event"><Button variant="secondary">Organize an Event</Button></Link>
          </div>
        </div>
        <div className="bg-white rounded-lg border shadow-card p-6">
          <div className="h-64 bg-gray-100 rounded flex items-center justify-center text-gray-500">Map Placeholder</div>
          <ul className="mt-4 grid grid-cols-2 gap-2 text-sm text-gray-700">
            {OFFICES.map(o => (
              <li key={o} className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-brand-500" /> {o}</li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

