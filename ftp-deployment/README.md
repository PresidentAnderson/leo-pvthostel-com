# FTP Deployment System for leo.pvthostel.com

Complete FTP deployment and management system for web service hosting.

## 🚀 Features

- **FTP Deployment**: Deploy websites via FTP/FTPS
- **Auto-Sync**: Automatically sync local changes to FTP server
- **DNS Management**: Configure FTP subdomains
- **Account Management**: Create and manage FTP accounts
- **Multiple Profiles**: Support for production, staging, and backup
- **Security**: TLS/SSL support, password generation, quota management

## 📁 Components

### 1. FTP Deployment (`ftp-deploy.py`)
Main deployment script with features:
- Upload files to FTP server
- Ignore patterns for excluded files
- Progress tracking and error handling
- Clean deployment option
- Multiple deployment profiles

### 2. FTP Auto-Sync (`ftp-auto-sync.sh`)
Automated synchronization:
- Watch for file changes
- Continuous sync at intervals
- System service integration
- macOS and Linux support

### 3. FTP Subdomain Setup (`setup-ftp-subdomain.py`)
DNS configuration for FTP access:
- Creates FTP subdomains (ftp.*, files.*, upload.*, cdn.*)
- Configures DNS records via Cloudflare/Canspace
- Generates server configurations (nginx, vsftpd)

### 4. Account Management (`manage-ftp-accounts.py`)
FTP account administration:
- Create/delete FTP accounts
- Password reset functionality
- Quota management
- FileZilla configuration export

## 🔧 Installation

### Prerequisites
```bash
# Python packages
pip install requests

# macOS
brew install lftp fswatch jq

# Linux
sudo apt-get install lftp inotify-tools jq vsftpd
```

### Configuration

1. **Set Environment Variables**
```bash
# FTP Credentials
export FTP_HOST="ftp.leo.pvthostel.com"
export FTP_USERNAME="your_username"
export FTP_PASSWORD="your_password"

# DNS Providers
export CLOUDFLARE_API_TOKEN="your_token"
export CANSPACE_USERNAME="cpanel_user"
export CANSPACE_PASSWORD="cpanel_pass"

# Server Settings
export SERVER_IP="your_server_ip"
```

2. **Edit Configuration Files**
```bash
# Edit FTP settings
vim ftp-config.json

# Configure accounts
vim ftp-accounts.json
```

## 📋 Usage

### Deploy Website
```bash
# One-time deployment
python ftp-deploy.py deploy

# Clean deployment (removes old files first)
python ftp-deploy.py clean-deploy

# Test connection
python ftp-deploy.py test
```

### Auto-Sync Setup
```bash
# One-time sync
./ftp-auto-sync.sh sync

# Watch for changes
./ftp-auto-sync.sh watch

# Continuous sync every 60 seconds
./ftp-auto-sync.sh continuous

# Create system service
./ftp-auto-sync.sh service
```

### Configure FTP Subdomains
```bash
# Interactive setup
python setup-ftp-subdomain.py

# This will:
# - Create DNS A records for ftp.leo.pvthostel.com
# - Create CNAME for secure-ftp.leo.pvthostel.com
# - Generate nginx and vsftpd configurations
```

### Manage FTP Accounts
```bash
# List all accounts
python manage-ftp-accounts.py list

# Create new account
python manage-ftp-accounts.py create john

# Reset password
python manage-ftp-accounts.py reset john newpass123

# Delete account
python manage-ftp-accounts.py delete john

# Generate FileZilla config
python manage-ftp-accounts.py filezilla john
```

## 🌐 FTP Access Points

After setup, FTP will be accessible at:

### Standard FTP
- `ftp://ftp.leo.pvthostel.com` (Port 21)
- `ftp://files.leo.pvthostel.com` (Port 21)
- `ftp://upload.leo.pvthostel.com` (Port 21)

### Secure FTP (FTPS)
- `ftps://secure-ftp.leo.pvthostel.com:990`
- TLS/SSL encrypted connection

### Web Interface
- `https://files.leo.pvthostel.com` (File browser)
- `https://cdn.leo.pvthostel.com` (Static file CDN)

## 📁 Directory Structure

```
ftp-deployment/
├── ftp-deploy.py           # Main deployment script
├── ftp-auto-sync.sh        # Auto-sync script
├── setup-ftp-subdomain.py  # DNS configuration
├── manage-ftp-accounts.py  # Account management
├── ftp-config.json         # FTP configuration
├── ftp-accounts.json       # Account database
├── vsftpd.conf            # FTP server config
├── nginx-ftp-web.conf     # Web interface config
└── README.md              # This file
```

## 🔒 Security Best Practices

1. **Use FTPS/SFTP** instead of plain FTP
2. **Strong Passwords**: Minimum 12 characters
3. **IP Restrictions**: Limit access to known IPs
4. **Quotas**: Set storage limits per user
5. **Regular Audits**: Review account access logs
6. **Separate Accounts**: Don't share credentials
7. **Encrypted Storage**: Store passwords securely

## 🚀 Deployment Profiles

### Production
```json
{
  "host": "ftp.leo.pvthostel.com",
  "remote_path": "/public_html",
  "local_path": "../.next",
  "clean_before_deploy": false
}
```

### Staging
```json
{
  "host": "staging-ftp.leo.pvthostel.com",
  "remote_path": "/staging",
  "local_path": "../dist",
  "clean_before_deploy": true
}
```

### Backup
```json
{
  "host": "backup.leo.pvthostel.com",
  "remote_path": "/backups",
  "local_path": "../",
  "clean_before_deploy": false
}
```

## 🔄 Automated Deployment

### GitHub Actions
```yaml
name: FTP Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: FTP Deploy
        env:
          FTP_HOST: ${{ secrets.FTP_HOST }}
          FTP_USERNAME: ${{ secrets.FTP_USERNAME }}
          FTP_PASSWORD: ${{ secrets.FTP_PASSWORD }}
        run: |
          python ftp-deploy.py deploy
```

### GitLab CI
```yaml
deploy:
  stage: deploy
  script:
    - python ftp-deploy.py deploy
  only:
    - main
```

## 📊 Monitoring

### Check FTP Status
```bash
# Test connection
lftp -c "open -u $FTP_USER,$FTP_PASS $FTP_HOST; ls; exit"

# Check server status
systemctl status vsftpd

# View logs
tail -f /var/log/vsftpd.log
```

### Deployment Logs
```bash
# View sync logs
tail -f ftp-sync.log

# Check errors
grep ERROR ftp-sync.log
```

## 🐛 Troubleshooting

### Connection Issues
- Verify firewall allows ports 20, 21, 990, 40000-40100
- Check FTP service is running
- Confirm credentials are correct
- Test with passive mode enabled

### Permission Errors
- Ensure FTP user has write permissions
- Check directory ownership
- Verify quota limits

### Sync Problems
- Check ignore patterns in config
- Verify local path exists
- Review log files for errors

## 📝 Next Steps

1. **Install FTP Server**:
   ```bash
   sudo apt-get install vsftpd
   sudo cp vsftpd.conf /etc/vsftpd.conf
   sudo systemctl restart vsftpd
   ```

2. **Configure DNS**:
   ```bash
   python setup-ftp-subdomain.py
   ```

3. **Create FTP Accounts**:
   ```bash
   python manage-ftp-accounts.py create admin
   ```

4. **Test Deployment**:
   ```bash
   python ftp-deploy.py test
   python ftp-deploy.py deploy
   ```

5. **Setup Auto-Sync**:
   ```bash
   ./ftp-auto-sync.sh service
   ```

## 📞 Support

For issues:
- Check logs in `ftp-sync.log`
- Verify DNS propagation: `dig ftp.leo.pvthostel.com`
- Test FTP access: `ftp ftp.leo.pvthostel.com`
- Review server logs: `/var/log/vsftpd.log`