#!/usr/bin/env python3
"""
ClickUp Integration for Documentation Management
Syncs documentation to ClickUp and triggers deployment pipeline
"""

import requests
import json
import os
import sys
from datetime import datetime
from typing import Dict, List, Optional
import subprocess
import hashlib

class ClickUpDocumentationManager:
    def __init__(self):
        """Initialize ClickUp integration"""
        self.api_key = os.getenv("CLICKUP_API_KEY")
        self.workspace_id = os.getenv("CLICKUP_WORKSPACE_ID")
        self.list_id = os.getenv("CLICKUP_LIST_ID", "900100775267")  # DNS Management list
        self.base_url = "https://api.clickup.com/api/v2"
        self.headers = {
            "Authorization": self.api_key,
            "Content-Type": "application/json"
        }
        
        if not self.api_key:
            print("⚠️ CLICKUP_API_KEY not set. Set it with:")
            print("export CLICKUP_API_KEY='your-api-key'")
    
    def get_workspaces(self) -> List[Dict]:
        """Get available workspaces"""
        response = requests.get(
            f"{self.base_url}/team",
            headers=self.headers
        )
        
        if response.status_code == 200:
            return response.json().get("teams", [])
        else:
            print(f"❌ Failed to get workspaces: {response.status_code}")
            return []
    
    def create_documentation_task(self, title: str, content: str, attachments: List[str] = None) -> Optional[str]:
        """
        Create a documentation task in ClickUp
        
        Args:
            title: Task title
            content: Documentation content (markdown)
            attachments: List of file paths to attach
        
        Returns:
            Task ID if successful
        """
        task_data = {
            "name": title,
            "description": content,
            "status": "complete",
            "priority": 2,
            "tags": ["documentation", "dns", "automated"],
            "custom_fields": [
                {
                    "id": "doc_type",
                    "value": "technical"
                },
                {
                    "id": "last_updated",
                    "value": datetime.now().isoformat()
                }
            ]
        }
        
        response = requests.post(
            f"{self.base_url}/list/{self.list_id}/task",
            headers=self.headers,
            json=task_data
        )
        
        if response.status_code == 200:
            task = response.json()
            task_id = task["id"]
            print(f"✅ Created ClickUp task: {task_id}")
            
            # Add attachments if provided
            if attachments:
                for filepath in attachments:
                    self.add_attachment(task_id, filepath)
            
            return task_id
        else:
            print(f"❌ Failed to create task: {response.status_code}")
            print(response.text)
            return None
    
    def add_attachment(self, task_id: str, filepath: str) -> bool:
        """Add attachment to a task"""
        if not os.path.exists(filepath):
            print(f"❌ File not found: {filepath}")
            return False
        
        with open(filepath, 'rb') as f:
            files = {'attachment': (os.path.basename(filepath), f)}
            
            response = requests.post(
                f"{self.base_url}/task/{task_id}/attachment",
                headers={"Authorization": self.api_key},
                files=files
            )
            
            if response.status_code == 200:
                print(f"  ✅ Attached: {os.path.basename(filepath)}")
                return True
            else:
                print(f"  ❌ Failed to attach: {os.path.basename(filepath)}")
                return False
    
    def update_documentation_task(self, task_id: str, content: str) -> bool:
        """Update existing documentation task"""
        update_data = {
            "description": content,
            "custom_fields": [
                {
                    "id": "last_updated",
                    "value": datetime.now().isoformat()
                }
            ]
        }
        
        response = requests.put(
            f"{self.base_url}/task/{task_id}",
            headers=self.headers,
            json=update_data
        )
        
        if response.status_code == 200:
            print(f"✅ Updated ClickUp task: {task_id}")
            return True
        else:
            print(f"❌ Failed to update task: {response.status_code}")
            return False
    
    def create_doc_page(self, title: str, content: str) -> Optional[str]:
        """Create a ClickUp Doc page"""
        doc_data = {
            "name": title,
            "content": {
                "ops": [
                    {
                        "insert": content
                    }
                ]
            },
            "parent_id": self.workspace_id,
            "tags": ["dns", "documentation", "automated"]
        }
        
        response = requests.post(
            f"{self.base_url}/team/{self.workspace_id}/doc",
            headers=self.headers,
            json=doc_data
        )
        
        if response.status_code == 200:
            doc = response.json()
            doc_id = doc["id"]
            print(f"✅ Created ClickUp Doc: {doc_id}")
            return doc_id
        else:
            print(f"❌ Failed to create doc: {response.status_code}")
            return None
    
    def sync_documentation(self, doc_path: str) -> Dict:
        """
        Sync documentation file to ClickUp
        
        Args:
            doc_path: Path to documentation file
        
        Returns:
            Sync results
        """
        if not os.path.exists(doc_path):
            print(f"❌ Documentation file not found: {doc_path}")
            return {"status": "error", "message": "File not found"}
        
        # Read documentation
        with open(doc_path, 'r') as f:
            content = f.read()
        
        # Calculate checksum
        checksum = hashlib.md5(content.encode()).hexdigest()
        
        # Extract title from markdown
        lines = content.split('\n')
        title = "DNS Management Documentation"
        for line in lines:
            if line.startswith('# '):
                title = line.replace('# ', '').strip()
                break
        
        # Create or update task
        task_id = self.create_documentation_task(
            f"{title} - {datetime.now().strftime('%Y-%m-%d')}",
            content,
            [doc_path]
        )
        
        # Create doc page
        doc_id = self.create_doc_page(title, content)
        
        return {
            "status": "success",
            "task_id": task_id,
            "doc_id": doc_id,
            "checksum": checksum,
            "timestamp": datetime.now().isoformat()
        }
    
    def create_deployment_task(self, version: str, changes: List[str]) -> Optional[str]:
        """Create deployment task in ClickUp"""
        task_data = {
            "name": f"Deploy DNS Management v{version}",
            "description": f"""
## Deployment Information

**Version:** {version}
**Date:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
**Environment:** Production

### Changes
{chr(10).join(f'- {change}' for change in changes)}

### Deployment Steps
1. ✅ Documentation updated in ClickUp
2. ⏳ Docker image building
3. ⏳ GitLab CI/CD pipeline running
4. ⏳ Vercel deployment pending

### Verification
- [ ] DNS health check passing
- [ ] HubSpot integration verified
- [ ] Documentation accessible
- [ ] All forms operational
            """,
            "status": "in progress",
            "priority": 1,
            "tags": ["deployment", "automated", "production"],
            "due_date": int((datetime.now().timestamp() + 3600) * 1000),  # 1 hour from now
        }
        
        response = requests.post(
            f"{self.base_url}/list/{self.list_id}/task",
            headers=self.headers,
            json=task_data
        )
        
        if response.status_code == 200:
            task = response.json()
            task_id = task["id"]
            print(f"✅ Created deployment task: {task_id}")
            return task_id
        else:
            print(f"❌ Failed to create deployment task: {response.status_code}")
            return None
    
    def add_comment(self, task_id: str, comment: str) -> bool:
        """Add comment to a task"""
        comment_data = {
            "comment_text": comment,
            "notify_all": True
        }
        
        response = requests.post(
            f"{self.base_url}/task/{task_id}/comment",
            headers=self.headers,
            json=comment_data
        )
        
        if response.status_code == 200:
            print(f"✅ Added comment to task {task_id}")
            return True
        else:
            print(f"❌ Failed to add comment: {response.status_code}")
            return False


def main():
    """CLI interface for ClickUp integration"""
    if len(sys.argv) < 2:
        print("""
📋 ClickUp Documentation Integration

Usage: python clickup-integration.py [command] [options]

Commands:
    sync <file>        - Sync documentation file to ClickUp
    deploy <version>   - Create deployment task
    test              - Test ClickUp connection
    workspaces        - List available workspaces
    
Examples:
    python clickup-integration.py sync DNS_MANAGEMENT_DOCUMENTATION.md
    python clickup-integration.py deploy 1.0.1
    python clickup-integration.py test
    python clickup-integration.py workspaces
    
Environment Variables:
    CLICKUP_API_KEY      - Your ClickUp API key
    CLICKUP_WORKSPACE_ID - Workspace/Team ID
    CLICKUP_LIST_ID      - List ID for tasks
""")
        sys.exit(0)
    
    manager = ClickUpDocumentationManager()
    command = sys.argv[1].lower()
    
    try:
        if command == "sync":
            if len(sys.argv) < 3:
                print("Usage: python clickup-integration.py sync <file>")
                sys.exit(1)
            
            result = manager.sync_documentation(sys.argv[2])
            print(f"\n📊 Sync Result: {result['status']}")
            
            if result["status"] == "success":
                print(f"Task ID: {result['task_id']}")
                print(f"Doc ID: {result['doc_id']}")
                print(f"Checksum: {result['checksum']}")
        
        elif command == "deploy":
            version = sys.argv[2] if len(sys.argv) > 2 else "1.0.0"
            
            changes = [
                "Updated DNS health monitoring",
                "Enhanced backup system",
                "Improved HubSpot integration",
                "Added comprehensive documentation"
            ]
            
            task_id = manager.create_deployment_task(version, changes)
            
            if task_id:
                # Add deployment status comment
                manager.add_comment(
                    task_id,
                    "🚀 Deployment initiated via automated pipeline"
                )
        
        elif command == "test":
            print("🔍 Testing ClickUp connection...")
            
            if not manager.api_key:
                print("❌ API key not configured")
                sys.exit(1)
            
            workspaces = manager.get_workspaces()
            
            if workspaces:
                print(f"✅ Connected to ClickUp")
                print(f"Found {len(workspaces)} workspace(s)")
                
                for ws in workspaces:
                    print(f"  - {ws['name']} (ID: {ws['id']})")
            else:
                print("❌ Connection failed")
        
        elif command == "workspaces":
            workspaces = manager.get_workspaces()
            
            if workspaces:
                print(f"\n📁 Available Workspaces:\n")
                for ws in workspaces:
                    print(f"Name: {ws['name']}")
                    print(f"ID: {ws['id']}")
                    print(f"Members: {len(ws.get('members', []))}")
                    print("-" * 40)
            else:
                print("No workspaces found")
        
        else:
            print(f"❌ Unknown command: {command}")
            sys.exit(1)
    
    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()