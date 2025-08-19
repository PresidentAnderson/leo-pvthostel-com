# DNS Management System for leo.pvthostel.com

Programmatic DNS management across multiple providers (Cloudflare and Canspace.ca).

## 🚀 Features

- **Multi-Provider Support**: Manage DNS on both Cloudflare and Canspace.ca
- **Unified Interface**: Single command to manage records across providers
- **Synchronization**: Keep DNS records synced between providers
- **Templates**: Quick setup for common configurations (Vercel, GitHub Pages, Email)
- **Bulk Updates**: Apply multiple DNS changes from JSON files
- **Comparison**: Compare records across providers to identify differences
- **Backup/Restore**: Export and import DNS configurations

## 📋 Prerequisites

```bash
pip install requests
```

## ⚙️ Configuration

### 1. Set Environment Variables

```bash
# Cloudflare
export CLOUDFLARE_API_TOKEN="your_api_token"
export CLOUDFLARE_ZONE_ID="optional_zone_id"

# Canspace.ca
export CANSPACE_USERNAME="your_username"
export CANSPACE_PASSWORD="your_password"
```

### 2. Or Use .env File

```bash
cp .env.example .env
# Edit .env with your credentials
```

## 🔧 Usage

### Unified DNS Manager (Recommended)

```bash
# List all DNS records
python dns-manager.py list

# Compare records between providers
python dns-manager.py compare

# Sync from Cloudflare to Canspace
python dns-manager.py sync cloudflare canspace

# Apply Vercel template
python dns-manager.py template vercel

# Bulk update from file
python dns-manager.py bulk updates.json
```

### Provider-Specific Commands

#### Cloudflare

```bash
# List records
python cloudflare-dns.py list

# Create A record
python cloudflare-dns.py create A api.leo.pvthostel.com 192.168.1.1

# Configure for Vercel
python cloudflare-dns.py vercel

# Export configuration
python cloudflare-dns.py export backup.json
```

#### Canspace.ca

```bash
# List records
python canspace-dns.py list

# Create CNAME record
python canspace-dns.py create CNAME www leo.pvthostel.com

# Configure for Vercel
python canspace-dns.py vercel

# Export configuration
python canspace-dns.py export backup.json
```

## 📚 Templates

### Vercel Deployment
```bash
python dns-manager.py template vercel
```
Sets up:
- A record pointing to Vercel IP (76.76.21.21)
- CNAME for www pointing to cname.vercel-dns.com

### GitHub Pages
```bash
python dns-manager.py template github-pages
```
Sets up:
- A records for GitHub Pages IPs
- CNAME for www pointing to username.github.io

### Google Workspace Email
```bash
python dns-manager.py template google-workspace
```
Sets up:
- MX records for Google mail servers
- SPF record for email authentication

### Office 365 Email
```bash
python dns-manager.py template office365
```
Sets up:
- MX record for Outlook
- SPF record for email authentication

## 📝 Bulk Updates

Create a JSON file with your updates:

```json
[
  {
    "action": "create",
    "type": "A",
    "name": "api.leo.pvthostel.com",
    "value": "192.168.1.100",
    "ttl": 3600,
    "proxied": true
  },
  {
    "action": "delete",
    "name": "old.leo.pvthostel.com",
    "type": "A"
  }
]
```

Apply the updates:
```bash
python dns-manager.py bulk updates.json
```

## 🔄 Synchronization

Keep DNS records synchronized between providers:

```bash
# Sync from Cloudflare (primary) to all others
python dns-manager.py sync

# Sync from Canspace to Cloudflare
python dns-manager.py sync canspace cloudflare

# Compare before syncing
python dns-manager.py compare
```

## 📊 DNS Record Types Supported

- **A**: IPv4 address
- **AAAA**: IPv6 address
- **CNAME**: Canonical name (alias)
- **MX**: Mail exchange
- **TXT**: Text records (SPF, DKIM, verification)
- **SRV**: Service records

## 🔒 Security Notes

1. **API Tokens**: Never commit API tokens to git
2. **Cloudflare Token**: Create with DNS:Edit permissions only
3. **Canspace**: Use API-specific password if available
4. **Backup**: Always export current config before major changes

## 📁 File Structure

```
dns-management/
├── cloudflare-dns.py    # Cloudflare-specific operations
├── canspace-dns.py      # Canspace-specific operations
├── dns-manager.py       # Unified management interface
├── dns-config.json      # Configuration and templates
├── .env.example         # Environment variables template
└── README.md           # This file
```

## 🚨 Common Tasks

### Point Domain to Vercel
```bash
python dns-manager.py template vercel
```

### Add Subdomain
```bash
python cloudflare-dns.py create A api.leo.pvthostel.com 192.168.1.1
python canspace-dns.py create A api 192.168.1.1
```

### Update Existing Record
```bash
python cloudflare-dns.py update leo.pvthostel.com 76.76.21.21
```

### Backup All Records
```bash
python cloudflare-dns.py export cloudflare-backup.json
python canspace-dns.py export canspace-backup.json
```

### Restore from Backup
```bash
python cloudflare-dns.py import cloudflare-backup.json
```

## 🐛 Troubleshooting

### Cloudflare Issues
- Verify API token has DNS:Edit permissions
- Check zone ID if auto-detection fails
- Ensure domain is active on Cloudflare

### Canspace Issues
- Enable API access in cPanel
- Check if using correct cPanel port (2083)
- Verify username/password combination

### Sync Issues
- Run `compare` first to see differences
- Check for record type compatibility
- Verify both providers are properly configured

## 📞 Support

For issues specific to:
- **Cloudflare**: https://dash.cloudflare.com/support
- **Canspace**: https://www.canspace.ca/support
- **This tool**: Create an issue in the repository