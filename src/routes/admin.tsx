import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader, SiteFooter, ContentHero } from "@/components/solar-site";
import { AdminDashboard } from "@/components/solar-admin";
import { pageHead } from "@/lib/seo";
export const Route = createFileRoute("/admin")({
  head: () => pageHead("Administration", "Secure content and enquiry management.", "/admin"),
  component: Admin,
});
function Admin() {
  return (
    <>
      <SiteHeader />
      <main id="main-content">
        <ContentHero
          kicker="Sanmitra Solar"
          title="Your website, in your hands."
          description="Manage your content, enquiries and website settings."
        />
        <AdminDashboard />
      </main>
      <SiteFooter />
    </>
  );
}
