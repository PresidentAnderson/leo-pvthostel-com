#!/usr/bin/env python3
"""
FTP Deployment Script for leo.pvthostel.com
Deploys web service to hosting provider via FTP
"""

import ftplib
import os
import sys
import json
import hashlib
from pathlib import Path
from datetime import datetime
import argparse
from typing import Dict, List, Set

class FTPDeployer:
    def __init__(self, config_file: str = "ftp-config.json"):
        """Initialize FTP deployer with configuration"""
        self.config = self.load_config(config_file)
        self.ftp = None
        self.deployed_files = set()
        self.skipped_files = set()
        self.failed_files = set()
        
    def load_config(self, config_file: str) -> Dict:
        """Load FTP configuration"""
        if os.path.exists(config_file):
            with open(config_file, 'r') as f:
                return json.load(f)
        
        # Default configuration
        return {
            "host": os.getenv("FTP_HOST", "ftp.leo.pvthostel.com"),
            "port": int(os.getenv("FTP_PORT", 21)),
            "username": os.getenv("FTP_USERNAME", ""),
            "password": os.getenv("FTP_PASSWORD", ""),
            "remote_path": os.getenv("FTP_REMOTE_PATH", "/public_html"),
            "local_path": os.getenv("FTP_LOCAL_PATH", "./dist"),
            "use_tls": os.getenv("FTP_USE_TLS", "true").lower() == "true",
            "passive_mode": True,
            "ignore_patterns": [
                ".git",
                ".env",
                "node_modules",
                "*.log",
                ".DS_Store",
                "Thumbs.db",
                "*.pyc",
                "__pycache__",
                ".vscode",
                ".idea"
            ],
            "file_permissions": {
                "directories": "755",
                "files": "644",
                "executables": "755"
            }
        }
    
    def connect(self) -> bool:
        """Establish FTP connection"""
        try:
            if self.config["use_tls"]:
                # Use FTP over TLS for security
                self.ftp = ftplib.FTP_TLS()
            else:
                self.ftp = ftplib.FTP()
            
            # Connect to server
            self.ftp.connect(self.config["host"], self.config["port"], timeout=30)
            
            # Login
            self.ftp.login(self.config["username"], self.config["password"])
            
            # Enable TLS encryption for data channel if using FTP_TLS
            if self.config["use_tls"]:
                self.ftp.prot_p()
            
            # Set passive mode
            self.ftp.set_pasv(self.config["passive_mode"])
            
            print(f"✅ Connected to {self.config['host']}")
            print(f"📂 Remote directory: {self.ftp.pwd()}")
            
            return True
            
        except Exception as e:
            print(f"❌ Connection failed: {e}")
            return False
    
    def disconnect(self):
        """Close FTP connection"""
        if self.ftp:
            try:
                self.ftp.quit()
            except:
                self.ftp.close()
            print("🔌 Disconnected from FTP server")
    
    def should_ignore(self, path: str) -> bool:
        """Check if file/directory should be ignored"""
        path_obj = Path(path)
        
        for pattern in self.config["ignore_patterns"]:
            if pattern.startswith("*"):
                if path_obj.name.endswith(pattern[1:]):
                    return True
            elif pattern in str(path):
                return True
        
        return False
    
    def create_remote_directory(self, remote_dir: str):
        """Create directory on remote server"""
        try:
            self.ftp.mkd(remote_dir)
            print(f"📁 Created directory: {remote_dir}")
        except ftplib.error_perm as e:
            if "550" not in str(e):  # 550 = directory already exists
                print(f"⚠️ Could not create directory {remote_dir}: {e}")
    
    def upload_file(self, local_file: str, remote_file: str) -> bool:
        """Upload a single file"""
        try:
            with open(local_file, 'rb') as f:
                self.ftp.storbinary(f'STOR {remote_file}', f)
            
            # Set permissions if specified
            if self.config.get("file_permissions"):
                try:
                    if local_file.endswith(('.sh', '.py', '.pl')):
                        self.ftp.voidcmd(f'SITE CHMOD {self.config["file_permissions"]["executables"]} {remote_file}')
                    else:
                        self.ftp.voidcmd(f'SITE CHMOD {self.config["file_permissions"]["files"]} {remote_file}')
                except:
                    pass  # Some servers don't support CHMOD
            
            print(f"✅ Uploaded: {local_file} → {remote_file}")
            self.deployed_files.add(local_file)
            return True
            
        except Exception as e:
            print(f"❌ Failed to upload {local_file}: {e}")
            self.failed_files.add(local_file)
            return False
    
    def get_remote_file_hash(self, remote_file: str) -> str:
        """Get hash of remote file for comparison"""
        try:
            # Try to get file size as a simple comparison
            size = self.ftp.size(remote_file)
            return str(size) if size else ""
        except:
            return ""
    
    def get_local_file_hash(self, local_file: str) -> str:
        """Calculate hash of local file"""
        try:
            return str(os.path.getsize(local_file))
        except:
            return ""
    
    def sync_directory(self, local_dir: str = None, remote_dir: str = None):
        """Sync entire directory to FTP server"""
        if not local_dir:
            local_dir = self.config["local_path"]
        if not remote_dir:
            remote_dir = self.config["remote_path"]
        
        # Change to remote directory
        try:
            self.ftp.cwd(remote_dir)
        except:
            self.create_remote_directory(remote_dir)
            self.ftp.cwd(remote_dir)
        
        # Walk through local directory
        for root, dirs, files in os.walk(local_dir):
            # Calculate relative path
            rel_path = os.path.relpath(root, local_dir)
            
            if self.should_ignore(root):
                print(f"⏭️ Skipping directory: {root}")
                continue
            
            # Create remote directory structure
            if rel_path != ".":
                remote_subdir = rel_path.replace(os.sep, "/")
                full_remote_dir = f"{remote_dir}/{remote_subdir}"
                
                # Create nested directories
                parts = remote_subdir.split("/")
                current_dir = remote_dir
                for part in parts:
                    current_dir = f"{current_dir}/{part}"
                    self.create_remote_directory(current_dir)
            
            # Upload files
            for file in files:
                local_file = os.path.join(root, file)
                
                if self.should_ignore(local_file):
                    print(f"⏭️ Skipping: {local_file}")
                    self.skipped_files.add(local_file)
                    continue
                
                # Calculate remote file path
                if rel_path == ".":
                    remote_file = f"{remote_dir}/{file}"
                else:
                    remote_file = f"{remote_dir}/{rel_path.replace(os.sep, '/')}/{file}"
                
                # Check if file needs updating
                local_hash = self.get_local_file_hash(local_file)
                remote_hash = self.get_remote_file_hash(remote_file)
                
                if local_hash != remote_hash:
                    self.upload_file(local_file, remote_file)
                else:
                    print(f"⏭️ Unchanged: {file}")
                    self.skipped_files.add(local_file)
    
    def deploy(self, clean: bool = False):
        """Main deployment function"""
        print(f"\n🚀 Starting FTP Deployment")
        print(f"📦 Local: {self.config['local_path']}")
        print(f"🌐 Remote: {self.config['username']}@{self.config['host']}:{self.config['remote_path']}")
        print("-" * 50)
        
        if not self.connect():
            return False
        
        try:
            # Clean remote directory if requested
            if clean:
                self.clean_remote_directory()
            
            # Sync files
            self.sync_directory()
            
            # Print summary
            self.print_summary()
            
            return len(self.failed_files) == 0
            
        finally:
            self.disconnect()
    
    def clean_remote_directory(self):
        """Clean remote directory before deployment"""
        print("🧹 Cleaning remote directory...")
        try:
            self.delete_remote_directory(self.config["remote_path"])
            self.create_remote_directory(self.config["remote_path"])
        except Exception as e:
            print(f"⚠️ Could not clean remote directory: {e}")
    
    def delete_remote_directory(self, path: str):
        """Recursively delete remote directory"""
        try:
            # List directory contents
            files = []
            self.ftp.dir(path, files.append)
            
            for file_info in files:
                parts = file_info.split()
                if len(parts) >= 9:
                    name = " ".join(parts[8:])
                    
                    if parts[0].startswith('d'):
                        # It's a directory
                        self.delete_remote_directory(f"{path}/{name}")
                    else:
                        # It's a file
                        self.ftp.delete(f"{path}/{name}")
            
            # Remove the directory itself
            self.ftp.rmd(path)
            
        except Exception as e:
            print(f"⚠️ Could not delete {path}: {e}")
    
    def print_summary(self):
        """Print deployment summary"""
        print("\n" + "=" * 50)
        print("📊 Deployment Summary")
        print("=" * 50)
        print(f"✅ Deployed: {len(self.deployed_files)} files")
        print(f"⏭️ Skipped: {len(self.skipped_files)} files")
        print(f"❌ Failed: {len(self.failed_files)} files")
        
        if self.failed_files:
            print("\n❌ Failed files:")
            for file in self.failed_files:
                print(f"  - {file}")
        
        print("\n✅ Deployment complete!")
        print(f"🌐 Visit: https://{self.config['host'].replace('ftp.', '')}")


class FTPAccountManager:
    """Manage FTP accounts and subdomains"""
    
    def __init__(self, cpanel_config: Dict = None):
        """Initialize FTP account manager"""
        self.config = cpanel_config or {
            "host": os.getenv("CPANEL_HOST", "cpanel.canspace.ca"),
            "username": os.getenv("CPANEL_USERNAME"),
            "password": os.getenv("CPANEL_PASSWORD"),
            "port": 2083
        }
    
    def create_ftp_account(self, username: str, password: str, quota: int = 500):
        """Create new FTP account"""
        # This would integrate with cPanel API
        print(f"📝 Creating FTP account: {username}@leo.pvthostel.com")
        print(f"   Quota: {quota}MB")
        print(f"   Home: /home/leo/{username}")
        
        # cPanel API call would go here
        return True
    
    def create_subdomain(self, subdomain: str, document_root: str = None):
        """Create subdomain for FTP access"""
        if not document_root:
            document_root = f"/home/leo/public_html/{subdomain}"
        
        print(f"🌐 Creating subdomain: {subdomain}.leo.pvthostel.com")
        print(f"   Document root: {document_root}")
        
        # cPanel API call would go here
        return True


def main():
    """CLI interface for FTP deployment"""
    parser = argparse.ArgumentParser(description="FTP Deployment Tool")
    parser.add_argument("command", choices=["deploy", "clean-deploy", "test", "create-account"],
                       help="Command to execute")
    parser.add_argument("--config", default="ftp-config.json",
                       help="Configuration file")
    parser.add_argument("--local", help="Local directory to deploy")
    parser.add_argument("--remote", help="Remote directory path")
    parser.add_argument("--username", help="FTP username")
    parser.add_argument("--password", help="FTP password")
    
    args = parser.parse_args()
    
    # Override config with command line arguments
    deployer = FTPDeployer(args.config)
    
    if args.local:
        deployer.config["local_path"] = args.local
    if args.remote:
        deployer.config["remote_path"] = args.remote
    if args.username:
        deployer.config["username"] = args.username
    if args.password:
        deployer.config["password"] = args.password
    
    # Execute command
    if args.command == "deploy":
        success = deployer.deploy(clean=False)
        sys.exit(0 if success else 1)
    
    elif args.command == "clean-deploy":
        success = deployer.deploy(clean=True)
        sys.exit(0 if success else 1)
    
    elif args.command == "test":
        if deployer.connect():
            print("✅ FTP connection successful!")
            deployer.disconnect()
            sys.exit(0)
        else:
            print("❌ FTP connection failed!")
            sys.exit(1)
    
    elif args.command == "create-account":
        manager = FTPAccountManager()
        username = input("Enter FTP username: ")
        password = input("Enter FTP password: ")
        quota = input("Enter quota in MB (default 500): ") or "500"
        
        manager.create_ftp_account(username, password, int(quota))
        manager.create_subdomain(f"ftp-{username}")


if __name__ == "__main__":
    main()