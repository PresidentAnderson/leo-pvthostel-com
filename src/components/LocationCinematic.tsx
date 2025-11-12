import * as PVT from './PVT'
import Link from 'next/link'

export default function LocationCinematic() {
  return (
    <section className="py-24 bg-pvt-black border-t border-border-medium">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <PVT.Heading level="2" font="display" className="mb-4 text-text-inverse">
            In the Heart of Montreal
          </PVT.Heading>
          <PVT.Text color="secondary" className="mb-6 text-gray-400">
            Steps from Place‑des‑Arts, cafés, nightlife, and major attractions.
            You're not just staying in Montreal — you're plugged into the city.
          </PVT.Text>
          <Link href="/location">
            <PVT.Button variant="gold" size="md">
              View Full Location
            </PVT.Button>
          </Link>
        </div>
        <div>
          <PVT.Card background="dark" shadow="medium" padding="none" className="overflow-hidden">
            <iframe
              title="Montreal Downtown Map"
              className="w-full h-80"
              src="https://maps.google.com/maps?q=montreal%20downtown&t=&z=13&ie=UTF8&iwloc=&output=embed"
              loading="lazy"
            />
          </PVT.Card>
        </div>
      </div>
    </section>
  )
}
