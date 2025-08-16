import Hero from '@/components/Hero'
import RoomShowcase from '@/components/RoomShowcase'
import Amenities from '@/components/Amenities'
import Location from '@/components/Location'
import Testimonials from '@/components/Testimonials'
import FAQ from '@/components/FAQ'
import CTA from '@/components/CTA'
import BookingWidget from '@/components/BookingWidget'

export default function HomePage() {
  return (
    <>
      <Hero />
      <BookingWidget />
      <RoomShowcase />
      <Amenities />
      <Location />
      <Testimonials />
      <FAQ />
      <CTA />
    </>
  )
}