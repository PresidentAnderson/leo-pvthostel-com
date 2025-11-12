import * as PVT from './PVT'
import Link from 'next/link'

export default function CTACinematic() {
  return (
    <section className="py-24 text-center bg-background-dark">
      <div className="max-w-3xl mx-auto px-6">
        <PVT.Heading level="2" font="display" className="mb-4 text-text-inverse">
          Ready for your stay?
        </PVT.Heading>
        <PVT.Text color="secondary" className="mb-8 text-gray-400">
          Book now and get exclusive direct‑booking perks.
        </PVT.Text>
        <Link href="/book">
          <PVT.Button variant="gold" size="lg" className="px-12">
            Book Your Stay
          </PVT.Button>
        </Link>
      </div>
    </section>
  )
}
