import { Link } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";
import rooftopSolar from "@/assets/solar-rooftop-editorial.jpg";

export function AboutSolarStory() {
  return (
    <section id="possibilities" className="about-solar-story site-wrap">
      <div className="about-solar-photo" data-enter="left">
        <div className="photo-curtain" data-photo-reveal>
          <img
            src={rooftopSolar}
            alt="Illustrative rooftop solar installation surrounded by an open landscape"
            width={1536}
            height={1024}
            loading="lazy"
          />
        </div>
        <div className="about-photo-caption">
          <span>THE SPACE ABOVE YOU.</span>
          <strong>Put it to good use.</strong>
        </div>
      </div>
      <div className="about-solar-copy" data-enter="right">
        <p className="eyebrow">ABOUT SANMITRA SOLAR</p>
        <h2 className="section-heading mt-5">A better energy plan starts with your roof.</h2>
        <p className="about-lead">
          Your electricity bill. Your roof space. The way you use energy. That’s where a useful
          solar conversation begins.
        </p>
        <p className="about-description">
          Explore solar for your home or business with Sanmitra Solar. Start with a savings
          estimate, then discuss the site details that will shape your system.
        </p>
        <div className="about-principles" data-stagger>
          <div>
            <Check size={17} aria-hidden="true" />
            <span>A system shaped around your property</span>
          </div>
          <div>
            <Check size={17} aria-hidden="true" />
            <span>Clear assumptions behind every estimate</span>
          </div>
          <div>
            <Check size={17} aria-hidden="true" />
            <span>A practical next step, at your pace</span>
          </div>
        </div>
        <Link to="/about" className="story-link">
          Get to know Sanmitra{" "}
          <span>
            <ArrowRight size={17} />
          </span>
        </Link>
      </div>
    </section>
  );
}
