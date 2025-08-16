#!/bin/bash

# Deploy to all platforms
echo "🚀 Leo PVT Hostel - Multi-Platform Deployment"
echo "=============================================="

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# 1. GitHub Deployment
echo -e "${BLUE}📦 Pushing to GitHub...${NC}"
git add -A
git commit -m "Deploy: $(date '+%Y-%m-%d %H:%M:%S')"
git push origin main || {
    echo -e "${YELLOW}Creating GitHub repository...${NC}"
    gh repo create leo-pvthostel --public --source=. --remote=origin --push
}

# 2. GitLab Deployment
echo -e "${BLUE}📦 Pushing to GitLab...${NC}"
if ! git remote | grep -q gitlab; then
    echo "Adding GitLab remote..."
    git remote add gitlab https://gitlab.com/yourusername/leo-pvthostel.git
fi
git push gitlab main || echo -e "${YELLOW}GitLab push failed - please configure remote${NC}"

# 3. Docker Hub Deployment
echo -e "${BLUE}🐳 Building and pushing Docker image...${NC}"
docker build -t leo-pvthostel:latest .
docker tag leo-pvthostel:latest yourdockerhub/leo-pvthostel:latest
docker tag leo-pvthostel:latest yourdockerhub/leo-pvthostel:$(git rev-parse --short HEAD)

# Login to Docker Hub
echo -e "${YELLOW}Please login to Docker Hub:${NC}"
docker login

# Push to Docker Hub
docker push yourdockerhub/leo-pvthostel:latest
docker push yourdockerhub/leo-pvthostel:$(git rev-parse --short HEAD)

# 4. Vercel Deployment
echo -e "${BLUE}▲ Deploying to Vercel...${NC}"
npx vercel --prod --yes

# 5. Run health checks
echo -e "${BLUE}🏥 Running health checks...${NC}"
./scripts/health-check.sh

echo -e "${GREEN}✅ Multi-platform deployment complete!${NC}"