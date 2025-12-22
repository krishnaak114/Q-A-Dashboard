#!/bin/bash

echo "🚀 Setting up Hemut Q&A Dashboard Backend..."

# Create virtual environment
echo ""
echo "📦 Creating virtual environment..."
python3 -m venv venv

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo ""
echo "📥 Installing dependencies..."
pip install -r requirements.txt

# Copy .env file if it doesn't exist
if [ ! -f .env ]; then
    echo ""
    echo "📝 Copying .env.example to .env..."
    cp .env.example .env
    echo "✅ Please update .env with your configuration!"
fi

echo ""
echo "✅ Backend setup complete!"
echo ""
echo "To start the server, run:"
echo "  source venv/bin/activate"
echo "  python -m uvicorn app.main:app --reload"
echo ""
echo "API will be available at:"
echo "  http://localhost:8000"
echo "  http://localhost:8000/docs (Interactive docs)"
