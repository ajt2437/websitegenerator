import { asset } from '../business.js'
import { copy } from '../business.js'
export default {
  "path": "/water-heaters",
  "title": copy("Water heaters | Your Company"),
  "description": "No hot water, rusty water, strange noises or a leaking tank. Contact us to talk through your requirements.",
  "h1": "Water heaters",
  "heroImage": asset("/images/water-heater.jpg"),
  "heroImageAlt": "Plumber servicing a water heater — stock photograph",
  "heroImages": [
    asset("/images/water-heater.jpg")
  ],
  "intro": [
    "No hot water, rusty water, strange noises or a leaking tank? We repair and replace gas and electric tank water heaters."
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
      "text": "Repair or replace?"
    },
    {
      "type": "p",
      "md": "We look at the age, condition and size of your current unit and explain whether a repair makes sense or a replacement is the better value."
    },
    {
      "type": "ul",
      "items": [
        "Water heater repair",
        "Tank water heater replacement",
        "Sizing for your household",
        "Removal of the old unit"
      ]
    },
    {
      "type": "img",
      "src": asset("/images/wall-heater.jpg"),
      "alt": "Illustrative stock photography"
    },
    {
      "type": "h2",
      "text": "Plan the replacement"
    },
    {
      "type": "p",
      "md": "We confirm the right size and type for your home and give you a written quotation before work starts."
    },
    {
      "type": "faq",
      "items": [
        {
          "q": "How long does a water heater last?",
          "a": "Many tank water heaters last around 8 to 12 years, depending on water quality and maintenance."
        },
        {
          "q": "Can you switch me to tankless?",
          "a": "Yes. See our tankless water heater page or contact us to talk it through."
        }
      ]
    },
    {
      "type": "contact"
    }
  ]
}
