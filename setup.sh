#!/bin/bash

# Tardus Inc - Event Scheduler Setup Script
# This script helps set up the application after cloning the repository

echo "🚀 Setting up Tardus Inc - Event Scheduler..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cat > .env << EOL
# Weather API (Required for Event Management)
# Get your free API key at: https://www.weatherapi.com/my/
VITE_WEATHER_API_KEY=your_weatherapi_key_here

# Google Maps API (Required for Job Application geocoding)
# Get your API key at: https://console.cloud.google.com/
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key_here
EOL
    echo "✅ Created .env file. Please add your API keys!"
else
    echo "✅ .env file already exists"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and run this script again."
    exit 1
fi

# Start backend and database
echo "🐳 Starting backend and database with Docker Compose..."
docker compose up -d postgres backend

# Wait a moment for services to start
echo "⏳ Waiting for services to start..."
sleep 5

# Start frontend
echo "🚀 Starting frontend development server..."
echo "   This will open in a new terminal window"
echo "   Press Ctrl+C to stop the frontend when done"
echo ""

# Check if we can run npm run dev
if command -v npm &> /dev/null; then
    echo "📱 Starting frontend..."
    npm run dev
else
    echo "❌ npm not found. Please install Node.js and run:"
    echo "   npm run dev"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📱 Access the application:"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:8080"
echo ""
echo "⚠️  Don't forget to:"
echo "   1. Add your API keys to the .env file"
echo "   2. Restart the application: docker compose restart"
echo ""
echo "🔧 To stop the application:"
echo "   docker compose down"
echo ""
echo "📖 For more information, see README.md"
