# Tardus Inc - Event Scheduler

A full-stack application with React frontend, Spring Boot backend, and PostgreSQL database. Features weather-aware event planning and job application management.

## 🚀 Quick Start

### Prerequisites
- **Docker & Docker Compose** (only requirement!)

### 1. Clone and Setup
```bash
git clone <repository-url>
cd Scheduler
```

### 2. Environment Configuration
Create a `.env` file in the project root:
```bash
# Weather API (Required for Event Management)
VITE_WEATHER_API_KEY=your_weatherapi_key_here

# Google Maps API (Required for Job Application geocoding)
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key_here
```

**Get API Keys:**
- **WeatherAPI.com**: [Get free key](https://www.weatherapi.com/my/) (1M calls/month)
- **Google Maps**: [Get API key](https://console.cloud.google.com/) (enable Geocoding API)

### 3. Start the Application
```bash
# Start everything with Docker (no npm install needed!)
docker compose up --build

# Access the app
open http://localhost:5173
```

#### 🚀 Alternative: Background Mode
```bash
# Start all services in background
docker compose up --build -d

# Check status
docker compose ps

# View logs
docker compose logs -f

# Stop services
docker compose down
```

### 4. Verify Setup
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080
- **Database**: localhost:5432

## 📁 Project Structure

```
Scheduler/
├── src/                    # React frontend
│   ├── components/         # Reusable UI components
│   ├── pages/             # Main application pages
│   └── services/          # API services (weather, etc.)
├── backend-java/          # Spring Boot backend
│   ├── src/main/java/     # Java source code
│   └── src/main/resources/ # Configuration files
├── docker-compose.yml     # Multi-service orchestration
└── README.md             # This file
```

## 🎯 Features

### Event Management
- **Weather Integration**: Real-time weather data for 5 office locations
- **Smart Recommendations**: AI-powered location suggestions based on weather conditions
- **Forecast Support**: Plan events up to 10 days ahead
- **Intelligent Scoring**: Considers temperature, wind, humidity, and weather conditions

### Job Application
- **Geocoding**: Automatic nearest office detection based on address
- **File Upload**: Resume submission with validation
- **Form Validation**: Complete client and server-side validation

### Home Page
- **Interactive Map**: Office locations with clickable markers
- **Responsive Design**: Mobile-first approach with Tailwind CSS

## 🔧 Development

### Making Changes
```bash
# All development happens in Docker containers
# Changes are automatically reflected with hot reload

# View logs
docker compose logs -f

# Rebuild after major changes
docker compose up --build
```

### Database Management
```bash
# Access PostgreSQL
docker exec -it scheduler-postgres psql -U postgres -d tardus

# View tables
\dt

# View employees
SELECT * FROM employee;
```

## 🌤️ Weather API Integration

The app uses WeatherAPI.com for real-time weather data:

- **Current Weather**: For today's events
- **10-Day Forecast**: For future event planning
- **5 Office Locations**: Irving TX, McKinney TX, Santa Clara CA, Tampa FL, Pittsburgh PA
- **Smart Scoring**: Considers safety, comfort, and event suitability

### Weather Scoring Rules
- **Perfect**: Overcast, 65-75°F, light breeze, 40-60% humidity
- **Good**: Partly cloudy, moderate conditions
- **Acceptable**: Light rain, manageable conditions
- **Poor**: Hot/sunny, high winds, extreme temperatures
- **Dangerous**: Thunderstorms, heavy rain, unsafe conditions

## 🏭 Production Deployment

### Docker Production Setup
```bash
# Build and start all services
docker compose up --build -d

# Check status
docker compose ps

# View logs
docker compose logs -f

# Stop services
docker compose down
```

### Production Environment Variables
Create a `.env.production` file:
```bash
# Production API keys
VITE_WEATHER_API_KEY=your_production_weather_key
VITE_GOOGLE_MAPS_API_KEY=your_production_maps_key

# Database configuration
DB_URL=jdbc:postgresql://postgres:5432/tardus
DB_USER=postgres
DB_PASSWORD=your_secure_password
```

### Cloud Deployment
```bash
# Clone and setup
git clone <repository-url>
cd Scheduler

# Add production environment variables
cp .env.production .env

# Deploy with Docker
docker compose up --build -d
```
