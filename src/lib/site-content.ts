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
  services: [],
  projects: [],
  blog_posts: [],
  gallery_items: [],
  testimonials: [],
};
// Public details only. A configured WhatsApp number or email enables direct enquiry sharing.
export const SITE_SETTINGS: Record<string, Record<string, unknown>> = {
  brand: { name: "Sanmitra Solar", logo: "" },
  contact: { phone: "", email: "", address: "", whatsapp: SOCIAL_LINKS.whatsapp },
  social: { instagram: SOCIAL_LINKS.instagram, facebook: SOCIAL_LINKS.facebook },
  homepage: {},
};
