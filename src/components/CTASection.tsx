'use client'

import { motion } from 'framer-motion'
import CTACard, { 
  BookingCTACard, 
  ContactCTACard, 
  UrgencyCTACard, 
  SafetyCTACard, 
  ReviewsCTACard, 
  AmenitiesCTACard, 
  NewsletterCTACard 
} from './CTACards'

interface CTASectionProps {
  layout: 'grid-2' | 'grid-3' | 'single' | 'sidebar' | 'banner'
  cards: Array<'booking' | 'contact' | 'urgency' | 'safety' | 'reviews' | 'amenities' | 'newsletter'>
  className?: string
  title?: string
  subtitle?: string
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
}

export default function CTASection({ 
  layout, 
  cards, 
  className = "", 
  title, 
  subtitle 
}: CTASectionProps) {
  const getLayoutClasses = () => {
    switch (layout) {
      case 'grid-2':
        return 'grid grid-cols-1 md:grid-cols-2 gap-6'
      case 'grid-3':
        return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
      case 'single':
        return 'max-w-md mx-auto'
      case 'sidebar':
        return 'space-y-4'
      case 'banner':
        return 'flex overflow-x-auto gap-4 pb-4'
      default:
        return 'grid grid-cols-1 md:grid-cols-2 gap-6'
    }
  }

  const renderCard = (cardType: string, index: number) => {
    const key = `${cardType}-${index}`
    
    switch (cardType) {
      case 'booking':
        return <BookingCTACard key={key} />
      case 'contact':
        return <ContactCTACard key={key} />
      case 'urgency':
        return <UrgencyCTACard key={key} />
      case 'safety':
        return <SafetyCTACard key={key} />
      case 'reviews':
        return <ReviewsCTACard key={key} />
      case 'amenities':
        return <AmenitiesCTACard key={key} />
      case 'newsletter':
        return <NewsletterCTACard key={key} />
      default:
        return <BookingCTACard key={key} />
    }
  }

  return (
    <section className={`py-8 ${className}`}>
      <div className="container mx-auto px-4">
        {(title || subtitle) && (
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {title && (
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>
            )}
            {subtitle && (
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
            )}
          </motion.div>
        )}

        <motion.div 
          className={getLayoutClasses()}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {cards.map((cardType, index) => renderCard(cardType, index))}
        </motion.div>
      </div>
    </section>
  )
}

// Predefined CTA sections for common use cases
export function HomePageCTASection() {
  return (
    <CTASection
      layout="grid-3"
      cards={['booking', 'safety', 'reviews']}
      className="bg-gray-50"
      title="Why Choose Leo PVT Hostel?"
      subtitle="Join thousands of travelers who've made Montreal unforgettable with us"
    />
  )
}

export function RoomsPageCTASection() {
  return (
    <CTASection
      layout="grid-2"
      cards={['urgency', 'amenities']}
      className="bg-white"
    />
  )
}

export function ContactPageCTASection() {
  return (
    <CTASection
      layout="grid-2"
      cards={['booking', 'newsletter']}
      className="bg-gray-50"
    />
  )
}

export function SidebarCTASection() {
  return (
    <CTASection
      layout="sidebar"
      cards={['booking', 'contact', 'newsletter']}
      className="lg:w-80"
    />
  )
}

export function UrgencyBannerSection() {
  return (
    <CTASection
      layout="single"
      cards={['urgency']}
      className="bg-red-50 border-t border-b border-red-200"
    />
  )
}