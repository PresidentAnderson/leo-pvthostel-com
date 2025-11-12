import PageHero from '@/components/PageHero'
import Location from '@/components/Location'
import BookingWidget from '@/components/BookingWidget'
import CTA from '@/components/CTA'

export const metadata = {
  title: 'Prime Location in Montreal',
  description: 'Leo PVT Hostel is perfectly located in downtown Montreal, walking distance to major attractions, metro stations, and the best of what Montreal offers.',
}

export default function LocationPage() {
  return (
    <>
      <PageHero
        title="Prime Downtown Location"
        subtitle="Heart of Montreal"
        description="Perfectly positioned in downtown Montreal, we're within walking distance of the city's best attractions, restaurants, and transportation hubs."
        backgroundImage="/images/location/montreal-downtown.jpg"
        ctaPrimary={{
          text: "Get Directions",
          href: "#location-map",
          showIcon: true
        }}
        ctaSecondary={{
          text: "Book Now",
          href: "#booking-widget",
          showIcon: true
        }}
        breadcrumbs={[
          { name: "Home", href: "/" },
          { name: "Location", href: "/location" }
        ]}
        stats={[
          { value: "2 min", label: "To Metro" },
          { value: "5 min", label: "To Old Port" },
          { value: "10 min", label: "To Mount Royal" }
        ]}
      />
      
      <div id="main-content">
        <Location />
        <BookingWidget />
        <CTA />
      </div>
    </>
  )
}