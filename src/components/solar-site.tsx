import { AboutSolarStory } from "./about-solar-story";
import { HomeSavings } from "./home-savings";
import { starterArticles } from "@/lib/solar-articles";
import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import { Link } from "react-router";
import {
  ArrowDown,
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Menu,
  Sun,
  X,
  Zap,
} from "lucide-react";
import { z } from "zod";

import {
  CinematicHero,
  ProjectShowcase,
  InstallationProcess,
  Testimonials,
  Sustainability,
  ContactActions,
  CompanyFigures,
  demoProjects,
  usePublished,
  useSiteSettings,
} from "./solar-experience";
import { useSolarMotion } from "@/hooks/use-solar-motion";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { estimateSolarSavings, SOLAR_ASSUMPTIONS } from "@/lib/solar-estimates";
import { homeSolar } from "@/lib/solar-images";
import rooftopSolar from "@/assets/solar-rooftop-editorial.jpg";
import { LumenRoofHero } from "@/components/lumen-roof-hero";
import { HomeContactPopup } from "@/components/home-contact-popup";

const navItems = [
  { label: "Our approach", to: "/about" as const },
  { label: "Solar solutions", to: "/services" as const },
  { label: "Projects", to: "/projects" as const },
  { label: "Insights", to: "/blog" as const },
];

export function SiteHeader({ inverse = false }: { inverse?: boolean }) {
  const { data: settings } = useSiteSettings();
  const logo =
    typeof settings?.["brand"]?.["logo"] === "string" ? String(settings["brand"]["logo"]) : "";
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 32);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <header
      className={`site-header fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${scrolled ? "is-scrolled" : inverse ? "is-inverse" : ""}`}
    >
      <div className="site-wrap flex h-[76px] items-center justify-between gap-6">
        <Link
          to="/"
          aria-label="Sanmitra Solar home"
          className="group inline-flex items-center gap-2.5"
        >
          {logo ? (
            <img src={logo} alt="Sanmitra Solar" className="max-h-10 max-w-36 object-contain" />
          ) : (
            <span className="brand-mark">
              <Sun aria-hidden="true" size={20} strokeWidth={2.2} />
            </span>
          )}
          <span className="font-display text-[15px] font-extrabold leading-none">
            SANMITRA<span className="brand-word-accent">.</span>
            <span className="ml-1 text-[11px] font-semibold tracking-normal opacity-65">SOLAR</span>
          </span>
        </Link>
        <nav aria-label="Main navigation" className="hidden items-center gap-8 lg:flex">
          {navItems.map((item) => (
            <Link key={item.to} to={item.to} className="nav-link">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-5 lg:flex">
          <Link to="/calculator" className="nav-link">
            Savings estimate <ArrowDownRight size={14} />
          </Link>
          <Button asChild className="nav-quote h-11 rounded-sm px-5">
            <Link to="/contact">
              Start a conversation <ArrowRight size={15} />
            </Link>
          </Button>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="mobile-menu-button lg:hidden"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X /> : <Menu />}
        </Button>
      </div>
      {menuOpen && (
        <nav aria-label="Mobile navigation" className="mobile-nav lg:hidden">
          {[
            ...navItems,
            { label: "Savings estimate", to: "/calculator" as const },
            { label: "Contact", to: "/contact" as const },
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="mobile-nav-link"
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
              <ArrowRight size={16} />
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

export function SiteFooter() {
  const { data: settings } = useSiteSettings();
  return (
    <footer className="site-footer">
      <div className="site-wrap footer-main grid gap-6 py-7 md:grid-cols-[1.2fr_1fr_1fr] md:gap-10 md:py-8">
        <div className="max-w-sm">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <span className="brand-mark">
              <Sun size={20} />
            </span>
            <span className="font-display text-base font-extrabold">
              SANMITRA<span className="brand-word-accent">.</span> SOLAR
            </span>
          </Link>
          <p className="mt-3 text-xs leading-6 text-primary-foreground/70">
            Solar for your home and business. Start with a clear plan.
          </p>
        </div>
        <div>
          <p className="footer-label">Explore</p>
          <div className="mt-3 grid gap-2 text-xs text-primary-foreground/80">
            <Link to="/about">Our approach</Link>
            <Link to="/services">Solar solutions</Link>
            <Link to="/projects">Projects</Link>
            <Link to="/blog">Insights</Link>
            <Link to="/gallery">Gallery</Link>
          </div>
        </div>
        <div>
          <p className="footer-label">Take the next step</p>
          <div className="mt-3 grid gap-2 text-xs text-primary-foreground/80">
            <Link to="/calculator">Estimate your solar potential</Link>
            <Link to="/contact">Request a conversation</Link>
            {Object.entries(settings?.["social"] ?? {})
              .filter(([, value]) => typeof value === "string" && /^https:\/\//.test(value))
              .map(([name, url]) => (
                <a
                  key={name}
                  href={String(url)}
                  target="_blank"
                  rel="noreferrer"
                  className="capitalize"
                >
                  {name}
                </a>
              ))}
          </div>
        </div>
      </div>
      <div className="site-wrap footer-bottom flex flex-col gap-2 border-t border-primary-foreground/15 py-3 text-xs text-primary-foreground/55 sm:flex-row sm:items-center sm:justify-between">
        <span>© {new Date().getFullYear()} Sanmitra Solar</span>
        <span>Thoughtfully designed for a brighter energy future.</span>
      </div>
    </footer>
  );
}

function PageFrame({ children, inverse = false }: { children: ReactNode; inverse?: boolean }) {
  useSolarMotion();
  return (
    <>
      <SiteHeader inverse={inverse} />
      <main id="main-content">{children}</main>
      <SiteFooter />
      <ContactActions />
    </>
  );
}

export function HomePage() {
  return (
    <PageFrame inverse>
      <LumenRoofHero />

      <AboutSolarStory />

      <section className="site-wrap py-12 md:py-16">
        <div className="grid items-end gap-5 md:grid-cols-[1fr_auto]">
          <div>
            <p className="eyebrow">OUR SOLAR SOLUTIONS</p>
            <h2 className="section-heading mt-4 max-w-[660px]">
              Solar for the place you live. And the place you work.
            </h2>
          </div>
          <Link
            to="/services"
            className="inline-flex items-center gap-2 pb-2 text-sm font-semibold text-brand-teal"
          >
            View all pathways <ArrowRight size={16} />
          </Link>
        </div>
        <div className="solutions-grid mt-10" data-stagger>
          <SolutionPanel
            number="01"
            title="For your home"
            desc="Explore rooftop solar for the place you call home."
            image={homeSolar}
            to="/solutions/residential"
          />
          <SolutionPanel
            number="02"
            title="For your business"
            desc="Consider what on-site solar could mean for your workplace."
            image={rooftopSolar}
            to="/solutions/commercial"
          />
          <div className="solution-note">
            <span className="eyebrow eyebrow-light">LET’S START WITH YOUR CONTEXT</span>
            <h3 className="mt-5 font-display text-2xl font-semibold leading-tight">
              Have a larger site in mind?
            </h3>
            <p className="mt-4 max-w-sm text-sm leading-6 text-primary-foreground/70">
              Share your roof area, electricity use and plans. We?ll help you work out what to
              explore next.
            </p>
            <Button
              asChild
              variant="outline"
              className="mt-6 rounded-sm border-primary-foreground/45 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
            >
              <Link to="/contact">
                Share your plans <ArrowRight size={15} />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <HomeSavings />
      <CompanyFigures />
      <EnergyStory />

      <section className="site-wrap py-12 md:py-16" data-reveal>
        <p className="eyebrow">THE PROJECT JOURNAL</p>
        <h2 className="section-heading mt-5 mb-10">Real projects. Real impact.</h2>
        <ProjectShowcase compact />
      </section>
      <section
        className="site-wrap grid gap-12 py-12 md:grid-cols-2 md:gap-16 md:py-16"
        data-reveal
      >
        <div>
          <p className="eyebrow">WHAT TO LOOK FOR</p>
          <h2 className="section-heading mt-5">
            Built on trust.
            <br />
            Powered by innovation.
          </h2>
          <p className="mt-6 text-sm leading-7 text-muted-foreground">
            A solar proposal should stand up to good questions. These are the details we believe
            every energy conversation deserves.
          </p>
        </div>
        <div>
          {[
            [
              "A considered design",
              "Start with a site assessment, your energy needs and clearly stated assumptions.",
            ],
            [
              "Quality in the details",
              "Discuss equipment, electrical protection, installation scope and warranty terms.",
            ],
            [
              "A clear handover",
              "Ask about system checks, documentation and the support available after installation.",
            ],
          ].map(([title, body], index) => (
            <div className="border-t border-border py-6" key={title}>
              <p className="text-xs text-brand-teal">0{index + 1}</p>
              <h3 className="mt-3 font-display text-xl font-semibold">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </section>
      <InstallationProcess />
      <Testimonials />
      <Sustainability />

      <section className="site-wrap grid gap-10 py-12 md:grid-cols-[0.75fr_1.25fr] md:gap-16 md:py-16">
        <div>
          <p className="eyebrow">A clearer picture</p>
          <h2 className="section-heading mt-4">Questions worth asking before you switch.</h2>
          <p className="mt-5 leading-7 text-muted-foreground">
            A little context can make your first solar conversation more useful.
          </p>
          <Button asChild variant="link" className="mt-5 h-auto p-0 text-brand-teal">
            <Link to="/services">
              Explore solar pathways <ArrowRight size={15} />
            </Link>
          </Button>
        </div>
        <Accordion type="single" collapsible className="w-full">
          <FAQItem value="cost" question="How much does a rooftop solar system cost?">
            It depends on the size and design of the system, your roof and the equipment selected.
            This site’s calculator uses illustrative assumptions only; request a property-specific
            quote for a real estimate.
          </FAQItem>
          <FAQItem value="roof" question="What should I know about my rooftop?">
            Usable roof area, shade, orientation, structure and local weather all affect a system
            design. A qualified site review is needed before confirming suitability.
          </FAQItem>
          <FAQItem value="maintenance" question="What maintenance might solar panels need?">
            Solar systems generally benefit from periodic inspection and cleaning suited to local
            conditions. Follow the maintenance guidance supplied with your installed equipment.
          </FAQItem>
          <FAQItem value="timeline" question="How long does installation take?">
            Timing depends on the site survey, design, approvals, equipment and grid connection. A
            project-specific schedule can only be confirmed after those details are reviewed.
          </FAQItem>
          <FAQItem value="life" question="How should I compare panel lifespan and warranties?">
            Ask for the specific equipment datasheets and written product and performance warranty
            terms. The panel, inverter and other components may have different cover and maintenance
            requirements.
          </FAQItem>
          <FAQItem value="weather" question="What affects solar performance?">
            Shade, orientation, weather, temperature, equipment and system losses affect generation.
            A property-specific design should explain these assumptions and how output will be
            monitored.
          </FAQItem>
          <FAQItem value="subsidy" question="Are government subsidies available?">
            Eligibility and subsidy rules can change. Check the current official programme for your
            location; no subsidy amount is included in this estimate.
          </FAQItem>
        </Accordion>
      </section>

      <section className="cta-band" id="home-contact-cta">
        <div className="site-wrap flex flex-col items-start justify-between gap-8 py-10 md:flex-row md:items-center md:py-14">
          <div>
            <p className="eyebrow eyebrow-light">A thoughtful next step</p>
            <h2 className="mt-4 max-w-3xl font-display text-4xl font-semibold leading-tight text-primary-foreground md:text-5xl">
              Ready to make room for a little more sunshine?
            </h2>
            <p className="mt-4 max-w-xl text-primary-foreground/75">
              Start with a question. We’ll help you work out what to explore next.
            </p>
          </div>
          <Button
            asChild
            size="lg"
            className="shrink-0 rounded-sm bg-brand-orange px-6 text-brand-ink hover:bg-brand-orange/90"
          >
            <Link to="/contact">
              Start a conversation <ArrowRight size={16} />
            </Link>
          </Button>
        </div>
      </section>
      <HomeContactPopup />
    </PageFrame>
  );
}

function SolutionPanel({
  number,
  title,
  desc,
  image,
  to,
}: {
  number: string;
  title: string;
  desc: string;
  image: string;
  to: "/solutions/residential" | "/solutions/commercial";
}) {
  return (
    <Link
      to={to}
      className="solution-panel group"
    >
      <img
        src={image}
        alt=""
        width={1536}
        height={1024}
        loading="lazy"
        className="solution-image"
      />
      <div className="solution-overlay" />
      <div className="solution-copy">
        <div className="flex items-center justify-between text-xs font-medium text-primary-foreground/75">
          <span>{number} / SOLAR PATHWAY</span>
          <ArrowDownRight className="solution-arrow" size={19} />
        </div>
        <h3 className="mt-5 font-display text-3xl font-semibold text-primary-foreground">
          {title}
        </h3>
        <p className="mt-2 max-w-xs text-sm leading-6 text-primary-foreground/80">{desc}</p>
      </div>
    </Link>
  );
}

function EnergyStory() {
  return (
    <section className="energy-band overflow-hidden py-10 md:py-16">
      <div className="site-wrap grid items-center gap-10 md:grid-cols-[0.9fr_1.1fr] md:gap-16">
        <div className="max-w-lg">
          <p className="eyebrow">A simple idea, made visible</p>
          <h2 className="section-heading mt-4">See how sunshine powers your world.</h2>
          <p className="mt-5 leading-7 text-muted-foreground">
            Solar panels turn daylight into electricity for your property. A suitable system depends
            on your energy use, roof and local conditions.
          </p>
          <ol className="mt-8 grid gap-4 border-l border-border pl-5">
            {[
              ["01", "Sunlight reaches the panels"],
              ["02", "The system converts it to electricity"],
              ["03", "Your property uses the energy"],
              ["04", "The grid supports what you still need"],
            ].map(([num, text]) => (
              <li key={num} className="relative flex gap-4">
                <span className="absolute -left-[27px] top-0.5 grid size-[18px] place-items-center rounded-full border border-brand-teal bg-background text-[9px] font-bold text-brand-teal">
                  {num}
                </span>
                <span className="text-sm leading-6 text-foreground/80">{text}</span>
              </li>
            ))}
          </ol>
        </div>
        <EnergyDiagram />
      </div>
    </section>
  );
}

function EnergyDiagram() {
  return (
    <div className="energy-visual relative">
      <img
        src={homeSolar}
        alt="Solar panels on a modern home in daylight"
        width={1920}
        height={1080}
        loading="lazy"
        className="aspect-[1.2] w-full object-cover"
      />
      <div className="energy-diagram-overlay" />
      <div className="energy-sun">
        <Sun size={30} />
      </div>
      <div className="energy-label label-panels">
        <Zap size={14} /> SOLAR PANELS
      </div>
      <div className="energy-label label-home">YOUR HOME</div>
      <svg
        className="energy-lines"
        viewBox="0 0 600 400"
        role="img"
        aria-label="Illustration of energy flowing from solar panels to a home"
      >
        <path d="M155 235 C 238 165, 280 174, 344 230" className="energy-line" />
        <path d="M155 245 C 238 175, 280 184, 344 240" className="energy-line solar-flow" />
      </svg>
      <div className="energy-caption">
        <span className="energy-live-dot" /> DAYLIGHT TO EVERYDAY ENERGY
      </div>
    </div>
  );
}

function FAQItem({
  value,
  question,
  children,
}: {
  value: string;
  question: string;
  children: ReactNode;
}) {
  return (
    <AccordionItem value={value} className="faq-item">
      <AccordionTrigger className="py-5 text-left font-display text-base font-semibold hover:no-underline md:text-lg">
        {question}
      </AccordionTrigger>
      <AccordionContent className="max-w-[740px] text-sm leading-7 text-muted-foreground">
        {children}
      </AccordionContent>
    </AccordionItem>
  );
}

export function ContentHero({
  kicker,
  title,
  description,
  image,
}: {
  kicker: string;
  title: string;
  description: string;
  image?: string | undefined;
}) {
  return (
    <section className={`content-hero ${image ? "content-hero-image" : ""}`}>
      {image && (
        <img
          src={image}
          alt=""
          width={1536}
          height={1024}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      {image && <div className="content-hero-shade absolute inset-0" />}
      <div
        className={`site-wrap relative z-10 pb-14 pt-36 md:pb-20 md:pt-44 ${image ? "text-primary-foreground" : ""}`}
      >
        <p className={`eyebrow ${image ? "eyebrow-light" : ""}`}>{kicker}</p>
        <h1 className="mt-4 max-w-4xl font-display text-4xl font-semibold leading-tight md:text-6xl">
          {title}
        </h1>
        <p
          className={`mt-5 max-w-2xl text-base leading-7 md:text-lg md:leading-8 ${image ? "text-primary-foreground/80" : "text-muted-foreground"}`}
        >
          {description}
        </p>
      </div>
    </section>
  );
}

export function AboutPage() {
  return (
    <PageFrame>
      <ContentHero
        kicker="About Sanmitra Solar"
        title="Good energy starts with good questions."
        description="A considered approach to solar begins by understanding the people, property and everyday energy needs behind each decision."
      />
      <section className="site-wrap grid gap-12 py-12 md:grid-cols-[1fr_1fr] md:gap-16 md:py-14">
        <div>
          <p className="eyebrow">A more thoughtful way to start</p>
          <h2 className="section-heading mt-4">
            Energy decisions should feel clear, not complicated.
          </h2>
        </div>
        <div className="space-y-5 text-base leading-8 text-muted-foreground">
          <p>
            Sanmitra Solar is here to help people explore solar with a clearer view of their
            options. Every property has its own context—from how it uses electricity to the shape
            and shade of its roof.
          </p>
          <p>
            We believe a useful conversation begins with listening, transparent assumptions and a
            careful look at what will work for you.
          </p>
          <Button asChild className="rounded-sm">
            <Link to="/contact">
              Tell us what you’re exploring <ArrowRight size={15} />
            </Link>
          </Button>
        </div>
      </section>
      <section className="brand-surface-band py-10 md:py-16">
        <div className="site-wrap">
          <p className="eyebrow">Our point of view</p>
          <h2 className="section-heading mt-4 max-w-3xl">
            A solar decision should be personal, practical and grounded in your property.
          </h2>
          <div className="mt-12 grid gap-8 border-t border-border pt-8 md:grid-cols-3">
            {[
              [
                "01",
                "Start with listening",
                "Understand the way you use energy before talking about a system.",
              ],
              [
                "02",
                "Make the assumptions visible",
                "Separate an early estimate from a property-specific recommendation.",
              ],
              [
                "03",
                "Keep the conversation open",
                "Give you a useful next step, with room to ask better questions.",
              ],
            ].map(([n, title, body]) => (
              <div key={n} className="border-t-2 border-brand-teal pt-5">
                <p className="stat-mark">{n}</p>
                <h3 className="mt-5 font-display text-xl font-semibold">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="site-wrap grid gap-10 py-10 md:grid-cols-[0.8fr_1.2fr] md:py-16">
        <div>
          <p className="eyebrow">The journey</p>
          <h2 className="section-heading mt-4">A typical project, step by step.</h2>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            The exact steps and timing depend on your property and the approvals it needs.
          </p>
        </div>
        <div className="grid gap-0">
          {[
            "Consultation",
            "Site survey",
            "System design",
            "Installation",
            "Testing and handover",
          ].map((step, i) => (
            <div key={step} className="process-row">
              <span className="font-display text-sm font-bold text-brand-teal">0{i + 1}</span>
              <span className="font-display text-lg font-semibold">{step}</span>
              <ChevronDown className="rotate-[-90deg] text-muted-foreground" size={16} />
            </div>
          ))}
        </div>
      </section>
    </PageFrame>
  );
}

const pathways = [
  {
    slug: "residential",
    title: "Residential solar",
    description: "Explore rooftop solar for the place you call home.",
    image: homeSolar,
    items: [
      "Understand your monthly energy use",
      "Consider your roof's usable area and shade",
      "Build an early estimate before a site review",
    ],
  },
  {
    slug: "commercial",
    title: "Commercial solar",
    description: "Consider what on-site solar could mean for your workplace.",
    image: rooftopSolar,
    items: [
      "Review operating hours and daytime demand",
      "Consider roof area and facility requirements",
      "Discuss a property-specific system assessment",
    ],
  },
  {
    slug: "industrial",
    title: "Industrial solar",
    description: "Start a conversation about a larger site's energy needs.",
    image: rooftopSolar,
    items: [
      "Map the site's electricity demand",
      "Discuss the available installation area",
      "Explore design requirements with a project expert",
    ],
  },
];

export function ServicesPage() {
  const { data: services } = usePublished("services");
  const listed = services?.length
    ? services.map((item) => ({ slug: item.slug, title: item.title, description: item.summary }))
    : pathways;
  return (
    <PageFrame>
      <ContentHero
        kicker="Solar solutions"
        title="A better place to begin is the one that fits you."
        description="Choose a conversation that matches your property and the questions on your mind."
      />
      <section className="site-wrap grid gap-0 pb-16 md:pb-24">
        {listed.map((item, i) => (
          <Link
            key={item.slug}
            to={`/services/${encodeURIComponent(item.slug)}`}
            className="pathway-row"
          >
            <span className="pathway-number">0{i + 1}</span>
            <span className="pathway-title">{item.title}</span>
            <span className="pathway-description">{item.description}</span>
            <ArrowRight className="pathway-arrow" size={19} />
          </Link>
        ))}
      </section>
      <CTASection
        title="Not sure where your project fits?"
        body="Tell us a little about your property and what you’re hoping to learn."
      />
    </PageFrame>
  );
}

export function ServiceDetailPage({ slug }: { slug: string }) {
  const { data: services } = usePublished("services");
  const published = services?.find((item) => item.slug === slug);
  const solution = published
    ? {
        title: published.title,
        description: published.summary,
        image: published.image_url || rooftopSolar,
        items: published.body.split("\n").filter(Boolean),
      }
    : pathways.find((item) => item.slug === slug);
  if (!solution)
    return (
      <PageFrame>
        <ContentHero
          kicker="Solar solutions"
          title="This solution is not available."
          description="Explore our current solar pathways or speak with our team."
        />
        <div className="site-wrap py-12">
          <Link to="/services">View all solutions</Link>
        </div>
      </PageFrame>
    );
  return (
    <PageFrame>
      <ContentHero
        kicker={`Solar solutions / ${solution.title}`}
        title={solution.title}
        description={solution.description}
        image={solution.image}
      />
      <section className="site-wrap grid gap-12 py-10 md:grid-cols-[0.75fr_1.25fr] md:gap-16 md:py-16">
        <div>
          <p className="eyebrow">A useful starting point</p>
          <h2 className="section-heading mt-4">Every property deserves a closer look.</h2>
        </div>
        <div>
          <p className="text-base leading-8 text-muted-foreground">
            Your energy use, the property and its location all shape a solar conversation. These
            prompts can help you prepare for a more useful first discussion.
          </p>
          <ul className="mt-8 grid gap-5">
            {solution.items.map((item, i) => (
              <li className="flex items-start gap-4 border-t border-border pt-4" key={item}>
                <span className="font-display text-xs font-bold text-brand-teal">0{i + 1}</span>
                <span className="text-sm leading-6">{item}</span>
              </li>
            ))}
          </ul>
          <Button asChild className="mt-8 rounded-sm">
            <Link to={{ pathname: "/contact", search: new URLSearchParams({ service: solution.title }).toString() }}>
              Ask about {solution.title.toLowerCase()} <ArrowRight size={15} />
            </Link>
          </Button>
        </div>
      </section>
      <section className="brand-surface-band">
        <div className="site-wrap grid gap-10 py-10 md:grid-cols-2 md:py-14">
          <div>
            <p className="eyebrow">Try an early estimate</p>
            <h2 className="mt-4 font-display text-3xl font-semibold">
              Bring your monthly bill into focus.
            </h2>
          </div>
          <div className="flex items-center">
            <p className="leading-7 text-muted-foreground">
              The solar calculator uses clear, illustrative assumptions to help you explore. It is
              not a quote or a guarantee of savings.
            </p>
            <Button asChild variant="link" className="shrink-0 text-brand-teal">
              <Link to="/calculator">
                Open calculator <ArrowRight size={15} />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </PageFrame>
  );
}

export function ProjectsPage() {
  return (
    <PageFrame>
      <ContentHero
        kicker="Project journal"
        title="Real projects. Real impact."
        description="Explore solar possibilities. Design concepts are labelled clearly and will give way to verified project stories as they are published."
        image={rooftopSolar}
      />
      <section className="site-wrap py-10 md:py-14">
        <ProjectShowcase />
      </section>
    </PageFrame>
  );
}

export function ProjectDetailPage({ slug }: { slug: string }) {
  const { data, isPending, isError, refetch } = usePublished("projects");
  const project =
    data?.find((item) => item.slug === slug) ?? demoProjects.find((item) => item.slug === slug);
  if (!project && isPending)
    return (
      <PageFrame>
        <div className="site-wrap py-36" role="status">
          Loading project story?
        </div>
      </PageFrame>
    );
  if (!project && isError)
    return (
      <PageFrame>
        <ContentHero
          kicker="Project journal"
          title="We could not load this project."
          description="Please try again or explore the project journal."
        />
        <div className="site-wrap py-12">
          <button onClick={() => void refetch()} className="mr-6 underline">
            Try again
          </button>
          <Link to="/projects">Back to projects</Link>
        </div>
      </PageFrame>
    );
  if (!project)
    return (
      <PageFrame>
        <ContentHero
          kicker="Project journal"
          title="This project story isn’t available yet."
          description="Published project details will appear here as they are verified."
        />
        <div className="site-wrap pb-20">
          <Button asChild variant="outline">
            <Link to="/projects">
              <ArrowLeft size={15} /> Back to projects
            </Link>
          </Button>
        </div>
      </PageFrame>
    );
  return (
    <PageFrame>
      <ContentHero
        kicker={`${project.category} / ${project.location}`}
        title={project.name}
        description={project.description}
        image={project.image_url ?? undefined}
      />
      <div className="site-wrap grid gap-8 py-12 sm:grid-cols-2">
        {project.location && (
          <p>
            Location <strong>{project.location}</strong>
          </p>
        )}
        {project.capacity_kw !== null && (
          <p>
            Installed capacity <strong>{project.capacity_kw} kW</strong>
          </p>
        )}
      </div>
    </PageFrame>
  );
}

export function GalleryPage() {
  const { data, isPending, isError, refetch } = usePublished("gallery_items");
  const [category, setCategory] = useState("All");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [selected, setSelected] = useState<{
    image_url: string;
    title: string;
    alt_text: string;
  } | null>(null);
  useEffect(() => {
    if (selected) dialogRef.current?.showModal();
    else dialogRef.current?.close();
  }, [selected]);
  const images = data?.length
    ? data
    : [
        {
          id: "concept-home",
          title: "A home with a brighter outlook",
          category: "Residential",
          image_url: homeSolar,
          alt_text: "Illustrative home with rooftop solar",
        },
        {
          id: "concept-business",
          title: "Space for smarter energy",
          category: "Commercial",
          image_url: rooftopSolar,
          alt_text: "Illustrative commercial solar rooftop",
        },
      ];
  useEffect(() => {
    if (!selected) return;
    const handle = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    document.addEventListener("keydown", handle);
    return () => document.removeEventListener("keydown", handle);
  }, [selected]);
  return (
    <PageFrame>
      <ContentHero
        kicker="The solar perspective"
        title="A little sunshine. A different outlook."
        description="Explore solar spaces and installation ideas. Concept imagery is illustrative and does not document completed Sanmitra Solar projects."
      />
      <section className="site-wrap py-12 pb-20">
        <div className="filter-row">
          {["All", ...new Set(images.map((image) => image.category))].map((item) => (
            <button key={item} aria-pressed={category === item} onClick={() => setCategory(item)}>
              {item}
            </button>
          ))}
        </div>
        {isPending && (
          <p role="status" className="mb-5 text-sm">
            Loading gallery?
          </p>
        )}
        {isError && (
          <p className="mb-5 text-xs text-muted-foreground">
            Published gallery unavailable. Showing concept imagery.{" "}
            <button className="underline" onClick={() => void refetch()}>
              Retry
            </button>
          </p>
        )}
        <div className="gallery-grid">
          {images
            .filter((image) => category === "All" || image.category === category)
            .map((image) => (
              <figure key={image.id}>
                <button
                  onClick={() => setSelected(image)}
                  className="w-full"
                  aria-label={"Enlarge " + image.title}
                >
                  <img
                    src={image.image_url}
                    alt={image.alt_text || image.title}
                    width={1000}
                    height={700}
                    loading="lazy"
                    className="aspect-[4/3] w-full object-cover"
                  />
                </button>
                <figcaption className="pt-4">
                  <span className="eyebrow">
                    {image.id.startsWith("concept") ? "Illustrative concept" : image.category}
                  </span>
                  <p className="mt-2 font-display text-xl font-semibold">{image.title}</p>
                </figcaption>
              </figure>
            ))}
        </div>
      </section>
      {selected && (
        <dialog
          ref={dialogRef}
          className="gallery-modal"
          aria-label={selected.title}
          onCancel={() => setSelected(null)}
          onClick={(event) => {
            if (event.target === event.currentTarget) setSelected(null);
          }}
        >
          <button
            autoFocus
            className="gallery-close"
            aria-label="Close enlarged image"
            onClick={() => setSelected(null)}
          >
            <X />
          </button>
          <figure onClick={(event) => event.stopPropagation()}>
            <img src={selected.image_url} alt={selected.alt_text || selected.title} />
            <figcaption>{selected.title}</figcaption>
          </figure>
        </dialog>
      )}
    </PageFrame>
  );
}

export function BlogPage() {
  const { data, isPending, isError, refetch } = usePublished("blog_posts");
  const posts = data?.length ? data : starterArticles;
  return (
    <PageFrame>
      <ContentHero
        kicker="The solar journal"
        title="Good questions. Brighter decisions."
        description="Practical reading for your next energy conversation. Start with the details that matter to your property."
      />
      <section className="site-wrap py-12 pb-20">
        {isPending && (
          <p role="status" className="mb-5 text-xs">
            Loading the latest journal?
          </p>
        )}
        {isError && (
          <p className="mb-5 text-xs text-muted-foreground">
            Latest articles unavailable. Introductory guides shown below.{" "}
            <button className="underline" onClick={() => void refetch()}>
              Retry
            </button>
          </p>
        )}
        <div className="editorial-grid">
          {posts.map((post) => (
            <Link
              key={post.id}
              to={`/blog/${encodeURIComponent(post.slug)}`}
              className="editorial-post"
            >
              <img
                src={post.cover_image_url || rooftopSolar}
                alt={post.title}
                width={1000}
                height={700}
                loading="lazy"
                className="aspect-[1.4] w-full object-cover"
              />
              <p className="eyebrow mt-5">
                {post.published_at
                  ? new Date(post.published_at).toLocaleDateString("en-IN", { dateStyle: "long" })
                  : "Introductory solar guide"}
              </p>
              <h2 className="mt-3 font-display text-2xl font-semibold leading-snug">
                {post.title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{post.excerpt}</p>
              <span className="mt-5 inline-flex items-center gap-3 text-xs font-semibold text-brand-teal">
                Read the story <ArrowRight size={15} />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </PageFrame>
  );
}

export function BlogPostPage({ slug }: { slug: string }) {
  const { data, isPending, isError, refetch } = usePublished("blog_posts");
  const post =
    data?.find((item) => item.slug === slug) ?? starterArticles.find((item) => item.slug === slug);
  if (!post)
    return (
      <PageFrame>
        <ContentHero
          kicker="Solar journal"
          title={isPending ? "Loading your story?" : "This story is unavailable."}
          description="Explore the journal for more practical solar guidance."
        />
        <div className="site-wrap py-12">
          {isError && (
            <button className="mr-6 underline" onClick={() => void refetch()}>
              Retry loading
            </button>
          )}
          <Link to="/blog">Back to the journal</Link>
        </div>
      </PageFrame>
    );
  return (
    <PageFrame>
      <ContentHero
        kicker="Solar journal / A considered read"
        title={post.title}
        description={post.excerpt}
        image={post.cover_image_url || rooftopSolar}
      />
      <article className="site-wrap max-w-3xl py-10 md:py-16">
        {post.content.split("\n\n").map((paragraph, index) => {
          const [heading, ...body] = paragraph.split("\n");
          return (
            <section key={index} className="mb-9">
              {body.length ? (
                <>
                  <h2 className="mb-3 font-display text-2xl font-semibold">{heading}</h2>
                  <p className="whitespace-pre-wrap text-base leading-8 text-muted-foreground">
                    {body.join("\n")}
                  </p>
                </>
              ) : (
                <p className="text-base leading-8 text-muted-foreground">{heading}</p>
              )}
            </section>
          );
        })}
        <Link to="/blog" className="mt-8 inline-flex items-center gap-3 text-sm text-brand-teal">
          <ArrowLeft size={16} />
          Back to the journal
        </Link>
      </article>
      <CTASection
        title="Put your questions into context."
        body="Share your property details and take a useful next step."
      />
    </PageFrame>
  );
}

export function CalculatorPage() {
  const [bill, setBill] = useState(5_000);
  const [tariff, setTariff] = useState(8);
  const [property, setProperty] = useState("Home");
  const [area, setArea] = useState(0);
  const [location, setLocation] = useState("");
  const estimate = useMemo(() => estimateSolarSavings(bill, tariff), [bill, tariff]);
  const size =
    estimate && area > 0
      ? Math.min(estimate.systemSizeKw, area / 100)
      : (estimate?.systemSizeKw ?? 0);
  const actual =
    estimate && size < estimate.systemSizeKw
      ? estimateSolarSavings((bill * size) / estimate.systemSizeKw, tariff)
      : estimate;
  return (
    <PageFrame>
      <ContentHero
        kicker="Solar savings estimate"
        title="Discover what solar could save you."
        description="A first look at system size, generation and potential savings, using assumptions you can inspect."
      />
      <section className="site-wrap grid gap-12 py-10 pb-20 md:grid-cols-[1fr_0.8fr] md:gap-16">
        <div className="calculator-controls">
          <label className="field-label" htmlFor="monthly-bill">
            Monthly electricity bill <span>(INR)</span>
          </label>
          <div className="input-prefix">
            <span>₹</span>
            <input
              id="monthly-bill"
              type="number"
              min="1"
              max="100000000"
              step="500"
              value={bill}
              onChange={(e) => setBill(Number(e.target.value))}
            />
          </div>
          <input
            className="range-input"
            type="range"
            min="1000"
            max="50000"
            step="500"
            value={Math.min(Math.max(bill, 1000), 50000)}
            aria-label="Monthly electricity bill range"
            onChange={(e) => setBill(Number(e.target.value))}
          />
          <div className="range-hints">
            <span>₹1,000</span>
            <span>₹50,000+</span>
          </div>
          <label className="field-label mt-9" htmlFor="property-type">
            Property type
          </label>
          <select
            id="property-type"
            className="form-control"
            value={property}
            onChange={(e) => setProperty(e.target.value)}
          >
            <option>Home</option>
            <option>Business</option>
            <option>Industrial site</option>
          </select>
          <label className="field-label mt-7" htmlFor="tariff">
            Electricity tariff <span>(optional, INR per kWh)</span>
          </label>
          <div className="input-prefix">
            <span>₹</span>
            <input
              id="tariff"
              type="number"
              min="1"
              max="100"
              step="0.5"
              value={tariff}
              onChange={(e) => setTariff(Number(e.target.value))}
            />
          </div>
          {
            <>
              <label className="field-label mt-7" htmlFor="rooftop-area">
                Usable rooftop area <span>(square feet, optional)</span>
              </label>
              <div className="input-prefix">
                <input
                  id="rooftop-area"
                  type="number"
                  min="0"
                  max="1000000"
                  step="50"
                  value={area}
                  onChange={(e) => setArea(Number(e.target.value))}
                />
                <span>sq ft</span>
              </div>
            </>
          }
          <label className="field-label mt-7" htmlFor="solar-location">
            Location <span>(optional)</span>
          </label>
          <input
            id="solar-location"
            className="form-control"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            type="text"
            placeholder="City or PIN code"
            maxLength={80}
          />
          <p className="mt-7 border-l-2 border-brand-orange pl-4 text-xs leading-6 text-muted-foreground">
            This is an illustrative estimate, not a quote. It excludes government subsidy, tariff
            changes, financing, maintenance and property-specific design.
          </p>
        </div>
        <aside className="estimate-panel">
          <div className="flex items-center justify-between">
            <p className="eyebrow eyebrow-light">Your first look</p>
            <span className="estimate-sun">
              <Sun size={17} />
            </span>
          </div>
          <p className="mt-9 text-sm text-primary-foreground/65">Estimated system size</p>
          <p className="mt-2 font-display text-5xl font-semibold text-primary-foreground">
            {Number.isFinite(size) ? size.toFixed(1) : "—"}
            <span className="ml-2 text-lg font-medium">kW</span>
          </p>
          <div
            className="savings-chart"
            role="img"
            aria-label={`Illustrative annual cost before solar ${bill * 12} rupees and after solar ${Math.max(0, bill * 12 - (actual?.annualSavingsInr ?? 0))} rupees`}
          >
            <div style={{ height: "100%" }} />
            <div
              style={{
                height: `${Math.max(1, 100 * (1 - (actual?.annualSavingsInr ?? 0) / (bill * 12 || 1)))}%`,
              }}
            />
          </div>
          <p className="mt-2 text-[10px] text-white/60">
            Annual electricity spend: before / after estimated solar offset
          </p>
          <div className="estimate-divider" />
          <div className="estimate-result">
            <div>
              <span>Monthly energy generation</span>
              <strong>
                {Number.isFinite(actual?.monthlyGenerationKwh)
                  ? Math.round(actual?.monthlyGenerationKwh ?? 0).toLocaleString("en-IN")
                  : "—"}{" "}
                <small>kWh</small>
              </strong>
            </div>
            <div>
              <span>Potential annual savings</span>
              <strong>
                ₹
                {Number.isFinite(actual?.annualSavingsInr)
                  ? Math.round(actual?.annualSavingsInr ?? 0).toLocaleString("en-IN")
                  : "—"}
              </strong>
            </div>
            <div>
              <span>Illustrative payback</span>
              <strong>
                {Number.isFinite(actual?.estimatedPaybackYears)
                  ? `${actual?.estimatedPaybackYears.toFixed(1)} years`
                  : "—"}
              </strong>
            </div>
            <div>
              <span>Estimated annual CO₂ avoided</span>
              <strong>
                {Number.isFinite(actual?.annualCarbonReductionKg)
                  ? `${Math.round(actual?.annualCarbonReductionKg ?? 0).toLocaleString("en-IN")} kg`
                  : "—"}
              </strong>
            </div>
          </div>
          <Button
            asChild
            className="mt-7 w-full rounded-sm bg-brand-orange text-brand-ink hover:bg-brand-orange/90"
          >
            <Link
              to={{
                pathname: "/contact",
                search: new URLSearchParams({
                  bill: String(bill),
                  service:
                    property === "Home"
                      ? "Residential solar"
                      : property === "Business"
                        ? "Commercial solar"
                        : "Industrial solar",
                  estimate: JSON.stringify({
                    location,
                    area,
                    tariff,
                    systemSizeKw: size,
                    monthlyGenerationKwh: actual?.monthlyGenerationKwh,
                    annualSavingsInr: actual?.annualSavingsInr,
                  }),
                }).toString(),
              }}
            >
              Get a personalized assessment <ArrowRight size={15} />
            </Link>
          </Button>
          <p className="mt-4 text-[11px] leading-5 text-primary-foreground/50">
            Estimates use a simplified model and are not guaranteed. A site assessment and local
            tariff are needed for an accurate proposal.
          </p>
        </aside>
      </section>
      <section className="brand-surface-band">
        <div className="site-wrap py-10 md:py-14">
          <h2 className="font-display text-2xl font-semibold">Assumptions behind this estimate</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ["Sunlight", `${SOLAR_ASSUMPTIONS.peakSunHoursPerDay} peak-sun hours per day`],
              [
                "System performance",
                `${Math.round(SOLAR_ASSUMPTIONS.performanceRatio * 100)}% performance ratio`,
              ],
              [
                "Bill offset",
                `${Math.round(SOLAR_ASSUMPTIONS.targetBillOffset * 100)}% of monthly spend`,
              ],
              [
                "Installed cost",
                `₹${SOLAR_ASSUMPTIONS.estimatedInstalledCostPerKw.toLocaleString("en-IN")} per kW`,
              ],
              [
                "Grid emissions",
                `${SOLAR_ASSUMPTIONS.estimatedGridEmissionsKgPerKwh} kg CO₂ per kWh`,
              ],
              ["Tariff", `₹${tariff} per kWh (editable above)`],
            ].map(([name, value]) => (
              <div className="assumption-row" key={name}>
                <span>{name}</span>
                <strong>{value}</strong>
              </div>
            ))}
          </div>
          <p className="mt-6 text-xs leading-5 text-muted-foreground">
            Assumptions are illustrative placeholders, not Sanmitra Solar pricing or a performance
            promise. Confirm current assumptions before relying on an estimate.
          </p>
        </div>
      </section>
    </PageFrame>
  );
}

const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Please enter your name.")
    .max(100, "Name must be 100 characters or fewer."),
  email: z
    .string()
    .trim()
    .email("Enter a valid email address.")
    .max(254, "Email must be 254 characters or fewer."),
  phone: z.string().trim().max(30, "Phone number must be 30 characters or fewer."),
  service_interest: z.string().max(80),
  monthly_bill: z.number().int().min(0).max(100_000_000).nullable(),
  message: z
    .string()
    .trim()
    .min(1, "Please share what you’d like to discuss.")
    .max(3000, "Message must be 3,000 characters or fewer."),
});

export function ContactPage({
  service,
  bill,
  estimate,
}: {
  service?: string | undefined;
  bill?: string | undefined;
  estimate?: string | undefined;
}) {
  const { data: settings } = useSiteSettings();
  const publicContact = settings?.["contact"];
  const configuredNumber = String(publicContact?.["whatsapp"] ?? "").replace(/\D/g, "");
  const whatsappNumber = /^[1-9]\d{9,14}$/.test(configuredNumber) ? configuredNumber : "";
  const contactEmail = String(publicContact?.["email"] ?? "");
  const enquiryAction = whatsappNumber
    ? "Send via WhatsApp"
    : contactEmail
      ? "Send by email"
      : "Download enquiry";
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [serviceInterest, setServiceInterest] = useState(service ?? "");
  const [monthlyBill, setMonthlyBill] = useState(bill ?? "");
  const [message, setMessage] = useState(
    estimate
      ? `I would like a personalized quote. My illustrative calculator requirements: ${estimate}`
      : "",
  );

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");
    const parsed = contactSchema.safeParse({
      name,
      email,
      phone,
      service_interest: serviceInterest,
      monthly_bill: monthlyBill ? Number(monthlyBill) : null,
      message,
    });
    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message ?? "Please review the form.");
      return;
    }
    setSubmitting(true);
    const details = [
      "Sanmitra Solar enquiry",
      "Name: " + parsed.data.name,
      "Email: " + parsed.data.email,
      "Phone: " + parsed.data.phone,
      "Interest: " + parsed.data.service_interest,
      "Monthly bill: " + (parsed.data.monthly_bill ?? "Not supplied"),
      "",
      parsed.data.message,
    ].join("\n");
    try {
      if (whatsappNumber) {
        window.open(
          "https://wa.me/" + whatsappNumber + "?text=" + encodeURIComponent(details),
          "_blank",
          "noopener,noreferrer",
        );
      } else if (contactEmail) {
        window.location.href =
          "mailto:" +
          contactEmail +
          "?subject=" +
          encodeURIComponent("Solar enquiry from " + parsed.data.name) +
          "&body=" +
          encodeURIComponent(details);
      } else {
        const url = URL.createObjectURL(new Blob([details], { type: "text/plain;charset=utf-8" }));
        const link = document.createElement("a");
        link.href = url;
        link.download = "sanmitra-solar-enquiry.txt";
        link.click();
        window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      }
    } catch {
      setFormError("Your enquiry could not be prepared. Please try again.");
      setSubmitting(false);
      return;
    }
    setSubmitting(false);
    setSubmitted(true);
  }

  return (
    <PageFrame>
      <ContentHero
        kicker="Get in touch"
        title="Let’s make your first conversation useful."
        description="Share what you’re exploring and the Sanmitra Solar team will have a little more context for the conversation."
      />
      <section className="site-wrap grid gap-12 py-10 pb-20 md:grid-cols-[0.7fr_1.3fr] md:gap-16">
        <div>
          <p className="eyebrow">Tell us a little about it</p>
          {publicContact && (
            <address className="mt-7 space-y-3 text-sm not-italic leading-7">
              {Boolean(publicContact["phone"]) && (
                <a
                  className="block text-brand-teal"
                  href={`tel:${String(publicContact["phone"]).replace(/[^+0-9]/g, "")}`}
                >
                  {String(publicContact["phone"])}
                </a>
              )}
              {Boolean(publicContact["email"]) && (
                <a
                  className="block break-words text-brand-teal"
                  href={`mailto:${String(publicContact["email"])}`}
                >
                  {String(publicContact["email"])}
                </a>
              )}
              {Boolean(publicContact["address"]) && <p>{String(publicContact["address"])}</p>}
            </address>
          )}
          <p className="mt-5 leading-7 text-muted-foreground">
            Property type, energy costs or a question on your mind—start wherever you are.
          </p>
          <div className="mt-8 border-t border-border pt-5">
            <p className="text-xs font-semibold uppercase tracking-normal text-brand-teal">
              Your enquiry
            </p>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              {whatsappNumber
                ? "Prepare your enquiry and continue in WhatsApp."
                : contactEmail
                  ? "Prepare your enquiry in your email application."
                  : "Download your enquiry details as a text file to share with the team."}
            </p>
          </div>
        </div>
        {submitted ? (
          <div className="success-panel" role="status">
            <span className="success-icon">
              <Check size={19} />
            </span>
            <p className="eyebrow">
              {whatsappNumber || contactEmail ? "Enquiry prepared" : "Enquiry downloaded"}
            </p>
            <h2 className="mt-4 font-display text-3xl font-semibold">Thank you, {name}.</h2>
            <p className="mt-3 leading-7 text-muted-foreground">
              {whatsappNumber || contactEmail
                ? "Your message is ready. Complete sending it in the application that opened."
                : "Your enquiry file is ready to share. No message has been sent automatically."}
            </p>
            <Button
              variant="outline"
              className="mt-7 rounded-sm"
              onClick={() => {
                setSubmitted(false);
                setName("");
                setEmail("");
                setPhone("");
                setMessage("");
              }}
            >
              Prepare another enquiry
            </Button>
          </div>
        ) : (
          <form className="contact-form" onSubmit={submit} noValidate>
            <div className="form-grid">
              <div>
                <label className="field-label" htmlFor="contact-name">
                  Your name
                </label>
                <input
                  id="contact-name"
                  className="form-control"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  maxLength={100}
                />
              </div>
              <div>
                <label className="field-label" htmlFor="contact-email">
                  Email address
                </label>
                <input
                  id="contact-email"
                  className="form-control"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  maxLength={254}
                />
              </div>
            </div>
            <div className="form-grid mt-6">
              <div>
                <label className="field-label" htmlFor="contact-phone">
                  Phone <span>(optional)</span>
                </label>
                <input
                  id="contact-phone"
                  className="form-control"
                  type="tel"
                  autoComplete="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  maxLength={30}
                />
              </div>
              <div>
                <label className="field-label" htmlFor="contact-service">
                  What are you exploring?
                </label>
                <select
                  id="contact-service"
                  className="form-control"
                  value={serviceInterest}
                  onChange={(e) => setServiceInterest(e.target.value)}
                >
                  <option value="">Select an option</option>
                  <option>Residential solar</option>
                  <option>Commercial solar</option>
                  <option>Industrial solar</option>
                  <option>Maintenance or service</option>
                  <option>Something else</option>
                </select>
              </div>
            </div>
            <div className="mt-6">
              <label className="field-label" htmlFor="contact-bill">
                Monthly electricity bill <span>(INR, optional)</span>
              </label>
              <input
                id="contact-bill"
                className="form-control"
                type="number"
                min="0"
                max="100000000"
                value={monthlyBill}
                onChange={(e) => setMonthlyBill(e.target.value)}
              />
            </div>
            <div className="mt-6">
              <label className="field-label" htmlFor="contact-message">
                What would you like to discuss?
              </label>
              <textarea
                id="contact-message"
                className="form-control min-h-36 resize-y py-3"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={3000}
                required
              />
            </div>
            {formError && (
              <p className="mt-4 text-sm text-destructive" role="alert">
                {formError}
              </p>
            )}
            <Button type="submit" size="lg" disabled={submitting} className="mt-7 rounded-sm px-6">
              {submitting ? "Preparing?" : enquiryAction}
              <ArrowRight size={15} />
            </Button>
            <p className="mt-4 text-xs leading-5 text-muted-foreground">
              Your details are used only to prepare this enquiry. They are not stored by this
              website.
            </p>
          </form>
        )}
      </section>
    </PageFrame>
  );
}

export function CTASection({ title, body }: { title: string; body: string }) {
  return (
    <section className="cta-band">
      <div className="site-wrap flex flex-col items-start justify-between gap-7 py-12 md:flex-row md:items-center md:py-16">
        <div>
          <p className="eyebrow eyebrow-light">A good next step</p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-primary-foreground md:text-4xl">
            {title}
          </h2>
          <p className="mt-3 text-primary-foreground/75">{body}</p>
        </div>
        <Button
          asChild
          className="shrink-0 rounded-sm bg-brand-orange px-6 text-brand-ink hover:bg-brand-orange/90"
        >
          <Link to="/contact">
            Get in touch <ArrowRight size={15} />
          </Link>
        </Button>
      </div>
    </section>
  );
}

function EmptyCollection({ title, body }: { title: string; body: string }) {
  return (
    <div className="empty-journal">
      <span className="empty-journal-icon">
        <Sun size={22} />
      </span>
      <h2 className="mt-4 font-display text-2xl font-semibold">{title}</h2>
      <p className="mt-3 max-w-lg text-sm leading-6 text-muted-foreground">{body}</p>
    </div>
  );
}
