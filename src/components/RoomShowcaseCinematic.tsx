import * as PVT from './PVT'
import Image from 'next/image'
import Link from 'next/link'

export default function RoomShowcaseCinematic() {
  const rooms = [
    {
      img: "https://images.unsplash.com/photo-1505692794403-34d4982d3a3a",
      title: "4‑Bed Mixed Dorm",
      price: "$35/night"
    },
    {
      img: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde",
      title: "Female‑Only Dorm",
      price: "$32/night"
    },
    {
      img: "https://images.unsplash.com/photo-1560448075-bb4b1a1a9c34",
      title: "Private Double Room",
      price: "$89/night"
    }
  ]

  return (
    <section className="py-24 bg-background-dark">
      <div className="max-w-6xl mx-auto px-6 mb-12 text-center">
        <PVT.Heading level="2" font="display" className="mb-4 text-text-inverse">
          Rooms & Suites
        </PVT.Heading>
        <PVT.Text color="secondary" className="max-w-xl mx-auto text-gray-400">
          Modern, clean, and designed for comfort — whether you're solo or traveling with friends.
        </PVT.Text>
      </div>

      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-10">
        {rooms.map((room, i) => (
          <PVT.Card
            key={i}
            background="dark"
            shadow="card"
            padding="none"
            className="overflow-hidden hover:scale-[1.02] transition-transform duration-300"
          >
            <div className="relative h-56 w-full">
              <Image
                src={room.img}
                alt={room.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <PVT.Heading level="3" font="body" className="mb-2 text-text-inverse">
                {room.title}
              </PVT.Heading>
              <PVT.Text color="secondary" className="mb-4 text-gray-300">
                {room.price}
              </PVT.Text>
              <Link href="/book">
                <PVT.Button variant="gold" size="md" fullWidth>
                  Book Now
                </PVT.Button>
              </Link>
            </div>
          </PVT.Card>
        ))}
      </div>
    </section>
  )
}
