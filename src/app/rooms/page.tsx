import PageHero from '@/components/PageHero'
import RoomShowcase from '@/components/RoomShowcase'
import BookingWidget from '@/components/BookingWidget'
import CTA from '@/components/CTA'
import { RoomsPageCTASection } from '@/components/CTASection'

export const metadata = {
  title: 'Rooms & Accommodations',
  description: 'Explore our comfortable and affordable rooms at Leo PVT Hostel Montreal. From dormitories to private rooms, find the perfect accommodation for your stay.',
}

export default function RoomsPage() {
  return (
    <>
      <PageHero
        title="Our Rooms"
        subtitle="Comfort Meets Affordability"
        description="From social dormitories to private retreats, discover accommodation options designed for every type of traveler visiting Montreal."
        backgroundImage="/images/rooms/rooms-hero.jpg"
        ctaPrimary={{
          text: "Check Availability",
          href: "#booking-widget",
          showIcon: true
        }}
        ctaSecondary={{
          text: "View Amenities",
          href: "/amenities",
          showIcon: true
        }}
        breadcrumbs={[
          { name: "Home", href: "/" },
          { name: "Rooms", href: "/rooms" }
        ]}
        stats={[
          { value: "6", label: "Room Types" },
          { value: "$28", label: "Starting From" },
          { value: "4.8★", label: "Guest Rating" }
        ]}
      />
      
      <div id="main-content">
        <BookingWidget />
        <RoomsPageCTASection />
        <RoomShowcase />
        <CTA />
      </div>
    </>
  )
}