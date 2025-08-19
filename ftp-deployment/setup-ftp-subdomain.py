#!/usr/bin/env python3
"""
Setup FTP Subdomain for leo.pvthostel.com
Creates FTP subdomain and configures DNS records
"""

import sys
import os
import json
from datetime import datetime

# Add parent directory to path to import DNS modules
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'dns-management'))

try:
    from cloudflare_dns import CloudflareDNS
    from canspace_dns import CanspaceDNS
except ImportError:
    print("⚠️ DNS management modules not found. Please ensure dns-management directory exists.")
    sys.exit(1)

class FTPSubdomainSetup:
    def __init__(self):
        """Initialize FTP subdomain setup"""
        self.domain = "leo.pvthostel.com"
        self.ftp_subdomains = [
            "ftp",
            "files", 
            "upload",
            "cdn"
        ]
        
    def setup_dns_records(self, provider: str = "cloudflare"):
        """Setup DNS records for FTP subdomains"""
        
        print(f"🌐 Setting up FTP subdomain DNS records via {provider}")
        print("-" * 50)
        
        # Get server IP (replace with your actual server IP)
        server_ip = os.getenv("SERVER_IP", "192.168.1.100")
        
        # Initialize DNS provider
        if provider == "cloudflare":
            api_token = os.getenv("CLOUDFLARE_API_TOKEN")
            if not api_token:
                print("❌ CLOUDFLARE_API_TOKEN not set")
                return False
            
            dns = CloudflareDNS(api_token)
            
            # Create A records for FTP subdomains
            for subdomain in self.ftp_subdomains:
                full_domain = f"{subdomain}.{self.domain}"
                try:
                    dns.update_or_create("A", full_domain, server_ip, proxied=False)
                    print(f"✅ Created A record: {full_domain} → {server_ip}")
                except Exception as e:
                    print(f"❌ Failed to create {full_domain}: {e}")
            
            # Create CNAME for alternative access
            try:
                dns.update_or_create("CNAME", f"secure-ftp.{self.domain}", f"ftp.{self.domain}", proxied=False)
                print(f"✅ Created CNAME: secure-ftp.{self.domain} → ftp.{self.domain}")
            except Exception as e:
                print(f"❌ Failed to create CNAME: {e}")
                
        elif provider == "canspace":
            username = os.getenv("CANSPACE_USERNAME")
            password = os.getenv("CANSPACE_PASSWORD")
            
            if not username or not password:
                print("❌ CANSPACE credentials not set")
                return False
            
            dns = CanspaceDNS(username, password, self.domain)
            
            # Create A records for FTP subdomains
            for subdomain in self.ftp_subdomains:
                try:
                    dns.create_dns_record("A", subdomain, server_ip)
                    print(f"✅ Created A record: {subdomain}.{self.domain} → {server_ip}")
                except Exception as e:
                    print(f"❌ Failed to create {subdomain}: {e}")
            
            # Create CNAME for alternative access
            try:
                dns.create_dns_record("CNAME", "secure-ftp", f"ftp.{self.domain}")
                print(f"✅ Created CNAME: secure-ftp.{self.domain} → ftp.{self.domain}")
            except Exception as e:
                print(f"❌ Failed to create CNAME: {e}")
        
        # Add TXT record for FTP service identification
        txt_content = f"FTP Service Active - {datetime.now().isoformat()}"
        try:
            if provider == "cloudflare":
                dns.update_or_create("TXT", f"_ftp.{self.domain}", txt_content)
            else:
                dns.create_dns_record("TXT", "_ftp", txt_content)
            print(f"✅ Created TXT record for FTP service identification")
        except:
            pass
        
        print("\n✅ FTP subdomain DNS setup complete!")
        print(f"\n📋 FTP Access Points:")
        for subdomain in self.ftp_subdomains:
            print(f"   - ftp://{subdomain}.{self.domain}")
        
        return True
    
    def generate_ftp_config(self):
        """Generate FTP configuration file"""
        config = {
            "primary_ftp": {
                "host": f"ftp.{self.domain}",
                "port": 21,
                "secure_port": 990,
                "protocol": "ftps",
                "passive_mode": True
            },
            "alternative_hosts": [
                f"files.{self.domain}",
                f"upload.{self.domain}",
                f"secure-ftp.{self.domain}"
            ],
            "cdn_endpoint": f"cdn.{self.domain}",
            "web_access": f"https://files.{self.domain}",
            "accounts": [
                {
                    "username": "admin",
                    "home_directory": "/public_html",
                    "permissions": "read,write,delete"
                },
                {
                    "username": "upload",
                    "home_directory": "/public_html/uploads",
                    "permissions": "write"
                },
                {
                    "username": "readonly",
                    "home_directory": "/public_html",
                    "permissions": "read"
                }
            ],
            "security": {
                "require_tls": True,
                "min_tls_version": "1.2",
                "allowed_ips": [],
                "rate_limiting": {
                    "enabled": True,
                    "max_connections_per_ip": 5,
                    "max_uploads_per_hour": 100
                }
            },
            "quotas": {
                "default_user_quota": "500MB",
                "max_file_size": "100MB",
                "total_space": "10GB"
            }
        }
        
        # Save configuration
        config_file = "ftp-subdomain-config.json"
        with open(config_file, 'w') as f:
            json.dump(config, f, indent=2)
        
        print(f"\n📄 FTP configuration saved to {config_file}")
        return config
    
    def create_nginx_config(self):
        """Create Nginx configuration for web-based FTP access"""
        nginx_config = """# FTP Web Interface Configuration
server {
    listen 80;
    listen [::]:80;
    server_name files.leo.pvthostel.com upload.leo.pvthostel.com;
    
    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name files.leo.pvthostel.com;
    
    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/leo.pvthostel.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/leo.pvthostel.com/privkey.pem;
    
    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # Document Root
    root /var/www/ftp-files;
    index index.html index.php;
    
    # File Browser
    location / {
        autoindex on;
        autoindex_exact_size off;
        autoindex_localtime on;
        autoindex_format html;
    }
    
    # Upload endpoint
    location /upload {
        client_max_body_size 100M;
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    # PHP Support (if using web FTP client)
    location ~ \\.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/var/run/php/php8.1-fpm.sock;
    }
    
    # Deny access to hidden files
    location ~ /\\. {
        deny all;
    }
}

# CDN Configuration
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name cdn.leo.pvthostel.com;
    
    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/leo.pvthostel.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/leo.pvthostel.com/privkey.pem;
    
    # Cache Headers
    location ~* \\.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
        add_header Access-Control-Allow-Origin "*";
    }
    
    # Document Root
    root /var/www/cdn;
    
    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}"""
        
        # Save Nginx configuration
        with open("nginx-ftp-web.conf", 'w') as f:
            f.write(nginx_config)
        
        print("📄 Nginx configuration saved to nginx-ftp-web.conf")
        return nginx_config
    
    def create_vsftpd_config(self):
        """Create vsftpd configuration for FTP server"""
        vsftpd_config = """# vsftpd Configuration for leo.pvthostel.com
listen=YES
listen_ipv6=NO
anonymous_enable=NO
local_enable=YES
write_enable=YES
local_umask=022
dirmessage_enable=YES
use_localtime=YES
xferlog_enable=YES
connect_from_port_20=YES
xferlog_file=/var/log/vsftpd.log
xferlog_std_format=YES
ftpd_banner=Welcome to LEO PVT Hostel FTP Service

# Security
chroot_local_user=YES
allow_writeable_chroot=YES
secure_chroot_dir=/var/run/vsftpd/empty
pam_service_name=vsftpd
rsa_cert_file=/etc/ssl/certs/ssl-cert-snakeoil.pem
rsa_private_key_file=/etc/ssl/private/ssl-cert-snakeoil.key
ssl_enable=YES
force_local_data_ssl=YES
force_local_logins_ssl=YES
ssl_tlsv1=YES
ssl_sslv2=NO
ssl_sslv3=NO
require_ssl_reuse=NO
ssl_ciphers=HIGH

# Performance
idle_session_timeout=600
data_connection_timeout=120
max_clients=50
max_per_ip=5

# Passive mode
pasv_enable=YES
pasv_min_port=40000
pasv_max_port=40100
pasv_address=YOUR_SERVER_IP

# User Configuration
userlist_enable=YES
userlist_file=/etc/vsftpd.userlist
userlist_deny=NO

# Logging
log_ftp_protocol=YES
debug_ssl=YES

# Custom Users Directory
local_root=/home/$USER/ftp
user_sub_token=$USER"""
        
        # Save vsftpd configuration
        with open("vsftpd.conf", 'w') as f:
            f.write(vsftpd_config)
        
        print("📄 vsftpd configuration saved to vsftpd.conf")
        
        # Create user list file
        userlist = """# vsftpd userlist
admin
upload
readonly
ftpuser1
ftpuser2"""
        
        with open("vsftpd.userlist", 'w') as f:
            f.write(userlist)
        
        print("📄 vsftpd userlist saved to vsftpd.userlist")
        
        return vsftpd_config


def main():
    """Main setup function"""
    print("🚀 FTP Subdomain Setup for leo.pvthostel.com")
    print("=" * 50)
    
    setup = FTPSubdomainSetup()
    
    # Choose DNS provider
    print("\nSelect DNS provider:")
    print("1. Cloudflare")
    print("2. Canspace.ca")
    print("3. Both")
    
    choice = input("\nEnter choice (1-3): ").strip()
    
    if choice == "1":
        setup.setup_dns_records("cloudflare")
    elif choice == "2":
        setup.setup_dns_records("canspace")
    elif choice == "3":
        setup.setup_dns_records("cloudflare")
        print("\n" + "-" * 50 + "\n")
        setup.setup_dns_records("canspace")
    else:
        print("❌ Invalid choice")
        return
    
    # Generate configurations
    print("\n" + "=" * 50)
    print("📋 Generating FTP Configurations")
    print("=" * 50)
    
    setup.generate_ftp_config()
    setup.create_nginx_config()
    setup.create_vsftpd_config()
    
    # Print next steps
    print("\n" + "=" * 50)
    print("📝 Next Steps:")
    print("=" * 50)
    print("""
1. Install FTP server:
   sudo apt-get install vsftpd
   
2. Copy vsftpd configuration:
   sudo cp vsftpd.conf /etc/vsftpd.conf
   sudo cp vsftpd.userlist /etc/vsftpd.userlist
   
3. Create FTP users:
   sudo useradd -m ftpuser1
   sudo passwd ftpuser1
   
4. Set up SSL certificate:
   sudo certbot certonly --standalone -d ftp.leo.pvthostel.com
   
5. Configure firewall:
   sudo ufw allow 20/tcp
   sudo ufw allow 21/tcp
   sudo ufw allow 990/tcp
   sudo ufw allow 40000:40100/tcp
   
6. Install web interface (optional):
   sudo cp nginx-ftp-web.conf /etc/nginx/sites-available/ftp-web
   sudo ln -s /etc/nginx/sites-available/ftp-web /etc/nginx/sites-enabled/
   sudo nginx -t && sudo systemctl reload nginx
   
7. Start FTP service:
   sudo systemctl restart vsftpd
   sudo systemctl enable vsftpd
   
8. Test FTP connection:
   ftp ftp.leo.pvthostel.com
""")
    
    print("\n✅ FTP subdomain setup complete!")
    print(f"🌐 FTP will be accessible at:")
    print(f"   - ftp://ftp.leo.pvthostel.com")
    print(f"   - ftps://secure-ftp.leo.pvthostel.com:990")
    print(f"   - https://files.leo.pvthostel.com (web interface)")


if __name__ == "__main__":
    main()