#!/bin/bash

# Quick Setup Script for DNS Management
# Sets up DNS for leo.pvthostel.com on Vercel

echo "🌐 DNS Quick Setup for leo.pvthostel.com"
echo "========================================"
echo ""

# Check for required environment variables
if [ -z "$CLOUDFLARE_API_TOKEN" ] && [ -z "$CANSPACE_USERNAME" ]; then
    echo "⚠️  No DNS provider credentials found!"
    echo ""
    echo "Please set one of the following:"
    echo "  For Cloudflare:"
    echo "    export CLOUDFLARE_API_TOKEN='your_token'"
    echo ""
    echo "  For Canspace:"
    echo "    export CANSPACE_USERNAME='your_username'"
    echo "    export CANSPACE_PASSWORD='your_password'"
    echo ""
    exit 1
fi

# Function to setup Vercel DNS
setup_vercel() {
    echo "🚀 Configuring DNS for Vercel deployment..."
    echo ""
    
    # Try Cloudflare first
    if [ -n "$CLOUDFLARE_API_TOKEN" ]; then
        echo "📡 Using Cloudflare provider..."
        python3 cloudflare-dns.py vercel
    fi
    
    # Try Canspace
    if [ -n "$CANSPACE_USERNAME" ]; then
        echo "📡 Using Canspace provider..."
        python3 canspace-dns.py vercel
    fi
    
    echo ""
    echo "✅ DNS configuration complete!"
    echo ""
    echo "Next steps:"
    echo "1. Add your domain to Vercel: vercel domains add leo.pvthostel.com"
    echo "2. Deploy your project: vercel --prod"
    echo "3. DNS propagation may take up to 48 hours"
}

# Function to check current DNS
check_dns() {
    echo "🔍 Checking current DNS configuration..."
    echo ""
    
    # Check A record
    echo "A Records:"
    dig +short A leo.pvthostel.com
    
    echo ""
    echo "CNAME Records:"
    dig +short CNAME www.leo.pvthostel.com
    
    echo ""
    echo "MX Records:"
    dig +short MX leo.pvthostel.com
    
    echo ""
    echo "NS Records:"
    dig +short NS leo.pvthostel.com
}

# Main menu
echo "What would you like to do?"
echo ""
echo "1) Setup DNS for Vercel deployment"
echo "2) Check current DNS configuration"
echo "3) List all DNS records"
echo "4) Compare DNS providers"
echo "5) Backup DNS configuration"
echo ""
read -p "Enter choice (1-5): " choice

case $choice in
    1)
        setup_vercel
        ;;
    2)
        check_dns
        ;;
    3)
        python3 dns-manager.py list
        ;;
    4)
        python3 dns-manager.py compare
        ;;
    5)
        python3 cloudflare-dns.py export cloudflare-backup-$(date +%Y%m%d).json
        python3 canspace-dns.py export canspace-backup-$(date +%Y%m%d).json
        echo "✅ Backups created with timestamp"
        ;;
    *)
        echo "Invalid choice"
        exit 1
        ;;
esac