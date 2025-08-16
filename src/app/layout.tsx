import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import './globals.css'
import { Analytics } from '@/components/Analytics'
import { Providers } from '@/components/Providers'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const poppins = Poppins({ 
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://leo.pvthostel.com'),
  title: {
    default: 'Leo PVT Hostel Montreal | Budget-Friendly Accommodation in Downtown',
    template: '%s | Leo PVT Hostel Montreal'
  },
  description: 'Experience Montreal at Leo PVT Hostel. Affordable accommodation in the heart of downtown Montreal. Perfect for backpackers, students, and budget travelers. Book your stay today!',
  keywords: 'hostel montreal, budget accommodation montreal, backpackers hostel, downtown montreal hostel, pvt hostel, leo hostel, cheap accommodation montreal, student hostel montreal',
  authors: [{ name: 'PVT Hostel' }],
  creator: 'PVT Hostel',
  publisher: 'PVT Hostel',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'Leo PVT Hostel Montreal | Budget-Friendly Accommodation',
    description: 'Experience Montreal at Leo PVT Hostel. Affordable accommodation in downtown Montreal.',
    url: 'https://leo.pvthostel.com',
    siteName: 'Leo PVT Hostel',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Leo PVT Hostel Montreal',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Leo PVT Hostel Montreal',
    description: 'Budget-friendly accommodation in downtown Montreal',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://leo.pvthostel.com',
    languages: {
      'en': 'https://leo.pvthostel.com/en',
      'fr': 'https://leo.pvthostel.com/fr',
    },
  },
  verification: {
    google: 'google-site-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className={inter.className}>
        <Providers>
          <Analytics />
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  )
}