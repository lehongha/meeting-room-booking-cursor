#!/bin/bash

# Meeting Room Booking MCP Server Setup Script

echo "🚀 Setting up Meeting Room Booking MCP Server..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Build the project
echo "🔨 Building the project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Failed to build the project"
    exit 1
fi

echo "✅ Project built successfully"

# Make the index.js file executable
chmod +x dist/index.js

echo "✅ Setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Make sure your backend server is running at http://localhost:3001"
echo "2. Configure your MCP client (Cursor/Claude Desktop) with the provided config files"
echo "3. Test the integration by chatting with your LLM"
echo ""
echo "📁 Configuration files are available in the examples/ directory"
echo "📖 See README.md for detailed instructions" 