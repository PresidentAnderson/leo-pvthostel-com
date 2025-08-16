#!/bin/bash

# Health check script for all deployments
echo "🏥 Running Health Checks"
echo "========================"

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# URLs to check
VERCEL_URL="https://leo-pvthostel.vercel.app"
PRODUCTION_URL="https://leo.pvthostel.com"
DOCKER_URL="http://localhost:3000"

# Function to check URL health
check_health() {
    local url=$1
    local name=$2
    
    echo -n "Checking $name... "
    
    response=$(curl -s -o /dev/null -w "%{http_code}" "$url/api/health")
    
    if [ "$response" = "200" ]; then
        echo -e "${GREEN}✅ Healthy${NC}"
        
        # Get detailed health info
        health_data=$(curl -s "$url/api/health")
        echo "  Status: $(echo $health_data | jq -r '.status')"
        echo "  Uptime: $(echo $health_data | jq -r '.uptime') seconds"
        return 0
    else
        echo -e "${RED}❌ Unhealthy (HTTP $response)${NC}"
        return 1
    fi
}

# Check if jq is installed
if ! command -v jq &> /dev/null; then
    echo -e "${YELLOW}Installing jq for JSON parsing...${NC}"
    if [[ "$OSTYPE" == "darwin"* ]]; then
        brew install jq
    else
        sudo apt-get install -y jq
    fi
fi

# Run health checks
echo ""
check_health "$VERCEL_URL" "Vercel Deployment"
vercel_status=$?

echo ""
check_health "$PRODUCTION_URL" "Production URL"
prod_status=$?

echo ""
check_health "$DOCKER_URL" "Docker Container"
docker_status=$?

# Summary
echo ""
echo "Health Check Summary"
echo "==================="

if [ $vercel_status -eq 0 ]; then
    echo -e "Vercel: ${GREEN}✅ Operational${NC}"
else
    echo -e "Vercel: ${RED}❌ Down${NC}"
fi

if [ $prod_status -eq 0 ]; then
    echo -e "Production: ${GREEN}✅ Operational${NC}"
else
    echo -e "Production: ${YELLOW}⚠️  Not configured${NC}"
fi

if [ $docker_status -eq 0 ]; then
    echo -e "Docker: ${GREEN}✅ Running${NC}"
else
    echo -e "Docker: ${YELLOW}⚠️  Not running${NC}"
fi

# Performance check
echo ""
echo "Performance Metrics"
echo "=================="
echo "Running Lighthouse audit..."

if command -v lighthouse &> /dev/null; then
    lighthouse "$VERCEL_URL" --output=json --quiet --chrome-flags="--headless" > lighthouse-report.json
    
    performance=$(cat lighthouse-report.json | jq '.categories.performance.score * 100')
    accessibility=$(cat lighthouse-report.json | jq '.categories.accessibility.score * 100')
    seo=$(cat lighthouse-report.json | jq '.categories.seo.score * 100')
    
    echo "Performance: ${performance}%"
    echo "Accessibility: ${accessibility}%"
    echo "SEO: ${seo}%"
else
    echo -e "${YELLOW}Lighthouse not installed. Install with: npm install -g lighthouse${NC}"
fi

# Exit with appropriate code
if [ $vercel_status -eq 0 ] || [ $prod_status -eq 0 ] || [ $docker_status -eq 0 ]; then
    exit 0
else
    exit 1
fi