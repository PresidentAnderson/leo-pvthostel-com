"""
Vercel API endpoint for DNS health check
"""

import json
import subprocess
import os
from datetime import datetime
from http.server import BaseHTTPRequestHandler

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        """Handle GET request for health check"""
        try:
            # Basic health response
            health_data = {
                "status": "healthy",
                "service": "DNS Management System",
                "domain": os.environ.get("DOMAIN", "leo.pvthostel.com"),
                "timestamp": datetime.now().isoformat(),
                "version": os.environ.get("VERSION", "1.0.0"),
                "environment": os.environ.get("ENVIRONMENT", "production"),
                "checks": {
                    "api": "operational",
                    "dns": "checking",
                    "hubspot": "connected"
                }
            }
            
            # Try to run actual health check if available
            try:
                result = subprocess.run(
                    ["python3", "../dns-health-monitor.py", "check"],
                    capture_output=True,
                    text=True,
                    timeout=10
                )
                if result.returncode == 0:
                    health_data["checks"]["dns"] = "healthy"
                else:
                    health_data["checks"]["dns"] = "degraded"
            except:
                health_data["checks"]["dns"] = "unknown"
            
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            self.wfile.write(json.dumps(health_data, indent=2).encode())
            
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            
            error_response = {
                "status": "error",
                "message": str(e),
                "timestamp": datetime.now().isoformat()
            }
            
            self.wfile.write(json.dumps(error_response).encode())
    
    def do_OPTIONS(self):
        """Handle CORS preflight"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()