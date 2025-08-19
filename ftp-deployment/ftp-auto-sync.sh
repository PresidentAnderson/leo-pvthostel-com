#!/bin/bash

# FTP Auto-Sync Script for leo.pvthostel.com
# Automatically syncs local changes to FTP server

# Configuration
CONFIG_FILE="ftp-config.json"
LOG_FILE="ftp-sync.log"
WATCH_DIR="../dist"
FTP_HOST="ftp.leo.pvthostel.com"
SYNC_INTERVAL=60  # seconds

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to log messages
log_message() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Function to check dependencies
check_dependencies() {
    local deps=("lftp" "inotifywait" "jq")
    local missing=()
    
    for dep in "${deps[@]}"; do
        if ! command -v "$dep" &> /dev/null; then
            missing+=("$dep")
        fi
    done
    
    if [ ${#missing[@]} -ne 0 ]; then
        echo -e "${RED}Missing dependencies: ${missing[*]}${NC}"
        echo "Install with:"
        echo "  macOS: brew install lftp fswatch jq"
        echo "  Linux: sudo apt-get install lftp inotify-tools jq"
        exit 1
    fi
}

# Function to read config
read_config() {
    if [ ! -f "$CONFIG_FILE" ]; then
        echo -e "${RED}Config file not found: $CONFIG_FILE${NC}"
        exit 1
    fi
    
    FTP_HOST=$(jq -r '.host' "$CONFIG_FILE")
    FTP_USER=$(jq -r '.username' "$CONFIG_FILE")
    FTP_PASS=$(jq -r '.password' "$CONFIG_FILE")
    FTP_REMOTE=$(jq -r '.remote_path' "$CONFIG_FILE")
    LOCAL_PATH=$(jq -r '.local_path' "$CONFIG_FILE")
    USE_TLS=$(jq -r '.use_tls' "$CONFIG_FILE")
    
    if [ -z "$FTP_USER" ] || [ -z "$FTP_PASS" ]; then
        echo -e "${YELLOW}FTP credentials not found in config${NC}"
        read -p "FTP Username: " FTP_USER
        read -s -p "FTP Password: " FTP_PASS
        echo
    fi
}

# Function to sync with lftp
sync_ftp() {
    log_message "Starting FTP sync to $FTP_HOST"
    
    # Build lftp command
    LFTP_CMD="set ftp:list-options -a;"
    LFTP_CMD+="set cmd:fail-exit yes;"
    
    if [ "$USE_TLS" == "true" ]; then
        LFTP_CMD+="set ftp:ssl-allow yes;"
        LFTP_CMD+="set ftp:ssl-force yes;"
        LFTP_CMD+="set ftp:ssl-protect-data yes;"
        LFTP_CMD+="set ssl:verify-certificate no;"
    fi
    
    LFTP_CMD+="open -u $FTP_USER,$FTP_PASS $FTP_HOST;"
    LFTP_CMD+="mirror --reverse --delete --verbose"
    LFTP_CMD+=" --exclude-glob .git/"
    LFTP_CMD+=" --exclude-glob node_modules/"
    LFTP_CMD+=" --exclude-glob .env"
    LFTP_CMD+=" --exclude-glob *.log"
    LFTP_CMD+=" --exclude-glob .DS_Store"
    LFTP_CMD+=" $LOCAL_PATH $FTP_REMOTE;"
    LFTP_CMD+="exit"
    
    # Execute sync
    if lftp -c "$LFTP_CMD" 2>&1 | tee -a "$LOG_FILE"; then
        log_message "✅ Sync completed successfully"
        return 0
    else
        log_message "❌ Sync failed"
        return 1
    fi
}

# Function to watch for changes (macOS compatible)
watch_changes() {
    log_message "👀 Watching $LOCAL_PATH for changes..."
    
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS using fswatch
        fswatch -o "$LOCAL_PATH" | while read num; do
            log_message "📝 Changes detected"
            sync_ftp
        done
    else
        # Linux using inotifywait
        while true; do
            inotifywait -r -e modify,create,delete,move "$LOCAL_PATH" 2>/dev/null
            log_message "📝 Changes detected"
            sync_ftp
        done
    fi
}

# Function for continuous sync
continuous_sync() {
    log_message "🔄 Starting continuous sync (interval: ${SYNC_INTERVAL}s)"
    
    while true; do
        sync_ftp
        log_message "💤 Waiting ${SYNC_INTERVAL} seconds..."
        sleep "$SYNC_INTERVAL"
    done
}

# Function to create systemd service
create_service() {
    cat > ftp-sync.service << EOF
[Unit]
Description=FTP Auto Sync for leo.pvthostel.com
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=$(pwd)
ExecStart=$(pwd)/ftp-auto-sync.sh continuous
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF
    
    echo "Systemd service file created: ftp-sync.service"
    echo "To install:"
    echo "  sudo cp ftp-sync.service /etc/systemd/system/"
    echo "  sudo systemctl daemon-reload"
    echo "  sudo systemctl enable ftp-sync"
    echo "  sudo systemctl start ftp-sync"
}

# Function to create launchd plist for macOS
create_launchd() {
    cat > com.leopvthostel.ftpsync.plist << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.leopvthostel.ftpsync</string>
    <key>ProgramArguments</key>
    <array>
        <string>$(pwd)/ftp-auto-sync.sh</string>
        <string>continuous</string>
    </array>
    <key>WorkingDirectory</key>
    <string>$(pwd)</string>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
    <key>StandardOutPath</key>
    <string>$(pwd)/ftp-sync.log</string>
    <key>StandardErrorPath</key>
    <string>$(pwd)/ftp-sync-error.log</string>
</dict>
</plist>
EOF
    
    echo "Launchd plist created: com.leopvthostel.ftpsync.plist"
    echo "To install:"
    echo "  cp com.leopvthostel.ftpsync.plist ~/Library/LaunchAgents/"
    echo "  launchctl load ~/Library/LaunchAgents/com.leopvthostel.ftpsync.plist"
}

# Main script
main() {
    echo -e "${GREEN}🚀 FTP Auto-Sync for leo.pvthostel.com${NC}"
    echo "========================================"
    
    # Check dependencies
    check_dependencies
    
    # Read configuration
    read_config
    
    # Parse command
    case "${1:-}" in
        sync)
            sync_ftp
            ;;
        watch)
            watch_changes
            ;;
        continuous)
            continuous_sync
            ;;
        service)
            if [[ "$OSTYPE" == "darwin"* ]]; then
                create_launchd
            else
                create_service
            fi
            ;;
        test)
            echo "Testing FTP connection..."
            lftp -c "set ftp:ssl-allow yes; open -u $FTP_USER,$FTP_PASS $FTP_HOST; ls; exit"
            ;;
        *)
            echo "Usage: $0 {sync|watch|continuous|service|test}"
            echo ""
            echo "Commands:"
            echo "  sync       - One-time sync to FTP"
            echo "  watch      - Watch for changes and sync"
            echo "  continuous - Sync at regular intervals"
            echo "  service    - Create system service"
            echo "  test       - Test FTP connection"
            exit 1
            ;;
    esac
}

# Run main function
main "$@"