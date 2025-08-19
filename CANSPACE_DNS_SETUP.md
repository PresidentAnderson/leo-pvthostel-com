# 🔧 Canspace.ca DNS Configuration for pvthostel.com

## Current Situation
- **Domain**: pvthostel.com (registered with Canspace.ca)
- **Deployment**: Live on Vercel at https://leopvthostel-b4x6gqudb-axaiinovation.vercel.app
- **Issue**: Domain blocked by Cloudflare, needs proper DNS configuration

---

## 📋 Step-by-Step Canspace Configuration

### Step 1: Login to Canspace cPanel
1. Go to: https://cpanel.canspace.ca:2083
2. Login with your Canspace credentials
3. Or use: https://my.canspace.ca → Manage → cPanel

### Step 2: Navigate to DNS Zone Editor
```
cPanel → Domains → Zone Editor
Select: pvthostel.com
```

### Step 3: Remove/Modify Existing Records
**IMPORTANT**: Delete or modify these if they exist:
- Any A records pointing to Cloudflare IPs
- Any CNAME records pointing to Cloudflare
- Keep NS (nameserver) records intact

### Step 4: Add Vercel DNS Records

#### For Root Domain (pvthostel.com):
```
Type: A
Name: pvthostel.com. (or @)
TTL: 14400
Record: 76.76.21.21
```

#### For WWW Subdomain:
```
Type: CNAME
Name: www
TTL: 14400
Record: cname.vercel-dns.com.
```

#### For LEO Subdomain:
```
Type: CNAME
Name: leo
TTL: 14400
Record: cname.vercel-dns.com.
```

### Step 5: Disable Cloudflare (if enabled in Canspace)
```
cPanel → Cloudflare (if available)
- Click "Disable Cloudflare"
- Or set to "DNS Only" mode (gray cloud)
```

---

## 🚀 Automated Configuration Using Our Script

```bash
# Set Canspace credentials
export CANSPACE_USERNAME="your_username"
export CANSPACE_PASSWORD="your_password"

# Run the configuration
cd /Volumes/DevOps/leo.pvthostel.com/dns-management
python canspace-dns.py vercel

# Or manually create records
python canspace-dns.py create A pvthostel.com 76.76.21.21
python canspace-dns.py create CNAME www cname.vercel-dns.com
python canspace-dns.py create CNAME leo cname.vercel-dns.com
```

---

## 🔍 Verify DNS Changes

### Check DNS Propagation:
```bash
# Check A record
dig pvthostel.com
nslookup pvthostel.com

# Check CNAME
dig www.pvthostel.com
dig leo.pvthostel.com

# Check propagation globally
# Visit: https://www.whatsmydns.net
# Enter: pvthostel.com
# Should show: 76.76.21.21
```

### Expected Results:
```
pvthostel.com → 76.76.21.21 (Vercel IP)
www.pvthostel.com → cname.vercel-dns.com
leo.pvthostel.com → cname.vercel-dns.com
```

---

## 🎯 Add Domain to Vercel

### Via Vercel Dashboard:
1. Go to: https://vercel.com/axaiinovation/leo.pvthostel.com/settings/domains
2. Click "Add Domain"
3. Add these domains:
   - pvthostel.com
   - www.pvthostel.com
   - leo.pvthostel.com
4. Vercel will verify DNS automatically

### Via CLI:
```bash
cd /Volumes/DevOps/leo.pvthostel.com

# Add domains to Vercel
vercel domains add pvthostel.com
vercel domains add www.pvthostel.com
vercel domains add leo.pvthostel.com

# Verify domains
vercel domains ls
```

---

## ⚠️ Important Canspace Settings

### 1. Check Nameservers
Make sure pvthostel.com uses Canspace nameservers:
```
ns1.canspace.ca
ns2.canspace.ca
```

### 2. Disable Any CDN/Proxy
- No Cloudflare proxy
- No Canspace CDN (if offered)
- Direct DNS only

### 3. SSL Certificate
- Vercel will auto-provision SSL via Let's Encrypt
- No need for Canspace SSL

---

## 🐛 Troubleshooting

### If "Blocked" Message Persists:

1. **Clear Cloudflare from Canspace**:
   - Login to cPanel
   - Look for "Cloudflare" icon
   - Click "Disable" or "Remove Domain"

2. **Check .htaccess**:
   ```bash
   # In cPanel File Manager
   Navigate to: public_html/
   Edit: .htaccess
   Remove any Cloudflare rules
   ```

3. **Contact Canspace Support**:
   ```
   Email: support@canspace.ca
   Phone: 1-877-226-7722
   
   Message: "Please disable Cloudflare and remove all 
   security blocks for pvthostel.com. I need to point 
   it to Vercel hosting at IP 76.76.21.21"
   ```

---

## 📊 DNS Configuration Summary

| Domain | Type | Points To | TTL |
|--------|------|-----------|-----|
| pvthostel.com | A | 76.76.21.21 | 14400 |
| www.pvthostel.com | CNAME | cname.vercel-dns.com | 14400 |
| leo.pvthostel.com | CNAME | cname.vercel-dns.com | 14400 |

---

## ⏱️ Timeline

1. **DNS Changes**: 5-10 minutes in Canspace
2. **Propagation**: 15 minutes to 48 hours (usually 1-4 hours)
3. **SSL Certificate**: Auto-provisioned by Vercel after DNS verified
4. **Full Resolution**: 1-4 hours typically

---

## ✅ Success Indicators

- [ ] DNS records updated in Canspace
- [ ] Cloudflare disabled/removed
- [ ] Domain added to Vercel
- [ ] DNS propagation started
- [ ] No more "blocked" message
- [ ] Site accessible at pvthostel.com

---

## 🎉 Once Complete

Your site will be accessible at:
- https://pvthostel.com
- https://www.pvthostel.com
- https://leo.pvthostel.com

All will point to your Vercel deployment with automatic SSL!

---

*Current Working URL: https://leopvthostel-b4x6gqudb-axaiinovation.vercel.app*