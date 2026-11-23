import { useEffect, useState } from "react";
import { Sun } from "lucide-react";

export function SitePreloader() {
  const [phase, setPhase] = useState<"loading" | "leaving" | "done">("loading");
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const started = performance.now();
    const timers: ReturnType<typeof setTimeout>[] = [];
    let disposed = false;
    let finished = false;
    const finish = () => {
      if (disposed || finished) return;
      finished = true;
      setPhase(reducedMotion ? "done" : "leaving");
      if (!reducedMotion) timers.push(setTimeout(() => setPhase("done"), 320));
    };
    timers.push(setTimeout(finish, 1800));
    void document.fonts.ready.then(() => {
      if (!disposed)
        timers.push(
          setTimeout(
            finish,
            Math.max(0, (reducedMotion ? 0 : 650) - (performance.now() - started)),
          ),
        );
    });
    return () => {
      disposed = true;
      timers.forEach(clearTimeout);
    };
  }, []);
  if (phase === "done") return null;
  return (
    <div className={`site-preloader ${phase === "leaving" ? "is-leaving" : ""}`} aria-hidden="true">
      <img src="/sanmitra-logo.png" alt="" className="h-auto w-64 max-w-[80vw]" />
      <div className="preloader-rule">
        <span />
      </div>
      <p>GOOD ENERGY STARTS HERE</p>
    </div>
  );
}
