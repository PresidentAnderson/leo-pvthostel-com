#!/bin/bash

# Leo PVT Hostel - Deployment Script
# This script handles the deployment process to Vercel

echo "🚀 Leo PVT Hostel - Deployment Script"
echo "====================================="

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  Warning: .env file not found${NC}"
    echo "Creating .env from .env.example..."
    cp .env.example .env
    echo -e "${YELLOW}Please update .env with your actual values before deploying${NC}"
    exit 1
fi

# Check for required environment variables
required_vars=("NEXT_PUBLIC_GA4_ID" "NEXT_PUBLIC_GTM_ID" "NEXT_PUBLIC_FB_PIXEL_ID" "NEXT_PUBLIC_CLARITY_ID")
missing_vars=()

for var in "${required_vars[@]}"; do
    if ! grep -q "^$var=" .env || grep -q "^$var=.*XXXXXXXXXX" .env; then
        missing_vars+=($var)
    fi
done

if [ ${#missing_vars[@]} -ne 0 ]; then
    echo -e "${RED}❌ Error: Missing or unconfigured analytics variables:${NC}"
    printf '%s\n' "${missing_vars[@]}"
    echo -e "${YELLOW}Analytics setup is MANDATORY before deployment${NC}"
    echo "Please configure these in your .env file"
    exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Run type checking
echo "🔍 Running type check..."
npm run typecheck
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Type checking failed. Please fix errors before deploying.${NC}"
    exit 1
fi

# Run linting
echo "🧹 Running linter..."
npm run lint
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Linting failed. Please fix errors before deploying.${NC}"
    exit 1
fi

# Build the project
echo "🔨 Building project..."
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed. Please fix errors before deploying.${NC}"
    exit 1
fi

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
if command -v vercel &> /dev/null; then
    vercel --prod
else
    echo -e "${YELLOW}⚠️  Vercel CLI not installed${NC}"
    echo "Installing Vercel CLI..."
    npm i -g vercel
    echo "Please run 'vercel login' first, then run this script again"
    exit 1
fi

echo -e "${GREEN}✅ Deployment complete!${NC}"
echo "Your site should be live at: https://leo.pvthostel.com"
echo ""
echo "Post-deployment checklist:"
echo "  □ Verify analytics are working"
echo "  □ Test booking widget"
echo "  □ Check responsive design on mobile"
echo "  □ Test contact forms"
echo "  □ Verify language switching"