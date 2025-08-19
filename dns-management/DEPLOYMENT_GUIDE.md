# 🚀 Complete Deployment Guide
## DNS Management System - Full CI/CD Pipeline

---

## 📋 Overview

This guide covers the complete deployment pipeline:
1. **Documentation Update** → ClickUp sync
2. **Docker Build** → Container creation
3. **GitLab Push** → CI/CD trigger
4. **Vercel Deploy** → Production deployment

---

## 🎯 Quick Deploy

### One-Command Deployment

```bash
# Full automated deployment
./deploy.sh --version 1.0.1 --env production

# Or use npm
npm run pipeline
```

This single command will:
- ✅ Run all tests
- ✅ Update documentation
- ✅ Sync to ClickUp
- ✅ Build Docker image
- ✅ Push to GitLab
- ✅ Deploy to Vercel
- ✅ Verify deployment

---

## 📝 Step-by-Step Manual Deployment

### 1. Update Documentation

```bash
# Edit documentation
vim DNS_MANAGEMENT_DOCUMENTATION.md

# Update version
sed -i "s/Version: .*/Version: 1.0.1/" DNS_MANAGEMENT_DOCUMENTATION.md
```

### 2. Sync to ClickUp

```bash
# Set API key
export CLICKUP_API_KEY="your-key"

# Sync documentation
python3 clickup-integration.py sync DNS_MANAGEMENT_DOCUMENTATION.md

# Create deployment task
python3 clickup-integration.py deploy 1.0.1
```

### 3. Build Docker Image

```bash
# Build image
docker build -t leo-dns-manager:1.0.1 .

# Test locally
docker run -it --rm \
  -e CLOUDFLARE_API_TOKEN="$CLOUDFLARE_API_TOKEN" \
  -e DOMAIN="leo.pvthostel.com" \
  leo-dns-manager:1.0.1 \
  python3 dns-health-monitor.py check

# Using docker-compose
docker-compose up -d
```

### 4. Push to GitLab

```bash
# Add changes
git add -A

# Commit
git commit -m "🚀 Deploy v1.0.1 - Enhanced DNS management"

# Tag release
git tag -a v1.0.1 -m "Version 1.0.1"

# Push
git push origin main --tags
```

### 5. Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Login (first time)
vercel login

# Deploy to production
vercel --prod

# Or deploy preview
vercel
```

---

## 🔧 Configuration

### Environment Variables

Create `.env` file:

```bash
# DNS Providers
CLOUDFLARE_API_TOKEN=your-cloudflare-token
CANSPACE_USERNAME=your-canspace-username
CANSPACE_PASSWORD=your-canspace-password

# Integrations
CLICKUP_API_KEY=your-clickup-key
HUBSPOT_API_KEY=your-hubspot-key
VERCEL_TOKEN=your-vercel-token

# GitLab
CI_REGISTRY_USER=your-gitlab-username
CI_REGISTRY_PASSWORD=your-gitlab-token

# Notifications
NOTIFICATION_WEBHOOK=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
```

### Vercel Setup

```bash
# Link project
vercel link

# Set environment variables
vercel env add DOMAIN production
vercel env add CLOUDFLARE_API_TOKEN production
vercel env add HUBSPOT_WEBHOOK_URL production

# Set secrets
vercel secrets add cloudflare_api_token "your-token"
vercel secrets add clickup_api_key "your-key"
```

### GitLab CI/CD Variables

In GitLab project settings → CI/CD → Variables:

- `CLOUDFLARE_API_TOKEN` - Protected, Masked
- `CLICKUP_API_KEY` - Protected, Masked
- `VERCEL_TOKEN` - Protected, Masked
- `DOCKER_REGISTRY_PASSWORD` - Protected, Masked

---

## 🐳 Docker Operations

### Build and Run

```bash
# Build
docker build -t leo-dns-manager .

# Run interactive
docker run -it --rm leo-dns-manager

# Run specific command
docker run --rm leo-dns-manager python3 dns-health-monitor.py check

# Run with compose
docker-compose up -d

# View logs
docker-compose logs -f dns-monitor

# Stop
docker-compose down
```

### Push to Registry

```bash
# GitLab Registry
docker login registry.gitlab.com
docker tag leo-dns-manager registry.gitlab.com/leo-pvthostel/dns-management:latest
docker push registry.gitlab.com/leo-pvthostel/dns-management:latest

# Docker Hub
docker tag leo-dns-manager yourusername/leo-dns-manager:latest
docker push yourusername/leo-dns-manager:latest
```

---

## 📊 GitLab CI/CD Pipeline

### Pipeline Stages

1. **Test** - Run health checks and tests
2. **Build** - Create Docker image
3. **Documentation** - Sync to ClickUp
4. **Deploy** - Deploy to Vercel
5. **Verify** - Post-deployment checks

### Manual Trigger

```bash
# Trigger pipeline via API
curl -X POST \
  -F token=YOUR_TRIGGER_TOKEN \
  -F ref=main \
  -F "variables[DEPLOY_ENV]=production" \
  https://gitlab.com/api/v4/projects/PROJECT_ID/trigger/pipeline
```

### View Pipeline

```bash
# Get pipeline status
curl --header "PRIVATE-TOKEN: your-token" \
  "https://gitlab.com/api/v4/projects/PROJECT_ID/pipelines"
```

---

## 🌐 Vercel Deployment

### Project Structure

```
dns-management/
├── api/               # Serverless functions
│   ├── health.py
│   ├── dns-list.py
│   └── clickup-sync.py
├── public/           # Static files
│   ├── index.html
│   └── documentation.html
├── vercel.json       # Vercel configuration
└── package.json      # NPM scripts
```

### API Endpoints

After deployment, these endpoints are available:

- `https://your-app.vercel.app/api/health` - Health check
- `https://your-app.vercel.app/api/dns/list` - List DNS records
- `https://your-app.vercel.app/api/dns/check` - Check DNS status
- `https://your-app.vercel.app/api/hubspot/test` - Test HubSpot
- `https://your-app.vercel.app/api/backup` - Trigger backup
- `https://your-app.vercel.app/docs` - Documentation

### Deployment Commands

```bash
# Deploy production
vercel --prod

# Deploy preview
vercel

# List deployments
vercel ls

# Inspect deployment
vercel inspect your-deployment-url

# View logs
vercel logs your-deployment-url

# Remove deployment
vercel rm your-deployment-url
```

---

## ✅ Verification

### Post-Deployment Checks

```bash
# 1. Check health endpoint
curl https://leo-dns-manager.vercel.app/api/health

# 2. Verify DNS records
curl https://leo-dns-manager.vercel.app/api/dns/list

# 3. Test HubSpot connection
curl https://leo-dns-manager.vercel.app/api/hubspot/test

# 4. Check documentation
curl https://leo-dns-manager.vercel.app/docs

# 5. Run full verification
./deploy.sh --verify-only
```

### Monitoring

```bash
# View Vercel analytics
vercel analytics

# Check GitLab pipeline
open https://gitlab.com/leo-pvthostel/dns-management/-/pipelines

# Monitor Docker containers
docker-compose ps
docker-compose logs -f

# Check ClickUp tasks
python3 clickup-integration.py list
```

---

## 🔄 Rollback Procedures

### Vercel Rollback

```bash
# List deployments
vercel ls

# Rollback to previous
vercel rollback [deployment-url]

# Or use alias
vercel alias set [old-deployment-url] leo-dns-manager.vercel.app
```

### Docker Rollback

```bash
# List images
docker images leo-dns-manager

# Run previous version
docker run leo-dns-manager:1.0.0

# Update compose
sed -i 's/:latest/:1.0.0/' docker-compose.yml
docker-compose up -d
```

### GitLab Rollback

```bash
# Revert commit
git revert HEAD
git push origin main

# Or reset to tag
git reset --hard v1.0.0
git push --force origin main
```

---

## 🚨 Troubleshooting

### Common Issues

#### ClickUp Sync Failed
```bash
# Check API key
echo $CLICKUP_API_KEY

# Test connection
python3 clickup-integration.py test

# Debug mode
CLICKUP_DEBUG=true python3 clickup-integration.py sync
```

#### Docker Build Failed
```bash
# Clean build
docker build --no-cache -t leo-dns-manager .

# Check logs
docker logs dns-manager

# Interactive debug
docker run -it --entrypoint /bin/bash leo-dns-manager
```

#### Vercel Deploy Failed
```bash
# Check logs
vercel logs

# Verify configuration
vercel env ls

# Force deploy
vercel --force

# Clear cache
vercel --no-cache
```

#### GitLab Pipeline Failed
```bash
# Retry job
curl -X POST --header "PRIVATE-TOKEN: your-token" \
  "https://gitlab.com/api/v4/projects/PROJECT_ID/jobs/JOB_ID/retry"

# Check runner
gitlab-runner verify

# View logs
gitlab-runner --debug run
```

---

## 📈 Performance Optimization

### Docker Optimization

```dockerfile
# Multi-stage build (already implemented)
# Use alpine images when possible
# Minimize layers
# Use .dockerignore
```

### Vercel Optimization

```json
{
  "functions": {
    "api/**/*.py": {
      "memory": 1024,
      "maxDuration": 30
    }
  },
  "regions": ["iad1"]
}
```

### GitLab CI Optimization

```yaml
# Use cache
cache:
  paths:
    - .cache/pip
    - node_modules/

# Parallel jobs
test:
  parallel: 3

# Only run on changes
only:
  changes:
    - "*.py"
    - "Dockerfile"
```

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [GitLab CI/CD](https://docs.gitlab.com/ee/ci/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [ClickUp API](https://clickup.com/api)

---

## 🎯 Quick Reference

### Essential Commands

```bash
# Full deployment
./deploy.sh

# Test only
npm test

# Build Docker
npm run docker:build

# Deploy to Vercel
npm run deploy

# Backup DNS
npm run backup

# Sync ClickUp
npm run sync:clickup

# View logs
docker-compose logs -f
vercel logs
```

### Health Check URLs

- Local: http://localhost:8000/api/health
- Docker: http://localhost:3000/api/health
- Vercel: https://leo-dns-manager.vercel.app/api/health
- HubSpot: https://hubspot-webhook-server-production.up.railway.app/health

---

*Last Updated: 2025-08-18*
*Version: 1.0.0*
*Maintained by: DevOps Team*