#!/bin/bash

# DNS Automation Script for leo.pvthostel.com
# Automated DNS management tasks and verification

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DOMAIN="leo.pvthostel.com"
DNS_DIR="/Volumes/DevOps/Projects/02-pvthostel-domains/leo.pvthostel.com/dns-management"
BACKUP_DIR="$DNS_DIR/backups"
LOG_FILE="$DNS_DIR/dns-automation.log"

# Create necessary directories
mkdir -p "$BACKUP_DIR"

# Logging function
log() {
    echo -e "$1"
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"
}

# Function to check dependencies
check_dependencies() {
    log "${BLUE}🔍 Checking dependencies...${NC}"
    
    local deps=("python3" "dig" "curl" "jq")
    local missing=()
    
    for dep in "${deps[@]}"; do
        if ! command -v "$dep" &> /dev/null; then
            missing+=("$dep")
        fi
    done
    
    if [ ${#missing[@]} -ne 0 ]; then
        log "${RED}❌ Missing dependencies: ${missing[*]}${NC}"
        log "Install with: brew install ${missing[*]}"
        exit 1
    fi
    
    # Check Python modules
    if ! python3 -c "import requests" 2>/dev/null; then
        log "${YELLOW}⚠️ Installing Python requests module...${NC}"
        pip3 install requests
    fi
    
    if ! python3 -c "import dns.resolver" 2>/dev/null; then
        log "${YELLOW}⚠️ Installing dnspython module...${NC}"
        pip3 install dnspython
    fi
    
    log "${GREEN}✅ All dependencies installed${NC}"
}

# Function to backup current DNS configuration
backup_dns() {
    log "${BLUE}💾 Backing up DNS configuration...${NC}"
    
    local timestamp=$(date +%Y%m%d_%H%M%S)
    local backup_file="$BACKUP_DIR/dns_backup_$timestamp.json"
    
    # Backup from Cloudflare if available
    if [ -n "$CLOUDFLARE_API_TOKEN" ]; then
        python3 "$DNS_DIR/cloudflare-dns.py" export "$backup_file" 2>/dev/null || true
        log "${GREEN}✅ Cloudflare backup saved to $backup_file${NC}"
    fi
    
    # Backup from Canspace if available
    if [ -n "$CANSPACE_USERNAME" ]; then
        python3 "$DNS_DIR/canspace-dns.py" export "${backup_file%.json}_canspace.json" 2>/dev/null || true
        log "${GREEN}✅ Canspace backup saved${NC}"
    fi
    
    # Keep only last 30 backups
    ls -t "$BACKUP_DIR"/dns_backup_*.json 2>/dev/null | tail -n +31 | xargs -r rm
    
    log "${GREEN}✅ Backup completed${NC}"
}

# Function to verify DNS propagation
verify_propagation() {
    local record_type="${1:-A}"
    local name="${2:-$DOMAIN}"
    
    log "${BLUE}🌍 Verifying DNS propagation for $record_type $name...${NC}"
    
    # Get expected value from primary nameserver
    local expected=$(dig +short $record_type $name @1.1.1.1 | head -1)
    
    if [ -z "$expected" ]; then
        log "${RED}❌ No $record_type record found for $name${NC}"
        return 1
    fi
    
    log "Expected value: $expected"
    
    # Check multiple nameservers
    local nameservers=("8.8.8.8" "1.1.1.1" "208.67.222.222" "9.9.9.9")
    local propagated=0
    local total=${#nameservers[@]}
    
    for ns in "${nameservers[@]}"; do
        local result=$(dig +short $record_type $name @$ns | head -1)
        
        if [ "$result" = "$expected" ]; then
            log "${GREEN}✅ $ns: $result${NC}"
            ((propagated++))
        else
            log "${RED}❌ $ns: $result (expected: $expected)${NC}"
        fi
    done
    
    local percentage=$((propagated * 100 / total))
    log "${BLUE}Propagation: $propagated/$total ($percentage%)${NC}"
    
    if [ $propagated -eq $total ]; then
        log "${GREEN}✅ Full propagation achieved!${NC}"
        return 0
    else
        log "${YELLOW}⚠️ Partial propagation ($percentage%)${NC}"
        return 1
    fi
}

# Function to setup Vercel DNS
setup_vercel() {
    log "${BLUE}🚀 Setting up DNS for Vercel deployment...${NC}"
    
    backup_dns
    
    python3 "$DNS_DIR/dns-manager.py" template vercel
    
    log "${GREEN}✅ Vercel DNS configuration applied${NC}"
    
    # Wait for propagation
    log "${YELLOW}⏳ Waiting 30 seconds for initial propagation...${NC}"
    sleep 30
    
    verify_propagation "A" "$DOMAIN"
}

# Function to monitor DNS health
monitor_health() {
    log "${BLUE}🏥 Running DNS health check...${NC}"
    
    python3 "$DNS_DIR/dns-health-monitor.py" check
    
    # Check HTTP response
    local http_status=$(curl -s -o /dev/null -w "%{http_code}" -L "https://$DOMAIN" --max-time 10)
    
    if [ "$http_status" = "200" ]; then
        log "${GREEN}✅ Website is accessible (HTTP $http_status)${NC}"
    else
        log "${RED}❌ Website returned HTTP $http_status${NC}"
    fi
}

# Function to sync DNS providers
sync_providers() {
    log "${BLUE}🔄 Syncing DNS providers...${NC}"
    
    backup_dns
    
    python3 "$DNS_DIR/dns-manager.py" sync
    
    log "${GREEN}✅ DNS providers synchronized${NC}"
}

# Function to apply custom DNS updates
apply_updates() {
    local updates_file="${1:-$DNS_DIR/updates.json}"
    
    if [ ! -f "$updates_file" ]; then
        log "${RED}❌ Updates file not found: $updates_file${NC}"
        return 1
    fi
    
    log "${BLUE}📝 Applying DNS updates from $updates_file...${NC}"
    
    backup_dns
    
    python3 "$DNS_DIR/dns-manager.py" bulk "$updates_file"
    
    log "${GREEN}✅ DNS updates applied${NC}"
}

# Function to test mail configuration
test_mail() {
    log "${BLUE}✉️ Testing mail configuration...${NC}"
    
    # Check MX records
    local mx_records=$(dig +short MX $DOMAIN)
    
    if [ -n "$mx_records" ]; then
        log "${GREEN}✅ MX Records found:${NC}"
        echo "$mx_records" | while read -r line; do
            log "  - $line"
        done
    else
        log "${RED}❌ No MX records found${NC}"
    fi
    
    # Check SPF
    local spf=$(dig +short TXT $DOMAIN | grep "v=spf1")
    
    if [ -n "$spf" ]; then
        log "${GREEN}✅ SPF Record: $spf${NC}"
    else
        log "${YELLOW}⚠️ No SPF record found${NC}"
    fi
    
    # Check DMARC
    local dmarc=$(dig +short TXT _dmarc.$DOMAIN | grep "v=DMARC1")
    
    if [ -n "$dmarc" ]; then
        log "${GREEN}✅ DMARC Record: $dmarc${NC}"
    else
        log "${YELLOW}⚠️ No DMARC record found${NC}"
    fi
}

# Function to run continuous monitoring
continuous_monitor() {
    local interval="${1:-3600}"
    
    log "${BLUE}🔄 Starting continuous monitoring (interval: ${interval}s)${NC}"
    
    while true; do
        monitor_health
        
        # Check for alerts
        if grep -q "❌" "$LOG_FILE" | tail -n 20; then
            log "${RED}🚨 Issues detected! Check logs for details.${NC}"
        fi
        
        log "${YELLOW}💤 Next check in $interval seconds...${NC}"
        sleep "$interval"
    done
}

# Function to show current DNS status
show_status() {
    log "${BLUE}📊 Current DNS Status for $DOMAIN${NC}"
    echo "================================"
    
    # A Records
    log "${YELLOW}A Records:${NC}"
    dig +short A $DOMAIN | while read -r ip; do
        log "  $ip"
    done
    
    # CNAME Records
    log "${YELLOW}CNAME Records (www):${NC}"
    dig +short CNAME www.$DOMAIN | while read -r cname; do
        log "  $cname"
    done
    
    # NS Records
    log "${YELLOW}Nameservers:${NC}"
    dig +short NS $DOMAIN | while read -r ns; do
        log "  $ns"
    done
    
    # MX Records
    log "${YELLOW}Mail Servers:${NC}"
    dig +short MX $DOMAIN | while read -r mx; do
        log "  $mx"
    done
    
    echo "================================"
}

# Function to clean old logs and backups
cleanup() {
    log "${BLUE}🧹 Cleaning up old files...${NC}"
    
    # Keep only last 30 days of logs
    find "$DNS_DIR" -name "*.log" -mtime +30 -delete 2>/dev/null || true
    
    # Keep only last 30 backups
    ls -t "$BACKUP_DIR"/dns_backup_*.json 2>/dev/null | tail -n +31 | xargs -r rm || true
    
    log "${GREEN}✅ Cleanup completed${NC}"
}

# Main menu
main() {
    clear
    echo "================================================"
    echo "   🌐 DNS Automation for $DOMAIN"
    echo "================================================"
    echo ""
    echo "1)  📊 Show Current DNS Status"
    echo "2)  🏥 Run Health Check"
    echo "3)  🌍 Verify DNS Propagation"
    echo "4)  🚀 Setup Vercel DNS"
    echo "5)  🔄 Sync DNS Providers"
    echo "6)  💾 Backup DNS Configuration"
    echo "7)  ✉️ Test Mail Configuration"
    echo "8)  📝 Apply Custom Updates"
    echo "9)  🔍 Monitor Continuously"
    echo "10) 🧹 Clean Old Files"
    echo "11) 📋 Show Recent Logs"
    echo "0)  Exit"
    echo ""
    read -p "Select option: " choice
    
    case $choice in
        1) show_status ;;
        2) monitor_health ;;
        3) 
            read -p "Record type (A/CNAME/MX/TXT) [A]: " rtype
            rtype=${rtype:-A}
            read -p "Domain name [$DOMAIN]: " dname
            dname=${dname:-$DOMAIN}
            verify_propagation "$rtype" "$dname"
            ;;
        4) setup_vercel ;;
        5) sync_providers ;;
        6) backup_dns ;;
        7) test_mail ;;
        8) 
            read -p "Updates file path [$DNS_DIR/updates.json]: " ufile
            ufile=${ufile:-$DNS_DIR/updates.json}
            apply_updates "$ufile"
            ;;
        9) 
            read -p "Check interval in seconds [3600]: " interval
            interval=${interval:-3600}
            continuous_monitor "$interval"
            ;;
        10) cleanup ;;
        11) tail -n 50 "$LOG_FILE" ;;
        0) exit 0 ;;
        *) 
            log "${RED}Invalid option${NC}"
            sleep 2
            main
            ;;
    esac
    
    echo ""
    read -p "Press Enter to continue..."
    main
}

# Check if running with arguments
if [ $# -gt 0 ]; then
    case "$1" in
        check) monitor_health ;;
        backup) backup_dns ;;
        sync) sync_providers ;;
        vercel) setup_vercel ;;
        propagation) verify_propagation "${2:-A}" "${3:-$DOMAIN}" ;;
        monitor) continuous_monitor "${2:-3600}" ;;
        status) show_status ;;
        cleanup) cleanup ;;
        test-mail) test_mail ;;
        *) 
            echo "Usage: $0 [check|backup|sync|vercel|propagation|monitor|status|cleanup|test-mail]"
            exit 1
            ;;
    esac
else
    # Check dependencies first
    check_dependencies
    
    # Run interactive menu
    main
fi