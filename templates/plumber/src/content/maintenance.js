import { asset } from '../business.js'
import { copy } from '../business.js'
export default {
  "path": "/maintenance",
  "title": copy("Plumbing maintenance | Your Company"),
  "description": "Want to catch small problems before they become expensive ones. Contact us to talk through your requirements.",
  "h1": "Plumbing maintenance",
  "heroImage": asset("/images/plumber-wall.jpg"),
  "heroImageAlt": "Plumber working on a pipe in a wall — stock photograph",
  "heroImages": [
    asset("/images/plumber-wall.jpg")
  ],
  "intro": [
    "Want to catch small problems before they become expensive ones? A plumbing inspection checks your fixtures, water heater, drains and visible lines."
  ],
  "heroCtas": [
    {
      "label": "Discuss your project",
      "href": "/contact"
    }
  ],
  "blocks": [
    {
      "type": "h2",
      "text": "A practical approach"
    },
    {
      "type": "p",
      "md": "Every home is different. We look at your existing system, how you use it and anything you have noticed, then explain what we found."
    },
    {
      "type": "ul",
      "items": [
        "Whole-home plumbing inspections",
        "Water heater flushing and checks",
        "Fixture and shut-off valve checks",
        "Pressure and leak checks"
      ]
    },
    {
      "type": "img",
      "src": asset("/images/faucet-open.jpg"),
      "alt": "Illustrative stock photography"
    },
    {
      "type": "h2",
      "text": "Plan the details before work begins"
    },
    {
      "type": "p",
      "md": "Contact us to confirm whether this service suits your property, along with availability and pricing."
    },
    {
      "type": "faq",
      "items": [
        {
          "q": "How do I request a quote?",
          "a": "Call or email with a short description of the work and your contact details."
        },
        {
          "q": "How much will the work cost?",
          "a": "The cost depends on the scope and condition of your plumbing. Ask for a quote for your specific home."
        }
      ]
    },
    {
      "type": "contact"
    }
  ]
}
