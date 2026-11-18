import { useEffect, useState, type FormEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useSiteSettings } from "@/components/solar-experience";

export function HomeContactPopup() {
  const { data: settings } = useSiteSettings();
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const target = document.getElementById("home-contact-cta");
    if (!target) return;

    let timer = 0;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) {
        if (!timer) {
          setOpen(true);
          timer = window.setTimeout(() => {
            setOpen(false);
            timer = 0;
          }, 5000);
        }
      } else {
        window.clearTimeout(timer);
        timer = 0;
        setOpen(false);
      }
    }, { threshold: 0 });

    observer.observe(target);
    return () => {
      window.clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const phone = String(form.get("phone") ?? "").trim();
    const message = String(form.get("message") ?? "").trim();
    const details = ["Sanmitra Solar enquiry", `Name: ${name}`, `Email: ${email}`, `Phone: ${phone || "Not supplied"}`, "", message].join("\n");
    const contact = settings?.["contact"];
    const whatsapp = String(contact?.["whatsapp"] ?? "").replace(/\D/g, "");
    const emailAddress = String(contact?.["email"] ?? "");

    try {
      if (/^[1-9]\d{9,14}$/.test(whatsapp)) {
        window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(details)}`, "_blank", "noopener,noreferrer");
      } else if (emailAddress) {
        window.location.href = `mailto:${emailAddress}?subject=${encodeURIComponent(`Solar enquiry from ${name}`)}&body=${encodeURIComponent(details)}`;
      } else {
        const url = URL.createObjectURL(new Blob([details], { type: "text/plain;charset=utf-8" }));
        const link = document.createElement("a");
        link.href = url;
        link.download = "sanmitra-solar-enquiry.txt";
        link.click();
        window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      }
      setSubmitted(true);
    } catch {
      setError("We couldn’t prepare your enquiry. Please try again.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto p-6 sm:max-w-lg">
        {submitted ? (
          <DialogHeader>
            <DialogTitle>Thanks for reaching out.</DialogTitle>
            <DialogDescription>Your enquiry is ready in the app that opened.</DialogDescription>
          </DialogHeader>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Let’s talk solar.</DialogTitle>
              <DialogDescription>Share a few details and we’ll help you explore the next step.</DialogDescription>
            </DialogHeader>
            <form className="contact-form mt-2" onSubmit={submit}>
              <div>
                <label className="field-label" htmlFor="home-popup-name">Your name</label>
                <input className="form-control" id="home-popup-name" name="name" autoComplete="name" required maxLength={100} />
              </div>
              <div className="mt-4">
                <label className="field-label" htmlFor="home-popup-email">Email address</label>
                <input className="form-control" id="home-popup-email" name="email" type="email" autoComplete="email" required maxLength={254} />
              </div>
              <div className="mt-4">
                <label className="field-label" htmlFor="home-popup-phone">Phone <span>(optional)</span></label>
                <input className="form-control" id="home-popup-phone" name="phone" type="tel" autoComplete="tel" maxLength={30} />
              </div>
              <div className="mt-4">
                <label className="field-label" htmlFor="home-popup-message">What would you like to discuss?</label>
                <textarea className="form-control min-h-24 resize-y py-3" id="home-popup-message" name="message" required maxLength={1000} />
              </div>
              {error && <p className="mt-3 text-sm text-destructive" role="alert">{error}</p>}
              <Button type="submit" className="mt-5 w-full">Send enquiry</Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
