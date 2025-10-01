# Weather API Setup Guide

## WeatherAPI.com Integration

This project now uses [WeatherAPI.com](https://www.weatherapi.com/) for real-time weather data, which offers:

### ✅ Advantages over other APIs:
- **Free tier**: 1 million calls/month (vs OpenWeatherMap's 1,000/day)
- **No credit card required** for free tier
- **Better data quality** and more detailed conditions
- **Faster response times**
- **More weather parameters** (UV index, pressure, etc.)

## Setup Instructions

### 1. Get Your API Key
1. Visit [WeatherAPI.com](https://www.weatherapi.com/my/)
2. Sign up for a free account
3. Copy your API key from the dashboard

### 2. Configure Environment Variables
Create a `.env` file in your project root:

```bash
# WeatherAPI.com API Key
VITE_WEATHER_API_KEY=your_api_key_here

# Google Maps API Key (for geocoding in JobApplication)
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

### 3. Test the Integration
1. Start the development server: `npm run dev`
2. Navigate to the Event Management page
3. Select a date and click "Check Weather & Suggest Location"
4. You should see real weather data for all office locations

## API Features Used

### Current Weather Data
- **Temperature**: Both Fahrenheit and Celsius
- **Conditions**: Detailed weather descriptions
- **Wind Speed**: In mph
- **Humidity**: Percentage
- **Weather Codes**: For condition analysis

### Office Locations
The system checks weather for these locations:
- Irving, TX
- McKinney, TX  
- Santa Clara, CA
- Tampa, FL
- Pittsburgh, PA

## Weather Scoring Logic

The system calculates suitability scores (0-100) based on:

### Temperature Scoring
- **65-80°F**: Optimal (+0 points)
- **60-85°F**: Good (-10 points)
- **50-60°F or 85-90°F**: Poor (-25 points)
- **<50°F or >90°F**: Very poor (-30 points)

### Weather Conditions
- **Clear/Sunny**: +10 points
- **Cloudy**: -5 points
- **Light Rain**: -30 points
- **Heavy Rain**: -35 points
- **Thunderstorms**: -40 points
- **Snow**: -25 points
- **Fog/Mist**: -15 points

### Wind & Humidity
- **Wind >20 mph**: -15 points
- **Wind >15 mph**: -5 points
- **Humidity >80%**: -10 points
- **Humidity <30%**: -5 points

### Final Decision
- **Score ≥70**: Location is suitable
- **Score <70**: Suggest alternative date

## Error Handling

The system includes comprehensive error handling:
- API key validation
- Network error recovery
- Rate limit handling
- User-friendly error messages

## Alternative Weather APIs

If you want to switch to a different weather API, you can easily modify the `weatherService.ts` file. The service is designed to be API-agnostic.

### Supported APIs:
- WeatherAPI.com (current)
- OpenWeatherMap
- AccuWeather
- Weatherbit
- Any REST API with weather data

## Troubleshooting

### Common Issues:
1. **"API key not found"**: Check your `.env` file
2. **"Weather API error"**: Verify your API key is valid
3. **No weather data**: Check your internet connection
4. **Rate limit exceeded**: Wait a few minutes or upgrade your plan

### Debug Mode:
Add `console.log(data)` in `fetchWeatherForLocation` to see raw API responses.
