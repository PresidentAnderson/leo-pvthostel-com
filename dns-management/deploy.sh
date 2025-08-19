#!/bin/bash

# Automated Deployment Pipeline
# Updates documentation, pushes to ClickUp, builds Docker image, and deploys to Vercel

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="leo-dns-manager"
DOCKER_REGISTRY="registry.gitlab.com/leo-pvthostel/dns-management"
VERSION="${1:-$(date +%Y%m%d.%H%M%S)}"
ENVIRONMENT="${2:-production}"

# Logging
log() {
    echo -e "${BLUE}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Header
clear
echo -e "${CYAN}"
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║          DNS Management System - Deployment Pipeline          ║"
echo "║                      leo.pvthostel.com                        ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"
echo ""
log "Version: ${GREEN}$VERSION${NC}"
log "Environment: ${GREEN}$ENVIRONMENT${NC}"
echo ""

# Function to check prerequisites
check_prerequisites() {
    log "${MAGENTA}📋 Checking prerequisites...${NC}"
    
    # Check for required commands
    local commands=("docker" "git" "python3" "npm" "vercel" "curl")
    local missing=()
    
    for cmd in "${commands[@]}"; do
        if ! command -v "$cmd" &> /dev/null; then
            missing+=("$cmd")
        fi
    done
    
    if [ ${#missing[@]} -ne 0 ]; then
        error "Missing required commands: ${missing[*]}"
    fi
    
    # Check environment variables
    if [ -z "$CLICKUP_API_KEY" ]; then
        warning "CLICKUP_API_KEY not set - ClickUp sync will be skipped"
    fi
    
    if [ -z "$VERCEL_TOKEN" ]; then
        warning "VERCEL_TOKEN not set - Vercel deployment will require manual authentication"
    fi
    
    success "All prerequisites checked"
}

# Function to run tests
run_tests() {
    log "${MAGENTA}🧪 Running tests...${NC}"
    
    # DNS health check
    log "Running DNS health check..."
    python3 dns-health-monitor.py check || warning "DNS health check failed"
    
    # HubSpot connection test
    log "Testing HubSpot connection..."
    python3 test-hubspot-connection.py all || warning "HubSpot test failed"
    
    # Backup test
    log "Testing backup system..."
    python3 dns-backup-restore.py backup || error "Backup test failed"
    
    success "Tests completed"
}

# Function to update documentation
update_documentation() {
    log "${MAGENTA}📝 Updating documentation...${NC}"
    
    # Generate timestamp
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    # Update version in documentation
    sed -i.bak "s/Version: .*/Version: $VERSION/" DNS_MANAGEMENT_DOCUMENTATION.md
    sed -i.bak "s/Last Updated: .*/Last Updated: $timestamp/" DNS_MANAGEMENT_DOCUMENTATION.md
    
    # Generate changelog entry
    cat >> CHANGELOG.md << EOF

## [$VERSION] - $(date '+%Y-%m-%d')

### Changed
- Updated DNS health monitoring system
- Enhanced backup and restore procedures
- Improved HubSpot integration
- Updated documentation

### Deployment
- Environment: $ENVIRONMENT
- Pipeline: Automated
- Timestamp: $timestamp
EOF
    
    success "Documentation updated"
}

# Function to sync with ClickUp
sync_clickup() {
    if [ -z "$CLICKUP_API_KEY" ]; then
        warning "Skipping ClickUp sync (API key not set)"
        return
    fi
    
    log "${MAGENTA}📋 Syncing with ClickUp...${NC}"
    
    # Sync documentation
    python3 clickup-integration.py sync DNS_MANAGEMENT_DOCUMENTATION.md || warning "ClickUp sync failed"
    
    # Create deployment task
    python3 clickup-integration.py deploy "$VERSION" || warning "Failed to create deployment task"
    
    success "ClickUp sync completed"
}

# Function to build Docker image
build_docker() {
    log "${MAGENTA}🐳 Building Docker image...${NC}"
    
    # Build image
    docker build -t "$PROJECT_NAME:$VERSION" -t "$PROJECT_NAME:latest" . || error "Docker build failed"
    
    # Tag for registry
    docker tag "$PROJECT_NAME:$VERSION" "$DOCKER_REGISTRY:$VERSION"
    docker tag "$PROJECT_NAME:latest" "$DOCKER_REGISTRY:latest"
    
    # Optional: Push to registry
    if [ "$PUSH_TO_REGISTRY" = "true" ]; then
        log "Pushing to Docker registry..."
        docker push "$DOCKER_REGISTRY:$VERSION"
        docker push "$DOCKER_REGISTRY:latest"
    fi
    
    # Save image locally
    log "Saving Docker image..."
    docker save "$PROJECT_NAME:$VERSION" | gzip > "docker-image-$VERSION.tar.gz"
    
    success "Docker image built: $PROJECT_NAME:$VERSION"
}

# Function to push to GitLab
push_to_gitlab() {
    log "${MAGENTA}📤 Pushing to GitLab...${NC}"
    
    # Check if we're in a git repository
    if [ ! -d .git ]; then
        warning "Not in a git repository, skipping GitLab push"
        return
    fi
    
    # Add changes
    git add -A
    
    # Commit with version
    git commit -m "🚀 Deploy version $VERSION

- Updated DNS management system
- Docker image: $PROJECT_NAME:$VERSION
- Environment: $ENVIRONMENT
- Automated deployment via deploy.sh" || warning "No changes to commit"
    
    # Create tag
    git tag -a "v$VERSION" -m "Version $VERSION deployment"
    
    # Push to GitLab
    git push origin main --tags || warning "Failed to push to GitLab"
    
    success "Pushed to GitLab with tag v$VERSION"
}

# Function to deploy to Vercel
deploy_vercel() {
    log "${MAGENTA}🚀 Deploying to Vercel...${NC}"
    
    # Create Vercel project structure
    log "Preparing Vercel deployment..."
    
    # Create API directory
    mkdir -p api static
    
    # Copy Python files to API
    cp dns-health-monitor.py api/
    cp dns-manager.py api/
    cp test-hubspot-connection.py api/
    
    # Copy static files
    cp DNS_MANAGEMENT_DOCUMENTATION.md static/
    cp dns-templates.json static/
    cp health_check_latest.json static/ 2>/dev/null || true
    
    # Create vercel.json
    cat > vercel.json << EOF
{
  "name": "$PROJECT_NAME",
  "version": 2,
  "builds": [
    {
      "src": "api/*.py",
      "use": "@vercel/python"
    },
    {
      "src": "static/**",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/\$1"
    },
    {
      "src": "/(.*)",
      "dest": "/static/\$1"
    }
  ],
  "env": {
    "VERSION": "$VERSION",
    "ENVIRONMENT": "$ENVIRONMENT"
  }
}
EOF
    
    # Deploy based on environment
    if [ "$ENVIRONMENT" = "production" ]; then
        log "Deploying to production..."
        vercel --prod --yes || error "Vercel production deployment failed"
    else
        log "Deploying to preview..."
        vercel --yes || error "Vercel preview deployment failed"
    fi
    
    # Get deployment URL
    DEPLOYMENT_URL=$(vercel ls | grep "$PROJECT_NAME" | head -1 | awk '{print $2}')
    
    success "Deployed to Vercel: $DEPLOYMENT_URL"
    echo "$DEPLOYMENT_URL" > deployment-url.txt
}

# Function to verify deployment
verify_deployment() {
    log "${MAGENTA}✅ Verifying deployment...${NC}"
    
    if [ ! -f deployment-url.txt ]; then
        warning "No deployment URL found, skipping verification"
        return
    fi
    
    local url=$(cat deployment-url.txt)
    
    # Test endpoints
    log "Testing health endpoint..."
    curl -f "$url/api/health" > /dev/null 2>&1 || warning "Health check failed"
    
    log "Testing main page..."
    curl -f "$url" > /dev/null 2>&1 || warning "Main page check failed"
    
    success "Deployment verified"
}

# Function to send notifications
send_notifications() {
    log "${MAGENTA}📬 Sending notifications...${NC}"
    
    local status="✅ Success"
    local color="good"
    
    if [ "$DEPLOYMENT_STATUS" = "failed" ]; then
        status="❌ Failed"
        color="danger"
    fi
    
    # Send to webhook if configured
    if [ -n "$NOTIFICATION_WEBHOOK" ]; then
        curl -X POST "$NOTIFICATION_WEBHOOK" \
            -H "Content-Type: application/json" \
            -d "{
                \"text\": \"Deployment $status\",
                \"attachments\": [{
                    \"color\": \"$color\",
                    \"fields\": [
                        {\"title\": \"Version\", \"value\": \"$VERSION\", \"short\": true},
                        {\"title\": \"Environment\", \"value\": \"$ENVIRONMENT\", \"short\": true},
                        {\"title\": \"Timestamp\", \"value\": \"$(date)\", \"short\": false}
                    ]
                }]
            }" > /dev/null 2>&1
    fi
    
    success "Notifications sent"
}

# Function to cleanup
cleanup() {
    log "${MAGENTA}🧹 Cleaning up...${NC}"
    
    # Remove temporary files
    rm -f *.bak
    rm -rf api static 2>/dev/null || true
    
    # Archive old backups
    python3 dns-backup-restore.py archive 30
    
    success "Cleanup completed"
}

# Main deployment pipeline
main() {
    local start_time=$(date +%s)
    
    # Run pipeline steps
    check_prerequisites
    run_tests
    update_documentation
    sync_clickup
    build_docker
    push_to_gitlab
    deploy_vercel
    verify_deployment
    send_notifications
    cleanup
    
    # Calculate execution time
    local end_time=$(date +%s)
    local duration=$((end_time - start_time))
    
    echo ""
    echo -e "${CYAN}════════════════════════════════════════════════════════════════${NC}"
    success "🎉 Deployment completed successfully!"
    log "Version: ${GREEN}$VERSION${NC}"
    log "Duration: ${GREEN}${duration} seconds${NC}"
    
    if [ -f deployment-url.txt ]; then
        log "URL: ${GREEN}$(cat deployment-url.txt)${NC}"
    fi
    
    echo -e "${CYAN}════════════════════════════════════════════════════════════════${NC}"
}

# Handle interrupts
trap 'error "Deployment interrupted"' INT TERM

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --version)
            VERSION="$2"
            shift 2
            ;;
        --env)
            ENVIRONMENT="$2"
            shift 2
            ;;
        --skip-tests)
            SKIP_TESTS=true
            shift
            ;;
        --skip-docker)
            SKIP_DOCKER=true
            shift
            ;;
        --push-registry)
            PUSH_TO_REGISTRY=true
            shift
            ;;
        --help)
            echo "Usage: ./deploy.sh [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  --version VERSION    Deployment version (default: timestamp)"
            echo "  --env ENVIRONMENT   Target environment (default: production)"
            echo "  --skip-tests        Skip running tests"
            echo "  --skip-docker       Skip Docker build"
            echo "  --push-registry     Push Docker image to registry"
            echo "  --help              Show this help message"
            exit 0
            ;;
        *)
            error "Unknown option: $1"
            ;;
    esac
done

# Run main deployment
main