# 🔑 Canspace Account Access Recovery Guide

## Current Situation
- **Domain**: pvthostel.com (registered with Canspace)
- **Issue**: Need to access Canspace cPanel to update DNS
- **Credentials**: Not found in project files

---

## 📋 Ways to Recover Canspace Access

### Option 1: Check Your Email
Search your email for:
- **From**: canspace.ca, support@canspace.ca, billing@canspace.ca
- **Subject**: "Welcome", "Account", "Login", "cPanel", "Registration"
- **Keywords**: "username", "password", "credentials"

Common email subjects from Canspace:
- "Welcome to Canspace"
- "Your Canspace Account Information"
- "cPanel Login Details"
- "Domain Registration Confirmation"

### Option 2: Password Reset
1. **Go to**: https://my.canspace.ca
2. **Click**: "Forgot Password?" or "Reset Password"
3. **Enter**: Your email address associated with the account
4. **Check**: Your email for reset link

### Option 3: Contact Canspace Support

**Phone**: 1-877-226-7722 (Toll-free)
**Email**: support@canspace.ca
**Live Chat**: https://www.canspace.ca (bottom right)

**What to say:**
> "I need to reset my cPanel login for pvthostel.com. Can you help me recover access or reset my credentials?"

**They will ask for:**
- Domain name: pvthostel.com
- Account email address
- Last 4 digits of credit card on file
- Security questions (if set up)

### Option 4: Check Browser Saved Passwords

**Chrome:**
```
chrome://settings/passwords
Search for: canspace
```

**Firefox:**
```
about:logins
Search for: canspace
```

**Safari:**
```
Safari → Preferences → Passwords
Search for: canspace
```

**macOS Keychain:**
```bash
# In Terminal:
security find-internet-password -s canspace.ca

# Or open Keychain Access app:
# Applications → Utilities → Keychain Access
# Search: canspace
```

### Option 5: Check Common Locations

Look for credentials in:
- **Password Manager**: 1Password, LastPass, Bitwarden, etc.
- **Notes Apps**: Apple Notes, Notion, Evernote
- **Text Files**: Desktop, Documents, Downloads
- **Spreadsheets**: "Passwords.xlsx", "Accounts.xlsx"
- **Physical Notes**: Notebook, sticky notes

---

## 🚀 Once You Have Access

### Quick DNS Setup Commands

```bash
# Set credentials
export CANSPACE_USERNAME="your_username"
export CANSPACE_PASSWORD="your_password"

# Run automated setup
cd /Volumes/DevOps/leo.pvthostel.com/dns-management
python canspace-dns.py vercel
```

### Manual cPanel Steps
1. Login to https://cpanel.canspace.ca:2083
2. Go to **Zone Editor**
3. Add these records:
   - A record: pvthostel.com → 76.76.21.21
   - CNAME: www → cname.vercel-dns.com
   - CNAME: leo → cname.vercel-dns.com

---

## 🆘 Alternative Solutions (No cPanel Needed)

### Option A: Use Cloudflare DNS (Free)
1. Create free Cloudflare account
2. Add pvthostel.com
3. Change nameservers at Canspace to Cloudflare's
4. Configure DNS in Cloudflare (easier interface)

### Option B: Transfer Domain
Transfer domain to:
- **Vercel**: Direct integration
- **Cloudflare Registrar**: $8.57/year for .com
- **Namecheap**: Easy management

### Option C: Support Ticket
Email Canspace support directly:

```
To: support@canspace.ca
Subject: DNS Update Request for pvthostel.com

Hello,

I need help updating DNS records for pvthostel.com.
Please update:
- A record for pvthostel.com to 76.76.21.21
- CNAME for www to cname.vercel-dns.com
- Disable any Cloudflare protection

Account email: [your email]
Domain: pvthostel.com

Thank you!
```

---

## 📝 For Future Reference

### Create Secure Credential Storage

```bash
# Create encrypted credentials file
cat > /Volumes/DevOps/leo.pvthostel.com/.env.canspace << EOF
# Canspace Credentials (DO NOT COMMIT)
CANSPACE_USERNAME=your_username_here
CANSPACE_PASSWORD=your_password_here
CANSPACE_ACCOUNT_EMAIL=your_email_here
EOF

# Add to .gitignore
echo ".env.canspace" >> .gitignore
```

### Store in macOS Keychain
```bash
# Store password securely
security add-internet-password \
  -a "your_username" \
  -s "canspace.ca" \
  -w "your_password"

# Retrieve later
security find-internet-password -s "canspace.ca" -w
```

---

## 🎯 Immediate Action Items

1. **Check email** for Canspace credentials
2. **Try password reset** at https://my.canspace.ca
3. **Call support** at 1-877-226-7722
4. **Check browser** saved passwords

The website is working at: https://leopvthostel-b4x6gqudb-axaiinovation.vercel.app

We just need the DNS configured to point pvthostel.com to Vercel!

---

*Priority: Contact Canspace support if you can't find credentials - they're very helpful!*