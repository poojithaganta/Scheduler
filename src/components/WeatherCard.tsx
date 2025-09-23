type WeatherCardProps = {
  city: string;
  temperatureF: number;
  condition: 'Sunny' | 'Cloudy' | 'Rain' | 'Snow' | 'Windy';
  highlight?: boolean;
};

const conditionToEmoji: Record<WeatherCardProps['condition'], string> = {
  Sunny: '☀️',
  Cloudy: '☁️',
  Rain: '🌧️',
  Snow: '❄️',
  Windy: '🌬️',
};

export function WeatherCard({ city, temperatureF, condition, highlight }: WeatherCardProps) {
  return (
    <div className={`rounded-lg border ${highlight ? 'border-blue-600 ring-2 ring-blue-300' : 'border-gray-200'} p-4 bg-white shadow-sm`}> 
      <div className="flex items-center justify-between">
        <div className="text-3xl">{conditionToEmoji[condition]}</div>
        <div className="text-2xl font-semibold">{Math.round(temperatureF)}°F</div>
      </div>
      <div className="mt-2 text-gray-700 font-medium">{city}</div>
    </div>
  );
}


