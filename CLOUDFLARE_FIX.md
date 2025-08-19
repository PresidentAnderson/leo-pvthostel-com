# 🔧 Cloudflare Block Resolution Guide

## Issue
**Domain**: pvthostel.com  
**Error**: Cloudflare security block preventing access  
**Status**: Site is deployed but domain is not accessible  

## Current Deployment Status

### ✅ What's Working:
- **Vercel URL**: https://leopvthostel-b4x6gqudb-axaiinovation.vercel.app (LIVE)
- **Build**: Successfully deployed to Vercel
- **Code**: All features working on Vercel domain

### ❌ What's Not Working:
- **Custom Domain**: pvthostel.com is blocked by Cloudflare
- **Subdomain**: leo.pvthostel.com needs DNS configuration

---

## 🚀 Solution Steps

### Option 1: Fix Cloudflare Settings (If You Own pvthostel.com)

1. **Login to Cloudflare Dashboard**
   - Go to https://dash.cloudflare.com
   - Select the pvthostel.com domain

2. **Check Security Settings**
   ```
   Security → Settings → Security Level
   - Change from "I'm Under Attack" to "Medium" or "Low"
   ```

3. **Disable Bot Fight Mode** (temporarily)
   ```
   Security → Bots → Bot Fight Mode
   - Toggle OFF temporarily
   ```

4. **Check Firewall Rules**
   ```
   Security → WAF → Firewall Rules
   - Look for blocking rules
   - Temporarily disable or modify them
   ```

5. **Add Vercel IPs to Allow List**
   ```
   Security → WAF → Tools → IP Access Rules
   Add these Vercel IPs:
   - 76.76.21.21
   - 76.76.21.61
   - 76.76.21.93
   - 76.76.21.123
   ```

6. **Configure DNS for Vercel**
   ```
   DNS → Records
   
   For root domain (pvthostel.com):
   - Type: A
   - Name: @
   - Content: 76.76.21.21
   - Proxy: OFF (important!)
   
   For www:
   - Type: CNAME
   - Name: www
   - Content: cname.vercel-dns.com
   - Proxy: OFF
   
   For leo subdomain:
   - Type: CNAME
   - Name: leo
   - Content: cname.vercel-dns.com
   - Proxy: OFF
   ```

---

### Option 2: Use Our DNS Management Scripts

```bash
# Set your Cloudflare credentials
export CLOUDFLARE_API_TOKEN="your_api_token_here"

# Configure DNS for Vercel
cd /Volumes/DevOps/leo.pvthostel.com/dns-management
python cloudflare-dns.py vercel

# Or use the unified manager
python dns-manager.py template vercel
```

---

### Option 3: Add Domain to Vercel

1. **In Vercel Dashboard**
   ```
   Project Settings → Domains
   Add Domain: pvthostel.com
   Add Domain: www.pvthostel.com
   Add Domain: leo.pvthostel.com
   ```

2. **Vercel will provide DNS instructions**
   - Follow Vercel's specific DNS configuration
   - Usually requires A record or CNAME

3. **Via CLI**
   ```bash
   vercel domains add pvthostel.com
   vercel domains add leo.pvthostel.com
   ```

---

## 🔍 Diagnostic Commands

### Check DNS Resolution
```bash
# Check current DNS
dig pvthostel.com
dig leo.pvthostel.com

# Check nameservers
whois pvthostel.com | grep "Name Server"

# Test from different locations
curl -I https://pvthostel.com
```

### Check Cloudflare Settings via API
```bash
cd /Volumes/DevOps/leo.pvthostel.com/dns-management

# List current DNS records
python cloudflare-dns.py list

# Check security settings (requires API token)
curl -X GET "https://api.cloudflare.com/client/v4/zones/ZONE_ID/settings/security_level" \
  -H "Authorization: Bearer YOUR_API_TOKEN"
```

---

## 🎯 Quick Fix Checklist

- [ ] **Cloudflare Proxy**: Turn OFF for Vercel domains
- [ ] **Security Level**: Set to Medium or Low
- [ ] **Bot Fight Mode**: Temporarily disable
- [ ] **Firewall Rules**: Check for blocking rules
- [ ] **DNS Records**: Point to Vercel IPs
- [ ] **SSL/TLS**: Set to "Full" or "Flexible"
- [ ] **Always Use HTTPS**: Can stay ON
- [ ] **Vercel Domain**: Add domain in Vercel dashboard

---

## 🚨 Immediate Workaround

While fixing the domain, your site is **FULLY ACCESSIBLE** at:  
**https://leopvthostel-b4x6gqudb-axaiinovation.vercel.app**

Share this URL for immediate access to the website.

---

## 📞 If You Don't Own pvthostel.com

If you don't own this domain yet:

1. **Register the domain** at:
   - Namecheap
   - GoDaddy  
   - Cloudflare Registrar
   - Canspace.ca

2. **Use a different domain**:
   - Register leo-pvthostel.com
   - Use leopvthostel.com
   - Use pvt-hostel.com

3. **Continue with Vercel subdomain**:
   - The current URL works perfectly
   - Can be used until domain is ready

---

## 💡 Prevention Tips

1. **Always disable Cloudflare proxy for Vercel**
2. **Set security to appropriate level**
3. **Test domain before going live**
4. **Keep Vercel URL as backup**

---

*Need help? The site is working at: https://leopvthostel-b4x6gqudb-axaiinovation.vercel.app*