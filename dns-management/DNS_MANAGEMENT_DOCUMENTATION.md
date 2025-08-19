# 🌐 DNS Management System Documentation
## leo.pvthostel.com Infrastructure

---

## 📋 Table of Contents

1. [System Overview](#system-overview)
2. [Quick Start](#quick-start)
3. [Components](#components)
4. [HubSpot Integration](#hubspot-integration)
5. [Common Tasks](#common-tasks)
6. [Monitoring & Health](#monitoring--health)
7. [Backup & Recovery](#backup--recovery)
8. [Templates](#templates)
9. [Troubleshooting](#troubleshooting)
10. [API Reference](#api-reference)

---

## 🎯 System Overview

The DNS Management System for leo.pvthostel.com provides:

- **Multi-Provider Support**: Cloudflare and Canspace.ca integration
- **Health Monitoring**: Continuous DNS health checks and propagation monitoring
- **Backup/Restore**: Automated backup with versioning and restore capabilities
- **Templates**: Pre-configured DNS setups for common services
- **HubSpot Integration**: Webhook server connectivity and form management
- **Automation**: Scripts for common DNS management tasks

### Current Status (2025-08-18)

| Component | Status | Details |
|-----------|--------|---------|
| DNS Provider | ✅ Active | Cloudflare (Primary) |
| A Records | ✅ Active | 104.26.10.172, 172.67.68.171, 104.26.11.172 |
| SSL Certificate | ⚠️ Issue | Needs verification |
| HTTP Response | ⚠️ 403 | Cloudflare protection active |
| Mail Records | ❌ Not configured | MX, SPF, DKIM need setup |
| HubSpot Webhook | ✅ Healthy | Server active on Railway |
| Forms | ✅ Accessible | All forms operational |

---

## 🚀 Quick Start

### Prerequisites

```bash
# Install required packages
pip3 install requests dnspython

# Set environment variables
export CLOUDFLARE_API_TOKEN="your-token"
export CANSPACE_USERNAME="your-username"
export CANSPACE_PASSWORD="your-password"
```

### Basic Commands

```bash
# Run interactive menu
./dns-automation.sh

# Check DNS health
python3 dns-health-monitor.py check

# Test HubSpot connection
python3 test-hubspot-connection.py all

# Create backup
python3 dns-backup-restore.py backup

# List DNS records
python3 dns-manager.py list
```

---

## 🔧 Components

### 1. DNS Manager (`dns-manager.py`)

Unified interface for managing DNS across providers.

**Features:**
- List records from all providers
- Sync records between providers
- Apply templates
- Bulk updates from JSON

**Usage:**
```bash
# List all records
python3 dns-manager.py list

# Sync from Cloudflare to Canspace
python3 dns-manager.py sync cloudflare canspace

# Apply Vercel template
python3 dns-manager.py template vercel

# Bulk update
python3 dns-manager.py bulk updates.json
```

### 2. Health Monitor (`dns-health-monitor.py`)

Monitors DNS health, propagation, and SSL status.

**Features:**
- DNS record verification
- Propagation checking
- SSL certificate monitoring
- HTTP response testing
- Mail configuration validation

**Usage:**
```bash
# Single health check
python3 dns-health-monitor.py check

# Continuous monitoring (1 hour interval)
python3 dns-health-monitor.py monitor 3600

# Check propagation
python3 dns-health-monitor.py propagation

# Check SSL
python3 dns-health-monitor.py ssl

# Check mail configuration
python3 dns-health-monitor.py mail
```

### 3. Backup & Restore (`dns-backup-restore.py`)

Automated backup system with versioning and restore capabilities.

**Features:**
- Multi-source backups (Cloudflare, Canspace, dig)
- Checksum verification
- Comparison between backups
- Dry-run restore option
- Duplicate cleanup

**Usage:**
```bash
# Create unified backup
python3 dns-backup-restore.py backup

# List backups from last 7 days
python3 dns-backup-restore.py list 7

# Verify backup integrity
python3 dns-backup-restore.py verify backup.json

# Compare two backups
python3 dns-backup-restore.py compare backup1.json backup2.json

# Restore (dry run)
python3 dns-backup-restore.py restore backup.json

# Restore (actual)
python3 dns-backup-restore.py restore backup.json --no-dry-run
```

### 4. Automation Script (`dns-automation.sh`)

Interactive shell script for common tasks.

**Features:**
- Interactive menu system
- Status display
- Health checks
- Propagation verification
- Mail testing
- Log management

**Menu Options:**
1. Show Current DNS Status
2. Run Health Check
3. Verify DNS Propagation
4. Setup Vercel DNS
5. Sync DNS Providers
6. Backup DNS Configuration
7. Test Mail Configuration
8. Apply Custom Updates
9. Monitor Continuously
10. Clean Old Files
11. Show Recent Logs

---

## 🔌 HubSpot Integration

### Webhook Server

**URL:** https://hubspot-webhook-server-production.up.railway.app

**Endpoints:**
- `/health` - Health check
- `/forms/{id}` - Form access
- `/api/webhooks/hubspot` - Webhook endpoint

### Testing Connection

```bash
# Test all HubSpot components
python3 test-hubspot-connection.py all

# Test specific components
python3 test-hubspot-connection.py health
python3 test-hubspot-connection.py forms
python3 test-hubspot-connection.py webhook
python3 test-hubspot-connection.py api
```

### Key Forms

| Form | ID | URL |
|------|----|----|
| Request for Exemption | 9b193440-b701-4000-8b3d-d864db623d09 | [Link](https://hubspot-webhook-server-production.up.railway.app/forms/9b193440-b701-4000-8b3d-d864db623d09) |
| Report an Incident | 30176de5-c571-4221-ac72-0050cd4b3efa | [Link](https://hubspot-webhook-server-production.up.railway.app/forms/30176de5-c571-4221-ac72-0050cd4b3efa) |
| Check-in Registration | 331de0e6-2455-4516-b914-d238435ee0f9 | [Link](https://hubspot-webhook-server-production.up.railway.app/forms/331de0e6-2455-4516-b914-d238435ee0f9) |

---

## 📝 Common Tasks

### Deploy to Vercel

```bash
# 1. Configure DNS for Vercel
./dns-automation.sh
# Select option 4: Setup Vercel DNS

# 2. Verify propagation
python3 dns-health-monitor.py propagation

# 3. Add domain in Vercel
vercel domains add leo.pvthostel.com

# 4. Deploy
vercel --prod
```

### Configure Email

```bash
# 1. Apply email template (Google Workspace)
python3 dns-manager.py template google-workspace

# 2. Verify mail records
python3 dns-health-monitor.py mail

# 3. Test email delivery
# Configure in Google Admin Console
```

### Add Subdomain

```bash
# Create API subdomain
cat > api-subdomain.json << EOF
[
  {
    "action": "create",
    "type": "CNAME",
    "name": "api.leo.pvthostel.com",
    "value": "api-server.railway.app",
    "ttl": 3600,
    "proxied": true
  }
]
EOF

python3 dns-manager.py bulk api-subdomain.json
```

### Migrate DNS Provider

```bash
# 1. Backup current configuration
python3 dns-backup-restore.py backup

# 2. Export from current provider
python3 cloudflare-dns.py export cf-export.json

# 3. Import to new provider
python3 canspace-dns.py import cf-export.json

# 4. Verify synchronization
python3 dns-manager.py compare
```

---

## 📊 Monitoring & Health

### Continuous Monitoring Setup

```bash
# Start monitoring daemon (checks every hour)
nohup python3 dns-health-monitor.py monitor 3600 > monitoring.log 2>&1 &

# View monitoring logs
tail -f monitoring.log

# Check for alerts
grep "ALERT" dns_alerts.log
```

### Health Check Metrics

- **A Records**: Primary domain IP addresses
- **CNAME Records**: Subdomain aliases
- **Propagation**: DNS server synchronization
- **SSL Certificate**: HTTPS security status
- **HTTP Response**: Website accessibility
- **Mail Records**: Email configuration

### Alert Configuration

Edit `dns-config.json`:

```json
{
  "monitoring": {
    "check_interval": 3600,
    "alert_email": "admin@leo.pvthostel.com",
    "expected_records": [
      {
        "type": "A",
        "name": "leo.pvthostel.com",
        "value": "76.76.21.21"
      }
    ]
  }
}
```

---

## 💾 Backup & Recovery

### Backup Strategy

**Automatic Backups:**
- Created before any restore operation
- Timestamped with checksum verification
- Latest symlinks for quick access

**Backup Locations:**
- Current: `/dns-management/backups/`
- Archive: `/dns-management/backups/archive/`
- Latest: `/dns-management/backups/latest_*.json`

### Recovery Procedures

#### Emergency Recovery

```bash
# 1. List available backups
python3 dns-backup-restore.py list

# 2. Verify backup integrity
python3 dns-backup-restore.py verify backups/latest_unified.json

# 3. Compare with current state
python3 dns-backup-restore.py backup
python3 dns-backup-restore.py compare backups/latest_unified.json current_backup.json

# 4. Restore (with dry run first)
python3 dns-backup-restore.py restore backups/latest_unified.json
python3 dns-backup-restore.py restore backups/latest_unified.json --no-dry-run
```

#### Scheduled Backups

Add to crontab:
```bash
# Daily backup at 2 AM
0 2 * * * cd /Volumes/DevOps/leo.pvthostel.com/dns-management && python3 dns-backup-restore.py backup

# Weekly archive on Sunday
0 3 * * 0 cd /Volumes/DevOps/leo.pvthostel.com/dns-management && python3 dns-backup-restore.py archive 30

# Monthly cleanup
0 4 1 * * cd /Volumes/DevOps/leo.pvthostel.com/dns-management && python3 dns-backup-restore.py cleanup
```

---

## 📚 Templates

### Available Templates

| Template | Purpose | Key Records |
|----------|---------|-------------|
| `vercel` | Vercel deployment | A: 76.76.21.21, CNAME: cname.vercel-dns.com |
| `github-pages` | GitHub Pages hosting | A: GitHub IPs, CNAME: username.github.io |
| `cloudflare-pages` | Cloudflare Pages | CNAME: project.pages.dev |
| `netlify` | Netlify hosting | A: 75.2.60.5, CNAME: site.netlify.app |
| `railway` | Railway deployment | CNAME: app.up.railway.app |
| `google-workspace` | Google email | MX: Google servers, SPF, DKIM |
| `office365` | Microsoft email | MX: Outlook servers, SPF, DKIM |
| `wordpress` | WordPress hosting | A: Server IP, MX: Mail server |
| `shopify` | E-commerce | A: 23.227.38.65, CNAME: shops.myshopify.com |

### Custom Template Creation

Edit `dns-templates.json`:

```json
{
  "templates": {
    "custom-service": {
      "name": "Custom Service",
      "description": "Your custom DNS configuration",
      "records": [
        {
          "type": "A",
          "name": "@",
          "value": "192.168.1.1",
          "ttl": 3600
        }
      ],
      "notes": [
        "Configuration notes"
      ]
    }
  }
}
```

---

## 🔧 Troubleshooting

### Common Issues

#### DNS Not Propagating

```bash
# Check current propagation status
python3 dns-health-monitor.py propagation

# Verify with multiple DNS servers
dig @8.8.8.8 leo.pvthostel.com
dig @1.1.1.1 leo.pvthostel.com
dig @208.67.222.222 leo.pvthostel.com

# Clear local DNS cache (macOS)
sudo dscacheutil -flushcache
```

#### SSL Certificate Issues

```bash
# Check certificate details
openssl s_client -connect leo.pvthostel.com:443 -servername leo.pvthostel.com

# Verify SSL status
python3 dns-health-monitor.py ssl

# Force SSL renewal (if using Cloudflare)
# Enable "Full (strict)" SSL mode in Cloudflare dashboard
```

#### 403 Forbidden Error

This typically indicates Cloudflare protection is active:
1. Check Cloudflare security settings
2. Verify firewall rules
3. Check rate limiting settings
4. Review IP access rules

#### Mail Not Working

```bash
# Check MX records
dig MX leo.pvthostel.com

# Verify SPF
dig TXT leo.pvthostel.com | grep spf

# Check DMARC
dig TXT _dmarc.leo.pvthostel.com

# Apply mail template
python3 dns-manager.py template google-workspace
```

#### HubSpot Connection Failed

```bash
# Test webhook server
curl https://hubspot-webhook-server-production.up.railway.app/health

# Check form accessibility
python3 test-hubspot-connection.py forms

# Verify API key (if using)
export HUBSPOT_API_KEY="your-key"
python3 test-hubspot-connection.py api
```

---

## 📖 API Reference

### CloudflareDNS Class

```python
from cloudflare_dns import CloudflareDNS

# Initialize
cf = CloudflareDNS(api_token, zone_id=None)

# List records
records = cf.list_dns_records(record_type="A")

# Create record
cf.create_dns_record("A", "api.leo.pvthostel.com", "192.168.1.1")

# Update or create
cf.update_or_create("CNAME", "www", "leo.pvthostel.com")

# Delete record
cf.delete_dns_record(record_id)
```

### CanspaceDNS Class

```python
from canspace_dns import CanspaceDNS

# Initialize
cs = CanspaceDNS(username, password, "leo.pvthostel.com")

# List records
records = cs.list_dns_records()

# Create record
cs.create_dns_record("A", "api", "192.168.1.1")

# Delete record
cs.delete_dns_record(line_number)
```

### DNSHealthMonitor Class

```python
from dns_health_monitor import DNSHealthMonitor

# Initialize
monitor = DNSHealthMonitor("leo.pvthostel.com")

# Run health check
results = monitor.run_health_check()

# Check specific record
values = monitor.check_dns_record("A", "leo.pvthostel.com")

# Check propagation
status = monitor.check_propagation("A", "leo.pvthostel.com", "76.76.21.21")

# Monitor continuously
monitor.monitor_continuous(interval=3600)
```

### DNSBackupRestore Class

```python
from dns_backup_restore import DNSBackupRestore

# Initialize
backup = DNSBackupRestore("leo.pvthostel.com")

# Create backup
data = backup.create_unified_backup()
backup.save_backup(data)

# List backups
backups = backup.list_backups(days=30)

# Verify backup
is_valid = backup.verify_backup("backup.json")

# Restore
backup.restore_backup("backup.json", dry_run=False)
```

---

## 📅 Maintenance Schedule

### Daily Tasks
- Health check monitoring
- Propagation verification
- Alert review

### Weekly Tasks
- Backup creation
- Log rotation
- Performance review

### Monthly Tasks
- Backup archival
- Duplicate cleanup
- Security audit
- Template updates

### Quarterly Tasks
- Provider comparison
- Cost optimization
- Documentation update
- Disaster recovery test

---

## 🔐 Security Best Practices

1. **API Token Management**
   - Never commit tokens to git
   - Use environment variables
   - Rotate tokens regularly
   - Limit token permissions

2. **Backup Security**
   - Encrypt sensitive backups
   - Store offsite copies
   - Test restore procedures
   - Verify checksums

3. **Access Control**
   - Use 2FA for DNS providers
   - Limit API permissions
   - Monitor access logs
   - Regular security audits

4. **DNS Security**
   - Enable DNSSEC where possible
   - Use CAA records
   - Implement rate limiting
   - Monitor for DNS hijacking

---

## 📞 Support & Contact

### Internal Support
- **DNS Management**: dns-management@leo.pvthostel.com
- **Emergency**: +1-XXX-XXX-XXXX

### Provider Support
- **Cloudflare**: https://dash.cloudflare.com/support
- **Canspace**: https://www.canspace.ca/support
- **Railway (HubSpot)**: https://railway.app/support

### Documentation
- **This Guide**: `/dns-management/DNS_MANAGEMENT_DOCUMENTATION.md`
- **Scripts**: `/dns-management/`
- **Backups**: `/dns-management/backups/`
- **Logs**: `/dns-management/*.log`

---

## 📈 Future Enhancements

- [ ] Implement DNSSEC
- [ ] Add more provider integrations
- [ ] Create web dashboard
- [ ] Implement email notifications
- [ ] Add GraphQL API
- [ ] Create mobile app
- [ ] Implement AI-based optimization
- [ ] Add cost tracking
- [ ] Create terraform modules
- [ ] Implement zero-downtime migrations

---

*Last Updated: 2025-08-18*
*Version: 1.0.0*
*Maintained by: DevOps Team*