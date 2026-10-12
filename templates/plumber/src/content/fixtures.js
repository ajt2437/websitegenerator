import { asset } from '../business.js'
import { copy } from '../business.js'
export default {
  "path": "/fixtures",
  "title": copy("Fixture installation | Your Company"),
  "description": "New faucet, toilet, shower valve or garbage disposal. Contact us to talk through your requirements.",
  "h1": "Fixture installation",
  "heroImage": asset("/images/faucet.jpg"),
  "heroImageAlt": "Stainless steel kitchen faucet — stock photograph",
  "heroImages": [
    asset("/images/faucet.jpg")
  ],
  "intro": [
    "New faucet, toilet, shower valve or garbage disposal? We install and replace fixtures neatly, without leaks."
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
      "text": "Fixtures installed right"
    },
    {
      "type": "p",
      "md": "Whether you bought the fixture yourself or want our advice, we make sure it is connected correctly and tested before we leave."
    },
    {
      "type": "ul",
      "items": [
        "Kitchen and bathroom faucets",
        "Toilets and toilet repairs",
        "Shower and tub valves",
        "Garbage disposals and dishwasher connections"
      ]
    },
    {
      "type": "img",
      "src": asset("/images/faucet-open.jpg"),
      "alt": "Illustrative stock photography"
    },
    {
      "type": "h2",
      "text": "Plan the details"
    },
    {
      "type": "p",
      "md": "Tell us what you would like installed and we will confirm the work and give you a quotation."
    },
    {
      "type": "faq",
      "items": [
        {
          "q": "Can I supply my own fixtures?",
          "a": "Usually, yes. Let us know the model so we can confirm compatibility."
        },
        {
          "q": "Do you replace shut-off valves too?",
          "a": "Ask us. Old valves are often worth replacing when a fixture is changed."
        }
      ]
    },
    {
      "type": "contact"
    }
  ]
}
