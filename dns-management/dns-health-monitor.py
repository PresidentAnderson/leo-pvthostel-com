#!/usr/bin/env python3
"""
DNS Health Monitor for leo.pvthostel.com
Monitors DNS records, propagation, and health status
"""

import dns.resolver
import requests
import json
import time
import sys
import os
from datetime import datetime
from typing import Dict, List, Optional, Tuple
import subprocess
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

class DNSHealthMonitor:
    def __init__(self, domain: str = "leo.pvthostel.com", config_file: str = "dns-config.json"):
        """
        Initialize DNS health monitor
        
        Args:
            domain: Domain to monitor
            config_file: Configuration file path
        """
        self.domain = domain
        self.config_file = config_file
        self.config = self.load_config()
        self.nameservers = [
            "8.8.8.8",        # Google
            "1.1.1.1",        # Cloudflare
            "208.67.222.222", # OpenDNS
            "9.9.9.9",        # Quad9
            "64.6.64.6"       # Verisign
        ]
        self.results = {}
        self.issues = []
    
    def load_config(self) -> Dict:
        """Load configuration from file"""
        if os.path.exists(self.config_file):
            with open(self.config_file, 'r') as f:
                return json.load(f)
        return {"monitoring": {"expected_records": []}}
    
    def check_dns_record(self, record_type: str, name: str, nameserver: str = None) -> List[str]:
        """
        Check DNS record from specific nameserver
        
        Args:
            record_type: Type of DNS record (A, CNAME, MX, TXT)
            name: Record name to check
            nameserver: Specific nameserver to query
        
        Returns:
            List of record values
        """
        resolver = dns.resolver.Resolver()
        
        if nameserver:
            resolver.nameservers = [nameserver]
        
        try:
            answers = resolver.resolve(name, record_type)
            
            if record_type == "A":
                return [str(rdata.address) for rdata in answers]
            elif record_type == "CNAME":
                return [str(rdata.target) for rdata in answers]
            elif record_type == "MX":
                return [f"{rdata.preference}:{str(rdata.exchange)}" for rdata in answers]
            elif record_type == "TXT":
                return [str(rdata) for rdata in answers]
            else:
                return [str(rdata) for rdata in answers]
        except dns.resolver.NXDOMAIN:
            return ["NXDOMAIN"]
        except dns.resolver.NoAnswer:
            return ["NoAnswer"]
        except Exception as e:
            return [f"Error: {str(e)}"]
    
    def check_propagation(self, record_type: str, name: str, expected_value: str) -> Dict:
        """
        Check DNS propagation across multiple nameservers
        
        Args:
            record_type: Type of DNS record
            name: Record name
            expected_value: Expected value for the record
        
        Returns:
            Propagation status across nameservers
        """
        propagation = {}
        
        for ns in self.nameservers:
            values = self.check_dns_record(record_type, name, ns)
            
            if expected_value in values:
                propagation[ns] = {
                    "status": "✅",
                    "value": values[0] if values else None,
                    "match": True
                }
            else:
                propagation[ns] = {
                    "status": "❌",
                    "value": values[0] if values else None,
                    "match": False
                }
        
        return propagation
    
    def check_ssl_certificate(self, hostname: str = None) -> Dict:
        """Check SSL certificate status"""
        if not hostname:
            hostname = self.domain
        
        try:
            response = subprocess.run(
                ["openssl", "s_client", "-connect", f"{hostname}:443", "-servername", hostname],
                input=b"",
                capture_output=True,
                text=True,
                timeout=10
            )
            
            cert_info = response.stdout
            
            # Extract certificate dates
            if "notBefore" in cert_info and "notAfter" in cert_info:
                lines = cert_info.split('\n')
                not_before = None
                not_after = None
                
                for line in lines:
                    if "notBefore" in line:
                        not_before = line.split("notBefore=")[1].strip()
                    elif "notAfter" in line:
                        not_after = line.split("notAfter=")[1].strip()
                
                return {
                    "status": "✅ Valid",
                    "not_before": not_before,
                    "not_after": not_after,
                    "hostname": hostname
                }
            else:
                return {
                    "status": "❌ Invalid",
                    "error": "Could not parse certificate",
                    "hostname": hostname
                }
        
        except Exception as e:
            return {
                "status": "❌ Error",
                "error": str(e),
                "hostname": hostname
            }
    
    def check_http_response(self, url: str = None) -> Dict:
        """Check HTTP response status"""
        if not url:
            url = f"https://{self.domain}"
        
        try:
            response = requests.get(url, timeout=10, allow_redirects=True)
            
            return {
                "status_code": response.status_code,
                "status": "✅" if response.status_code == 200 else "⚠️",
                "response_time": response.elapsed.total_seconds(),
                "final_url": response.url,
                "redirects": len(response.history)
            }
        
        except requests.exceptions.SSLError:
            return {
                "status": "❌",
                "error": "SSL Error",
                "url": url
            }
        except requests.exceptions.ConnectionError:
            return {
                "status": "❌",
                "error": "Connection Error",
                "url": url
            }
        except Exception as e:
            return {
                "status": "❌",
                "error": str(e),
                "url": url
            }
    
    def check_mail_records(self) -> Dict:
        """Check mail-related DNS records"""
        mail_records = {
            "mx": [],
            "spf": None,
            "dmarc": None,
            "dkim": []
        }
        
        # Check MX records
        mx_records = self.check_dns_record("MX", self.domain)
        mail_records["mx"] = mx_records
        
        # Check SPF record
        txt_records = self.check_dns_record("TXT", self.domain)
        for record in txt_records:
            if "v=spf1" in record:
                mail_records["spf"] = record
        
        # Check DMARC record
        dmarc_records = self.check_dns_record("TXT", f"_dmarc.{self.domain}")
        if dmarc_records and dmarc_records[0] != "NXDOMAIN":
            mail_records["dmarc"] = dmarc_records[0]
        
        # Check common DKIM selectors
        common_selectors = ["default", "google", "mail", "dkim", "selector1", "selector2"]
        for selector in common_selectors:
            dkim = self.check_dns_record("TXT", f"{selector}._domainkey.{self.domain}")
            if dkim and dkim[0] != "NXDOMAIN" and dkim[0] != "NoAnswer":
                mail_records["dkim"].append({
                    "selector": selector,
                    "record": dkim[0]
                })
        
        return mail_records
    
    def run_health_check(self) -> Dict:
        """Run complete health check"""
        print(f"\n🏥 DNS Health Check for {self.domain}")
        print("=" * 60)
        
        results = {
            "timestamp": datetime.now().isoformat(),
            "domain": self.domain,
            "checks": {}
        }
        
        # 1. Check A records
        print("\n📍 Checking A Records...")
        a_records = self.check_dns_record("A", self.domain)
        results["checks"]["a_records"] = {
            "values": a_records,
            "status": "✅" if a_records and a_records[0] not in ["NXDOMAIN", "NoAnswer"] else "❌"
        }
        print(f"  A Records: {', '.join(a_records)}")
        
        # 2. Check CNAME for www
        print("\n🔗 Checking CNAME Records...")
        www_cname = self.check_dns_record("CNAME", f"www.{self.domain}")
        results["checks"]["www_cname"] = {
            "values": www_cname,
            "status": "✅" if www_cname and www_cname[0] not in ["NXDOMAIN", "NoAnswer"] else "⚠️"
        }
        print(f"  WWW CNAME: {', '.join(www_cname)}")
        
        # 3. Check propagation
        if a_records and a_records[0] not in ["NXDOMAIN", "NoAnswer"]:
            print("\n🌍 Checking DNS Propagation...")
            propagation = self.check_propagation("A", self.domain, a_records[0])
            results["checks"]["propagation"] = propagation
            
            propagated = sum(1 for p in propagation.values() if p["match"])
            total = len(propagation)
            print(f"  Propagation: {propagated}/{total} nameservers")
            
            for ns, status in propagation.items():
                print(f"    {status['status']} {ns}: {status['value']}")
        
        # 4. Check SSL certificate
        print("\n🔒 Checking SSL Certificate...")
        ssl_status = self.check_ssl_certificate()
        results["checks"]["ssl"] = ssl_status
        print(f"  SSL Status: {ssl_status['status']}")
        if ssl_status.get("not_after"):
            print(f"  Expires: {ssl_status['not_after']}")
        
        # 5. Check HTTP response
        print("\n🌐 Checking HTTP Response...")
        http_status = self.check_http_response()
        results["checks"]["http"] = http_status
        
        if http_status.get("status_code"):
            print(f"  HTTP Status: {http_status['status_code']} {http_status['status']}")
            print(f"  Response Time: {http_status.get('response_time', 0):.2f}s")
            if http_status.get("redirects", 0) > 0:
                print(f"  Redirects: {http_status['redirects']}")
        else:
            print(f"  HTTP Status: {http_status['status']} {http_status.get('error', '')}")
        
        # 6. Check mail records
        print("\n✉️ Checking Mail Records...")
        mail_records = self.check_mail_records()
        results["checks"]["mail"] = mail_records
        
        if mail_records["mx"]:
            print(f"  MX Records: {', '.join(mail_records['mx'])}")
        else:
            print("  MX Records: ❌ None found")
        
        if mail_records["spf"]:
            print(f"  SPF: ✅ {mail_records['spf'][:50]}...")
        else:
            print("  SPF: ⚠️ Not configured")
        
        if mail_records["dmarc"]:
            print(f"  DMARC: ✅ {mail_records['dmarc'][:50]}...")
        else:
            print("  DMARC: ⚠️ Not configured")
        
        if mail_records["dkim"]:
            print(f"  DKIM: ✅ {len(mail_records['dkim'])} selector(s) found")
        else:
            print("  DKIM: ⚠️ Not configured")
        
        # 7. Check expected records
        if self.config.get("monitoring", {}).get("expected_records"):
            print("\n✔️ Checking Expected Records...")
            
            for expected in self.config["monitoring"]["expected_records"]:
                record_type = expected["type"]
                name = expected["name"].replace("@", self.domain)
                expected_value = expected["value"]
                
                actual = self.check_dns_record(record_type, name)
                
                if expected_value in actual:
                    print(f"  ✅ {record_type} {name} = {expected_value}")
                else:
                    print(f"  ❌ {record_type} {name} expected {expected_value}, got {actual}")
                    self.issues.append(f"{record_type} {name} mismatch")
        
        # Summary
        print("\n" + "=" * 60)
        if self.issues:
            print(f"⚠️ Found {len(self.issues)} issue(s):")
            for issue in self.issues:
                print(f"  - {issue}")
        else:
            print("✅ All checks passed!")
        
        return results
    
    def monitor_continuous(self, interval: int = 3600):
        """
        Run continuous monitoring
        
        Args:
            interval: Check interval in seconds (default: 1 hour)
        """
        print(f"🔄 Starting continuous monitoring (interval: {interval}s)")
        
        while True:
            try:
                results = self.run_health_check()
                
                # Save results
                timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                results_file = f"health_check_{timestamp}.json"
                
                with open(results_file, 'w') as f:
                    json.dump(results, f, indent=2)
                
                # Alert if issues found
                if self.issues:
                    self.send_alert(self.issues)
                
                # Clear issues for next run
                self.issues = []
                
                # Wait for next check
                print(f"\n💤 Next check in {interval} seconds...")
                time.sleep(interval)
                
            except KeyboardInterrupt:
                print("\n👋 Monitoring stopped")
                break
            except Exception as e:
                print(f"❌ Error during monitoring: {e}")
                time.sleep(60)  # Wait 1 minute on error
    
    def send_alert(self, issues: List[str]):
        """Send alert for DNS issues"""
        alert_email = self.config.get("monitoring", {}).get("alert_email")
        
        if not alert_email:
            print("⚠️ No alert email configured")
            return
        
        # Log alert
        alert_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        alert_message = f"""
DNS Health Alert for {self.domain}
Time: {alert_time}

Issues Found:
{chr(10).join(f'- {issue}' for issue in issues)}

Please check the DNS configuration immediately.
        """
        
        print(f"\n🚨 ALERT: {len(issues)} DNS issue(s) detected!")
        print(alert_message)
        
        # You can implement email sending here if needed
        # For now, just log to file
        with open("dns_alerts.log", 'a') as f:
            f.write(f"\n{alert_time}: {', '.join(issues)}\n")


def main():
    """CLI interface for DNS health monitoring"""
    if len(sys.argv) < 2:
        print("""
🏥 DNS Health Monitor for leo.pvthostel.com

Usage: python dns-health-monitor.py [command] [options]

Commands:
    check              - Run single health check
    monitor [interval] - Run continuous monitoring (default: 3600s)
    propagation        - Check DNS propagation status
    ssl               - Check SSL certificate status
    mail              - Check mail configuration
    
Examples:
    python dns-health-monitor.py check
    python dns-health-monitor.py monitor 1800
    python dns-health-monitor.py propagation
    python dns-health-monitor.py ssl
    python dns-health-monitor.py mail
""")
        sys.exit(0)
    
    monitor = DNSHealthMonitor()
    command = sys.argv[1].lower()
    
    try:
        if command == "check":
            results = monitor.run_health_check()
            
            # Save results
            with open("health_check_latest.json", 'w') as f:
                json.dump(results, f, indent=2)
            
            print(f"\n💾 Results saved to health_check_latest.json")
        
        elif command == "monitor":
            interval = int(sys.argv[2]) if len(sys.argv) > 2 else 3600
            monitor.monitor_continuous(interval)
        
        elif command == "propagation":
            print(f"\n🌍 Checking DNS Propagation for {monitor.domain}")
            print("=" * 60)
            
            # Check A record propagation
            a_records = monitor.check_dns_record("A", monitor.domain)
            if a_records and a_records[0] not in ["NXDOMAIN", "NoAnswer"]:
                propagation = monitor.check_propagation("A", monitor.domain, a_records[0])
                
                propagated = sum(1 for p in propagation.values() if p["match"])
                total = len(propagation)
                
                print(f"\nExpected: {a_records[0]}")
                print(f"Propagation: {propagated}/{total} nameservers ({propagated*100//total}%)\n")
                
                for ns, status in propagation.items():
                    print(f"{status['status']} {ns:<20} {status['value']}")
            else:
                print("❌ No A record found")
        
        elif command == "ssl":
            print(f"\n🔒 Checking SSL Certificate for {monitor.domain}")
            print("=" * 60)
            
            ssl_status = monitor.check_ssl_certificate()
            
            print(f"\nStatus: {ssl_status['status']}")
            if ssl_status.get("not_before"):
                print(f"Valid From: {ssl_status['not_before']}")
            if ssl_status.get("not_after"):
                print(f"Valid Until: {ssl_status['not_after']}")
            if ssl_status.get("error"):
                print(f"Error: {ssl_status['error']}")
        
        elif command == "mail":
            print(f"\n✉️ Checking Mail Configuration for {monitor.domain}")
            print("=" * 60)
            
            mail_records = monitor.check_mail_records()
            
            print("\nMX Records:")
            if mail_records["mx"]:
                for mx in mail_records["mx"]:
                    print(f"  - {mx}")
            else:
                print("  ❌ No MX records found")
            
            print("\nSPF Record:")
            if mail_records["spf"]:
                print(f"  ✅ {mail_records['spf']}")
            else:
                print("  ❌ No SPF record found")
                print("  💡 Add TXT record: v=spf1 a mx ~all")
            
            print("\nDMARC Record:")
            if mail_records["dmarc"]:
                print(f"  ✅ {mail_records['dmarc']}")
            else:
                print("  ❌ No DMARC record found")
                print("  💡 Add TXT record at _dmarc: v=DMARC1; p=none; rua=mailto:admin@leo.pvthostel.com")
            
            print("\nDKIM Records:")
            if mail_records["dkim"]:
                for dkim in mail_records["dkim"]:
                    print(f"  ✅ {dkim['selector']}._domainkey")
            else:
                print("  ⚠️ No DKIM records found")
                print("  💡 DKIM requires configuration with your email provider")
        
        else:
            print(f"❌ Unknown command: {command}")
            sys.exit(1)
    
    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    # Check for required module
    try:
        import dns.resolver
    except ImportError:
        print("❌ dnspython module not installed")
        print("Install with: pip install dnspython")
        sys.exit(1)
    
    main()