import { asset } from '../business.js'
import { copy } from '../business.js'
export default {
  "path": "/remodels",
  "title": copy("Kitchen & bath remodels | Your Company"),
  "description": "Renovating a kitchen or bathroom. Contact us to talk through your requirements.",
  "h1": "Kitchen & bath remodels",
  "heroImage": asset("/images/interior.jpg"),
  "heroImageAlt": "Renovated kitchen interior — stock photograph",
  "heroImages": [
    asset("/images/interior.jpg")
  ],
  "intro": [
    "Renovating a kitchen or bathroom? We handle the plumbing, from moving lines during rough-in to setting the final fixtures."
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
      "text": "Plumbing for your renovation"
    },
    {
      "type": "p",
      "md": "Good planning early avoids surprises later. We work with you or your contractor on layout, fixture choices and timing."
    },
    {
      "type": "ul",
      "items": [
        "Relocating sinks, showers and toilets",
        "Rough-in and finish plumbing",
        "Tub-to-shower conversions",
        "Fixture selection advice"
      ]
    },
    {
      "type": "img",
      "src": asset("/images/faucet.jpg"),
      "alt": "Illustrative stock photography"
    },
    {
      "type": "h2",
      "text": "Plan the details"
    },
    {
      "type": "p",
      "md": "Share your plans and we will confirm the plumbing scope and give you a written quotation."
    },
    {
      "type": "faq",
      "items": [
        {
          "q": "Can you work with my contractor?",
          "a": "Yes. We can coordinate timing and scope with your contractor."
        },
        {
          "q": "Do you help choose fixtures?",
          "a": "Ask us. We can advise on fixtures that suit your space and water pressure."
        }
      ]
    },
    {
      "type": "contact"
    }
  ]
}
