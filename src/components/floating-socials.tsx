import { Link } from "@tanstack/react-router";
import { ArrowRight, Facebook, Instagram } from "lucide-react";
import { SOCIAL_LINKS } from "@/lib/social-links";

function profileUrl(value: unknown, domain: string): string | undefined {
  if (typeof value !== "string" || !value.trim()) return undefined;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.username || url.password) return undefined;
    if (url.hostname !== domain && !url.hostname.endsWith("." + domain)) return undefined;
    return url.href;
  } catch {
    return undefined;
  }
}
function WhatsAppIcon() {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M20.6 11.8a8.6 8.6 0 0 1-12.7 7.6L3 21l1.6-4.8a8.6 8.6 0 1 1 16-4.4Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M8.1 7.5c.2-.3.7-.3.9 0l1.1 2c.2.3.1.6-.1.8l-.7.7c.7 1.4 1.7 2.4 3.2 3l.8-.9c.2-.2.5-.3.8-.1l1.9.9c.4.2.5.5.3.9-.3.8-1 1.5-1.8 1.5-3.7-.1-7.6-3.7-7.8-7.1 0-.7.6-1.4 1.4-1.7Z"
        fill="currentColor"
      />
    </svg>
  );
}
export function FloatingSocials({
  social,
  contact,
}: {
  social?: Record<string, unknown> | undefined;
  contact?: Record<string, unknown> | undefined;
}) {
  const number = String(contact?.["whatsapp"] || SOCIAL_LINKS.whatsapp).replace(/\D/g, "");
  const socials = [
    {
      name: "Instagram",
      className: "instagram",
      href: profileUrl(social?.["instagram"] || SOCIAL_LINKS.instagram, "instagram.com"),
      icon: <Instagram size={21} strokeWidth={1.7} aria-hidden="true" />,
    },
    {
      name: "Facebook",
      className: "facebook",
      href: profileUrl(social?.["facebook"] || SOCIAL_LINKS.facebook, "facebook.com"),
      icon: <Facebook size={21} strokeWidth={1.7} aria-hidden="true" />,
    },
    {
      name: "WhatsApp",
      className: "whatsapp",
      href: /^[1-9]\d{9,14}$/.test(number)
        ? `https://wa.me/${number}?text=${encodeURIComponent("Hello Sanmitra Solar, I would like to discuss solar for my property.")}`
        : undefined,
      icon: <WhatsAppIcon />,
    },
  ];
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <div className="mobile-action-bar">
        <Link to="/contact" className="mobile-quote">
          Get a free solar consultation <ArrowRight size={17} />
        </Link>
        <aside className="floating-socials" aria-label="Connect with Sanmitra Solar">
          {socials.map((item) =>
            item.href ? (
              <a
                key={item.name}
                className={`social-icon ${item.className}`}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Sanmitra Solar on ${item.name} (opens in a new tab)`}
              >
                <span className="social-tooltip">{item.name}</span>
                {item.icon}
              </a>
            ) : (
              <button
                key={item.name}
                className={`social-icon ${item.className} is-unconfigured`}
                type="button"
                aria-disabled="true"
                aria-label={`${item.name} — profile coming soon`}
              >
                <span className="social-tooltip">{item.name} · Coming soon</span>
                {item.icon}
              </button>
            ),
          )}
        </aside>
      </div>
    </>
  );
}
