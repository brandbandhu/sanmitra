import { SOCIAL_LINKS } from "./social-links";

export type SolarProject = {
  id: string;
  slug: string;
  name: string;
  location: string;
  category: string;
  capacity_kw: number | null;
  description: string;
  image_url: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
};
export type SiteContentMap = {
  services: {
    id: string;
    slug: string;
    title: string;
    summary: string;
    body: string;
    image_url: string | null;
  }[];
  projects: SolarProject[];
  blog_posts: {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    cover_image_url: string | null;
    published_at: string | null;
  }[];
  gallery_items: {
    id: string;
    title: string;
    category: string;
    image_url: string;
    alt_text: string;
  }[];
  testimonials: {
    id: string;
    customer_name: string;
    location: string;
    project_type: string;
    quote: string;
    rating: number | null;
  }[];
};
// Add approved company content here. Empty collections use the labelled site concepts/guides.
export const SITE_CONTENT: SiteContentMap = {
  services: [
    {
      id: "epc",
      slug: "epc",
      title: "Solar EPC",
      summary: "Engineering, procurement and construction for solar installations.",
      body: "Solar system engineering and design\nEquipment procurement\nConstruction and installation",
      image_url: null,
    },
    {
      id: "amc",
      slug: "amc",
      title: "Solar AMC",
      summary: "Annual maintenance contracts for solar systems.",
      body: "Discuss maintenance needs for your solar system\nAsk what is included in an annual maintenance contract",
      image_url: null,
    },
  ],
  projects: [],
  blog_posts: [],
  gallery_items: [],
  testimonials: [],
};
const SOLAR_PV_BRANDS = [
  { category: "Panels", names: ["Waaree", "V-Guard", "Premier Energies", "Adani", "Vikram", "Rayzon"] },
  { category: "Inverters", names: ["V-Guard", "Solis", "Sungrow", "Growatt", "Polycab", "Feston"] },
  { category: "Hybrid inverters", names: ["Solis", "Feston", "Sungrow", "Deye", "Power One"] },
];

export const SOLAR_PRODUCTS: {
  name: string;
  brands?: typeof SOLAR_PV_BRANDS;
}[] = [
  { name: "Solar PV rooftop system", brands: SOLAR_PV_BRANDS },
  { name: "Solar water heater" },
  { name: "Solar streetlight" },
  { name: "Solar camera" },
  { name: "Solar agricultural pump" },
  { name: "Home inverter and lithium battery" },
];

export const BUSINESS_CONTACT = {
  phones: [
    { label: "8600609579", href: "tel:+918600609579" },
    { label: "8090900606", href: "tel:+918090900606" },
  ],
  email: "sanmitrasolar@gmail.com",
  address: "Opp. Grampanchayat, Awasari Kh, Ambegaon, Pune 412405",
  mapEmbedUrl: "https://www.google.com/maps?q=18.9731243%2C73.9635132&z=16&output=embed",
  directionsUrl: "https://www.google.com/maps/dir/?api=1&destination=18.9731243%2C73.9635132",
};

// Public details only. A configured WhatsApp number or email enables direct enquiry sharing.
export const SITE_SETTINGS: Record<string, Record<string, unknown>> = {
  brand: { name: "Sanmitra Solar", logo: "" },
  contact: {
    ...BUSINESS_CONTACT,
    whatsapp: SOCIAL_LINKS.whatsapp,
  },
  social: { instagram: SOCIAL_LINKS.instagram, facebook: SOCIAL_LINKS.facebook },
  homepage: {},
};
