# Sanmitra Solar

A standalone React / TypeScript / Vite solar website. It uses Overlock for hero headings, Outfit for section headings and Poppins for body text, with responsive layouts, GSAP motion, a branded preloader and floating social icons.

## Run locally

```sh
npm install
npm run dev
```

No database connection, account or environment credentials are needed.

## Edit content

- `src/lib/site-content.ts`: approved services, projects, articles, gallery, testimonials and public company settings.
- `src/lib/social-links.ts`: Instagram, Facebook and WhatsApp defaults.
- `src/lib/solar-articles.ts`: introductory solar guides.
- `src/components/solar-experience.tsx`: labelled project concepts and hero slides.

Empty collections use clearly labelled concepts and introductory guides. Company achievements and customer reviews are not fabricated.

## Enquiries

The form validates input without storing it. A configured company WhatsApp number opens WhatsApp with the enquiry text; otherwise a configured email opens the visitor's email application. When neither is configured, the visitor downloads a text file to share manually. A prepared or downloaded enquiry is never described as delivered.

## Database removal

All active Supabase reads, enquiry inserts and authentication middleware have been disconnected. The database-backed admin dashboard and its route have been removed. Public pages use local content; the savings calculator runs entirely in the browser.

Lovable-managed generated integration files and the original schema/migration files are retained unchanged under the project instructions. They are inactive and are not part of the website runtime. No hosted database or existing remote records were deleted.

## Checks

```sh
npm run typecheck
npm test
npm run build
```

For desktop and mobile browser checks, start the local server at port 5173, then run:

```sh
npm run test:e2e
```

Browser checks use the installed Microsoft Edge. They cover page routing, responsive layouts, hero controls, calculator handoff, enquiry downloads, project filters, article details, gallery dialogs and operation without database network calls.

## Hosting

On Vercel, use the Vite framework preset and default build settings. The build uses Vercel?s production project URL for canonical URLs and the homepage share preview. Set `VITE_SITE_URL` to your public origin if you use a custom domain, and update the URLs in `public/sitemap.xml` and `public/robots.txt` when changing domains.
