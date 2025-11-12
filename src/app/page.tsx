import Hero from '@/components/Hero'
import RoomShowcase from '@/components/RoomShowcase'
import Amenities from '@/components/Amenities'
import Location from '@/components/Location'
import Testimonials from '@/components/Testimonials'
import FAQ from '@/components/FAQ'
import CTA from '@/components/CTA'
import FlashSaleBooking from '@/components/FlashSaleBooking'
import { HomePageCTASection } from '@/components/CTASection'

export default function HomePage() {
  return (
    <>
      <Hero />
      <FlashSaleBooking />
      <HomePageCTASection />
      <RoomShowcase />
      <Amenities />
      <Location />
      <Testimonials />
      <FAQ />
      <CTA />
    </>
  )
}