# Sanmitra Solar

A responsive solar website built on the existing React 19 / TypeScript / TanStack Start project. The design uses Overlock hero headings, Outfit section headings, Poppins body text, deep navy, solar orange and energy teal, with the supplied installation imagery.

## Local development

```sh
npm install
# Copy .env.example to .env and configure your Supabase connection first.
npm run dev
```

Open the address printed by Vite. The default local address is http://localhost:5173. The existing `.env` supplies the public Supabase connection; keep private credentials in Lovable Secrets, never in this repository.

## Pages and functionality

- Cinematic three-slide homepage with pause, previous/next controls and reduced-motion support.
- About, services, residential/commercial/industrial pathways, projects and project details, gallery with accessible image dialog, articles and article details, calculator, contact and admin pages.
- GSAP ScrollTrigger reveals, photo masking, solar energy flow and verified company counters when configured.
- Interactive savings calculator with bill, tariff, property, roof area and location. Requirements transfer to the enquiry form.
- Validated enquiries saved to `contact_requests`, with loading, failure and success states.
- Supabase administrator sign-in and `has_role` authorization. Content management supports add/edit/delete, draft/publication controls, enquiry status and CSV export.
- Public contact details, WhatsApp, social links, logo, hero image/title and verified company metrics are configured through website settings.
- Unique page metadata, canonical links, organization structured data, sitemap and robots.txt.

## Content rules

The included project concepts and gallery imagery are clearly marked illustrative. They are not claims of completed Sanmitra Solar installations. Introductory articles are general preparation guides. Customer reviews and company achievements are shown only when the team publishes them. Empty project/review datasets are handled without invented achievements.

## Backend and remaining integration

The project uses its existing Lovable-managed Supabase/PostgreSQL backend. No MySQL or Express backend is claimed. No generated integration files or database schema/migrations were edited.

The connected Lovable app currently returns `reauthentication required`. The following require the owner to reconnect Lovable and complete managed configuration:

1. Provision a photo upload bucket with administrator-only write policies and connect a direct upload control. The current editors accept hosted image URLs.
2. Add dedicated service/article SEO columns and per-project multi-image galleries if separate editable fields are needed. Existing page metadata is generated from the route; article excerpts are editable.
3. Create or select an administrator account and assign the existing `admin` role through Lovable. Administrator credentials were not supplied; authenticated production writes have not been verified.
4. Set verified company contact details, WhatsApp number, social links, approved customer reviews and actual company/project figures. Until then, the floating contact action opens the enquiry form.
5. Confirm the production domain before publishing; canonical URLs and sitemap currently use the existing `sanmitra-sunshine-hub.lovable.app` address.

Source is prepared for GitHub. Production deployment and synchronization into the original Lovable project are separate steps.

## Verification

```sh
npx tsc --noEmit
npm test
npm run build
```

Browser checks use Microsoft Edge installed on Windows:

```sh
npm run dev -- --host 127.0.0.1 --port 5173
npx playwright test
```

Browser enquiry tests intercept backend responses and create no customer records. They verify the request payload, validation, failures and success rendering. Public backend reads were checked separately; complete authenticated database behavior still needs an owner account.

The existing calculator test mixed rupees with kilowatt-hours; its expected system size has been corrected to use 500 kWh for a ₹5,000 bill, 80% offset and ₹8/kWh tariff.

## Typography and social controls

The branded first-load preloader waits briefly for fonts and clears within a bounded time. It respects reduced motion and does not repeat during internal navigation. Floating Instagram, Facebook and WhatsApp icons use verified values from website settings; local public defaults can be entered in `src/lib/social-links.ts`. Unconfigured accounts show a Coming soon tooltip and do not open invented profiles.
