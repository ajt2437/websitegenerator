import { asset } from '../business.js'
import { copy } from '../business.js'
export default {
  "path": "/tankless-water-heaters",
  "title": copy("Tankless water heaters | Your Company"),
  "description": "Thinking about endless hot water and a smaller footprint. Contact us to talk through your requirements.",
  "h1": "Tankless water heaters",
  "heroImage": asset("/images/wall-heater.jpg"),
  "heroImageAlt": "Wall-mounted water heater above a sink — stock photograph",
  "heroImages": [
    asset("/images/wall-heater.jpg")
  ],
  "intro": [
    "Thinking about endless hot water and a smaller footprint? We can talk through whether a tankless water heater is the right fit for your home."
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
      "text": "Is tankless right for you?"
    },
    {
      "type": "p",
      "md": "Tankless systems heat water on demand. The right unit depends on how many fixtures run at once, your fuel type and your existing lines."
    },
    {
      "type": "ul",
      "items": [
        "Tankless water heater installation",
        "Conversion from a tank water heater",
        "Sizing for your household",
        "Descaling and maintenance"
      ]
    },
    {
      "type": "img",
      "src": asset("/images/water-heater.jpg"),
      "alt": "Illustrative stock photography"
    },
    {
      "type": "h2",
      "text": "Plan the details"
    },
    {
      "type": "p",
      "md": "We explain the options, any changes needed to gas, venting or water lines, and give you a written quotation."
    },
    {
      "type": "faq",
      "items": [
        {
          "q": "Do tankless water heaters need maintenance?",
          "a": "Yes. Periodic descaling helps keep them efficient, especially with hard water."
        },
        {
          "q": "Will I need new gas or venting?",
          "a": "Sometimes. We check your setup and explain what is needed before quoting."
        }
      ]
    },
    {
      "type": "contact"
    }
  ]
}
