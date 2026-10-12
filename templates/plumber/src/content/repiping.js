import { asset } from '../business.js'
import { copy } from '../business.js'
export default {
  "path": "/repiping",
  "title": copy("Repiping | Your Company"),
  "description": "Low water pressure, discolored water or repeated leaks from aging pipes. Contact us to talk through your requirements.",
  "h1": "Repiping",
  "heroImage": asset("/images/pipes.jpg"),
  "heroImageAlt": "Pipes mounted on a wall — stock photograph",
  "heroImages": [
    asset("/images/pipes.jpg")
  ],
  "intro": [
    "Low water pressure, discolored water or repeated leaks from aging pipes? Repiping replaces failing water lines throughout the home."
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
      "text": "When to consider repiping"
    },
    {
      "type": "p",
      "md": "Older galvanized and polybutylene pipes can corrode, restrict flow or fail. We assess your system and explain your options."
    },
    {
      "type": "ul",
      "items": [
        "Whole-home repiping",
        "Partial repipes and line replacements",
        "PEX and copper water lines",
        "Main water line replacement"
      ]
    },
    {
      "type": "img",
      "src": asset("/images/plumber-wall.jpg"),
      "alt": "Illustrative stock photography"
    },
    {
      "type": "h2",
      "text": "Plan the work"
    },
    {
      "type": "p",
      "md": "We explain the scope, access needed in walls and ceilings, timing and a written quotation before starting."
    },
    {
      "type": "faq",
      "items": [
        {
          "q": "How do I know if I need a repipe?",
          "a": "Frequent leaks, low pressure and discolored water are common signs. Contact us to talk it through."
        },
        {
          "q": "How long does repiping take?",
          "a": "It depends on the size of the home and access. We will give you a timeline with your quotation."
        }
      ]
    },
    {
      "type": "contact"
    }
  ]
}
