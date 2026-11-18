import { FloatingSocials } from "./floating-socials";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { ArrowLeft, ArrowRight, Pause, Play, Sun } from "lucide-react";
import {
  SITE_CONTENT,
  SITE_SETTINGS,
  type SiteContentMap,
  type SolarProject,
} from "@/lib/site-content";
import { homeSolar } from "@/lib/solar-images";
import rooftopSolar from "@/assets/solar-rooftop-editorial.jpg";

export function usePublished<T extends keyof SiteContentMap>(table: T) {
  return {
    data: SITE_CONTENT[table],
    isPending: false,
    isError: false,
    refetch: async () => ({ data: SITE_CONTENT[table] }),
  };
}
export function useSiteSettings() {
  return { data: SITE_SETTINGS };
}
const defaultSlides = [
  {
    title: "Power Your Home. Brighten Your Future.",
    body: "Smart, sustainable solar energy solutions designed for modern living.",
    label: "Residential solar",
    cta: "Explore Solar Solutions",
    href: "/solutions/residential",
    image: homeSolar,
  },
  {
    title: "Smarter Energy for Growing Businesses.",
    body: "Explore what reliable, on-site solar power could mean for your business.",
    label: "Commercial solar",
    cta: "Explore Commercial Solar",
    href: "/solutions/commercial",
    image: rooftopSolar,
  },
  {
    title: "The Future Runs on Sunshine.",
    body: "A cleaner tomorrow starts with a thoughtful energy decision today.",
    label: "A brighter tomorrow",
    cta: "Get a Free Consultation",
    href: "/contact",
    image: homeSolar,
  },
];
export function CinematicHero() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const { data: settings } = useSiteSettings();
  const slides = defaultSlides.map((slide, i) => ({
    ...slide,
    title:
      typeof settings?.["homepage"]?.[`slide${i + 1}_title`] === "string"
        ? String(settings["homepage"][`slide${i + 1}_title`])
        : slide["title"],
    image:
      typeof settings?.["homepage"]?.[`slide${i + 1}_image`] === "string" &&
      settings["homepage"][`slide${i + 1}_image`]
        ? String(settings["homepage"][`slide${i + 1}_image`])
        : slide.image,
  }));
  const scope = useRef<HTMLElement>(null);
  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) setActive((i) => (i + 1) % 3);
    }, 8000);
    return () => window.clearInterval(timer);
  }, [paused, active]);
  const slide = slides[active]!;
  return (
    <section
      ref={scope}
      className="home-hero relative isolate flex items-end overflow-hidden bg-brand-night"
      aria-roledescription="carousel"
      aria-label="Solar possibilities"
    >
      {slides.map((item, i) => (
        <div
          key={i}
          className="hero-slide -z-20"
          style={{
            opacity: i === active ? 1 : 0,
            transform: i === active ? "translateX(0)" : "translateX(-4%)",
          }}
          aria-hidden={i !== active}
        >
          <img
            src={item.image}
            alt="Illustrative rooftop solar installation in warm sunlight"
            width={1920}
            height={1080}
            fetchPriority={i === 0 ? "high" : "low"}
            className={i === active ? "hero-image" : ""}
          />
        </div>
      ))}
      <div className="hero-visual absolute inset-0 -z-10" />
      <div className="hero-body site-wrap grid w-full items-end gap-10 pt-40 text-primary-foreground md:grid-cols-[1fr_200px]">
        <div key={active} className="reveal-up max-w-[870px]" aria-live={paused ? "polite" : "off"}>
          <p className="eyebrow eyebrow-light">
            <span /> SOLAR FOR YOUR HOME & BUSINESS
          </p>
          <h1 className="mt-7 font-display text-5xl font-semibold leading-[1.06] md:text-[78px]">
            {slide["title"].split(". ").map((text, i) => (
              <span key={text} className={i === 1 ? "heading-highlight" : ""}>
                {i > 0 && <br />}
                {text}
                {i === 0 && slide["title"].includes(". ") ? "." : ""}
              </span>
            ))}
          </h1>
          <p className="mt-6 max-w-lg text-base leading-8 text-primary-foreground/80">
            {slide.body}
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <a
              href={slide.href}
              className="inline-flex min-h-12 items-center gap-7 rounded-sm bg-brand-orange px-6 text-sm font-semibold text-brand-ink"
            >
              {slide.cta}
              <ArrowRight size={17} />
            </a>
            <Link to="/calculator" className="inline-flex min-h-12 items-center gap-4 px-3 text-sm">
              Find your solar potential <ArrowRight size={16} />
            </Link>
          </div>
        </div>
        <a
          href="#possibilities"
          className="hidden items-center gap-3 text-[10px] tracking-widest md:flex"
        >
          <span className="grid size-11 place-items-center rounded-full border border-white/40">
            ↓
          </span>
          SCROLL TO DISCOVER
        </a>
      </div>
      <div className="hero-controls">
        <div className="site-wrap hero-control-row">
          {slides.map((item, i) => (
            <button
              key={i}
              aria-label={`Show slide ${i + 1}: ${item.label}`}
              aria-pressed={active === i}
              onClick={() => {
                setActive(i);
                setPaused(true);
              }}
            >
              <span />
              {item.label}
            </button>
          ))}
          <span className="hero-counter">0{active + 1} / 03</span>
          <button
            className="hero-arrow"
            aria-label="Previous slide"
            onClick={() => {
              setActive((active + 2) % 3);
              setPaused(true);
            }}
          >
            <ArrowLeft size={15} />
          </button>
          <button
            className="hero-arrow"
            aria-label={paused ? "Play slideshow" : "Pause slideshow"}
            onClick={() => setPaused(!paused)}
          >
            {paused ? <Play size={14} /> : <Pause size={14} />}
          </button>
          <button
            className="hero-arrow"
            aria-label="Next slide"
            onClick={() => {
              setActive((active + 1) % 3);
              setPaused(true);
            }}
          >
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </section>
  );
}
export const demoProjects: SolarProject[] = [
  {
    id: "demo-home",
    slug: "concept-courtyard-home",
    name: "The courtyard home",
    location: "Pune · Design concept",
    category: "Residential",
    capacity_kw: 5,
    description:
      "DEMO CONCEPT — Not a completed Sanmitra Solar installation. An illustrative 5 kW rooftop layout for a family home. A real proposal requires a shade analysis, structural review and electricity-use assessment.",
    image_url: homeSolar,
    published: true,
    created_at: "",
    updated_at: "",
  },
  {
    id: "demo-business",
    slug: "concept-business-rooftop",
    name: "A rooftop that works harder",
    location: "Nashik · Design concept",
    category: "Commercial",
    capacity_kw: 30,
    description:
      "DEMO CONCEPT — Not a completed Sanmitra Solar installation. An illustrative commercial rooftop concept exploring daytime energy use. Capacity is a design example, not a verified project result.",
    image_url: rooftopSolar,
    published: true,
    created_at: "",
    updated_at: "",
  },
  {
    id: "demo-industry",
    slug: "concept-industrial-rooftop",
    name: "Space for a bigger ambition",
    location: "Maharashtra · Design concept",
    category: "Industrial",
    capacity_kw: 100,
    description:
      "DEMO CONCEPT — Not a completed Sanmitra Solar installation. A larger rooftop concept for exploring industrial demand, safe access and engineering requirements. All figures are illustrative.",
    image_url: rooftopSolar,
    published: true,
    created_at: "",
    updated_at: "",
  },
];
export function ProjectShowcase({ compact = false }: { compact?: boolean }) {
  const { data, isPending, isError, refetch } = usePublished("projects");
  const [filter, setFilter] = useState("All");
  const track = useRef<HTMLDivElement>(null);
  function moveProjects(direction: number) {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.current?.scrollBy({
      left: direction * track.current.clientWidth * 0.85,
      behavior: reduced ? "instant" : "smooth",
    });
  }
  const projects = data?.length ? data : demoProjects;
  const filtered = projects.filter((p) => filter === "All" || p.category === filter);
  return (
    <div>
      <div className="filter-row" aria-label="Filter projects">
        {["All", "Residential", "Commercial", "Industrial"].map((category) => (
          <button
            key={category}
            aria-pressed={filter === category}
            onClick={() => setFilter(category)}
          >
            {category}
          </button>
        ))}
      </div>
      {isPending && (
        <p className="mb-4 text-xs text-muted-foreground" role="status">
          Loading project journal… Design concepts shown below.
        </p>
      )}
      {isError && (
        <p className="mb-4 text-xs text-muted-foreground" role="status">
          Published projects are unavailable. Showing design concepts.{" "}
          <button className="underline" onClick={() => void refetch()}>
            Retry
          </button>
        </p>
      )}
      <div ref={track} className={compact ? "project-track" : "editorial-grid"}>
        {filtered.map((project) => (
          <Link
            key={project.id}
            to={`/projects/${encodeURIComponent(project["slug"])}`}
            className="project-card"
          >
            <figure>
              <img
                src={project.image_url || rooftopSolar}
                alt={`${project["name"]} — ${project.category} rooftop solar${project.id.startsWith("demo") ? " concept" : ""}`}
                width={1000}
                height={700}
                loading="lazy"
              />
            </figure>
            <span className="demo-tag">
              {project.id.startsWith("demo")
                ? "Illustrative concept · not a completed project"
                : project.category}
            </span>
            <h3>
              {project["name"]} <ArrowRight className="inline" size={19} />
            </h3>
            <p>
              {project.location}{" "}
              <span className="float-right">
                {project.capacity_kw} kW{project.id.startsWith("demo") ? " concept" : ""}
              </span>
            </p>
          </Link>
        ))}
      </div>
      {compact && (
        <div className="project-track-footer">
          <p>Explore the project journal</p>
          <div>
            <button type="button" aria-label="Previous projects" onClick={() => moveProjects(-1)}>
              <ArrowLeft size={18} />
            </button>
            <button type="button" aria-label="Next projects" onClick={() => moveProjects(1)}>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}
      {!filtered.length && (
        <p className="py-10 text-muted-foreground">No published projects in this category yet.</p>
      )}
    </div>
  );
}
export function InstallationProcess() {
  return (
    <section className="installation-section site-wrap py-12 md:py-16">
      <p className="eyebrow">HOW IT WORKS</p>
      <h2 className="section-heading mt-5 max-w-2xl">Your journey to solar, simplified.</h2>
      <p className="mt-5 max-w-xl text-sm leading-7 text-muted-foreground">
        A typical project follows these five stages. Your site, approvals and chosen system shape
        the final plan.
      </p>
      <div className="process-grid" data-process>
        {[
          ["Consultation", "Your goals, your electricity bill, your questions."],
          ["Site survey", "A closer look at space, shade and roof suitability."],
          ["System design", "A proposal shaped around your energy needs."],
          ["Installation", "Equipment, safety and a coordinated site plan."],
          ["Testing & handover", "System checks, guidance and the next steps."],
        ].map(([title, body], i) => (
          <div className="process-step" key={title}>
            <span className="stat-mark">0{i + 1}</span>
            <h3>{title}</h3>
            <p>{body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
export function Testimonials() {
  const { data } = usePublished("testimonials");
  const [index, setIndex] = useState(0);
  const review = data?.[index % (data.length || 1)];
  if (!review) return null;
  return (
    <section className="site-wrap py-10 md:py-16" data-reveal>
      <p className="eyebrow">THE PEOPLE BEHIND THE DECISION</p>
      <h2 className="section-heading mt-5 mb-10">Trusted by those who choose solar.</h2>
      {review ? (
        <div className="quote-block" aria-live="polite">
          <blockquote>“{review.quote}”</blockquote>
          <p>
            {review["customer_name"]} · {review.location} · {review.project_type}
            {review["rating"] ? ` · ${review["rating"]}/5` : ""}
          </p>
          <div className="mt-6 flex gap-4">
            <button
              aria-label="Previous testimonial"
              onClick={() => setIndex((index + (data?.length || 1) - 1) % (data?.length || 1))}
            >
              <ArrowLeft />
            </button>
            <button aria-label="Next testimonial" onClick={() => setIndex(index + 1)}>
              <ArrowRight />
            </button>
          </div>
        </div>
      ) : (
        <div className="quote-block">
          <p className="!mt-0 max-w-2xl !text-base !leading-8">
            Customer stories will appear here after the team adds approved reviews. Until then,
            let’s start with your questions and a clear look at your property.
          </p>
          <Link
            to="/contact"
            className="mt-5 inline-flex items-center gap-3 text-sm font-semibold text-brand-teal"
          >
            Start a conversation <ArrowRight size={16} />
          </Link>
        </div>
      )}
    </section>
  );
}
export function Sustainability() {
  return (
    <section className="wide-story">
      <img
        src={rooftopSolar}
        width={1536}
        height={1024}
        loading="lazy"
        alt="Sunlight across an illustrative rooftop solar installation"
      />
      <div className="site-wrap">
        <p className="eyebrow eyebrow-light">A SMALL CHANGE. A LONGER VIEW.</p>
        <h2 className="mt-5 max-w-3xl font-display text-5xl font-semibold leading-tight md:text-7xl">
          Better energy.
          <br />
          Better tomorrow.
        </h2>
        <p className="mt-6 max-w-lg text-base leading-8 text-white/80">
          Turn an everyday energy decision into a step toward a cleaner future. Explore your
          potential impact with transparent, illustrative calculations.
        </p>
        <Link
          to="/calculator"
          className="mt-7 inline-flex items-center gap-5 text-sm text-brand-orange"
        >
          Estimate your environmental impact <ArrowRight size={17} />
        </Link>
      </div>
    </section>
  );
}
export function ContactActions() {
  const { data } = useSiteSettings();
  return <FloatingSocials social={data?.["social"]} contact={data?.["contact"]} />;
}
export function CompanyFigures() {
  const { data } = useSiteSettings();
  const metrics = [
    ["Projects completed", data?.["homepage"]?.["projects"]],
    ["Installed capacity (kW)", data?.["homepage"]?.["capacity"]],
    ["Years of experience", data?.["homepage"]?.["years"]],
    ["Happy customers", data?.["homepage"]?.["customers"]],
  ].filter(([, value]) => typeof value === "number" && Number.isFinite(value) && Number(value) > 0);
  if (!metrics.length) return null;
  return (
    <div className="site-wrap grid grid-cols-2 gap-10 border-t border-border py-12 md:grid-cols-4">
      {metrics.map(([label, value]) => (
        <div key={String(label)}>
          <strong className="stat-mark" data-counter={Number(value)}>
            {Number(value).toLocaleString("en-IN")}
          </strong>
          <p className="mt-2 text-xs text-muted-foreground">{String(label)}</p>
        </div>
      ))}
    </div>
  );
}
