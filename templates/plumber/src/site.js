import { asset } from './business.js'
import { BUSINESS } from './business.js'
export const SITE = BUSINESS


export const NAV = [
  { label: "Home", href: '/' },
  {
    label: "Services",
    href: '/services',
    children: [
      { label: "Emergency plumbing", href: '/emergency-plumbing', blurb: "Burst pipes, major leaks and backups" },
      {
        label: "Leaks & drains",
        href: '/leak-repair',
        blurb: "Leak repair and drain cleaning",
        children: [
          { label: "Leak repair", href: '/leak-repair' },
          { label: "Drain cleaning", href: '/drain-cleaning' },
          { label: "Sewer lines", href: '/sewer-lines' },
        ],
      },
      {
        label: "Water heaters",
        href: '/water-heaters',
        blurb: "Tank and tankless hot water",
        children: [
          { label: "Tank water heaters", href: '/water-heaters' },
          { label: "Tankless water heaters", href: '/tankless-water-heaters' },
        ],
      },
      {
        label: "Fixtures & remodels",
        href: '/fixtures',
        blurb: "Kitchens, bathrooms and new fixtures",
        children: [
          { label: "Fixture installation", href: '/fixtures' },
          { label: "Kitchen & bath remodels", href: '/remodels' },
          { label: "Repiping", href: '/repiping' },
          { label: "New construction", href: '/new-construction' },
        ],
      },
      { label: "Plumbing maintenance", href: '/maintenance', blurb: "Inspections and preventive care" },
    ],
  },
  { label: "Prices", href: '/pricing' },
  { label: "Inspiration", href: '/inspiration' },
  { label: "About", href: '/about' },
  { label: "Contact", href: '/contact' },
]

export const FOOTER_MENU = [
  { label: "Home", href: '/' },
  { label: "Services", href: '/services' },
  { label: "Emergency plumbing", href: '/emergency-plumbing' },
  { label: "Leak repair", href: '/leak-repair' },
  { label: "Drain cleaning", href: '/drain-cleaning' },
  { label: "Water heaters", href: '/water-heaters' },
  { label: "Repiping", href: '/repiping' },
  { label: "Inspiration", href: '/inspiration' },
  { label: "Remodels", href: '/remodels' },
  { label: "Prices", href: '/pricing' },
  { label: "Contact", href: '/contact' },
]

/* Local landing pages */
export const AREAS = { local: [{label: 'Local plumbing services', href: '/contact'}] }

export const HOME_SERVICES = [
  {
    title: "Emergency plumbing",
    text: "Fast help with burst pipes, major leaks, overflowing toilets and sewer backups.",
    href: '/emergency-plumbing',
    image: asset("/images/under-sink.jpg"),
    alt: "Plumber working under a sink — stock photograph",
    icon: 'Siren',
  },
  {
    title: "Leak repair",
    text: "Dripping faucets, running toilets and hidden leaks found and fixed properly.",
    href: '/leak-repair',
    image: asset("/images/plumber-wall.jpg"),
    alt: "Plumber working on a pipe in a wall — stock photograph",
    icon: 'Droplets',
  },
  {
    title: "Drain cleaning",
    text: "Slow or clogged kitchen, bathroom and main drains cleared and flowing again.",
    href: '/drain-cleaning',
    image: asset("/images/sink-drain.jpg"),
    alt: "Water draining into a sink — stock photograph",
    icon: 'Waves',
  },
  {
    title: "Water heaters",
    text: "Repair and replacement of tank and tankless water heaters for reliable hot water.",
    href: '/water-heaters',
    image: asset("/images/water-heater.jpg"),
    alt: "Plumber servicing a water heater — stock photograph",
    icon: 'Flame',
  },
  {
    title: "Fixtures",
    text: "Faucets, sinks, toilets and showers installed neatly and without leaks.",
    href: '/fixtures',
    image: asset("/images/faucet.jpg"),
    alt: "Stainless steel faucet — stock photograph",
    icon: 'ShowerHead',
  },
  {
    title: "Kitchen & bath remodels",
    text: "Plumbing for renovations, from moving lines to setting the final fixtures.",
    href: '/remodels',
    image: asset("/images/interior.jpg"),
    alt: "Renovated kitchen interior — stock photograph",
    icon: 'Hammer',
  },
]

export const GALLERY = [
  { src: asset("/images/faucet.jpg"), alt: "Stainless steel kitchen faucet — stock photograph", category: "Fixtures" },
  { src: asset("/images/interior.jpg"), alt: "Renovated kitchen — stock photograph", category: "Kitchens" },
  { src: asset("/images/faucet-open.jpg"), alt: "Hand turning on a faucet — stock photograph", category: "Fixtures" },
  { src: asset("/images/water-heater.jpg"), alt: "Water heater service — stock photograph", category: "Water heaters" },
  { src: asset("/images/pipes.jpg"), alt: "Pipes mounted on a wall — stock photograph", category: "Pipework" },
  { src: asset("/images/wall-heater.jpg"), alt: "Wall-mounted water heater above a sink — stock photograph", category: "Water heaters" },
  { src: asset("/images/house-dusk.jpg"), alt: "A home at dusk — stock photograph", category: "Homes" },
]
export const GALLERY_FILTERS = ["All", "Fixtures", "Kitchens", "Water heaters", "Pipework", "Homes"]

export const TRUST_STATS = [
  { value: 'Care', label: 'in every detail' },
  { value: 'Quality', label: 'workmanship' },
  { value: 'Clear', label: 'communication' },
  { value: 'Local', label: 'service' },
]

export const BADGES = []

/* Old-site paths that 301'd — preserved as client-side redirects */
export const REDIRECTS = {}
