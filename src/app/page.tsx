import HeroCinematic from '@/components/HeroCinematic'
import ValueProp from '@/components/ValueProp'
import FlashSaleBooking from '@/components/FlashSaleBooking'
import RoomShowcaseCinematic from '@/components/RoomShowcaseCinematic'
import LocationCinematic from '@/components/LocationCinematic'
import Testimonials from '@/components/Testimonials'
import FAQ from '@/components/FAQ'
import CTACinematic from '@/components/CTACinematic'

export default function HomePage() {
  return (
    <div className="bg-pvt-black">
      <HeroCinematic />
      <ValueProp />
      <FlashSaleBooking />
      <RoomShowcaseCinematic />
      <LocationCinematic />
      <Testimonials />
      <FAQ />
      <CTACinematic />
    </div>
  )
}
