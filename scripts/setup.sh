#!/bin/bash
# Setup script for openclaw-xiaomi-home skill
# This script helps users install Home Assistant and configure the MCP server

set -e

echo "=========================================="
echo "Xiaomi Home Skill Setup"
echo "=========================================="

# Check Docker
if ! command -v docker &> /dev/null; then
    echo "Error: Docker is not installed."
    echo "Please install Docker Desktop from: https://docs.docker.com/desktop/setup/install/mac-install/"
    exit 1
fi

if ! docker info &> /dev/null; then
    echo "Error: Docker is not running."
    echo "Please start Docker Desktop."
    exit 1
fi

echo "✓ Docker is installed and running"

# Create config directory
mkdir -p config

# Start Home Assistant
echo ""
echo "Starting Home Assistant..."
docker compose up -d

echo ""
echo "✓ Home Assistant started"
echo "  Access at: http://localhost:8123"
echo ""
echo "  First-time setup:"
echo "  1. Create your Home Assistant account"
echo "  2. Go to Settings → Devices & Services → Add Integration"
echo "  3. Search for 'Xiaomi Home' and install it"
echo "  4. Login with your Xiaomi account"
echo ""
echo "  After setup, generate a Long-Lived Access Token:"
echo "  5. Profile → Security → Long-Lived Access Tokens → Create Token"
echo "  6. Copy the token and update scripts/ha-mcp-server/.env"
echo ""

# Setup MCP server
echo "=========================================="
echo "MCP Server Setup"
echo "=========================================="

cd scripts/ha-mcp-server

if [ ! -f .env ]; then
    cp .env.example .env
    echo "✓ Created .env file from template"
    echo "  Please edit .env and add your HA_TOKEN"
else
    echo "✓ .env file already exists"
fi

echo ""
echo "Installing MCP server dependencies..."
npm install
npm run build

echo ""
echo "=========================================="
echo "Setup Complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Add your HA_TOKEN to scripts/ha-mcp-server/.env"
echo "2. Configure mcporter to use the MCP server"
echo "3. Restart OpenClaw"
echo ""
echo "For detailed instructions, see: references/installation.md"
