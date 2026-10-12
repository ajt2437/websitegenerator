import { asset } from '../business.js'
import { copy } from '../business.js'
export default {
  "path": "/new-construction",
  "title": copy("New construction | Your Company"),
  "description": "Building an addition or a new home. Contact us to talk through your requirements.",
  "h1": "New construction",
  "heroImage": asset("/images/house-dusk.jpg"),
  "heroImageAlt": "A home at dusk — stock photograph",
  "heroImages": [
    asset("/images/house-dusk.jpg")
  ],
  "intro": [
    "Building an addition or a new home? We plan and install plumbing systems with your builder from the start."
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
      "text": "Planned from the start"
    },
    {
      "type": "p",
      "md": "We work from your plans to lay out water, drain and vent lines, then return to set fixtures once the finishes are in."
    },
    {
      "type": "ul",
      "items": [
        "Additions and new builds",
        "Water, drain and vent systems",
        "Water heater installation",
        "Coordination with your builder"
      ]
    },
    {
      "type": "img",
      "src": asset("/images/pipes.jpg"),
      "alt": "Illustrative stock photography"
    },
    {
      "type": "h2",
      "text": "Plan the details"
    },
    {
      "type": "p",
      "md": "Send us your plans and timeline and we will discuss the scope and quotation."
    },
    {
      "type": "faq",
      "items": [
        {
          "q": "When should I bring in a plumber?",
          "a": "As early as possible, so the layout works before walls go up."
        },
        {
          "q": "Do you work with general contractors?",
          "a": "Yes. We can coordinate directly with your builder."
        }
      ]
    },
    {
      "type": "contact"
    }
  ]
}
