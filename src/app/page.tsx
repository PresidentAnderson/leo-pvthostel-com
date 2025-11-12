import HeroLuxury from '@/components/HeroLuxury'
import BookingBarLuxury from '@/components/BookingBarLuxury'
import ValueProp from '@/components/ValueProp'
import RoomsLuxury from '@/components/RoomsLuxury'
import LocationCinematic from '@/components/LocationCinematic'
import Testimonials from '@/components/Testimonials'
import FAQ from '@/components/FAQ'
import CTACinematic from '@/components/CTACinematic'

export default function HomePage() {
  return (
    <div className="bg-black">
      <HeroLuxury />
      <BookingBarLuxury />
      <ValueProp />
      <RoomsLuxury />
      <LocationCinematic />
      <Testimonials />
      <FAQ />
      <CTACinematic />
    </div>
  )
}
