import { asset } from '../business.js'
import { copy } from '../business.js'
export default {
  "path": "/leak-repair",
  "title": copy("Leak repair | Your Company"),
  "description": "Dripping faucets, running toilets, damp walls or an unexplained jump in your water bill. Contact us to talk through your requirements.",
  "h1": "Leak repair",
  "heroImage": asset("/images/plumber-wall.jpg"),
  "heroImageAlt": "Plumber repairing a pipe in a wall — stock photograph",
  "heroImages": [
    asset("/images/plumber-wall.jpg")
  ],
  "intro": [
    "Dripping faucets, running toilets, damp walls or an unexplained jump in your water bill? Tell us what you are seeing and we can find and fix the source."
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
      "text": "Finding the real source"
    },
    {
      "type": "p",
      "md": "Leaks are not always where the water shows up. We start by tracing the problem so the repair fixes the cause, not just the symptom."
    },
    {
      "type": "ul",
      "items": [
        "Dripping faucets and shower valves",
        "Running or leaking toilets",
        "Leaking supply lines and shut-off valves",
        "Hidden leaks behind walls and under floors"
      ]
    },
    {
      "type": "img",
      "src": asset("/images/pipes.jpg"),
      "alt": "Illustrative stock photography"
    },
    {
      "type": "h2",
      "text": "Repairs that last"
    },
    {
      "type": "p",
      "md": "We explain what we found, the options for repair and a written quotation before we begin."
    },
    {
      "type": "faq",
      "items": [
        {
          "q": "Is a small drip worth fixing?",
          "a": "Yes. Even a slow drip wastes water and can damage cabinets, floors and walls over time."
        },
        {
          "q": "Do you repair leaks under slabs?",
          "a": "Contact us to discuss your home. We can talk through the signs you are seeing and the next steps."
        }
      ]
    },
    {
      "type": "contact"
    }
  ]
}
