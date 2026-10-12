import { asset } from '../business.js'
import { copy } from '../business.js'
export default {
  "path": "/sewer-lines",
  "title": copy("Sewer lines | Your Company"),
  "description": "Multiple drains backing up, sewage odors or soggy spots in the yard. Contact us to talk through your requirements.",
  "h1": "Sewer lines",
  "heroImage": asset("/images/sink-drain.jpg"),
  "heroImageAlt": "Water draining into a sink — stock photograph",
  "heroImages": [
    asset("/images/sink-drain.jpg")
  ],
  "intro": [
    "Multiple drains backing up, sewage odors or soggy spots in the yard? These can point to a sewer line problem."
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
      "text": "Finding the problem"
    },
    {
      "type": "p",
      "md": "Roots, sagging pipe and old materials are common causes of sewer line trouble. We find the cause and explain the options."
    },
    {
      "type": "ul",
      "items": [
        "Sewer line inspection",
        "Main line clearing",
        "Sewer line repair",
        "Sewer line replacement"
      ]
    },
    {
      "type": "img",
      "src": asset("/images/pipes.jpg"),
      "alt": "Illustrative stock photography"
    },
    {
      "type": "h2",
      "text": "Plan the repair"
    },
    {
      "type": "p",
      "md": "We explain what we found, the repair options and a written quotation before work begins."
    },
    {
      "type": "faq",
      "items": [
        {
          "q": "What are signs of a sewer line problem?",
          "a": "Several drains clogging at once, gurgling toilets and sewage smells are common warning signs."
        },
        {
          "q": "Can roots damage my sewer line?",
          "a": "Yes. Tree roots are a common cause of blockages and damage."
        }
      ]
    },
    {
      "type": "contact"
    }
  ]
}
