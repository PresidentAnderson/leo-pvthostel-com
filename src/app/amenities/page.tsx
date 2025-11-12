import PageHero from '@/components/PageHero'
import Amenities from '@/components/Amenities'
import BookingWidget from '@/components/BookingWidget'
import CTA from '@/components/CTA'

export const metadata = {
  title: 'Amenities & Services',
  description: 'Discover all the amenities and services available at Leo PVT Hostel Montreal. Free WiFi, 24/7 reception, laundry, kitchen facilities, and more.',
}

export default function AmenitiesPage() {
  return (
    <>
      <PageHero
        title="World-Class Amenities"
        subtitle="Everything You Need"
        description="Enjoy premium facilities and services designed to make your stay in Montreal comfortable, convenient, and memorable."
        backgroundImage="/images/amenities/amenities-hero.jpg"
        ctaPrimary={{
          text: "Book Your Stay",
          href: "#booking-widget",
          showIcon: true
        }}
        ctaSecondary={{
          text: "View Rooms",
          href: "/rooms",
          showIcon: true
        }}
        breadcrumbs={[
          { name: "Home", href: "/" },
          { name: "Amenities", href: "/amenities" }
        ]}
        stats={[
          { value: "24/7", label: "Reception" },
          { value: "Free", label: "WiFi & Breakfast" },
          { value: "100%", label: "Satisfaction" }
        ]}
      />
      
      <div id="main-content">
        <Amenities />
        <BookingWidget />
        <CTA />
      </div>
    </>
  )
}