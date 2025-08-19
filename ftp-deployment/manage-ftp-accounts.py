#!/usr/bin/env python3
"""
FTP Account Management for leo.pvthostel.com
Manages FTP accounts via cPanel API or direct server commands
"""

import os
import sys
import json
import requests
import hashlib
import random
import string
from datetime import datetime
from typing import Dict, List, Optional
import subprocess
import crypt

class FTPAccountManager:
    def __init__(self, config_file: str = "ftp-accounts.json"):
        """Initialize FTP Account Manager"""
        self.config_file = config_file
        self.accounts = self.load_accounts()
        
        # cPanel configuration
        self.cpanel_host = os.getenv("CPANEL_HOST", "cpanel.canspace.ca")
        self.cpanel_user = os.getenv("CPANEL_USERNAME")
        self.cpanel_pass = os.getenv("CPANEL_PASSWORD")
        self.cpanel_port = 2083
        
    def load_accounts(self) -> Dict:
        """Load FTP accounts from configuration file"""
        if os.path.exists(self.config_file):
            with open(self.config_file, 'r') as f:
                return json.load(f)
        
        # Default configuration
        return {
            "domain": "leo.pvthostel.com",
            "accounts": [],
            "quota_default": 500,  # MB
            "home_base": "/home/leo/public_html",
            "created_at": datetime.now().isoformat()
        }
    
    def save_accounts(self):
        """Save FTP accounts to configuration file"""
        with open(self.config_file, 'w') as f:
            json.dump(self.accounts, f, indent=2)
        print(f"✅ Accounts saved to {self.config_file}")
    
    def generate_password(self, length: int = 12) -> str:
        """Generate secure random password"""
        chars = string.ascii_letters + string.digits + "!@#$%^&*"
        return ''.join(random.choice(chars) for _ in range(length))
    
    def create_account_cpanel(self, username: str, password: str, quota: int = 500, home_dir: str = None):
        """Create FTP account via cPanel API"""
        
        if not self.cpanel_user or not self.cpanel_pass:
            print("❌ cPanel credentials not configured")
            return False
        
        # Prepare API request
        url = f"https://{self.cpanel_host}:{self.cpanel_port}/execute/Ftp/add_ftp"
        
        if not home_dir:
            home_dir = f"{self.accounts['home_base']}/{username}"
        
        data = {
            "user": f"{username}@{self.accounts['domain']}",
            "pass": password,
            "quota": quota,
            "homedir": home_dir
        }
        
        try:
            response = requests.post(
                url,
                auth=(self.cpanel_user, self.cpanel_pass),
                data=data,
                verify=False
            )
            
            if response.status_code == 200:
                result = response.json()
                if result.get("status") == 1:
                    print(f"✅ FTP account created: {username}@{self.accounts['domain']}")
                    return True
                else:
                    print(f"❌ Failed to create account: {result.get('errors')}")
            else:
                print(f"❌ API request failed: {response.status_code}")
                
        except Exception as e:
            print(f"❌ Error creating account: {e}")
        
        return False
    
    def create_account_system(self, username: str, password: str, home_dir: str = None):
        """Create FTP account using system commands (requires root)"""
        
        if not home_dir:
            home_dir = f"/home/{username}"
        
        try:
            # Create system user
            cmd = f"sudo useradd -m -d {home_dir} -s /bin/false {username}"
            subprocess.run(cmd, shell=True, check=True)
            
            # Set password
            encrypted_pass = crypt.crypt(password, crypt.mksalt(crypt.METHOD_SHA512))
            cmd = f"echo '{username}:{encrypted_pass}' | sudo chpasswd -e"
            subprocess.run(cmd, shell=True, check=True)
            
            # Create FTP directory
            ftp_dir = f"{home_dir}/ftp"
            subprocess.run(f"sudo mkdir -p {ftp_dir}", shell=True, check=True)
            subprocess.run(f"sudo chown {username}:{username} {ftp_dir}", shell=True, check=True)
            subprocess.run(f"sudo chmod 755 {ftp_dir}", shell=True, check=True)
            
            # Add to vsftpd user list
            subprocess.run(f"echo '{username}' | sudo tee -a /etc/vsftpd.userlist", shell=True, check=True)
            
            print(f"✅ System FTP account created: {username}")
            return True
            
        except subprocess.CalledProcessError as e:
            print(f"❌ Failed to create system account: {e}")
            return False
    
    def create_account(self, username: str, password: str = None, quota: int = None, 
                      home_dir: str = None, method: str = "auto"):
        """Create new FTP account"""
        
        # Generate password if not provided
        if not password:
            password = self.generate_password()
        
        if not quota:
            quota = self.accounts["quota_default"]
        
        # Check if account already exists
        existing = self.get_account(username)
        if existing:
            print(f"⚠️ Account {username} already exists")
            return False
        
        # Create account based on method
        success = False
        
        if method == "cpanel" or (method == "auto" and self.cpanel_user):
            success = self.create_account_cpanel(username, password, quota, home_dir)
        elif method == "system" or method == "auto":
            success = self.create_account_system(username, password, home_dir)
        
        if success:
            # Store account information
            account_info = {
                "username": username,
                "password": password,  # In production, store hashed
                "quota": quota,
                "home_dir": home_dir or f"{self.accounts['home_base']}/{username}",
                "created_at": datetime.now().isoformat(),
                "status": "active",
                "permissions": ["read", "write", "delete"],
                "last_login": None,
                "usage": 0
            }
            
            self.accounts["accounts"].append(account_info)
            self.save_accounts()
            
            # Generate access details
            self.print_access_details(username, password)
            
            return True
        
        return False
    
    def delete_account(self, username: str, method: str = "auto"):
        """Delete FTP account"""
        
        account = self.get_account(username)
        if not account:
            print(f"❌ Account {username} not found")
            return False
        
        success = False
        
        if method == "cpanel" or (method == "auto" and self.cpanel_user):
            # Delete via cPanel API
            url = f"https://{self.cpanel_host}:{self.cpanel_port}/execute/Ftp/delete_ftp"
            data = {"user": f"{username}@{self.accounts['domain']}"}
            
            try:
                response = requests.post(
                    url,
                    auth=(self.cpanel_user, self.cpanel_pass),
                    data=data,
                    verify=False
                )
                
                if response.status_code == 200:
                    result = response.json()
                    if result.get("status") == 1:
                        success = True
                        
            except Exception as e:
                print(f"❌ Error deleting account: {e}")
        
        elif method == "system" or method == "auto":
            # Delete system user
            try:
                subprocess.run(f"sudo userdel -r {username}", shell=True, check=True)
                subprocess.run(f"sudo sed -i '/{username}/d' /etc/vsftpd.userlist", shell=True, check=True)
                success = True
            except subprocess.CalledProcessError as e:
                print(f"❌ Failed to delete system account: {e}")
        
        if success:
            # Remove from configuration
            self.accounts["accounts"] = [
                acc for acc in self.accounts["accounts"] 
                if acc["username"] != username
            ]
            self.save_accounts()
            print(f"✅ Account {username} deleted")
            return True
        
        return False
    
    def get_account(self, username: str) -> Optional[Dict]:
        """Get account information"""
        for account in self.accounts["accounts"]:
            if account["username"] == username:
                return account
        return None
    
    def list_accounts(self):
        """List all FTP accounts"""
        print(f"\n📋 FTP Accounts for {self.accounts['domain']}")
        print("=" * 70)
        print(f"{'Username':<20} {'Status':<10} {'Quota':<10} {'Usage':<10} {'Created'}")
        print("-" * 70)
        
        for account in self.accounts["accounts"]:
            created = account['created_at'][:10] if account.get('created_at') else 'Unknown'
            usage_pct = (account.get('usage', 0) / account.get('quota', 500)) * 100
            
            print(f"{account['username']:<20} "
                  f"{account.get('status', 'unknown'):<10} "
                  f"{account.get('quota', 0)}MB{'':<6} "
                  f"{usage_pct:.1f}%{'':<6} "
                  f"{created}")
        
        print(f"\nTotal accounts: {len(self.accounts['accounts'])}")
    
    def update_account(self, username: str, **kwargs):
        """Update account settings"""
        account = self.get_account(username)
        if not account:
            print(f"❌ Account {username} not found")
            return False
        
        # Update fields
        for key, value in kwargs.items():
            if key in account:
                account[key] = value
        
        account["updated_at"] = datetime.now().isoformat()
        self.save_accounts()
        
        print(f"✅ Account {username} updated")
        return True
    
    def reset_password(self, username: str, new_password: str = None):
        """Reset account password"""
        if not new_password:
            new_password = self.generate_password()
        
        # Update password in system/cPanel
        if self.cpanel_user:
            # cPanel API password reset
            url = f"https://{self.cpanel_host}:{self.cpanel_port}/execute/Ftp/passwd"
            data = {
                "user": f"{username}@{self.accounts['domain']}",
                "pass": new_password
            }
            
            try:
                response = requests.post(
                    url,
                    auth=(self.cpanel_user, self.cpanel_pass),
                    data=data,
                    verify=False
                )
                
                if response.status_code == 200:
                    result = response.json()
                    if result.get("status") != 1:
                        print(f"❌ Failed to reset password: {result.get('errors')}")
                        return False
                        
            except Exception as e:
                print(f"❌ Error resetting password: {e}")
                return False
        else:
            # System password reset
            try:
                encrypted_pass = crypt.crypt(new_password, crypt.mksalt(crypt.METHOD_SHA512))
                cmd = f"echo '{username}:{encrypted_pass}' | sudo chpasswd -e"
                subprocess.run(cmd, shell=True, check=True)
            except subprocess.CalledProcessError as e:
                print(f"❌ Failed to reset system password: {e}")
                return False
        
        # Update configuration
        self.update_account(username, password=new_password)
        
        print(f"✅ Password reset for {username}")
        self.print_access_details(username, new_password)
        
        return True
    
    def print_access_details(self, username: str, password: str):
        """Print FTP access details"""
        print("\n" + "=" * 50)
        print("📝 FTP Access Details")
        print("=" * 50)
        print(f"Username: {username}@{self.accounts['domain']}")
        print(f"Password: {password}")
        print(f"\nConnection Details:")
        print(f"  FTP Host: ftp.{self.accounts['domain']}")
        print(f"  Port: 21 (FTP) or 990 (FTPS)")
        print(f"  Protocol: FTP or FTPS (recommended)")
        print(f"\nAccess URLs:")
        print(f"  ftp://ftp.{self.accounts['domain']}")
        print(f"  ftps://secure-ftp.{self.accounts['domain']}:990")
        print(f"  https://files.{self.accounts['domain']} (web interface)")
        print("=" * 50)
    
    def generate_filezilla_config(self, username: str):
        """Generate FileZilla site configuration"""
        account = self.get_account(username)
        if not account:
            print(f"❌ Account {username} not found")
            return
        
        config = f"""<?xml version="1.0" encoding="UTF-8"?>
<FileZilla3 version="3.60.1" platform="*">
    <Servers>
        <Server>
            <Host>ftp.{self.accounts['domain']}</Host>
            <Port>21</Port>
            <Protocol>1</Protocol>
            <Type>0</Type>
            <User>{username}@{self.accounts['domain']}</User>
            <Pass encoding="base64">{account['password']}</Pass>
            <Logontype>1</Logontype>
            <TimezoneOffset>0</TimezoneOffset>
            <PasvMode>MODE_DEFAULT</PasvMode>
            <MaximumMultipleConnections>0</MaximumMultipleConnections>
            <EncodingType>Auto</EncodingType>
            <BypassProxy>0</BypassProxy>
            <Name>LEO PVT Hostel - {username}</Name>
            <Comments>FTP access for {username}</Comments>
            <LocalDir></LocalDir>
            <RemoteDir>{account.get('home_dir', '/')}</RemoteDir>
        </Server>
    </Servers>
</FileZilla3>"""
        
        filename = f"filezilla-{username}.xml"
        with open(filename, 'w') as f:
            f.write(config)
        
        print(f"✅ FileZilla configuration saved to {filename}")
        print(f"Import this file in FileZilla: File → Import Settings")


def main():
    """CLI interface for FTP account management"""
    
    if len(sys.argv) < 2:
        print("""
FTP Account Manager for leo.pvthostel.com

Usage: python manage-ftp-accounts.py [command] [options]

Commands:
    list                          - List all FTP accounts
    create USERNAME [PASSWORD]    - Create new FTP account
    delete USERNAME               - Delete FTP account
    reset USERNAME [PASSWORD]     - Reset account password
    info USERNAME                 - Show account details
    filezilla USERNAME            - Generate FileZilla config
    
Examples:
    python manage-ftp-accounts.py list
    python manage-ftp-accounts.py create john
    python manage-ftp-accounts.py reset john newpass123
    python manage-ftp-accounts.py delete john
    python manage-ftp-accounts.py filezilla john
""")
        sys.exit(1)
    
    manager = FTPAccountManager()
    command = sys.argv[1].lower()
    
    try:
        if command == "list":
            manager.list_accounts()
        
        elif command == "create":
            if len(sys.argv) < 3:
                print("Usage: python manage-ftp-accounts.py create USERNAME [PASSWORD]")
                sys.exit(1)
            
            username = sys.argv[2]
            password = sys.argv[3] if len(sys.argv) > 3 else None
            
            manager.create_account(username, password)
        
        elif command == "delete":
            if len(sys.argv) < 3:
                print("Usage: python manage-ftp-accounts.py delete USERNAME")
                sys.exit(1)
            
            username = sys.argv[2]
            confirm = input(f"Are you sure you want to delete {username}? (yes/no): ")
            
            if confirm.lower() == "yes":
                manager.delete_account(username)
        
        elif command == "reset":
            if len(sys.argv) < 3:
                print("Usage: python manage-ftp-accounts.py reset USERNAME [PASSWORD]")
                sys.exit(1)
            
            username = sys.argv[2]
            password = sys.argv[3] if len(sys.argv) > 3 else None
            
            manager.reset_password(username, password)
        
        elif command == "info":
            if len(sys.argv) < 3:
                print("Usage: python manage-ftp-accounts.py info USERNAME")
                sys.exit(1)
            
            username = sys.argv[2]
            account = manager.get_account(username)
            
            if account:
                print(f"\n📋 Account Information: {username}")
                print("=" * 50)
                for key, value in account.items():
                    if key != "password":  # Don't display password
                        print(f"{key}: {value}")
            else:
                print(f"❌ Account {username} not found")
        
        elif command == "filezilla":
            if len(sys.argv) < 3:
                print("Usage: python manage-ftp-accounts.py filezilla USERNAME")
                sys.exit(1)
            
            username = sys.argv[2]
            manager.generate_filezilla_config(username)
        
        else:
            print(f"❌ Unknown command: {command}")
            sys.exit(1)
            
    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()