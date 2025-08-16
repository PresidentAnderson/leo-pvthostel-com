#!/bin/bash

# Leo PVT Hostel - Initial Setup Script
# This script sets up the development environment

echo "🏨 Leo PVT Hostel - Setup Script"
echo "================================="

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 1. Install dependencies
echo -e "${BLUE}📦 Installing dependencies...${NC}"
npm install

# 2. Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo -e "${BLUE}🔧 Creating .env file...${NC}"
    cp .env.example .env
    echo -e "${YELLOW}⚠️  Please update .env with your actual API keys and credentials${NC}"
fi

# 3. Setup Git hooks (optional)
echo -e "${BLUE}🔗 Setting up Git hooks...${NC}"
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
echo "Running pre-commit checks..."

# Type check
npm run typecheck
if [ $? -ne 0 ]; then
    echo "❌ Type checking failed"
    exit 1
fi

# Lint
npm run lint
if [ $? -ne 0 ]; then
    echo "❌ Linting failed"
    exit 1
fi

echo "✅ Pre-commit checks passed"
EOF
chmod +x .git/hooks/pre-commit

# 4. Create necessary directories
echo -e "${BLUE}📁 Creating project directories...${NC}"
mkdir -p public/images/rooms
mkdir -p public/images/avatars
mkdir -p src/lib
mkdir -p src/hooks
mkdir -p src/utils
mkdir -p src/types

# 5. Setup ClickUp integration (optional)
echo -e "${BLUE}📊 ClickUp Integration${NC}"
echo "To set up ClickUp project management:"
echo "  1. Get your API key from https://app.clickup.com/settings/apps"
echo "  2. Add it to .env as CLICKUP_API_KEY"
echo "  3. Run: npm run clickup:setup"

# 6. Display next steps
echo ""
echo -e "${GREEN}✅ Setup complete!${NC}"
echo ""
echo "Next steps:"
echo "  1. Update .env file with your credentials:"
echo "     - Analytics IDs (GA4, GTM, Facebook Pixel, Clarity)"
echo "     - Email service API keys"
echo "     - ClickUp API key (optional)"
echo ""
echo "  2. Add placeholder images to public/images/"
echo ""
echo "  3. Start development server:"
echo "     npm run dev"
echo ""
echo "  4. For deployment:"
echo "     ./deploy.sh"
echo ""
echo "  5. GitHub setup:"
echo "     git remote add origin <your-repo-url>"
echo "     git push -u origin main"
echo ""
echo -e "${BLUE}📚 Documentation available in README.md${NC}"