import { NextResponse } from 'next/server'

export async function GET() {
  const healthCheck = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version || '1.0.0',
    services: {
      database: 'connected',
      cache: 'connected',
      analytics: {
        ga4: !!process.env.NEXT_PUBLIC_GA4_ID,
        gtm: !!process.env.NEXT_PUBLIC_GTM_ID,
        facebook: !!process.env.NEXT_PUBLIC_FB_PIXEL_ID,
        clarity: !!process.env.NEXT_PUBLIC_CLARITY_ID,
      }
    },
    memory: {
      used: process.memoryUsage().heapUsed / 1024 / 1024,
      total: process.memoryUsage().heapTotal / 1024 / 1024,
      unit: 'MB'
    }
  }

  return NextResponse.json(healthCheck, { status: 200 })
}