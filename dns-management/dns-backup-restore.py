#!/usr/bin/env python3
"""
DNS Backup and Restore System for leo.pvthostel.com
Automated backup, versioning, and restoration of DNS configurations
"""

import json
import os
import sys
import time
import shutil
from datetime import datetime, timedelta
from typing import Dict, List, Optional
import subprocess
import hashlib

class DNSBackupRestore:
    def __init__(self, domain: str = "leo.pvthostel.com"):
        """
        Initialize DNS backup and restore system
        
        Args:
            domain: Domain to manage backups for
        """
        self.domain = domain
        self.backup_dir = "/Volumes/DevOps/Projects/02-pvthostel-domains/leo.pvthostel.com/dns-management/backups"
        self.archive_dir = f"{self.backup_dir}/archive"
        self.config_file = "dns-config.json"
        
        # Create directories if they don't exist
        os.makedirs(self.backup_dir, exist_ok=True)
        os.makedirs(self.archive_dir, exist_ok=True)
        
        # Import DNS managers
        try:
            from cloudflare_dns import CloudflareDNS
            from canspace_dns import CanspaceDNS
            self.cloudflare_available = True
            self.canspace_available = True
        except ImportError:
            print("⚠️ DNS manager modules not available")
            self.cloudflare_available = False
            self.canspace_available = False
    
    def get_backup_filename(self, provider: str = "unified") -> str:
        """Generate backup filename with timestamp"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        return f"{self.backup_dir}/dns_backup_{provider}_{timestamp}.json"
    
    def calculate_checksum(self, data: Dict) -> str:
        """Calculate checksum for backup data"""
        json_str = json.dumps(data, sort_keys=True)
        return hashlib.sha256(json_str.encode()).hexdigest()
    
    def backup_cloudflare(self) -> Optional[Dict]:
        """Backup Cloudflare DNS records"""
        if not self.cloudflare_available:
            return None
        
        api_token = os.getenv("CLOUDFLARE_API_TOKEN")
        if not api_token:
            print("⚠️ CLOUDFLARE_API_TOKEN not set")
            return None
        
        try:
            from cloudflare_dns import CloudflareDNS
            
            cf = CloudflareDNS(api_token)
            records = cf.list_dns_records()
            
            backup_data = {
                "provider": "cloudflare",
                "domain": self.domain,
                "timestamp": datetime.now().isoformat(),
                "records": records,
                "total_records": len(records)
            }
            
            # Add checksum
            backup_data["checksum"] = self.calculate_checksum(backup_data)
            
            return backup_data
        
        except Exception as e:
            print(f"❌ Error backing up Cloudflare: {e}")
            return None
    
    def backup_canspace(self) -> Optional[Dict]:
        """Backup Canspace DNS records"""
        if not self.canspace_available:
            return None
        
        username = os.getenv("CANSPACE_USERNAME")
        password = os.getenv("CANSPACE_PASSWORD")
        
        if not username or not password:
            print("⚠️ CANSPACE credentials not set")
            return None
        
        try:
            from canspace_dns import CanspaceDNS
            
            cs = CanspaceDNS(username, password, self.domain)
            records = cs.list_dns_records()
            
            backup_data = {
                "provider": "canspace",
                "domain": self.domain,
                "timestamp": datetime.now().isoformat(),
                "records": records,
                "total_records": len(records)
            }
            
            # Add checksum
            backup_data["checksum"] = self.calculate_checksum(backup_data)
            
            return backup_data
        
        except Exception as e:
            print(f"❌ Error backing up Canspace: {e}")
            return None
    
    def backup_dig(self) -> Dict:
        """Backup DNS records using dig command"""
        record_types = ["A", "AAAA", "CNAME", "MX", "TXT", "SRV", "CAA"]
        records = []
        
        for rtype in record_types:
            try:
                result = subprocess.run(
                    ["dig", "+short", rtype, self.domain],
                    capture_output=True,
                    text=True,
                    timeout=5
                )
                
                if result.stdout.strip():
                    for line in result.stdout.strip().split('\n'):
                        records.append({
                            "type": rtype,
                            "name": self.domain,
                            "value": line,
                            "source": "dig"
                        })
            except Exception:
                continue
        
        # Check www subdomain
        try:
            result = subprocess.run(
                ["dig", "+short", "CNAME", f"www.{self.domain}"],
                capture_output=True,
                text=True,
                timeout=5
            )
            
            if result.stdout.strip():
                records.append({
                    "type": "CNAME",
                    "name": f"www.{self.domain}",
                    "value": result.stdout.strip(),
                    "source": "dig"
                })
        except Exception:
            pass
        
        backup_data = {
            "provider": "dig",
            "domain": self.domain,
            "timestamp": datetime.now().isoformat(),
            "records": records,
            "total_records": len(records),
            "note": "Public DNS query results"
        }
        
        backup_data["checksum"] = self.calculate_checksum(backup_data)
        
        return backup_data
    
    def create_unified_backup(self) -> Dict:
        """Create unified backup from all sources"""
        print("📦 Creating unified backup...")
        
        unified = {
            "domain": self.domain,
            "timestamp": datetime.now().isoformat(),
            "sources": {},
            "unified_records": [],
            "metadata": {
                "backup_tool": "dns-backup-restore.py",
                "version": "1.0.0"
            }
        }
        
        # Backup from Cloudflare
        cf_backup = self.backup_cloudflare()
        if cf_backup:
            unified["sources"]["cloudflare"] = cf_backup
            print("  ✅ Cloudflare backed up")
        
        # Backup from Canspace
        cs_backup = self.backup_canspace()
        if cs_backup:
            unified["sources"]["canspace"] = cs_backup
            print("  ✅ Canspace backed up")
        
        # Backup using dig
        dig_backup = self.backup_dig()
        unified["sources"]["dig"] = dig_backup
        print("  ✅ Public DNS backed up")
        
        # Create unified record list
        seen_records = set()
        
        for source_name, source_data in unified["sources"].items():
            if source_data and "records" in source_data:
                for record in source_data["records"]:
                    # Create unique key
                    if isinstance(record, dict):
                        key = f"{record.get('type', '')}:{record.get('name', '')}:{record.get('value', record.get('content', record.get('data', '')))}"
                        
                        if key not in seen_records:
                            seen_records.add(key)
                            unified["unified_records"].append({
                                "type": record.get("type"),
                                "name": record.get("name"),
                                "value": record.get("value", record.get("content", record.get("data"))),
                                "ttl": record.get("ttl", 3600),
                                "source": source_name
                            })
        
        unified["total_records"] = len(unified["unified_records"])
        unified["checksum"] = self.calculate_checksum(unified)
        
        return unified
    
    def save_backup(self, backup_data: Dict, filename: str = None) -> str:
        """Save backup to file"""
        if not filename:
            provider = backup_data.get("provider", "unified")
            filename = self.get_backup_filename(provider)
        
        with open(filename, 'w') as f:
            json.dump(backup_data, f, indent=2)
        
        print(f"💾 Backup saved to {filename}")
        
        # Create latest symlink
        latest_link = f"{self.backup_dir}/latest_{backup_data.get('provider', 'unified')}.json"
        if os.path.exists(latest_link):
            os.remove(latest_link)
        os.symlink(filename, latest_link)
        
        return filename
    
    def list_backups(self, days: int = 30) -> List[Dict]:
        """List available backups"""
        backups = []
        cutoff_date = datetime.now() - timedelta(days=days)
        
        for filename in os.listdir(self.backup_dir):
            if filename.startswith("dns_backup_") and filename.endswith(".json"):
                filepath = os.path.join(self.backup_dir, filename)
                
                # Get file info
                stat = os.stat(filepath)
                mod_time = datetime.fromtimestamp(stat.st_mtime)
                
                if mod_time >= cutoff_date:
                    # Load backup metadata
                    try:
                        with open(filepath, 'r') as f:
                            data = json.load(f)
                        
                        backups.append({
                            "filename": filename,
                            "filepath": filepath,
                            "size": stat.st_size,
                            "modified": mod_time.isoformat(),
                            "provider": data.get("provider", "unknown"),
                            "records": data.get("total_records", 0),
                            "checksum": data.get("checksum", "")
                        })
                    except Exception:
                        continue
        
        # Sort by modification time
        backups.sort(key=lambda x: x["modified"], reverse=True)
        
        return backups
    
    def verify_backup(self, filepath: str) -> bool:
        """Verify backup integrity"""
        try:
            with open(filepath, 'r') as f:
                data = json.load(f)
            
            stored_checksum = data.get("checksum", "")
            
            # Remove checksum from data for calculation
            data_copy = dict(data)
            if "checksum" in data_copy:
                del data_copy["checksum"]
            
            calculated_checksum = self.calculate_checksum(data_copy)
            
            if stored_checksum == calculated_checksum:
                print("✅ Backup integrity verified")
                return True
            else:
                print("❌ Backup integrity check failed")
                return False
        
        except Exception as e:
            print(f"❌ Error verifying backup: {e}")
            return False
    
    def compare_backups(self, file1: str, file2: str) -> Dict:
        """Compare two backup files"""
        with open(file1, 'r') as f:
            data1 = json.load(f)
        
        with open(file2, 'r') as f:
            data2 = json.load(f)
        
        # Extract records
        records1 = set()
        records2 = set()
        
        def extract_records(data):
            records = set()
            
            if "unified_records" in data:
                for r in data["unified_records"]:
                    key = f"{r['type']}:{r['name']}:{r['value']}"
                    records.add(key)
            elif "records" in data:
                for r in data["records"]:
                    if isinstance(r, dict):
                        value = r.get("value", r.get("content", r.get("data", "")))
                        key = f"{r.get('type', '')}:{r.get('name', '')}:{value}"
                        records.add(key)
            
            return records
        
        records1 = extract_records(data1)
        records2 = extract_records(data2)
        
        comparison = {
            "file1": os.path.basename(file1),
            "file2": os.path.basename(file2),
            "date1": data1.get("timestamp", ""),
            "date2": data2.get("timestamp", ""),
            "added": list(records2 - records1),
            "removed": list(records1 - records2),
            "unchanged": list(records1 & records2),
            "total_changes": len(records2 - records1) + len(records1 - records2)
        }
        
        return comparison
    
    def restore_backup(self, filepath: str, provider: str = None, dry_run: bool = True):
        """Restore DNS records from backup"""
        print(f"{'🔍 DRY RUN' if dry_run else '⚠️ RESTORE'}: {filepath}")
        
        # Verify backup first
        if not self.verify_backup(filepath):
            print("❌ Backup verification failed. Aborting restore.")
            return False
        
        with open(filepath, 'r') as f:
            backup_data = json.load(f)
        
        # Determine provider
        if not provider:
            provider = backup_data.get("provider", "cloudflare")
        
        print(f"Provider: {provider}")
        print(f"Records to restore: {backup_data.get('total_records', 0)}")
        
        if dry_run:
            print("\n📋 Records that would be restored:")
            
            if "unified_records" in backup_data:
                records = backup_data["unified_records"]
            elif "records" in backup_data:
                records = backup_data["records"]
            else:
                records = []
            
            for i, record in enumerate(records[:10], 1):
                if isinstance(record, dict):
                    rtype = record.get("type", "")
                    name = record.get("name", "")
                    value = record.get("value", record.get("content", record.get("data", "")))
                    print(f"  {i}. {rtype} {name} → {value}")
            
            if len(records) > 10:
                print(f"  ... and {len(records) - 10} more records")
            
            print("\n✅ Dry run complete. No changes made.")
            print("💡 Run with --no-dry-run to actually restore")
        
        else:
            # Create backup before restore
            print("\n💾 Creating backup before restore...")
            current_backup = self.create_unified_backup()
            pre_restore_file = self.save_backup(
                current_backup,
                f"{self.backup_dir}/pre_restore_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
            )
            
            print(f"✅ Pre-restore backup saved: {pre_restore_file}")
            
            # Perform restore
            print("\n⚠️ Starting restore process...")
            
            if provider == "cloudflare" and self.cloudflare_available:
                self.restore_to_cloudflare(backup_data)
            elif provider == "canspace" and self.canspace_available:
                self.restore_to_canspace(backup_data)
            else:
                print(f"❌ Provider {provider} not available for restore")
                return False
            
            print("\n✅ Restore complete!")
            print(f"💡 If issues occur, restore from: {pre_restore_file}")
        
        return True
    
    def restore_to_cloudflare(self, backup_data: Dict):
        """Restore records to Cloudflare"""
        from cloudflare_dns import CloudflareDNS
        
        api_token = os.getenv("CLOUDFLARE_API_TOKEN")
        cf = CloudflareDNS(api_token)
        
        if "unified_records" in backup_data:
            records = backup_data["unified_records"]
        elif "records" in backup_data:
            records = backup_data["records"]
        else:
            records = []
        
        for record in records:
            if isinstance(record, dict):
                try:
                    cf.update_or_create(
                        record.get("type"),
                        record.get("name"),
                        record.get("value", record.get("content")),
                        ttl=record.get("ttl", 1),
                        proxied=record.get("proxied", False),
                        priority=record.get("priority")
                    )
                    print(f"  ✅ Restored: {record.get('type')} {record.get('name')}")
                except Exception as e:
                    print(f"  ❌ Failed: {record.get('name')} - {e}")
    
    def restore_to_canspace(self, backup_data: Dict):
        """Restore records to Canspace"""
        from canspace_dns import CanspaceDNS
        
        username = os.getenv("CANSPACE_USERNAME")
        password = os.getenv("CANSPACE_PASSWORD")
        cs = CanspaceDNS(username, password, self.domain)
        
        if "unified_records" in backup_data:
            records = backup_data["unified_records"]
        elif "records" in backup_data:
            records = backup_data["records"]
        else:
            records = []
        
        for record in records:
            if isinstance(record, dict):
                try:
                    cs.create_dns_record(
                        record.get("type"),
                        record.get("name"),
                        record.get("value", record.get("data")),
                        ttl=record.get("ttl", 14400),
                        priority=record.get("priority")
                    )
                    print(f"  ✅ Restored: {record.get('type')} {record.get('name')}")
                except Exception as e:
                    print(f"  ❌ Failed: {record.get('name')} - {e}")
    
    def archive_old_backups(self, days: int = 30):
        """Archive backups older than specified days"""
        cutoff_date = datetime.now() - timedelta(days=days)
        archived = 0
        
        for filename in os.listdir(self.backup_dir):
            if filename.startswith("dns_backup_") and filename.endswith(".json"):
                filepath = os.path.join(self.backup_dir, filename)
                
                # Check file age
                stat = os.stat(filepath)
                mod_time = datetime.fromtimestamp(stat.st_mtime)
                
                if mod_time < cutoff_date:
                    # Move to archive
                    archive_path = os.path.join(self.archive_dir, filename)
                    shutil.move(filepath, archive_path)
                    archived += 1
        
        if archived > 0:
            print(f"📦 Archived {archived} old backup(s)")
    
    def cleanup_duplicates(self):
        """Remove duplicate backups with same checksum"""
        checksums = {}
        duplicates = []
        
        for filename in os.listdir(self.backup_dir):
            if filename.startswith("dns_backup_") and filename.endswith(".json"):
                filepath = os.path.join(self.backup_dir, filename)
                
                try:
                    with open(filepath, 'r') as f:
                        data = json.load(f)
                    
                    checksum = data.get("checksum", "")
                    
                    if checksum:
                        if checksum in checksums:
                            # Keep the older file, mark newer as duplicate
                            duplicates.append(filepath)
                        else:
                            checksums[checksum] = filepath
                
                except Exception:
                    continue
        
        if duplicates:
            print(f"🗑️ Found {len(duplicates)} duplicate backup(s)")
            for dup in duplicates:
                os.remove(dup)
                print(f"  Removed: {os.path.basename(dup)}")
        else:
            print("✅ No duplicate backups found")


def main():
    """CLI interface for DNS backup and restore"""
    if len(sys.argv) < 2:
        print("""
💾 DNS Backup and Restore System for leo.pvthostel.com

Usage: python dns-backup-restore.py [command] [options]

Commands:
    backup [provider]     - Create backup (all/cloudflare/canspace/dig)
    list [days]          - List backups from last N days (default: 30)
    verify <file>        - Verify backup integrity
    compare <file1> <file2> - Compare two backups
    restore <file> [--no-dry-run] - Restore from backup
    archive [days]       - Archive backups older than N days
    cleanup              - Remove duplicate backups
    
Examples:
    python dns-backup-restore.py backup
    python dns-backup-restore.py backup cloudflare
    python dns-backup-restore.py list 7
    python dns-backup-restore.py verify backups/latest_unified.json
    python dns-backup-restore.py compare backup1.json backup2.json
    python dns-backup-restore.py restore backup.json
    python dns-backup-restore.py restore backup.json --no-dry-run
    python dns-backup-restore.py archive 30
    python dns-backup-restore.py cleanup
""")
        sys.exit(0)
    
    manager = DNSBackupRestore()
    command = sys.argv[1].lower()
    
    try:
        if command == "backup":
            provider = sys.argv[2] if len(sys.argv) > 2 else "all"
            
            if provider in ["all", "unified"]:
                backup = manager.create_unified_backup()
                manager.save_backup(backup)
            elif provider == "cloudflare":
                backup = manager.backup_cloudflare()
                if backup:
                    manager.save_backup(backup)
            elif provider == "canspace":
                backup = manager.backup_canspace()
                if backup:
                    manager.save_backup(backup)
            elif provider == "dig":
                backup = manager.backup_dig()
                manager.save_backup(backup)
            else:
                print(f"❌ Unknown provider: {provider}")
        
        elif command == "list":
            days = int(sys.argv[2]) if len(sys.argv) > 2 else 30
            
            backups = manager.list_backups(days)
            
            if backups:
                print(f"\n📚 Backups from last {days} days:\n")
                print(f"{'Filename':<40} {'Provider':<12} {'Records':<10} {'Size':<10} {'Modified'}")
                print("-" * 100)
                
                for backup in backups:
                    size_kb = backup['size'] / 1024
                    print(f"{backup['filename']:<40} {backup['provider']:<12} {backup['records']:<10} {size_kb:.1f}KB {backup['modified']}")
                
                print(f"\nTotal: {len(backups)} backup(s)")
            else:
                print(f"No backups found from last {days} days")
        
        elif command == "verify":
            if len(sys.argv) < 3:
                print("Usage: python dns-backup-restore.py verify <file>")
                sys.exit(1)
            
            manager.verify_backup(sys.argv[2])
        
        elif command == "compare":
            if len(sys.argv) < 4:
                print("Usage: python dns-backup-restore.py compare <file1> <file2>")
                sys.exit(1)
            
            comparison = manager.compare_backups(sys.argv[2], sys.argv[3])
            
            print(f"\n📊 Backup Comparison")
            print(f"File 1: {comparison['file1']} ({comparison['date1']})")
            print(f"File 2: {comparison['file2']} ({comparison['date2']})")
            print(f"\nChanges: {comparison['total_changes']}")
            
            if comparison['added']:
                print(f"\n➕ Added ({len(comparison['added'])}):")
                for record in comparison['added'][:5]:
                    print(f"  {record}")
                if len(comparison['added']) > 5:
                    print(f"  ... and {len(comparison['added']) - 5} more")
            
            if comparison['removed']:
                print(f"\n➖ Removed ({len(comparison['removed'])}):")
                for record in comparison['removed'][:5]:
                    print(f"  {record}")
                if len(comparison['removed']) > 5:
                    print(f"  ... and {len(comparison['removed']) - 5} more")
            
            print(f"\n↔️ Unchanged: {len(comparison['unchanged'])} records")
        
        elif command == "restore":
            if len(sys.argv) < 3:
                print("Usage: python dns-backup-restore.py restore <file> [--no-dry-run]")
                sys.exit(1)
            
            dry_run = "--no-dry-run" not in sys.argv
            manager.restore_backup(sys.argv[2], dry_run=dry_run)
        
        elif command == "archive":
            days = int(sys.argv[2]) if len(sys.argv) > 2 else 30
            manager.archive_old_backups(days)
        
        elif command == "cleanup":
            manager.cleanup_duplicates()
        
        else:
            print(f"❌ Unknown command: {command}")
            sys.exit(1)
    
    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()