#!/usr/bin/env node

const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

// ClickUp API Configuration
const CLICKUP_API_KEY = process.env.CLICKUP_API_KEY;
const CLICKUP_API_URL = 'https://api.clickup.com/api/v2';

class ClickUpProjectManager {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.headers = {
            'Authorization': apiKey,
            'Content-Type': 'application/json'
        };
    }

    // Get team/workspace ID
    async getTeams() {
        try {
            const response = await axios.get(`${CLICKUP_API_URL}/team`, {
                headers: this.headers
            });
            return response.data.teams;
        } catch (error) {
            console.error('Error fetching teams:', error.message);
            return null;
        }
    }

    // Create a new space for leo.pvthostel.com
    async createSpace(teamId, spaceName = "Leo PVT Hostel Website") {
        try {
            const response = await axios.post(
                `${CLICKUP_API_URL}/team/${teamId}/space`,
                {
                    name: spaceName,
                    multiple_assignees: true,
                    features: {
                        due_dates: {
                            enabled: true,
                            start_date: true,
                            remap_due_dates: true,
                            remap_closed_due_date: false
                        },
                        time_tracking: {
                            enabled: true
                        },
                        tags: {
                            enabled: true
                        },
                        time_estimates: {
                            enabled: true
                        },
                        custom_fields: {
                            enabled: true
                        },
                        remap_dependencies: {
                            enabled: true
                        },
                        dependency_warning: {
                            enabled: true
                        },
                        portfolios: {
                            enabled: true
                        }
                    }
                },
                { headers: this.headers }
            );
            console.log(`✅ Space created: ${response.data.name} (ID: ${response.data.id})`);
            return response.data;
        } catch (error) {
            console.error('Error creating space:', error.message);
            return null;
        }
    }

    // Create folders in the space
    async createFolder(spaceId, folderName) {
        try {
            const response = await axios.post(
                `${CLICKUP_API_URL}/space/${spaceId}/folder`,
                { name: folderName },
                { headers: this.headers }
            );
            console.log(`✅ Folder created: ${response.data.name}`);
            return response.data;
        } catch (error) {
            console.error(`Error creating folder ${folderName}:`, error.message);
            return null;
        }
    }

    // Create lists with custom fields
    async createList(folderId, listName, customFields = []) {
        try {
            const response = await axios.post(
                `${CLICKUP_API_URL}/folder/${folderId}/list`,
                {
                    name: listName,
                    content: `List for ${listName} tasks`,
                    due_date: null,
                    priority: 3,
                    status: "to do"
                },
                { headers: this.headers }
            );
            
            const listId = response.data.id;
            console.log(`✅ List created: ${response.data.name} (ID: ${listId})`);

            // Add custom fields to the list
            for (const field of customFields) {
                await this.addCustomField(listId, field);
            }

            return response.data;
        } catch (error) {
            console.error(`Error creating list ${listName}:`, error.message);
            return null;
        }
    }

    // Add custom fields to a list
    async addCustomField(listId, fieldConfig) {
        try {
            const response = await axios.post(
                `${CLICKUP_API_URL}/list/${listId}/field`,
                fieldConfig,
                { headers: this.headers }
            );
            console.log(`  ✅ Custom field added: ${fieldConfig.name}`);
            return response.data;
        } catch (error) {
            console.error(`Error adding custom field ${fieldConfig.name}:`, error.message);
            return null;
        }
    }

    // Create tasks in a list
    async createTask(listId, taskData) {
        try {
            const response = await axios.post(
                `${CLICKUP_API_URL}/list/${listId}/task`,
                taskData,
                { headers: this.headers }
            );
            console.log(`  ✅ Task created: ${response.data.name}`);
            return response.data;
        } catch (error) {
            console.error(`Error creating task:`, error.message);
            return null;
        }
    }

    // Setup complete project structure
    async setupLeoProject() {
        console.log('\n🚀 Setting up Leo PVT Hostel Website Project in ClickUp...\n');

        // Get team
        const teams = await this.getTeams();
        if (!teams || teams.length === 0) {
            console.error('No teams found. Please check your API key.');
            return;
        }

        const teamId = teams[0].id;
        console.log(`Using team: ${teams[0].name} (ID: ${teamId})\n`);

        // Create space
        const space = await this.createSpace(teamId);
        if (!space) return;

        // Project structure
        const projectStructure = {
            'Development': {
                lists: {
                    'Frontend Development': {
                        customFields: [
                            { name: 'Component Type', type: 'drop_down', type_config: { options: ['Page', 'Component', 'Layout', 'API Route'] } },
                            { name: 'Tech Stack', type: 'labels', type_config: { options: [{ label: 'Next.js' }, { label: 'React' }, { label: 'TypeScript' }, { label: 'Tailwind CSS' }] } },
                            { name: 'Priority', type: 'drop_down', type_config: { options: ['Critical', 'High', 'Medium', 'Low'] } },
                            { name: 'Story Points', type: 'number' },
                            { name: 'Sprint', type: 'drop_down', type_config: { options: ['Sprint 1', 'Sprint 2', 'Sprint 3'] } }
                        ],
                        tasks: [
                            { name: 'Setup Next.js 14 with TypeScript', description: 'Initialize Next.js project with App Router and TypeScript', priority: 1, tags: ['setup', 'critical'] },
                            { name: 'Configure Tailwind CSS and design system', description: 'Setup Tailwind with custom theme and components', priority: 1, tags: ['styling', 'setup'] },
                            { name: 'Create homepage with hero section', description: 'Implement responsive hero section with booking CTA', priority: 1, tags: ['homepage', 'ui'] },
                            { name: 'Implement room showcase component', description: 'Create component to display room types and features', priority: 2, tags: ['component', 'rooms'] },
                            { name: 'Build amenities section', description: 'Display hostel amenities with icons and descriptions', priority: 2, tags: ['component', 'amenities'] },
                            { name: 'Create location/map component', description: 'Integrate interactive map showing hostel location', priority: 2, tags: ['component', 'location'] },
                            { name: 'Implement testimonials carousel', description: 'Build testimonial slider with guest reviews', priority: 3, tags: ['component', 'social-proof'] },
                            { name: 'Create booking integration', description: 'Integrate with PVT booking system or third-party', priority: 1, tags: ['booking', 'integration'] },
                            { name: 'Build contact form', description: 'Implement contact form with email notifications', priority: 2, tags: ['form', 'contact'] },
                            { name: 'Add multilingual support (FR/EN)', description: 'Implement i18n for French and English', priority: 2, tags: ['i18n', 'feature'] }
                        ]
                    },
                    'Backend & Infrastructure': {
                        customFields: [
                            { name: 'Service Type', type: 'drop_down', type_config: { options: ['API', 'Database', 'Auth', 'Integration', 'DevOps'] } },
                            { name: 'Environment', type: 'labels', type_config: { options: [{ label: 'Development' }, { label: 'Staging' }, { label: 'Production' }] } },
                            { name: 'Security Level', type: 'drop_down', type_config: { options: ['Critical', 'High', 'Standard'] } }
                        ],
                        tasks: [
                            { name: 'Setup API routes for contact form', description: 'Create Next.js API routes for form submission', priority: 2, tags: ['api', 'backend'] },
                            { name: 'Configure email service (SendGrid/Resend)', description: 'Setup email service for notifications', priority: 2, tags: ['email', 'integration'] },
                            { name: 'Implement rate limiting', description: 'Add rate limiting to prevent spam', priority: 2, tags: ['security', 'backend'] },
                            { name: 'Setup environment variables', description: 'Configure .env files for all environments', priority: 1, tags: ['config', 'setup'] },
                            { name: 'Configure Vercel deployment', description: 'Setup automatic deployment pipeline', priority: 1, tags: ['deployment', 'devops'] },
                            { name: 'Implement caching strategy', description: 'Setup caching for performance optimization', priority: 3, tags: ['performance', 'optimization'] }
                        ]
                    },
                    'Analytics & SEO': {
                        customFields: [
                            { name: 'Platform', type: 'labels', type_config: { options: [{ label: 'Google Analytics' }, { label: 'GTM' }, { label: 'Facebook' }, { label: 'Clarity' }] } },
                            { name: 'Implementation Status', type: 'drop_down', type_config: { options: ['Not Started', 'In Progress', 'Testing', 'Complete'] } }
                        ],
                        tasks: [
                            { name: 'Setup Google Analytics 4', description: 'Implement GA4 tracking with events', priority: 1, tags: ['analytics', 'tracking'] },
                            { name: 'Configure Google Tag Manager', description: 'Setup GTM container and tags', priority: 1, tags: ['gtm', 'tracking'] },
                            { name: 'Implement Facebook Pixel', description: 'Add Facebook Pixel for marketing', priority: 2, tags: ['facebook', 'marketing'] },
                            { name: 'Setup Microsoft Clarity', description: 'Implement heatmap and session recording', priority: 3, tags: ['clarity', 'ux'] },
                            { name: 'Configure SEO metadata', description: 'Add meta tags, Open Graph, structured data', priority: 1, tags: ['seo', 'metadata'] },
                            { name: 'Create and submit sitemap', description: 'Generate XML sitemap for search engines', priority: 2, tags: ['seo', 'sitemap'] },
                            { name: 'Setup Google Search Console', description: 'Verify property and monitor performance', priority: 2, tags: ['seo', 'search-console'] }
                        ]
                    }
                }
            },
            'Content & Design': {
                lists: {
                    'Content Creation': {
                        customFields: [
                            { name: 'Content Type', type: 'drop_down', type_config: { options: ['Copy', 'Images', 'Video', 'Documents'] } },
                            { name: 'Language', type: 'labels', type_config: { options: [{ label: 'English' }, { label: 'French' }, { label: 'Both' }] } },
                            { name: 'Word Count', type: 'number' }
                        ],
                        tasks: [
                            { name: 'Write homepage hero copy', description: 'Create compelling headline and subheadline', priority: 1, tags: ['copy', 'homepage'] },
                            { name: 'Create room descriptions', description: 'Write detailed descriptions for each room type', priority: 2, tags: ['copy', 'rooms'] },
                            { name: 'Write amenities content', description: 'Describe all hostel amenities and features', priority: 2, tags: ['copy', 'amenities'] },
                            { name: 'Create About Us section', description: 'Write hostel story and mission', priority: 3, tags: ['copy', 'about'] },
                            { name: 'Gather guest testimonials', description: 'Collect and format guest reviews', priority: 2, tags: ['content', 'social-proof'] },
                            { name: 'Translate all content to French', description: 'Professional translation of all website copy', priority: 2, tags: ['translation', 'i18n'] }
                        ]
                    },
                    'Visual Assets': {
                        customFields: [
                            { name: 'Asset Type', type: 'drop_down', type_config: { options: ['Photo', 'Icon', 'Illustration', 'Logo', 'Video'] } },
                            { name: 'Resolution', type: 'labels', type_config: { options: [{ label: 'Web' }, { label: 'Retina' }, { label: '4K' }] } },
                            { name: 'File Size (KB)', type: 'number' }
                        ],
                        tasks: [
                            { name: 'Professional photography shoot', description: 'Capture high-quality photos of all areas', priority: 1, tags: ['photography', 'assets'] },
                            { name: 'Optimize images for web', description: 'Compress and resize all images', priority: 2, tags: ['optimization', 'performance'] },
                            { name: 'Create favicon and app icons', description: 'Design icons for all platforms', priority: 3, tags: ['design', 'branding'] },
                            { name: 'Source or create amenity icons', description: 'Icons for all amenities and features', priority: 2, tags: ['icons', 'design'] },
                            { name: 'Create loading animations', description: 'Design smooth loading states', priority: 3, tags: ['animation', 'ux'] }
                        ]
                    }
                }
            },
            'Testing & Launch': {
                lists: {
                    'Quality Assurance': {
                        customFields: [
                            { name: 'Test Type', type: 'drop_down', type_config: { options: ['Unit', 'Integration', 'E2E', 'Performance', 'Security'] } },
                            { name: 'Browser', type: 'labels', type_config: { options: [{ label: 'Chrome' }, { label: 'Firefox' }, { label: 'Safari' }, { label: 'Edge' }] } },
                            { name: 'Device', type: 'labels', type_config: { options: [{ label: 'Desktop' }, { label: 'Mobile' }, { label: 'Tablet' }] } },
                            { name: 'Severity', type: 'drop_down', type_config: { options: ['Critical', 'Major', 'Minor', 'Trivial'] } }
                        ],
                        tasks: [
                            { name: 'Cross-browser testing', description: 'Test on all major browsers', priority: 1, tags: ['testing', 'compatibility'] },
                            { name: 'Mobile responsiveness testing', description: 'Test on various mobile devices', priority: 1, tags: ['testing', 'mobile'] },
                            { name: 'Form validation testing', description: 'Test all forms and inputs', priority: 2, tags: ['testing', 'forms'] },
                            { name: 'Performance testing', description: 'Lighthouse audits and optimization', priority: 2, tags: ['testing', 'performance'] },
                            { name: 'Accessibility testing', description: 'WCAG 2.1 compliance check', priority: 2, tags: ['testing', 'a11y'] },
                            { name: 'Security audit', description: 'Check for vulnerabilities', priority: 1, tags: ['testing', 'security'] },
                            { name: 'Load testing', description: 'Test server under load', priority: 3, tags: ['testing', 'performance'] }
                        ]
                    },
                    'Launch Checklist': {
                        customFields: [
                            { name: 'Status', type: 'drop_down', type_config: { options: ['Pending', 'In Progress', 'Complete', 'Verified'] } },
                            { name: 'Responsible', type: 'text' },
                            { name: 'Due Date', type: 'date' }
                        ],
                        tasks: [
                            { name: 'Domain configuration', description: 'Setup leo.pvthostel.com DNS', priority: 1, tags: ['launch', 'infrastructure'] },
                            { name: 'SSL certificate setup', description: 'Ensure HTTPS is working', priority: 1, tags: ['launch', 'security'] },
                            { name: 'Analytics verification', description: 'Verify all tracking is working', priority: 1, tags: ['launch', 'analytics'] },
                            { name: 'Backup strategy', description: 'Setup automated backups', priority: 2, tags: ['launch', 'backup'] },
                            { name: 'Monitoring setup', description: 'Configure uptime monitoring', priority: 2, tags: ['launch', 'monitoring'] },
                            { name: 'Legal pages', description: 'Add privacy policy and terms', priority: 2, tags: ['launch', 'legal'] },
                            { name: 'Launch announcement', description: 'Prepare marketing materials', priority: 3, tags: ['launch', 'marketing'] },
                            { name: 'Staff training', description: 'Train staff on new website', priority: 2, tags: ['launch', 'training'] }
                        ]
                    }
                }
            }
        };

        // Create folders, lists, and tasks
        for (const [folderName, folderData] of Object.entries(projectStructure)) {
            console.log(`\n📁 Creating folder: ${folderName}`);
            const folder = await this.createFolder(space.id, folderName);
            
            if (folder) {
                for (const [listName, listData] of Object.entries(folderData.lists)) {
                    console.log(`\n📋 Creating list: ${listName}`);
                    const list = await this.createList(folder.id, listName, listData.customFields);
                    
                    if (list && listData.tasks) {
                        console.log(`  Adding tasks to ${listName}...`);
                        for (const task of listData.tasks) {
                            await this.createTask(list.id, task);
                        }
                    }
                }
            }
        }

        // Save project configuration
        const config = {
            teamId,
            spaceId: space.id,
            spaceName: space.name,
            createdAt: new Date().toISOString(),
            structure: projectStructure
        };

        await fs.writeFile(
            path.join(__dirname, 'clickup-project-config.json'),
            JSON.stringify(config, null, 2)
        );

        console.log('\n✅ Leo PVT Hostel project setup complete in ClickUp!');
        console.log(`\n📊 View your project at: https://app.clickup.com/${teamId}/spaces`);
        return config;
    }
}

// Main execution
async function main() {
    if (!CLICKUP_API_KEY) {
        console.error('❌ Please set CLICKUP_API_KEY in your .env file');
        console.log('\nTo get your ClickUp API key:');
        console.log('1. Go to https://app.clickup.com/settings/apps');
        console.log('2. Click on "Apps" in the left sidebar');
        console.log('3. Click "Generate" to create a personal API token');
        console.log('4. Copy the token and add it to your .env file as CLICKUP_API_KEY=your_token_here');
        process.exit(1);
    }

    const manager = new ClickUpProjectManager(CLICKUP_API_KEY);
    await manager.setupLeoProject();
}

// Run if executed directly
if (require.main === module) {
    main().catch(console.error);
}

module.exports = ClickUpProjectManager;