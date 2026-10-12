import { asset } from '../business.js'
import { copy } from '../business.js'
export default {
  "path": "/emergency-plumbing",
  "title": copy("Emergency plumbing | Your Company"),
  "description": "Burst pipe, major leak or sewer backup. Contact us to talk through your requirements.",
  "h1": "Emergency plumbing",
  "heroImage": asset("/images/under-sink.jpg"),
  "heroImageAlt": "Plumber working under a sink — stock photograph",
  "heroImages": [
    asset("/images/under-sink.jpg")
  ],
  "intro": [
    "Burst pipe, major leak or sewer backup? Call and tell us what is happening. We will talk you through shutting off the water and the next steps."
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
      "text": "What to do in a plumbing emergency"
    },
    {
      "type": "p",
      "md": "Turn off the main water shut-off valve if water is leaking, keep people away from wet electrical outlets and appliances, and call us with a short description of the problem."
    },
    {
      "type": "ul",
      "items": [
        "Burst or leaking water lines",
        "Overflowing toilets and sewer backups",
        "No water or no hot water",
        "Leaks from water heaters or under sinks"
      ]
    },
    {
      "type": "img",
      "src": asset("/images/faucet-open.jpg"),
      "alt": "Illustrative stock photography"
    },
    {
      "type": "h2",
      "text": "Getting things working again"
    },
    {
      "type": "p",
      "md": "We will confirm availability, what the visit involves and how the work is quoted before we start."
    },
    {
      "type": "faq",
      "items": [
        {
          "q": "Where is my main water shut-off?",
          "a": "It is often near where the water line enters the house, in a garage, or at the meter box near the street. We can help you find it over the phone."
        },
        {
          "q": "How is emergency work priced?",
          "a": "Ask us when you call. The cost depends on the problem, materials and timing, and we will explain it before work begins."
        }
      ]
    },
    {
      "type": "contact"
    }
  ]
}
