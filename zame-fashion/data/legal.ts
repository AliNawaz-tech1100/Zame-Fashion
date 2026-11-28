export type LegalBlock =
  | { type: "paragraph"; text: string }
  | { type: "list"; ordered: boolean; items: string[] }
  | { type: "subheading"; text: string };

export type LegalSection = { heading: string; blocks: LegalBlock[] };

export const privacySections: LegalSection[] = [
  {
    "heading": "Overview",
    "blocks": [
      {
        "type": "paragraph",
        "text": "Last updated: 28 November 2026"
      },
      {
        "type": "paragraph",
        "text": "Welcome to ZAMÉ Fashion (\"ZAMÉ\", \"we\", \"our\", or \"us\"), accessible at https://zamefashion.com. Your privacy matters to us. This Privacy Policy explains what information we collect when you visit our website or place an order, how we use it, who we share it with, and the choices you have."
      },
      {
        "type": "paragraph",
        "text": "By using this website, you agree to the collection and use of information in accordance with this policy. If you do not agree, please do not use the website."
      }
    ]
  },
  {
    "heading": "1. Information We Collect",
    "blocks": [
      {
        "type": "subheading",
        "text": "a) Information you give us directly"
      },
      {
        "type": "paragraph",
        "text": "When you place an order, subscribe to our newsletter, or contact us, we may collect:"
      },
      {
        "type": "list",
        "ordered": false,
        "items": [
          "Your name",
          "Your phone number and delivery address (for order fulfilment)",
          "Your email address",
          "Order details (products purchased, payment method selected)",
          "Any message you send us through our contact page, email, Instagram, or WhatsApp"
        ]
      },
      {
        "type": "subheading",
        "text": "b) Information collected automatically"
      },
      {
        "type": "paragraph",
        "text": "When you visit the site, we and our service providers may automatically collect:"
      },
      {
        "type": "list",
        "ordered": false,
        "items": [
          "Your IP address, browser type, device type, and operating system",
          "Pages you visit, time spent on pages, and links you click",
          "Referring website or search terms",
          "Cookies and similar tracking technologies (see Section 4)"
        ]
      },
      {
        "type": "subheading",
        "text": "c) Payment information"
      },
      {
        "type": "paragraph",
        "text": "We offer Cash on Delivery (COD) across Pakistan. We do not collect or store your full bank card numbers on this website. If online payment options are offered in future through a third-party payment processor, your payment will be processed by that processor under its own privacy policy."
      }
    ]
  },
  {
    "heading": "2. How We Use Your Information",
    "blocks": [
      {
        "type": "paragraph",
        "text": "We use the information we collect to:"
      },
      {
        "type": "list",
        "ordered": false,
        "items": [
          "Process, pack, and deliver your orders, and handle exchanges",
          "Communicate with you about your order, delivery, or enquiry",
          "Send you offers, new-arrival updates, and newsletters — only if you subscribed, and you may unsubscribe at any time",
          "Improve our website, products, and customer experience",
          "Show you relevant advertising (see Sections 5 and 6)",
          "Prevent fraud and keep our website secure",
          "Comply with legal obligations in Pakistan"
        ]
      },
      {
        "type": "paragraph",
        "text": "We do not sell your personal information."
      }
    ]
  },
  {
    "heading": "3. Who We Share Information With",
    "blocks": [
      {
        "type": "paragraph",
        "text": "We share information only as needed with:"
      },
      {
        "type": "list",
        "ordered": false,
        "items": [
          "Delivery / courier partners — your name, phone, and address so they can deliver your order",
          "Hosting and technology providers — including our hosting provider, to operate and secure the website",
          "Analytics providers — such as Google Analytics, to understand how visitors use the site (in aggregated, anonymised form where possible)",
          "Advertising partners — including Google AdSense (see Section 5)",
          "Legal authorities — if required by law, court order, or to protect our rights"
        ]
      }
    ]
  },
  {
    "heading": "4. Cookies",
    "blocks": [
      {
        "type": "paragraph",
        "text": "A cookie is a small file stored on your device. We use cookies to:"
      },
      {
        "type": "list",
        "ordered": false,
        "items": [
          "Keep your shopping cart working",
          "Remember your preferences",
          "Understand website traffic and performance",
          "Serve and measure advertising"
        ]
      },
      {
        "type": "paragraph",
        "text": "You can control or delete cookies in your browser settings. Disabling cookies may affect some site features (such as the cart). For more information about cookies used by Google on partner sites, visit: https://policies.google.com/technologies/cookies"
      }
    ]
  },
  {
    "heading": "5. Google AdSense and Third-Party Advertising",
    "blocks": [
      {
        "type": "paragraph",
        "text": "This website uses Google AdSense, an advertising service provided by Google, and may use other third-party advertising networks in future."
      },
      {
        "type": "list",
        "ordered": false,
        "items": [
          "Third-party vendors, including Google, use cookies to serve ads based on your prior visits to this website and other websites on the internet.",
          "Google's use of advertising cookies enables Google and its partners to serve ads to you based on your visits to this site and/or other sites.",
          "You may opt out of personalised advertising by visiting Google Ads Settings: https://www.google.com/settings/ads",
          "You may opt out of some third-party vendors' use of cookies for personalised advertising by visiting: https://www.aboutads.info/choices/",
          "If you are in the European Economic Area (EEA), the UK, or another region with consent requirements, a consent message may be shown before personalised ads are served, in line with Google's EU User Consent Policy."
        ]
      },
      {
        "type": "paragraph",
        "text": "Third-party ad servers or networks may also use technologies such as JavaScript or web beacons in their advertisements and links that appear on this site. They automatically receive your IP address when this happens. We have no access to or control over cookies used by third-party advertisers. Please consult their respective privacy policies for details."
      }
    ]
  },
  {
    "heading": "6. Affiliate Links",
    "blocks": [
      {
        "type": "paragraph",
        "text": "This website participates in affiliate marketing programmes, including the Daraz Affiliate Programme and Amazon Associates. Some links on our blog and pages are affiliate links — if you click and buy, we may earn a small commission at no extra cost to you. Our full disclosure is on our Affiliate Disclosure page: https://zamefashion.com/affiliate-disclosure/"
      }
    ]
  },
  {
    "heading": "7. Children's Privacy",
    "blocks": [
      {
        "type": "paragraph",
        "text": "Our products include children's hair accessories, but this website is intended for purchase by adults. We do not knowingly collect personal information from children under 13. If you believe a child has provided us with personal information, contact us and we will delete it promptly."
      }
    ]
  },
  {
    "heading": "8. Data Security and Retention",
    "blocks": [
      {
        "type": "paragraph",
        "text": "We take reasonable technical and organisational steps to protect your information. No method of transmission over the internet is 100% secure, and we cannot guarantee absolute security. We keep order information for as long as needed for accounting, legal, and customer-service purposes, and delete or anonymise it when it is no longer needed."
      }
    ]
  },
  {
    "heading": "9. Your Rights",
    "blocks": [
      {
        "type": "paragraph",
        "text": "You may request to access, correct, or delete the personal information we hold about you, or ask us to stop sending you marketing messages, by contacting us at alinawazahad@gmail.com. We will respond within a reasonable time."
      }
    ]
  },
  {
    "heading": "10. Links to Other Websites",
    "blocks": [
      {
        "type": "paragraph",
        "text": "Our website may link to Instagram, Daraz, Amazon, and other third-party sites. We are not responsible for the content or privacy practices of those sites. Please review their privacy policies."
      }
    ]
  },
  {
    "heading": "11. Changes to This Policy",
    "blocks": [
      {
        "type": "paragraph",
        "text": "We may update this Privacy Policy from time to time. Changes will be posted on this page with a new \"Last updated\" date. Continued use of the site after changes means you accept the updated policy."
      }
    ]
  },
  {
    "heading": "12. Contact Us",
    "blocks": [
      {
        "type": "paragraph",
        "text": "If you have any questions about this Privacy Policy, contact: ZAMÉ Fashion Email: alinawazahad@gmail.com Location: Lahore, Pakistan Website: https://zamefashion.com Instagram: @zame_fashion"
      }
    ]
  }
];

export const termsSections: LegalSection[] = [
  {
    "heading": "Overview",
    "blocks": [
      {
        "type": "paragraph",
        "text": "Last updated: 28 November 2026"
      },
      {
        "type": "paragraph",
        "text": "These Terms & Conditions (\"Terms\") govern your use of https://zamefashion.com (the \"Website\"), operated by ZAMÉ Fashion (\"we\", \"our\", \"us\"), based in Lahore, Pakistan. By visiting the Website or placing an order, you agree to these Terms. If you do not agree, please do not use the Website."
      }
    ]
  },
  {
    "heading": "1. About ZAMÉ Fashion",
    "blocks": [
      {
        "type": "paragraph",
        "text": "ZAMÉ Fashion is an online store offering premium imported women's and girls' accessories, including hair clips, bows, headbands, hair ties, and keychains, delivered across Pakistan."
      }
    ]
  },
  {
    "heading": "2. Eligibility and Accounts",
    "blocks": [
      {
        "type": "paragraph",
        "text": "You must be able to form a legally binding contract under applicable law to place an order. If you create an account or provide contact details, you are responsible for keeping them accurate and for all activity under your details."
      }
    ]
  },
  {
    "heading": "3. Products and Pricing",
    "blocks": [
      {
        "type": "list",
        "ordered": false,
        "items": [
          "We work hard to show products, colours, and prices accurately, but screens display colours differently and minor variations may occur. Product images are for illustration.",
          "All prices are listed in Pakistani Rupees (PKR) unless stated otherwise.",
          "Prices, offers, and availability may change without notice. A sale or launch discount (for example, a launch offer) applies only for the period stated and while stock lasts.",
          "In case of an obvious pricing error, we may cancel the order and refund any amount paid, or contact you before dispatch to confirm the correct price."
        ]
      }
    ]
  },
  {
    "heading": "4. Orders and Order Confirmation",
    "blocks": [
      {
        "type": "list",
        "ordered": false,
        "items": [
          "Placing an order is an offer to buy. Your order is accepted when we confirm it (by message, call, email, or a dispatch notification).",
          "We may refuse or cancel an order if a product is out of stock, details provided are incomplete or cannot be verified, fraud is suspected, or pricing was incorrect.",
          "Please provide a correct, reachable phone number and complete delivery address. We are not responsible for delays caused by incorrect or incomplete details provided by the customer."
        ]
      }
    ]
  },
  {
    "heading": "5. Payment — Cash on Delivery (COD)",
    "blocks": [
      {
        "type": "list",
        "ordered": false,
        "items": [
          "We currently offer Cash on Delivery (COD) nationwide: you pay in cash when your order arrives at your door.",
          "Please keep exact payment ready where possible and check your parcel at delivery as described in Section 7.",
          "If additional payment methods are introduced, their terms will be stated at checkout."
        ]
      }
    ]
  },
  {
    "heading": "6. Delivery",
    "blocks": [
      {
        "type": "list",
        "ordered": false,
        "items": [
          "We deliver across Pakistan through trusted courier partners.",
          "Free delivery on orders over PKR 2,000. For orders under PKR 2,000, a delivery charge shown at checkout (or confirmed with your order) applies.",
          "Estimated delivery times are guides, not guarantees. Delays can occur due to weather, courier operations, public holidays, or circumstances beyond our control.",
          "Risk in the products passes to you on delivery. Please provide a safe delivery location; we are not liable for parcels lost after confirmed delivery to the address provided."
        ]
      }
    ]
  },
  {
    "heading": "7. Checking Your Order",
    "blocks": [
      {
        "type": "paragraph",
        "text": "Please inspect your items promptly after delivery. If an item arrives damaged, defective, or different from what you ordered, contact us within 48 hours of delivery with your order details and a clear photo/video so we can help quickly under Section 8."
      }
    ]
  },
  {
    "heading": "8. Returns and 7-Day Exchange Policy",
    "blocks": [
      {
        "type": "paragraph",
        "text": "We offer a hassle-free 7-day return and exchange policy on all unused items, subject to the following:"
      },
      {
        "type": "list",
        "ordered": false,
        "items": [
          "The item must be unused, unworn, unwashed, and in its original condition and packaging, with any tags intact.",
          "For hygiene reasons, items that have been worn or used cannot be exchanged unless they arrived damaged or defective.",
          "To start an exchange, contact us within 7 days of delivery at alinawazahad@gmail.com or via Instagram @zame_fashion with your order number.",
          "Exchanges are for another item or size/style of equal value, or store credit if the requested item is unavailable. Any price difference will be settled at the time of exchange.",
          "Customers may be responsible for return courier charges unless the item was damaged, defective, or sent incorrectly by us — in those cases we will cover reasonable return shipping.",
          "Refunds, where applicable (for example, a prepaid order that cannot be fulfilled), will be processed through the original payment method or by bank transfer / mobile wallet as agreed, within a reasonable processing time after we receive and inspect the returned item."
        ]
      }
    ]
  },
  {
    "heading": "9. Intellectual Property",
    "blocks": [
      {
        "type": "paragraph",
        "text": "All content on this Website — the ZAMÉ Fashion name and logo, text, images, graphics, and design — belongs to ZAMÉ Fashion or its content suppliers and is protected by applicable intellectual property laws. You may not copy, reproduce, or use our content for commercial purposes without our written permission. Product photos shared by customers and tagged to @zame_fashion may be reshared on our channels with credit; contact us if you want a photo removed."
      }
    ]
  },
  {
    "heading": "10. Acceptable Use",
    "blocks": [
      {
        "type": "paragraph",
        "text": "You agree not to: misuse the Website; attempt to gain unauthorised access; place fraudulent orders; upload harmful code; scrape content at scale; or use the Website in violation of any applicable law in Pakistan."
      }
    ]
  },
  {
    "heading": "11. Blog Content, Advertising, and Affiliate Links",
    "blocks": [
      {
        "type": "paragraph",
        "text": "Our blog provides styling and buying guidance for general information. Results and prices mentioned in articles can change. This Website displays advertising (including Google AdSense) and contains affiliate links — see our Privacy Policy and Affiliate Disclosure. We are not responsible for the content, fulfilment, or policies of third-party sites you visit through ads or affiliate links; your purchase from a third party is governed by that seller's terms."
      }
    ]
  },
  {
    "heading": "12. Limitation of Liability",
    "blocks": [
      {
        "type": "paragraph",
        "text": "To the maximum extent permitted by law, ZAMÉ Fashion will not be liable for indirect, incidental, or consequential losses arising from use of the Website or products, beyond the value of the order concerned. Nothing in these Terms limits liability that cannot be limited under applicable law, or your statutory consumer rights."
      }
    ]
  },
  {
    "heading": "13. Governing Law",
    "blocks": [
      {
        "type": "paragraph",
        "text": "These Terms are governed by the laws of Pakistan. Any dispute will first be addressed in good faith by contacting us; if unresolved, it will be subject to the jurisdiction of the courts of Pakistan."
      }
    ]
  },
  {
    "heading": "14. Changes to These Terms",
    "blocks": [
      {
        "type": "paragraph",
        "text": "We may update these Terms from time to time. The version posted on this page at the time of your order is the version that applies to that order."
      }
    ]
  }
];

export const affiliateSections: LegalSection[] = [
  {
    "heading": "Overview",
    "blocks": [
      {
        "type": "paragraph",
        "text": "Last updated: 28 November 2026"
      },
      {
        "type": "paragraph",
        "text": "Transparency matters to us. This page explains, in plain language, how ZAMÉ Fashion earns money from some of the links on https://zamefashion.com — so you always know what is happening when you click."
      }
    ]
  },
  {
    "heading": "What is an affiliate link?",
    "blocks": [
      {
        "type": "paragraph",
        "text": "Some links on our blog, guides, and product-related articles are affiliate links. If you click one of those links and then buy something from that retailer, we may earn a small commission from the retailer."
      },
      {
        "type": "paragraph",
        "text": "You pay exactly the same price. The commission comes out of the retailer's margin, not your pocket. In some cases an affiliate link may even give you a special offer or discount."
      }
    ]
  },
  {
    "heading": "Programmes we participate in",
    "blocks": [
      {
        "type": "list",
        "ordered": false,
        "items": [
          "Daraz Affiliate Programme — Daraz.pk (Pakistan)",
          "Amazon Services LLC Associates Program — Amazon.com. As an Amazon Associate, ZAMÉ Fashion earns from qualifying purchases.",
          "We may join additional programmes in future (for example, other marketplaces relevant to Pakistan). When we do, we will update this page."
        ]
      }
    ]
  },
  {
    "heading": "Where you will see affiliate links",
    "blocks": [
      {
        "type": "list",
        "ordered": false,
        "items": [
          "In blog articles and buying guides on this site, clearly placed near the product being discussed",
          "Occasionally in comparison sections where we suggest an alternative we do not stock ourselves"
        ]
      },
      {
        "type": "paragraph",
        "text": "Products sold directly on zamefashion.com are our own products — those are normal shop links, not affiliate links, and we earn the normal retail margin when you buy from us directly."
      }
    ]
  },
  {
    "heading": "How we choose what to recommend",
    "blocks": [
      {
        "type": "list",
        "ordered": false,
        "items": [
          "We recommend products based on style relevance, quality signals, customer reviews on the retailer's site, and value for money in Pakistan.",
          "Earning a commission does not guarantee a positive mention. If we would not gift it to a friend or wear it ourselves, we will not recommend it as a top pick.",
          "Prices and availability on Daraz and Amazon change frequently and are outside our control. The price shown on the retailer's site at checkout is the price that applies."
        ]
      }
    ]
  },
  {
    "heading": "Advertising is separate",
    "blocks": [
      {
        "type": "paragraph",
        "text": "In addition to affiliate links, this site displays advertising through Google AdSense and similar networks. Ads are provided by third parties and are labelled as advertising by the ad network. See our Privacy Policy for how advertising cookies work and how to opt out of personalised ads."
      }
    ]
  },
  {
    "heading": "Questions",
    "blocks": [
      {
        "type": "paragraph",
        "text": "If anything here is unclear, contact us at alinawazahad@gmail.com or on Instagram @zame_fashion. Thank you for supporting a small Pakistani business — affiliate income helps us keep publishing free styling guides."
      }
    ]
  }
];

export const disclaimerSections: LegalSection[] = [
  {
    "heading": "Overview",
    "blocks": [
      {
        "type": "paragraph",
        "text": "Last updated: 28 November 2026"
      },
      {
        "type": "paragraph",
        "text": "The information on https://zamefashion.com is provided by ZAMÉ Fashion for general information, shopping, and styling inspiration. By using this site, you accept this Disclaimer."
      }
    ]
  },
  {
    "heading": "1. General information only",
    "blocks": [
      {
        "type": "paragraph",
        "text": "Blog articles, styling guides, and buying guides on this site are for general information and inspiration. They are not professional advice. Hairstyle and accessory results vary by hair type, outfit, and personal preference — what works beautifully for one person may need adjusting for another."
      }
    ]
  },
  {
    "heading": "2. Product colours, sizes, and availability",
    "blocks": [
      {
        "type": "paragraph",
        "text": "We aim for accurate product photos and descriptions, but colours can appear differently on different screens, and handmade items (including crochet pieces) can have small, natural variations — that is part of their character. Stock is limited for imported items; a product shown on the site may sell out. The product page price and availability at the time you order is what applies."
      }
    ]
  },
  {
    "heading": "3. Prices and external sites",
    "blocks": [
      {
        "type": "paragraph",
        "text": "Prices on third-party sites linked from here (including Daraz and Amazon) are set by those sellers, change without notice, and may differ from any price mentioned in an article written earlier. Always check the final price, delivery charges, and seller ratings on the retailer's own site before buying."
      }
    ]
  },
  {
    "heading": "4. External links and advertising",
    "blocks": [
      {
        "type": "paragraph",
        "text": "This site contains links to external websites and displays third-party advertising (including Google AdSense). We do not control, endorse, or take responsibility for the content, products, fulfilment, or privacy practices of external sites or advertisers. Visiting them is at your own discretion — please read their terms and privacy policies."
      }
    ]
  },
  {
    "heading": "5. Testimonials and reviews",
    "blocks": [
      {
        "type": "paragraph",
        "text": "Testimonials shown on this site reflect the experiences of individual customers. They are genuine in spirit but are not a guarantee that every customer will have the identical experience."
      }
    ]
  },
  {
    "heading": "6. Children's products — adult supervision",
    "blocks": [
      {
        "type": "paragraph",
        "text": "Some accessories are designed for children. Small parts (including clips and keychain attachments) can be a choking hazard for very young children. Children should use accessories under adult supervision, and accessories should be removed before sleep. See each product description and our kids' safety guide on the blog."
      }
    ]
  },
  {
    "heading": "7. No warranties",
    "blocks": [
      {
        "type": "paragraph",
        "text": "While we work hard to keep information accurate and up to date, we make no warranties that the site content is complete, error-free, or always available. To the extent permitted by law, we are not liable for losses arising from reliance on site content — see our Terms & Conditions for full details."
      }
    ]
  },
  {
    "heading": "8. Contact",
    "blocks": [
      {
        "type": "paragraph",
        "text": "Questions about this Disclaimer: alinawazahad@gmail.com — ZAMÉ Fashion, Lahore, Pakistan."
      }
    ]
  }
];

