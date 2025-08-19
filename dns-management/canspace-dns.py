#!/usr/bin/env python3
"""
Canspace.ca DNS Management Script for leo.pvthostel.com
Manages DNS records via Canspace API or cPanel
"""

import requests
import json
import sys
import os
from typing import Dict, List, Optional
from datetime import datetime
import xml.etree.ElementTree as ET

class CanspaceDNS:
    def __init__(self, username: str, password: str, domain: str = "leo.pvthostel.com"):
        """
        Initialize Canspace DNS manager
        
        Args:
            username: Canspace/cPanel username
            password: Canspace/cPanel password or API token
            domain: Domain to manage
        """
        self.username = username
        self.password = password
        self.domain = domain
        self.base_url = None
        self.session = requests.Session()
        
        # Canspace typically uses cPanel, so we'll implement cPanel API
        self.detect_api_endpoint()
    
    def detect_api_endpoint(self):
        """Detect the correct API endpoint for Canspace"""
        # Common Canspace/cPanel endpoints
        possible_endpoints = [
            "https://cpanel.canspace.ca:2083",
            "https://server.canspace.ca:2083",
            f"https://{self.domain}:2083",
            "https://canspace.ca:2083"
        ]
        
        for endpoint in possible_endpoints:
            try:
                response = requests.get(f"{endpoint}/login", timeout=5)
                if response.status_code in [200, 401]:
                    self.base_url = endpoint
                    print(f"✅ Found Canspace endpoint: {endpoint}")
                    break
            except:
                continue
        
        if not self.base_url:
            # Fallback to standard cPanel port
            self.base_url = "https://cpanel.canspace.ca:2083"
            print(f"⚠️ Using default endpoint: {self.base_url}")
    
    def authenticate(self):
        """Authenticate with cPanel API"""
        auth_url = f"{self.base_url}/execute/Session/create"
        
        response = self.session.post(
            auth_url,
            auth=(self.username, self.password),
            data={
                "service": "cpaneld",
                "api.version": "1"
            }
        )
        
        if response.status_code == 200:
            data = response.json()
            if data.get("status") == 1:
                self.token = data.get("data", {}).get("token")
                print("✅ Authenticated with Canspace/cPanel")
                return True
        
        print("❌ Authentication failed")
        return False
    
    def list_dns_records(self, zone: str = None) -> List[Dict]:
        """List all DNS records for the domain"""
        if not zone:
            zone = self.domain
            
        url = f"{self.base_url}/execute/DNS/parse_zone"
        
        response = self.session.get(
            url,
            auth=(self.username, self.password),
            params={
                "zone": zone,
                "api.version": "1"
            }
        )
        
        if response.status_code == 200:
            data = response.json()
            if data.get("status") == 1:
                records = []
                for record in data.get("data", []):
                    records.append({
                        "line": record.get("line"),
                        "type": record.get("type"),
                        "name": record.get("name"),
                        "ttl": record.get("ttl"),
                        "data": record.get("data_b64") or record.get("address") or record.get("cname") or record.get("txtdata"),
                        "priority": record.get("priority")
                    })
                return records
        
        return []
    
    def create_dns_record(self, record_type: str, name: str, value: str, 
                          ttl: int = 14400, priority: int = None) -> bool:
        """Create a new DNS record"""
        
        # Map record types to cPanel API functions
        api_functions = {
            "A": "add_zone_record",
            "AAAA": "add_zone_record",
            "CNAME": "add_zone_record",
            "MX": "add_mx",
            "TXT": "add_zone_record",
            "SRV": "add_zone_record"
        }
        
        if record_type not in api_functions:
            print(f"❌ Unsupported record type: {record_type}")
            return False
        
        # Prepare the API call based on record type
        if record_type == "MX":
            url = f"{self.base_url}/execute/Email/add_mx"
            params = {
                "domain": self.domain,
                "exchanger": value,
                "priority": priority or 10,
                "api.version": "1"
            }
        else:
            url = f"{self.base_url}/execute/DNS/add_zone_record"
            params = {
                "domain": self.domain,
                "type": record_type,
                "name": name,
                "ttl": ttl,
                "api.version": "1"
            }
            
            # Add type-specific data field
            if record_type == "A":
                params["address"] = value
            elif record_type == "AAAA":
                params["address"] = value
            elif record_type == "CNAME":
                params["cname"] = value
            elif record_type == "TXT":
                params["txtdata"] = value
            elif record_type == "SRV":
                params["target"] = value
                if priority:
                    params["priority"] = priority
        
        response = self.session.post(
            url,
            auth=(self.username, self.password),
            data=params
        )
        
        if response.status_code == 200:
            data = response.json()
            if data.get("status") == 1:
                print(f"✅ Created {record_type} record for {name}")
                return True
            else:
                print(f"❌ Failed to create record: {data.get('errors')}")
        
        return False
    
    def update_dns_record(self, line_number: int, **kwargs) -> bool:
        """Update an existing DNS record by line number"""
        url = f"{self.base_url}/execute/DNS/edit_zone_record"
        
        params = {
            "domain": self.domain,
            "line": line_number,
            "api.version": "1"
        }
        params.update(kwargs)
        
        response = self.session.post(
            url,
            auth=(self.username, self.password),
            data=params
        )
        
        if response.status_code == 200:
            data = response.json()
            if data.get("status") == 1:
                print(f"✅ Updated DNS record at line {line_number}")
                return True
        
        return False
    
    def delete_dns_record(self, line_number: int) -> bool:
        """Delete a DNS record by line number"""
        url = f"{self.base_url}/execute/DNS/remove_zone_record"
        
        response = self.session.post(
            url,
            auth=(self.username, self.password),
            data={
                "domain": self.domain,
                "line": line_number,
                "api.version": "1"
            }
        )
        
        if response.status_code == 200:
            data = response.json()
            if data.get("status") == 1:
                print(f"✅ Deleted DNS record at line {line_number}")
                return True
        
        return False
    
    def find_record(self, name: str, record_type: str = None) -> Optional[Dict]:
        """Find a specific DNS record"""
        records = self.list_dns_records()
        
        for record in records:
            if record["name"] == name:
                if not record_type or record["type"] == record_type:
                    return record
        
        return None
    
    def configure_for_vercel(self):
        """Configure DNS for Vercel deployment"""
        # Add A record for root domain
        self.create_dns_record("A", self.domain, "76.76.21.21")
        
        # Add CNAME for www subdomain
        self.create_dns_record("CNAME", f"www.{self.domain}", "cname.vercel-dns.com")
        
        print("✅ DNS configured for Vercel deployment")
    
    def configure_email(self, mx_servers: List[Dict]):
        """Configure MX records for email"""
        for mx in mx_servers:
            self.create_dns_record(
                "MX",
                self.domain,
                mx["server"],
                priority=mx.get("priority", 10)
            )
        
        print("✅ Email MX records configured")
    
    def export_config(self, filename: str = "canspace-dns-backup.json"):
        """Export all DNS records to JSON file"""
        records = self.list_dns_records()
        
        backup = {
            "domain": self.domain,
            "exported_at": datetime.now().isoformat(),
            "provider": "Canspace.ca",
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
            try:
                self.create_dns_record(
                    record["type"],
                    record["name"],
                    record["data"],
                    ttl=record.get("ttl", 14400),
                    priority=record.get("priority")
                )
            except Exception as e:
                print(f"⚠️ Failed to import {record['name']}: {e}")
        
        print("✅ Import completed")
    
    def bulk_update(self, updates: List[Dict]):
        """Perform bulk DNS updates"""
        success_count = 0
        
        for update in updates:
            action = update.get("action", "create")
            
            if action == "create":
                if self.create_dns_record(
                    update["type"],
                    update["name"],
                    update["value"],
                    ttl=update.get("ttl", 14400),
                    priority=update.get("priority")
                ):
                    success_count += 1
            
            elif action == "update":
                record = self.find_record(update["name"], update.get("type"))
                if record:
                    if self.update_dns_record(
                        record["line"],
                        **update.get("params", {})
                    ):
                        success_count += 1
            
            elif action == "delete":
                record = self.find_record(update["name"], update.get("type"))
                if record:
                    if self.delete_dns_record(record["line"]):
                        success_count += 1
        
        print(f"✅ Bulk update completed: {success_count}/{len(updates)} successful")


def main():
    """CLI interface for Canspace DNS management"""
    if len(sys.argv) < 2:
        print("""
Usage: python canspace-dns.py [command] [options]

Commands:
    list                    - List all DNS records
    create TYPE NAME VALUE  - Create new DNS record
    update NAME VALUE       - Update existing record
    delete NAME             - Delete a record
    vercel                  - Configure for Vercel deployment
    export [filename]       - Export DNS configuration
    import filename         - Import DNS configuration
    
Environment variables:
    CANSPACE_USERNAME - Your Canspace/cPanel username
    CANSPACE_PASSWORD - Your Canspace/cPanel password
    
Examples:
    python canspace-dns.py list
    python canspace-dns.py create A api 192.168.1.1
    python canspace-dns.py vercel
    python canspace-dns.py export backup.json
""")
        sys.exit(1)
    
    # Get credentials from environment
    username = os.getenv("CANSPACE_USERNAME")
    password = os.getenv("CANSPACE_PASSWORD")
    
    if not username or not password:
        print("❌ Error: CANSPACE_USERNAME and CANSPACE_PASSWORD environment variables must be set")
        sys.exit(1)
    
    dns = CanspaceDNS(username, password)
    command = sys.argv[1].lower()
    
    try:
        if command == "list":
            records = dns.list_dns_records()
            
            print(f"\n📋 DNS Records for {dns.domain} (Canspace)\n")
            print(f"{'Type':<8} {'Name':<30} {'Value':<40} {'TTL':<8}")
            print("-" * 86)
            
            for record in records:
                print(f"{record['type']:<8} {record['name']:<30} {record['data']:<40} {record.get('ttl', 'N/A'):<8}")
        
        elif command == "create":
            if len(sys.argv) < 5:
                print("Usage: python canspace-dns.py create TYPE NAME VALUE")
                sys.exit(1)
            
            record_type = sys.argv[2].upper()
            name = sys.argv[3]
            value = sys.argv[4]
            
            dns.create_dns_record(record_type, name, value)
        
        elif command == "update":
            if len(sys.argv) < 4:
                print("Usage: python canspace-dns.py update NAME VALUE")
                sys.exit(1)
            
            name = sys.argv[2]
            value = sys.argv[3]
            
            record = dns.find_record(name)
            if record:
                # Update based on record type
                update_params = {}
                if record["type"] == "A":
                    update_params["address"] = value
                elif record["type"] == "CNAME":
                    update_params["cname"] = value
                elif record["type"] == "TXT":
                    update_params["txtdata"] = value
                
                dns.update_dns_record(record["line"], **update_params)
            else:
                print(f"❌ Record {name} not found")
        
        elif command == "delete":
            if len(sys.argv) < 3:
                print("Usage: python canspace-dns.py delete NAME")
                sys.exit(1)
            
            name = sys.argv[2]
            record = dns.find_record(name)
            
            if record:
                dns.delete_dns_record(record["line"])
            else:
                print(f"❌ Record {name} not found")
        
        elif command == "vercel":
            dns.configure_for_vercel()
        
        elif command == "export":
            filename = sys.argv[2] if len(sys.argv) > 2 else "canspace-dns-backup.json"
            dns.export_config(filename)
        
        elif command == "import":
            if len(sys.argv) < 3:
                print("Usage: python canspace-dns.py import filename")
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