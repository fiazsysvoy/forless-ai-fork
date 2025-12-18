// src/lib/websiteTypes.ts
export type WebsiteType = "product" | "service" | "personal" | "business";

export type WebsiteData = {
  type: WebsiteType;
  brandName: string;
  tagline: string;

  hero: {
    headline: string;
    subheadline: string;
    primaryCta: string;
    secondaryCta?: string;
    primaryCtaLink?: string;
    secondaryCtaLink?: string;
    imageQuery: string; // for Unsplash
  };

  about: {
    title: string;
    body: string;
    imageQuery: string;
  };

  features: {
    title: string;
    items: { label: string; description: string }[];
  };

  offers: {
    // products or services
    title: string;
    items: {
      name: string;
      description: string;
      priceLabel?: string; // "From $49", "Starting at $10/hr"
    }[];
  };

  testimonials?: {
    title: string;
    items: { quote: string; name: string; role?: string }[];
  };

  faq?: {
    title: string;
    items: { question: string; answer: string }[];
  };

  contact: {
    title: string;
    description: string;
    email: string;
    phone?: string;
    whatsapp?: string;
  };

  finalCta: {
    headline: string;
    subheadline: string;
    buttonLabel: string;
  };
};

export function getDefaultWebsiteData(type: WebsiteType): WebsiteData {
  return {
    type,
    brandName: "Your Brand",
    tagline: "Short tagline goes here",
    hero: {
      headline: "Make a bold statement",
      subheadline: "Explain what you do in one simple sentence.",
      primaryCta: "Get Started",
      secondaryCta: "Learn More",
      primaryCtaLink: "https://www.example.com/",
      secondaryCtaLink: "https://www.example.com/",
      imageQuery:
        type === "product"
          ? "product"
          : type === "service"
          ? "team"
          : type === "personal"
          ? "freelancer"
          : "business",
    },
    about: {
      title: "About Us",
      body: "Write a short description about your brand, who you help, and what makes you different.",
      imageQuery: "workspace",
    },
    features: {
      title: "Why Choose Us",
      items: [
        {
          label: "Quality",
          description: "We focus on delivering great results.",
        },
        { label: "Trust", description: "Built on long-term relationships." },
        { label: "Support", description: "We are here when you need us." },
      ],
    },
    offers: {
      title: type === "product" ? "Our Products" : "Our Services",
      items: [
        {
          name: "Main Offer",
          description: "Describe your main offer.",
          priceLabel: "From $99",
        },
        {
          name: "Secondary Offer",
          description: "Describe another offer.",
          priceLabel: "Custom pricing",
        },
      ],
    },
    testimonials: {
      title: "What Our Customers Say",
      items: [
        {
          quote: "Amazing experience working with this brand.",
          name: "Happy Client",
        },
      ],
    },
    faq: {
      title: "Frequently Asked Questions",
      items: [
        {
          question: "How do we get started?",
          answer: "Contact us and we’ll guide you step by step.",
        },
      ],
    },
    contact: {
      title: "Contact Us",
      description: "Have questions? Reach out and we’ll respond soon.",
      email: "you@example.com",
      whatsapp: "+1234567890",
    },
    finalCta: {
      headline: "Ready to begin?",
      subheadline: "Start your journey with us today.",
      buttonLabel: "Contact Us",
    },
  };
}
