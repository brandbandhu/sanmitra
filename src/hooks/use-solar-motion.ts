import { useEffect } from "react";
import { useLocation } from "@tanstack/react-router";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function useSolarMotion() {
  const pathname = useLocation({ select: (location) => location.pathname });
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    let disposed = false;
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const context = gsap.context(() => {
        const mobile = window.matchMedia("(max-width: 767px)").matches;
        gsap.utils
          .toArray<HTMLElement>("[data-reveal], [data-enter], .section-heading")
          .filter(
            (element) =>
              !element.parentElement?.closest("[data-reveal], [data-enter], [data-stagger]"),
          )
          .forEach((element) => {
            const direction = element.dataset["enter"];
            gsap.from(element, {
              x: mobile ? 0 : direction === "left" ? -32 : direction === "right" ? 32 : 0,
              y: direction && !mobile ? 0 : 22,
              opacity: 0,
              duration: 0.75,
              ease: "power2.out",
              scrollTrigger: { trigger: element, start: "top 91%", once: true },
            });
          });
        gsap.utils.toArray<HTMLElement>("[data-stagger]").forEach((group) => {
          gsap.from(group.children, {
            y: 24,
            opacity: 0,
            duration: 0.65,
            stagger: 0.11,
            ease: "power2.out",
            scrollTrigger: { trigger: group, start: "top 88%", once: true },
          });
        });
        gsap.utils.toArray<HTMLElement>("[data-photo-reveal]").forEach((frame) => {
          const timeline = gsap.timeline({
            scrollTrigger: { trigger: frame, start: "top 87%", once: true },
          });
          timeline.from(frame, {
            clipPath: "inset(0 100% 0 0)",
            duration: 1,
            ease: "power3.inOut",
          });
          const photo = frame.querySelector("img");
          if (photo) timeline.from(photo, { scale: 1.07, duration: 1.25, ease: "power2.out" }, 0);
        });
        gsap.utils
          .toArray<HTMLElement>("[data-parallax]")
          .forEach((element) =>
            gsap.fromTo(
              element,
              { clipPath: "inset(8% 5% 8% 5%)" },
              {
                clipPath: "inset(0% 0% 0% 0%)",
                ease: "none",
                scrollTrigger: { trigger: element, start: "top 95%", end: "top 20%", scrub: 1 },
              },
            ),
          );
        const energy = document.querySelector(".energy-visual");
        if (energy) {
          gsap
            .timeline({
              scrollTrigger: { trigger: energy, start: "top 85%", end: "bottom 45%", scrub: 1 },
            })
            .from(".energy-sun", { opacity: 0, y: -30 })
            .from(".label-panels", { opacity: 0, x: -15 })
            .from(".energy-lines", { opacity: 0 })
            .from(".label-home", { opacity: 0, y: 15 })
            .from(".energy-caption", { opacity: 0 });
        }
        gsap.utils.toArray<HTMLElement>("[data-process]").forEach((grid) => {
          const steps = Array.from(grid.querySelectorAll<HTMLElement>(".process-step"));
          gsap.fromTo(
            grid,
            { "--process-progress": 0 },
            {
              "--process-progress": 1,
              ease: "none",
              scrollTrigger: {
                trigger: grid,
                start: "top 78%",
                end: "bottom 35%",
                scrub: 0.5,
                onUpdate: (self) =>
                  steps.forEach((step, index) =>
                    step.classList.toggle("is-current", self.progress >= index / steps.length),
                  ),
              },
            },
          );
        });
        gsap.utils.toArray<HTMLElement>("[data-counter]").forEach((element) => {
          const value = { count: 0 };
          gsap.to(value, {
            count: Number(element.dataset["counter"]),
            duration: 1.5,
            scrollTrigger: { trigger: element, start: "top 90%", once: true },
            onUpdate: () => {
              element.textContent = Math.round(value.count).toLocaleString("en-IN");
            },
          });
        });
      });
      return () => {
        context.revert();
        document
          .querySelectorAll(".process-step.is-current")
          .forEach((step) => step.classList.remove("is-current"));
      };
    });
    void document.fonts.ready.then(() => {
      if (!disposed) ScrollTrigger.refresh();
    });
    return () => {
      disposed = true;
      media.revert();
    };
  }, [pathname]);
}
