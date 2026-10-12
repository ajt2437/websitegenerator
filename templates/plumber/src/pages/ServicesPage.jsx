import { asset } from '../business.js'
import { copy } from '../business.js'
import { Link } from 'react-router-dom'
import { Building2, Home, ArrowRight, Siren, Wrench, ShieldAlert, Layers, HousePlus, LayoutGrid, Droplets, Flame, ShowerHead, Waves } from 'lucide-react'
import { useSEO } from '../lib/useSEO.js'
import { HOME_SERVICES } from '../site.js'
import Reveal from '../lib/Reveal.jsx'
import PageHero from '../components/PageHero.jsx'
import ServicesGrid from '../components/ServicesGrid.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import ContactSection from '../components/ContactSection.jsx'
import Reviews from '../components/Reviews.jsx'

const ALL = [
  { Icon: Siren, label: "Emergency plumbing", href: '/emergency-plumbing', text: "Burst pipes, major leaks and backups - tell us what is happening and we will talk through the next steps." },
  { Icon: Droplets, label: "Leak repair", href: '/leak-repair', text: "Dripping fixtures, hidden leaks and damaged supply lines found and repaired." },
  { Icon: Waves, label: "Drain cleaning", href: '/drain-cleaning', text: "Slow or clogged kitchen, bathroom and main drains cleared." },
  { Icon: Flame, label: "Water heaters", href: '/water-heaters', text: "Repair and replacement of tank water heaters." },
  { Icon: Flame, label: "Tankless water heaters", href: '/tankless-water-heaters', text: "Endless hot water with a properly sized tankless system." },
  { Icon: ShowerHead, label: "Fixtures", href: '/fixtures', text: "Faucets, sinks, toilets, showers and garbage disposals installed or replaced." },
  { Icon: Layers, label: "Repiping", href: '/repiping', text: "Replacing aging or failing water lines throughout the home." },
  { Icon: ShieldAlert, label: "Sewer lines", href: '/sewer-lines', text: "Sewer line inspection, repair and replacement." },
  { Icon: LayoutGrid, label: "Kitchen & bath remodels", href: '/remodels', text: "Plumbing for kitchen and bathroom renovations, from rough-in to finish." },
  { Icon: HousePlus, label: "New construction", href: '/new-construction', text: "Plumbing for additions and new builds, planned with your contractor." },
  { Icon: Wrench, label: "Plumbing maintenance", href: '/maintenance', text: "Inspections and preventive maintenance that catch problems early." },
]

export default function ServicesPage() {
  useSEO({
    title: copy("Explore our craftsmanship | Your Company"),
    description: "Discuss your plumbing needs with us. We can talk through the work, timing and quotation for your property.",
    path: '/services',
    image: asset("/images/under-sink.jpg"),
  })
  const segments = [
    { Icon: Building2, title: "Housing associations", text: "Discuss your plumbing needs with us. We can talk through the work, timing and quotation for your property." },
    { Icon: Home, title: "Homeowners", text: "Discuss your plumbing needs with us. We can talk through the work, timing and quotation for your property." },
  ]
  return (
    <>
      <PageHero
        image={asset("/images/under-sink.jpg")}
        imageAlt={copy("Your Company — explore our craftsmanship")}
        crumbs={[{ label: "Home", href: '/' }, { label: "Services", href: '/services' }]}
        eyebrow={"Plumbing services"}
        h1={"Explore our craftsmanship"}
        intro={["Our attention to detail and craftsmanship is expressed in every project we carry out. From a dripping faucet to repiping an entire home."]}
      />

      <section className="px-6 sm:px-10 lg:px-16 pt-20 sm:pt-28 pb-8">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-5">
          {segments.map((s, i) => (
            <Reveal key={s.title} delay={i * 120}>
              <article className="h-full rounded-5xl bg-white border border-divider p-7 sm:p-10 shadow-sm hover:shadow-xl hover:shadow-primary/10 hover:border-primary/40 transition-all duration-500">
                <span className="h-12 w-12 rounded-2xl bg-primary/10 text-primary-dark flex items-center justify-center mb-6"><s.Icon className="h-6 w-6" strokeWidth={2.2} /></span>
                <h3 className="font-display font-bold text-2xl sm:text-3xl text-ink tracking-tight">{s.title}</h3>
                <p className="text-muted text-[15px] sm:text-base leading-relaxed mt-4">{s.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="px-6 sm:px-10 lg:px-16 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto">
          <SectionHeading eyebrow={"Our services"} title={"All your plumbing needs,"} flourish={"under one roof."} className="mb-12" />
          <ServicesGrid items={HOME_SERVICES} />
          <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-divider rounded-4xl overflow-hidden border border-divider">
            {ALL.map((s, i) => (
              <Reveal key={s.href} delay={(i % 3) * 60}>
                <Link to={s.href} className="group flex h-full items-start gap-4 bg-white p-6 hover:bg-background transition-colors">
                  <span className="h-10 w-10 shrink-0 rounded-2xl bg-primary/10 text-primary-dark flex items-center justify-center group-hover:bg-primary group-hover:text-deep transition-colors"><s.Icon className="h-5 w-5" strokeWidth={2.2} /></span>
                  <span className="flex-1">
                    <span className="font-display font-semibold text-ink group-hover:text-primary-dark transition-colors block">{s.label}</span>
                    <span className="text-sm text-muted leading-snug block mt-1">{s.text}</span>
                  </span>
                  <ArrowRight className="h-4 w-4 text-ink/30 group-hover:text-primary group-hover:translate-x-0.5 transition-all mt-1" />
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Reviews />
      <ContactSection />
    </>
  )
}
