// Contact Person Type
export type ContactPersonLabel = "Mango"

export interface ContactPerson {
  label: ContactPersonLabel
  phoneE164: string // Full number with country code: 919419532222
  phoneDisplay: string // Formatted for display: 94191 41495
  whatsappE164: string // Same as phoneE164 for WhatsApp
}

export const siteConfig = {
  name: "Mango",
  tagline: "Pure Vegetarian • Bahu Plaza, Jammu",
  url: "https://mango.onelink.cards",
  
  contact: {
    phones: ["9419532222"],
    email: "honeyfish.jmu@gmail.com",
    address: "Shop No 32, B2 South Block, Vidhata Nagar, Bahu Plaza, Gandhi Nagar, Jammu, 180004",
    mapQuery: "Mango Bahu Plaza Vidhata Nagar Gandhi Nagar Jammu",
    storeHours: "Monday – Saturday: 10:30 AM – 9:30 PM. Sunday: 11:00 AM – 9:30 PM.",
    officePhone: "9419532222",
  },
  
  // Contact (single Mango number)
  contactPersons: [
    {
      label: "Mango" as ContactPersonLabel,
      phoneE164: "919419532222",
      phoneDisplay: "94195 32222",
      whatsappE164: "919419532222",
    },
  ] as ContactPerson[],
  
  whatsapp: {
    defaultPhone: "9419532222",
    defaultMessage: "Hi Mango, I would like to place an order. Please share today's availability and rates.",
  },
  
  trustBadges: [
    "Pure Vegetarian",
    "4.1★ Google Rating",
    "Dine-In & Takeaway"
  ] as string[],
  
  brands: [
    {
      name: "Fresh & Frozen",
      tagline: "Premium Quality",
      logo: "",
    },
    {
      name: "Hygienic Processing",
      tagline: "Top Standards",
      logo: "",
    },
    {
      name: "Doorstep Delivery",
      tagline: "Jammu Wide",
      logo: "",
    },
    {
      name: "Family Legacy",
      tagline: "Since 1968",
      logo: "",
    },
  ],
  
  about: {
    title: "Welcome to Mango",
    shortDescription: "Located in the heart of Bahu Plaza, Mango is a pure vegetarian restaurant serving authentic North Indian and Chinese flavours. We focus on clean preparation, quality ingredients, and a welcoming dining experience for families and friends.",
    fullDescription: "Located in the heart of Bahu Plaza, Mango is a pure vegetarian restaurant serving authentic North Indian and Chinese flavours. We focus on clean preparation, quality ingredients, and a welcoming dining experience for families and friends.",
  },
  
  catalog: [
    {
      id: "service-1",
      title: "Service/Product 1",
      description: "Brief description of your first service or product.",
      logo: "",
      details: "This is a demo description for your first service or product. Replace this with detailed information about what you offer. Explain the benefits, features, and why customers should choose you. Add specific details that make your service unique and valuable.",
      images: [], // Add your product/service images here
    },
    {
      id: "service-2",
      title: "Service/Product 2",
      description: "Brief description of your second service or product.",
      logo: "",
      details: "This is a demo description for your second service or product. Replace this with detailed information about what you offer. Explain the benefits, features, and why customers should choose you. Add specific details that make your service unique and valuable.",
      images: [], // Add your product/service images here
    },
    {
      id: "service-3",
      title: "Service/Product 3",
      description: "Brief description of your third service or product.",
      logo: "",
      details: "This is a demo description for your third service or product. Replace this with detailed information about what you offer. Explain the benefits, features, and why customers should choose you. Add specific details that make your service unique and valuable.",
      images: [], // Add your product/service images here
    },
    {
      id: "service-4",
      title: "Service/Product 4",
      description: "Brief description of your fourth service or product.",
      logo: "",
      details: "This is a demo description for your fourth service or product. Replace this with detailed information about what you offer. Explain the benefits, features, and why customers should choose you. Add specific details that make your service unique and valuable.",
      images: [], // Add your product/service images here
    },
  ],
  
  brochures: [] as Array<{ href: string; title: string }>,
  
  social: {
    facebook: "https://www.facebook.com/share/198avg1doq/",
    instagram: "https://www.instagram.com/mangojammu/?hl=en",
    twitter: "https://twitter.com/yourbusiness",
    linkedin: "https://www.linkedin.com/company/yourbusiness",
  },
  
  seo: {
    title: "Mango - Pure Vegetarian Restaurant | Bahu Plaza Jammu",
    description: "Mango Bahu Plaza Jammu - Pure vegetarian restaurant. North Indian & Chinese cuisine, dine-in & takeaway. Authentic taste, quality ingredients.",
    keywords: "Mango Jammu, vegetarian restaurant Bahu Plaza, North Indian Jammu, Chinese food Jammu, pure veg restaurant Jammu",
    // Link share preview (og/twitter) – Mango logo
    shareImage: "/components/fff.png",
  },
  
  credits: {
    designer: "RepixelX Studio",
    designerUrl: "https://repixelx.com",
  },
  
  google: {
    placeId: "ChIJx172t6WFHjkRO5-dx4NQ9Jc",
    mapsUrl: "https://www.google.com/maps/place/?q=place_id:ChIJx172t6WFHjkRO5-dx4NQ9Jc",
    reviewsUrl: "https://search.google.com/local/writereview?placeid=ChIJx172t6WFHjkRO5-dx4NQ9Jc",
  },
}

export type SiteConfig = typeof siteConfig
