type WeatherCardProps = {
  city: string;
  temperatureF: number;
  condition: string;
  highlight?: boolean;
  selected?: boolean;
  onClick?: () => void;
};

function getConditionEmoji(condition: string): string {
  const conditionLower = condition.toLowerCase();
  
  if (conditionLower.includes('sunny') || conditionLower.includes('clear')) {
    return '☀️';
  } else if (conditionLower.includes('cloud')) {
    return '☁️';
  } else if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) {
    return '🌧️';
  } else if (conditionLower.includes('snow') || conditionLower.includes('blizzard')) {
    return '❄️';
  } else if (conditionLower.includes('wind') || conditionLower.includes('breeze')) {
    return '🌬️';
  } else if (conditionLower.includes('thunder') || conditionLower.includes('storm')) {
    return '⛈️';
  } else if (conditionLower.includes('fog') || conditionLower.includes('mist')) {
    return '🌫️';
  } else {
    return '🌤️'; // Default for other conditions
  }
}

export function WeatherCard({ city, temperatureF, condition, highlight, selected, onClick }: WeatherCardProps) {
  const isClickable = !!onClick;
  const isSelected = selected || highlight;
  
  return (
    <div 
      className={`rounded-lg border p-4 shadow-sm transition-all duration-200 ${
        isSelected 
          ? 'border-blue-600 ring-2 ring-blue-300 bg-blue-50' 
          : 'border-gray-200 bg-white hover:border-gray-300'
      } ${isClickable ? 'cursor-pointer hover:shadow-md' : ''}`}
      onClick={onClick}
    > 
      <div className="flex items-center justify-between">
        <div className="text-3xl">{getConditionEmoji(condition)}</div>
        <div className="text-2xl font-semibold">{Math.round(temperatureF)}°F</div>
      </div>
      <div className="mt-2 text-gray-700 font-medium">{city}</div>
      <div className="mt-1 text-sm text-gray-500">{condition}</div>
      {isSelected && (
        <div className="mt-2 text-xs text-blue-600 font-medium">✓ Selected</div>
      )}
    </div>
  );
}


