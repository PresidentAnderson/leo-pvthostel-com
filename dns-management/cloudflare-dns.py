#!/usr/bin/env python3
"""
Cloudflare DNS Management Script for leo.pvthostel.com
Programmatically manage DNS records via Cloudflare API
"""

import requests
import json
import sys
from typing import Dict, List, Optional
import os
from datetime import datetime

class CloudflareDNS:
    def __init__(self, api_token: str, zone_id: str = None):
        """
        Initialize Cloudflare DNS manager
        
        Args:
            api_token: Cloudflare API token with DNS edit permissions
            zone_id: Zone ID for the domain (optional, can be auto-detected)
        """
        self.api_token = api_token
        self.zone_id = zone_id
        self.base_url = "https://api.cloudflare.com/client/v4"
        self.headers = {
            "Authorization": f"Bearer {api_token}",
            "Content-Type": "application/json"
        }
        
        if not zone_id:
            self.zone_id = self.get_zone_id("leo.pvthostel.com")
    
    def get_zone_id(self, domain: str) -> str:
        """Get zone ID for a domain"""
        # Extract base domain (remove subdomains)
        parts = domain.split('.')
        if len(parts) > 2:
            base_domain = '.'.join(parts[-2:])
        else:
            base_domain = domain
            
        response = requests.get(
            f"{self.base_url}/zones",
            headers=self.headers,
            params={"name": base_domain}
        )
        
        if response.status_code == 200:
            data = response.json()
            if data["result"]:
                return data["result"][0]["id"]
        
        raise Exception(f"Could not find zone ID for {base_domain}")
    
    def list_dns_records(self, record_type: str = None) -> List[Dict]:
        """List all DNS records for the zone"""
        params = {}
        if record_type:
            params["type"] = record_type
            
        response = requests.get(
            f"{self.base_url}/zones/{self.zone_id}/dns_records",
            headers=self.headers,
            params=params
        )
        
        if response.status_code == 200:
            return response.json()["result"]
        else:
            raise Exception(f"Failed to list DNS records: {response.text}")
    
    def create_dns_record(self, record_type: str, name: str, content: str, 
                          ttl: int = 1, proxied: bool = False, 
                          priority: int = None) -> Dict:
        """
        Create a new DNS record
        
        Args:
            record_type: Type of record (A, AAAA, CNAME, MX, TXT, etc.)
            name: Name of record (e.g., "leo.pvthostel.com" or "@" for root)
            content: Content of record (IP address, domain, text, etc.)
            ttl: Time to live (1 = automatic)
            proxied: Whether to proxy through Cloudflare
            priority: Priority for MX records
        """
        data = {
            "type": record_type,
            "name": name,
            "content": content,
            "ttl": ttl,
            "proxied": proxied
        }
        
        if priority is not None:
            data["priority"] = priority
            
        response = requests.post(
            f"{self.base_url}/zones/{self.zone_id}/dns_records",
            headers=self.headers,
            json=data
        )
        
        if response.status_code == 200:
            print(f"✅ Created {record_type} record for {name}")
            return response.json()["result"]
        else:
            raise Exception(f"Failed to create DNS record: {response.text}")
    
    def update_dns_record(self, record_id: str, **kwargs) -> Dict:
        """Update an existing DNS record"""
        response = requests.patch(
            f"{self.base_url}/zones/{self.zone_id}/dns_records/{record_id}",
            headers=self.headers,
            json=kwargs
        )
        
        if response.status_code == 200:
            print(f"✅ Updated DNS record {record_id}")
            return response.json()["result"]
        else:
            raise Exception(f"Failed to update DNS record: {response.text}")
    
    def delete_dns_record(self, record_id: str) -> bool:
        """Delete a DNS record"""
        response = requests.delete(
            f"{self.base_url}/zones/{self.zone_id}/dns_records/{record_id}",
            headers=self.headers
        )
        
        if response.status_code == 200:
            print(f"✅ Deleted DNS record {record_id}")
            return True
        else:
            raise Exception(f"Failed to delete DNS record: {response.text}")
    
    def find_record(self, name: str, record_type: str = None) -> Optional[Dict]:
        """Find a specific DNS record"""
        records = self.list_dns_records(record_type)
        for record in records:
            if record["name"] == name:
                return record
        return None
    
    def update_or_create(self, record_type: str, name: str, content: str, **kwargs):
        """Update existing record or create if it doesn't exist"""
        existing = self.find_record(name, record_type)
        
        if existing:
            return self.update_dns_record(existing["id"], content=content, **kwargs)
        else:
            return self.create_dns_record(record_type, name, content, **kwargs)
    
    def configure_for_vercel(self, subdomain: str = None):
        """Configure DNS for Vercel deployment"""
        if subdomain:
            # CNAME for subdomain
            name = f"{subdomain}.leo.pvthostel.com"
            self.update_or_create("CNAME", name, "cname.vercel-dns.com", proxied=False)
        else:
            # A records for root domain
            self.update_or_create("A", "leo.pvthostel.com", "76.76.21.21", proxied=False)
            # CNAME for www
            self.update_or_create("CNAME", "www.leo.pvthostel.com", "cname.vercel-dns.com", proxied=False)
        
        print("✅ DNS configured for Vercel")
    
    def configure_email(self, mx_records: List[Dict]):
        """Configure MX records for email"""
        for mx in mx_records:
            self.update_or_create(
                "MX", 
                "leo.pvthostel.com", 
                mx["server"], 
                priority=mx["priority"]
            )
        
        print("✅ Email MX records configured")
    
    def add_verification_txt(self, name: str, content: str):
        """Add TXT record for domain verification"""
        self.update_or_create("TXT", name, content)
        print(f"✅ Verification TXT record added for {name}")
    
    def export_config(self, filename: str = "dns-backup.json"):
        """Export all DNS records to JSON file"""
        records = self.list_dns_records()
        
        backup = {
            "zone_id": self.zone_id,
            "exported_at": datetime.now().isoformat(),
            "records": records
        }
        
        with open(filename, 'w') as f:
            json.dump(backup, f, indent=2)
        
        print(f"✅ Exported {len(records)} DNS records to {filename}")
        return filename
    
    def import_config(self, filename: str):
        """Import DNS records from JSON file"""
        with open(filename, 'r') as f:
            backup = json.load(f)
        
        for record in backup["records"]:
            # Skip system records
            if record["type"] in ["NS", "SOA"]:
                continue
                
            try:
                self.create_dns_record(
                    record["type"],
                    record["name"],
                    record["content"],
                    ttl=record.get("ttl", 1),
                    proxied=record.get("proxied", False),
                    priority=record.get("priority")
                )
            except Exception as e:
                print(f"⚠️ Failed to import {record['name']}: {e}")
        
        print(f"✅ Import completed")


def main():
    """CLI interface for DNS management"""
    if len(sys.argv) < 2:
        print("""
Usage: python cloudflare-dns.py [command] [options]

Commands:
    list [type]              - List DNS records (optionally filtered by type)
    create TYPE NAME CONTENT - Create new DNS record
    update NAME CONTENT      - Update existing record
    delete NAME              - Delete a record
    vercel [subdomain]       - Configure for Vercel deployment
    export [filename]        - Export DNS configuration
    import filename          - Import DNS configuration
    
Environment variables:
    CLOUDFLARE_API_TOKEN - Your Cloudflare API token
    CLOUDFLARE_ZONE_ID   - Zone ID (optional, auto-detected)
    
Examples:
    python cloudflare-dns.py list
    python cloudflare-dns.py create A api.leo.pvthostel.com 192.168.1.1
    python cloudflare-dns.py vercel
    python cloudflare-dns.py export dns-backup.json
""")
        sys.exit(1)
    
    # Get API credentials from environment
    api_token = os.getenv("CLOUDFLARE_API_TOKEN")
    zone_id = os.getenv("CLOUDFLARE_ZONE_ID")
    
    if not api_token:
        print("❌ Error: CLOUDFLARE_API_TOKEN environment variable not set")
        print("Get your API token from: https://dash.cloudflare.com/profile/api-tokens")
        sys.exit(1)
    
    dns = CloudflareDNS(api_token, zone_id)
    command = sys.argv[1].lower()
    
    try:
        if command == "list":
            record_type = sys.argv[2].upper() if len(sys.argv) > 2 else None
            records = dns.list_dns_records(record_type)
            
            print(f"\n📋 DNS Records for leo.pvthostel.com\n")
            print(f"{'Type':<8} {'Name':<30} {'Content':<40} {'Proxied':<8} {'TTL'}")
            print("-" * 90)
            
            for record in records:
                proxied = "Yes" if record.get("proxied") else "No"
                ttl = "Auto" if record["ttl"] == 1 else str(record["ttl"])
                print(f"{record['type']:<8} {record['name']:<30} {record['content']:<40} {proxied:<8} {ttl}")
        
        elif command == "create":
            if len(sys.argv) < 5:
                print("Usage: python cloudflare-dns.py create TYPE NAME CONTENT")
                sys.exit(1)
            
            record_type = sys.argv[2].upper()
            name = sys.argv[3]
            content = sys.argv[4]
            
            dns.create_dns_record(record_type, name, content)
        
        elif command == "update":
            if len(sys.argv) < 4:
                print("Usage: python cloudflare-dns.py update NAME CONTENT")
                sys.exit(1)
            
            name = sys.argv[2]
            content = sys.argv[3]
            
            record = dns.find_record(name)
            if record:
                dns.update_dns_record(record["id"], content=content)
            else:
                print(f"❌ Record {name} not found")
        
        elif command == "delete":
            if len(sys.argv) < 3:
                print("Usage: python cloudflare-dns.py delete NAME")
                sys.exit(1)
            
            name = sys.argv[2]
            record = dns.find_record(name)
            
            if record:
                dns.delete_dns_record(record["id"])
            else:
                print(f"❌ Record {name} not found")
        
        elif command == "vercel":
            subdomain = sys.argv[2] if len(sys.argv) > 2 else None
            dns.configure_for_vercel(subdomain)
        
        elif command == "export":
            filename = sys.argv[2] if len(sys.argv) > 2 else "dns-backup.json"
            dns.export_config(filename)
        
        elif command == "import":
            if len(sys.argv) < 3:
                print("Usage: python cloudflare-dns.py import filename")
                sys.exit(1)
            
            dns.import_config(sys.argv[2])
        
        else:
            print(f"❌ Unknown command: {command}")
            sys.exit(1)
            
    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()