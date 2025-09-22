import React from 'react';

type Props = {
  city: string;
  temperature: number;
  icon?: string; // emoji or URL
  highlight?: boolean;
};

export default function WeatherCard({ city, temperature, icon = '⛅', highlight }: Props) {
  return (
    <div className={`rounded-lg border ${highlight ? 'border-brand-500 bg-brand-50' : 'border-gray-200 bg-white'} p-4 shadow-sm` }>
      <div className="flex items-center gap-3">
        <div className="text-2xl">{icon}</div>
        <div>
          <div className="text-base font-semibold">{city}</div>
          <div className="text-sm text-gray-600">{temperature}°F</div>
        </div>
      </div>
    </div>
  );
}


