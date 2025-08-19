#!/usr/bin/env python3
"""
Unified DNS Manager for leo.pvthostel.com
Manages DNS across multiple providers (Cloudflare and Canspace.ca)
"""

import os
import sys
import json
from typing import Dict, List, Optional
from datetime import datetime
from cloudflare_dns import CloudflareDNS
from canspace_dns import CanspaceDNS

class UnifiedDNSManager:
    def __init__(self, config_file: str = "dns-config.json"):
        """
        Initialize unified DNS manager
        
        Args:
            config_file: Path to configuration file
        """
        self.config_file = config_file
        self.config = self.load_config()
        self.providers = {}
        
        # Initialize providers based on config
        self.init_providers()
    
    def load_config(self) -> Dict:
        """Load configuration from file or environment"""
        if os.path.exists(self.config_file):
            with open(self.config_file, 'r') as f:
                return json.load(f)
        
        # Default configuration
        return {
            "domain": "leo.pvthostel.com",
            "primary_provider": "cloudflare",
            "providers": {
                "cloudflare": {
                    "enabled": True,
                    "api_token": os.getenv("CLOUDFLARE_API_TOKEN"),
                    "zone_id": os.getenv("CLOUDFLARE_ZONE_ID")
                },
                "canspace": {
                    "enabled": True,
                    "username": os.getenv("CANSPACE_USERNAME"),
                    "password": os.getenv("CANSPACE_PASSWORD")
                }
            },
            "records": []
        }
    
    def save_config(self):
        """Save configuration to file"""
        with open(self.config_file, 'w') as f:
            json.dump(self.config, f, indent=2)
        print(f"✅ Configuration saved to {self.config_file}")
    
    def init_providers(self):
        """Initialize DNS providers"""
        # Initialize Cloudflare if enabled
        if self.config["providers"]["cloudflare"]["enabled"]:
            cf_config = self.config["providers"]["cloudflare"]
            if cf_config.get("api_token"):
                self.providers["cloudflare"] = CloudflareDNS(
                    cf_config["api_token"],
                    cf_config.get("zone_id")
                )
                print("✅ Cloudflare provider initialized")
            else:
                print("⚠️ Cloudflare API token not configured")
        
        # Initialize Canspace if enabled
        if self.config["providers"]["canspace"]["enabled"]:
            cs_config = self.config["providers"]["canspace"]
            if cs_config.get("username") and cs_config.get("password"):
                self.providers["canspace"] = CanspaceDNS(
                    cs_config["username"],
                    cs_config["password"],
                    self.config["domain"]
                )
                print("✅ Canspace provider initialized")
            else:
                print("⚠️ Canspace credentials not configured")
    
    def sync_records(self, source: str = None, target: str = None):
        """
        Sync DNS records between providers
        
        Args:
            source: Source provider (default: primary_provider)
            target: Target provider (default: all other providers)
        """
        if not source:
            source = self.config["primary_provider"]
        
        if source not in self.providers:
            print(f"❌ Source provider {source} not available")
            return
        
        # Get records from source
        print(f"📥 Fetching records from {source}...")
        source_provider = self.providers[source]
        
        if source == "cloudflare":
            records = source_provider.list_dns_records()
            formatted_records = []
            
            for record in records:
                formatted_records.append({
                    "type": record["type"],
                    "name": record["name"],
                    "value": record["content"],
                    "ttl": record.get("ttl", 1),
                    "proxied": record.get("proxied", False),
                    "priority": record.get("priority")
                })
        else:  # canspace
            records = source_provider.list_dns_records()
            formatted_records = []
            
            for record in records:
                formatted_records.append({
                    "type": record["type"],
                    "name": record["name"],
                    "value": record["data"],
                    "ttl": record.get("ttl", 14400),
                    "priority": record.get("priority")
                })
        
        # Store in config for reference
        self.config["records"] = formatted_records
        self.config["last_sync"] = datetime.now().isoformat()
        
        # Sync to target providers
        targets = [target] if target else [p for p in self.providers if p != source]
        
        for target_name in targets:
            if target_name not in self.providers:
                continue
            
            print(f"\n📤 Syncing to {target_name}...")
            target_provider = self.providers[target_name]
            
            for record in formatted_records:
                # Skip system records
                if record["type"] in ["NS", "SOA"]:
                    continue
                
                try:
                    if target_name == "cloudflare":
                        target_provider.update_or_create(
                            record["type"],
                            record["name"],
                            record["value"],
                            ttl=record.get("ttl", 1),
                            proxied=record.get("proxied", False),
                            priority=record.get("priority")
                        )
                    else:  # canspace
                        target_provider.create_dns_record(
                            record["type"],
                            record["name"],
                            record["value"],
                            ttl=record.get("ttl", 14400),
                            priority=record.get("priority")
                        )
                    
                    print(f"  ✅ {record['type']} {record['name']}")
                except Exception as e:
                    print(f"  ❌ Failed to sync {record['name']}: {e}")
        
        self.save_config()
        print(f"\n✅ Sync completed. {len(formatted_records)} records processed.")
    
    def apply_template(self, template: str):
        """Apply a predefined DNS template"""
        templates = {
            "vercel": {
                "description": "Configure DNS for Vercel deployment",
                "records": [
                    {"type": "A", "name": "@", "value": "76.76.21.21"},
                    {"type": "CNAME", "name": "www", "value": "cname.vercel-dns.com"}
                ]
            },
            "github-pages": {
                "description": "Configure DNS for GitHub Pages",
                "records": [
                    {"type": "A", "name": "@", "value": "185.199.108.153"},
                    {"type": "A", "name": "@", "value": "185.199.109.153"},
                    {"type": "A", "name": "@", "value": "185.199.110.153"},
                    {"type": "A", "name": "@", "value": "185.199.111.153"},
                    {"type": "CNAME", "name": "www", "value": "{username}.github.io"}
                ]
            },
            "google-workspace": {
                "description": "Configure MX records for Google Workspace",
                "records": [
                    {"type": "MX", "name": "@", "value": "aspmx.l.google.com", "priority": 1},
                    {"type": "MX", "name": "@", "value": "alt1.aspmx.l.google.com", "priority": 5},
                    {"type": "MX", "name": "@", "value": "alt2.aspmx.l.google.com", "priority": 5},
                    {"type": "MX", "name": "@", "value": "alt3.aspmx.l.google.com", "priority": 10},
                    {"type": "MX", "name": "@", "value": "alt4.aspmx.l.google.com", "priority": 10},
                    {"type": "TXT", "name": "@", "value": "v=spf1 include:_spf.google.com ~all"}
                ]
            },
            "office365": {
                "description": "Configure MX records for Office 365",
                "records": [
                    {"type": "MX", "name": "@", "value": "{domain}.mail.protection.outlook.com", "priority": 0},
                    {"type": "TXT", "name": "@", "value": "v=spf1 include:spf.protection.outlook.com -all"}
                ]
            }
        }
        
        if template not in templates:
            print(f"❌ Unknown template: {template}")
            print(f"Available templates: {', '.join(templates.keys())}")
            return
        
        template_data = templates[template]
        print(f"\n📋 Applying template: {template_data['description']}")
        
        # Apply to all enabled providers
        for provider_name, provider in self.providers.items():
            print(f"\n🔧 Configuring {provider_name}...")
            
            for record in template_data["records"]:
                # Replace placeholders
                name = record["name"].replace("@", self.config["domain"])
                value = record["value"]
                
                # Handle template variables
                if "{domain}" in value:
                    value = value.replace("{domain}", self.config["domain"].replace(".", "-"))
                if "{username}" in value:
                    username = input("Enter GitHub username: ")
                    value = value.replace("{username}", username)
                
                try:
                    if provider_name == "cloudflare":
                        provider.update_or_create(
                            record["type"],
                            name,
                            value,
                            priority=record.get("priority")
                        )
                    else:  # canspace
                        provider.create_dns_record(
                            record["type"],
                            name,
                            value,
                            priority=record.get("priority")
                        )
                    
                    print(f"  ✅ {record['type']} {name} → {value}")
                except Exception as e:
                    print(f"  ❌ Failed: {e}")
        
        print(f"\n✅ Template '{template}' applied successfully")
    
    def compare_providers(self):
        """Compare DNS records across providers"""
        if len(self.providers) < 2:
            print("❌ Need at least 2 providers to compare")
            return
        
        provider_records = {}
        
        # Fetch records from all providers
        for name, provider in self.providers.items():
            print(f"📥 Fetching from {name}...")
            
            if name == "cloudflare":
                records = provider.list_dns_records()
                provider_records[name] = {
                    f"{r['type']}:{r['name']}": r["content"]
                    for r in records
                    if r["type"] not in ["NS", "SOA"]
                }
            else:  # canspace
                records = provider.list_dns_records()
                provider_records[name] = {
                    f"{r['type']}:{r['name']}": r["data"]
                    for r in records
                    if r["type"] not in ["NS", "SOA"]
                }
        
        # Find differences
        all_keys = set()
        for records in provider_records.values():
            all_keys.update(records.keys())
        
        print(f"\n📊 DNS Record Comparison\n")
        print(f"{'Record':<40} {'Cloudflare':<30} {'Canspace':<30} {'Status'}")
        print("-" * 110)
        
        differences = []
        
        for key in sorted(all_keys):
            cf_value = provider_records.get("cloudflare", {}).get(key, "—")
            cs_value = provider_records.get("canspace", {}).get(key, "—")
            
            if cf_value == cs_value:
                status = "✅ Synced"
            elif cf_value == "—":
                status = "⚠️ Missing in Cloudflare"
                differences.append(key)
            elif cs_value == "—":
                status = "⚠️ Missing in Canspace"
                differences.append(key)
            else:
                status = "❌ Different"
                differences.append(key)
            
            print(f"{key:<40} {cf_value:<30} {cs_value:<30} {status}")
        
        if differences:
            print(f"\n⚠️ Found {len(differences)} differences")
            print("Run 'sync' command to synchronize records")
        else:
            print(f"\n✅ All records are synchronized")
    
    def bulk_update(self, updates_file: str):
        """Apply bulk DNS updates from JSON file"""
        with open(updates_file, 'r') as f:
            updates = json.load(f)
        
        print(f"📋 Applying {len(updates)} DNS updates...")
        
        for provider_name, provider in self.providers.items():
            print(f"\n🔧 Updating {provider_name}...")
            
            for update in updates:
                action = update.get("action", "create")
                
                try:
                    if action == "create":
                        if provider_name == "cloudflare":
                            provider.create_dns_record(
                                update["type"],
                                update["name"],
                                update["value"],
                                ttl=update.get("ttl", 1),
                                proxied=update.get("proxied", False),
                                priority=update.get("priority")
                            )
                        else:  # canspace
                            provider.create_dns_record(
                                update["type"],
                                update["name"],
                                update["value"],
                                ttl=update.get("ttl", 14400),
                                priority=update.get("priority")
                            )
                    
                    elif action == "delete":
                        record = provider.find_record(update["name"], update.get("type"))
                        if record:
                            if provider_name == "cloudflare":
                                provider.delete_dns_record(record["id"])
                            else:  # canspace
                                provider.delete_dns_record(record["line"])
                    
                    print(f"  ✅ {action} {update.get('type', '')} {update['name']}")
                    
                except Exception as e:
                    print(f"  ❌ Failed: {e}")
        
        print(f"\n✅ Bulk update completed")


def main():
    """CLI interface for unified DNS management"""
    if len(sys.argv) < 2:
        print("""
🌐 Unified DNS Manager for leo.pvthostel.com

Usage: python dns-manager.py [command] [options]

Commands:
    list [provider]      - List DNS records (all providers or specific)
    sync [source] [target] - Sync records between providers
    compare             - Compare records across providers
    template [name]     - Apply DNS template (vercel, github-pages, google-workspace, office365)
    bulk [file]         - Apply bulk updates from JSON file
    export [file]       - Export current configuration
    
Environment Variables:
    CLOUDFLARE_API_TOKEN - Cloudflare API token
    CLOUDFLARE_ZONE_ID   - Cloudflare zone ID (optional)
    CANSPACE_USERNAME    - Canspace/cPanel username
    CANSPACE_PASSWORD    - Canspace/cPanel password
    
Examples:
    python dns-manager.py list
    python dns-manager.py sync cloudflare canspace
    python dns-manager.py compare
    python dns-manager.py template vercel
    python dns-manager.py bulk updates.json
    
Templates:
    vercel         - Configure for Vercel deployment
    github-pages   - Configure for GitHub Pages
    google-workspace - Configure Google Workspace email
    office365      - Configure Office 365 email
""")
        sys.exit(0)
    
    manager = UnifiedDNSManager()
    command = sys.argv[1].lower()
    
    try:
        if command == "list":
            provider = sys.argv[2] if len(sys.argv) > 2 else None
            
            if provider and provider in manager.providers:
                # List for specific provider
                print(f"\n📋 DNS Records from {provider}\n")
                
                if provider == "cloudflare":
                    records = manager.providers[provider].list_dns_records()
                    print(f"{'Type':<8} {'Name':<30} {'Content':<40} {'Proxied':<8}")
                    print("-" * 86)
                    
                    for record in records:
                        proxied = "Yes" if record.get("proxied") else "No"
                        print(f"{record['type']:<8} {record['name']:<30} {record['content']:<40} {proxied:<8}")
                else:  # canspace
                    records = manager.providers[provider].list_dns_records()
                    print(f"{'Type':<8} {'Name':<30} {'Value':<40} {'TTL':<8}")
                    print("-" * 86)
                    
                    for record in records:
                        print(f"{record['type']:<8} {record['name']:<30} {record['data']:<40} {record.get('ttl', 'N/A'):<8}")
            else:
                # List for all providers
                for provider_name in manager.providers:
                    print(f"\n📋 DNS Records from {provider_name}\n")
                    
                    if provider_name == "cloudflare":
                        records = manager.providers[provider_name].list_dns_records()
                        for record in records[:5]:  # Show first 5
                            print(f"  {record['type']:<8} {record['name']:<30} {record['content']}")
                    else:  # canspace
                        records = manager.providers[provider_name].list_dns_records()
                        for record in records[:5]:  # Show first 5
                            print(f"  {record['type']:<8} {record['name']:<30} {record['data']}")
                    
                    if len(records) > 5:
                        print(f"  ... and {len(records) - 5} more records")
        
        elif command == "sync":
            source = sys.argv[2] if len(sys.argv) > 2 else None
            target = sys.argv[3] if len(sys.argv) > 3 else None
            manager.sync_records(source, target)
        
        elif command == "compare":
            manager.compare_providers()
        
        elif command == "template":
            if len(sys.argv) < 3:
                print("Available templates: vercel, github-pages, google-workspace, office365")
                sys.exit(1)
            
            manager.apply_template(sys.argv[2])
        
        elif command == "bulk":
            if len(sys.argv) < 3:
                print("Usage: python dns-manager.py bulk updates.json")
                sys.exit(1)
            
            manager.bulk_update(sys.argv[2])
        
        elif command == "export":
            filename = sys.argv[2] if len(sys.argv) > 2 else "dns-config.json"
            manager.save_config()
            print(f"✅ Configuration exported to {filename}")
        
        else:
            print(f"❌ Unknown command: {command}")
            sys.exit(1)
            
    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()