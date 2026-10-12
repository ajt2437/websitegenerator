import { asset } from '../business.js'
import { copy } from '../business.js'
export default {
  "path": "/drain-cleaning",
  "title": copy("Drain cleaning | Your Company"),
  "description": "Slow sinks, gurgling drains or a clog that keeps coming back. Contact us to talk through your requirements.",
  "h1": "Drain cleaning",
  "heroImage": asset("/images/sink-drain.jpg"),
  "heroImageAlt": "Water draining into a sink — stock photograph",
  "heroImages": [
    asset("/images/sink-drain.jpg")
  ],
  "intro": [
    "Slow sinks, gurgling drains or a clog that keeps coming back? We clear kitchen, bathroom and main drains so everything flows again."
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
      "text": "Clearing the clog properly"
    },
    {
      "type": "p",
      "md": "Grease, hair, food waste and roots build up over time. We clear the blockage and let you know if anything points to a bigger issue in the line."
    },
    {
      "type": "ul",
      "items": [
        "Kitchen sink and garbage disposal clogs",
        "Bathroom sinks, tubs and showers",
        "Toilet clogs",
        "Main line and floor drain backups"
      ]
    },
    {
      "type": "img",
      "src": asset("/images/faucet.jpg"),
      "alt": "Illustrative stock photography"
    },
    {
      "type": "h2",
      "text": "Keep drains flowing"
    },
    {
      "type": "p",
      "md": "Ask us about simple habits and maintenance that help prevent repeat clogs."
    },
    {
      "type": "faq",
      "items": [
        {
          "q": "Should I use chemical drain cleaners?",
          "a": "They can damage pipes and rarely clear the full blockage. Call us instead if a drain keeps clogging."
        },
        {
          "q": "Why does my drain keep clogging?",
          "a": "Repeat clogs often mean a build-up further down the line. We can talk through the options."
        }
      ]
    },
    {
      "type": "contact"
    }
  ]
}
