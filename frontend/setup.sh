#!/bin/bash

echo "🚀 Setting up Hemut Q&A Dashboard Frontend..."

# Install dependencies
echo ""
echo "📥 Installing dependencies (this may take a few minutes)..."
npm install

# Copy .env file if it doesn't exist
if [ ! -f .env.local ]; then
    echo ""
    echo "📝 Copying .env.local.example to .env.local..."
    cp .env.local.example .env.local
    echo "✅ Environment file created!"
fi

echo ""
echo "✅ Frontend setup complete!"
echo ""
echo "To start the development server, run:"
echo "  npm run dev"
echo ""
echo "Application will be available at:"
echo "  http://localhost:3000"
