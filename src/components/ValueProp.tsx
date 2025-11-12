import * as PVT from './PVT'

export default function ValueProp() {
  const values = [
    {
      title: "Prime Downtown Location",
      desc: "2‑minute walk to metro, cafés, nightlife, museums.",
    },
    {
      title: "Affordable Luxury",
      desc: "Dorms from $28. Boutique private rooms under $100.",
    },
    {
      title: "24/7 Security",
      desc: "CCTV, keycard floors, female‑only sections.",
    }
  ]

  return (
    <section className="py-20 bg-pvt-black border-t border-border-medium">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-12 text-center">
        {values.map((item, i) => (
          <div key={i} className="flex flex-col items-center">
            <PVT.Heading level="3" font="body" className="text-text-inverse mb-2">
              {item.title}
            </PVT.Heading>
            <PVT.Text color="secondary" className="text-gray-400">
              {item.desc}
            </PVT.Text>
          </div>
        ))}
      </div>
    </section>
  )
}
