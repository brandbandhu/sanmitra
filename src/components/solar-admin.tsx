import { useEffect, useState, type FormEvent } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowRight, Download, LogOut, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { TablesInsert, Json } from "@/integrations/supabase/types";

type ContentTable = "services" | "projects" | "blog_posts" | "gallery_items" | "testimonials";
type Section = ContentTable | "dashboard" | "contact_requests" | "site_settings";
type RecordRow = Record<string, unknown> & { id?: string; setting_key?: string };
type Field = { key: string; label: string; type?: string; required?: boolean; long?: boolean };
const sections: { key: Section; label: string }[] = [
  { key: "dashboard", label: "Overview" },
  { key: "contact_requests", label: "Enquiries" },
  { key: "services", label: "Services" },
  { key: "projects", label: "Projects" },
  { key: "gallery_items", label: "Gallery" },
  { key: "blog_posts", label: "Articles" },
  { key: "testimonials", label: "Testimonials" },
  { key: "site_settings", label: "Website settings" },
];
const fields: Record<ContentTable, Field[]> = {
  services: [
    { key: "title", label: "Service title", required: true },
    { key: "slug", label: "URL slug", required: true },
    { key: "summary", label: "Summary", long: true, required: true },
    { key: "body", label: "Full description", long: true },
    { key: "image_url", label: "Image URL", type: "url" },
  ],
  projects: [
    { key: "name", label: "Project name", required: true },
    { key: "slug", label: "URL slug", required: true },
    { key: "location", label: "Location" },
    { key: "category", label: "Category", required: true },
    { key: "capacity_kw", label: "Installed capacity (kW)", type: "number" },
    { key: "description", label: "Project story", long: true },
    { key: "image_url", label: "Image URL", type: "url" },
  ],
  blog_posts: [
    { key: "title", label: "Article title", required: true },
    { key: "slug", label: "URL slug", required: true },
    { key: "excerpt", label: "Excerpt / search description", long: true },
    { key: "content", label: "Article content", long: true },
    { key: "cover_image_url", label: "Featured image URL", type: "url" },
  ],
  gallery_items: [
    { key: "title", label: "Caption", required: true },
    { key: "category", label: "Category" },
    { key: "image_url", label: "Photo URL", type: "url", required: true },
    { key: "alt_text", label: "Image description", required: true },
  ],
  testimonials: [
    { key: "customer_name", label: "Customer name", required: true },
    { key: "location", label: "Location" },
    { key: "project_type", label: "Project type" },
    { key: "quote", label: "Approved customer review", required: true, long: true },
    { key: "rating", label: "Rating (1–5, optional)", type: "number" },
  ],
};
const settingsFields: Record<string, Field[]> = {
  brand: [
    { key: "name", label: "Company name" },
    { key: "logo", label: "Logo URL", type: "url" },
  ],
  contact: [
    { key: "email", label: "Public email", type: "email" },
    { key: "phone", label: "Phone number" },
    { key: "address", label: "Office address", long: true },
    { key: "whatsapp", label: "WhatsApp number with country code" },
  ],
  social: [
    { key: "instagram", label: "Instagram URL", type: "url" },
    { key: "facebook", label: "Facebook URL", type: "url" },
    { key: "linkedin", label: "LinkedIn URL", type: "url" },
  ],
  homepage: [
    { key: "slide1_title", label: "Residential hero title" },
    { key: "slide1_image", label: "Residential hero image URL", type: "url" },
    { key: "slide2_title", label: "Commercial hero title" },
    { key: "slide2_image", label: "Commercial hero image URL", type: "url" },
    { key: "slide3_title", label: "Sustainability hero title" },
    { key: "slide3_image", label: "Sustainability hero image URL", type: "url" },
    { key: "projects", label: "Verified completed projects", type: "number" },
    { key: "capacity", label: "Verified installed capacity (kW)", type: "number" },
    { key: "years", label: "Verified years of experience", type: "number" },
    { key: "customers", label: "Verified customer count", type: "number" },
  ],
};
function csvCell(value: unknown) {
  const text = String(value ?? "");
  return '"' + (/^[=+@\-\t\r]/.test(text) ? "'" : "") + text.replaceAll('"', '""') + '"';
}
function exportEnquiries(rows: RecordRow[]) {
  const keys = [
    "name",
    "email",
    "phone",
    "service_interest",
    "monthly_bill",
    "message",
    "status",
    "created_at",
  ];
  const blob = new Blob(
    [
      "\ufeff" +
        [keys.join(","), ...rows.map((row) => keys.map((key) => csvCell(row[key])).join(","))].join(
          "\r\n",
        ),
    ],
    { type: "text/csv;charset=utf-8" },
  );
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "sanmitra-enquiries.csv";
  link.click();
  URL.revokeObjectURL(url);
}
export function AdminDashboard() {
  const client = useQueryClient();
  const [user, setUser] = useState<{ id: string; email?: string | undefined } | null>(null);
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);
  const [authError, setAuthError] = useState("");
  const [busy, setBusy] = useState(false);
  const [section, setSection] = useState<Section>("dashboard");
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});
  const [published, setPublished] = useState(false);
  const [settingGroup, setSettingGroup] = useState("contact");
  const [statusFilter, setStatusFilter] = useState("all");
  useEffect(() => {
    let active = true;
    async function inspect() {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (!active) return;
        if (error || !data.user) {
          setUser(null);
          setAuthorized(false);
          return;
        }
        const { data: allowed, error: roleError } = await supabase.rpc("has_role", {
          _user_id: data.user.id,
          _role: "admin",
        });
        if (active) {
          setUser({ id: data.user.id, email: data.user["email"] });
          setAuthorized(Boolean(allowed) && !roleError);
        }
      } catch {
        if (active) setAuthError("Could not check your session. Please sign in again.");
      } finally {
        if (active) setChecking(false);
      }
    }
    void inspect();
    const { data: subscription } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        setUser(null);
        setAuthorized(false);
        client.removeQueries({ queryKey: ["admin"] });
      }
    });
    return () => {
      active = false;
      subscription.subscription.unsubscribe();
    };
  }, [client]);
  const records = useQuery({
    queryKey: ["admin", section, user?.id],
    enabled: authorized && section !== "dashboard",
    queryFn: async () => {
      if (section === "dashboard") return [];
      const { data, error } = await supabase.from(section).select("*");
      if (error)
        throw new Error(
          "Records could not be loaded. Check your database connection and administrator access.",
        );
      return (data ?? []) as RecordRow[];
    },
  });
  const overview = useQuery({
    queryKey: ["admin", "overview", user?.id],
    enabled: authorized,
    queryFn: async () => {
      const results = await Promise.all([
        supabase
          .from("contact_requests")
          .select("*", { count: "exact" })
          .order("created_at", { ascending: false })
          .limit(5),
        supabase.from("projects").select("id", { count: "exact", head: true }),
        supabase.from("services").select("id", { count: "exact", head: true }),
      ]);
      if (results.some((result) => result.error))
        throw new Error("Dashboard totals are unavailable.");
      return {
        inquiries: results[0].count ?? 0,
        projects: results[1].count ?? 0,
        services: results[2].count ?? 0,
        recent: results[0].data ?? [],
      };
    },
  });
  function clearEditor() {
    setEditing(null);
    setForm({});
    setPublished(false);
  }
  async function signIn(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setAuthError("");
    const values = new FormData(e.currentTarget);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: String(values.get("email")),
        password: String(values.get("password")),
      });
      if (error || !data.user) throw new Error("Sign-in failed. Check your email and password.");
      const { data: allowed, error: roleError } = await supabase.rpc("has_role", {
        _user_id: data.user.id,
        _role: "admin",
      });
      if (roleError || !allowed) {
        await supabase.auth.signOut();
        throw new Error(
          "This account does not have administrator access. Ask the owner to assign the admin role.",
        );
      }
      setUser({ id: data.user.id, email: data.user["email"] });
      setAuthorized(true);
    } catch (error) {
      setAuthError(error instanceof Error ? error["message"] : "Sign-in could not complete.");
    } finally {
      setBusy(false);
    }
  }
  async function signOut() {
    await supabase.auth.signOut();
    setAuthorized(false);
    setUser(null);
    client.removeQueries({ queryKey: ["admin"] });
  }
  async function refresh() {
    await Promise.all([
      client.invalidateQueries({ queryKey: ["admin"] }),
      client.invalidateQueries({ queryKey: ["published"] }),
      client.invalidateQueries({ queryKey: ["site-settings"] }),
    ]);
  }
  function edit(row: RecordRow) {
    setEditing(String(row.id ?? row.setting_key));
    setPublished(Boolean(row["published"]));
    if (section === "site_settings") {
      setSettingGroup(String(row.setting_key));
      setForm(
        Object.fromEntries(
          Object.entries((row["setting_value"] as Record<string, unknown>) ?? {}).map(
            ([key, value]) => [key, String(value)],
          ),
        ),
      );
    } else
      setForm(
        Object.fromEntries(Object.entries(row).map(([key, value]) => [key, String(value ?? "")])),
      );
  }
  async function save(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (section === "site_settings") {
        const payload = Object.fromEntries(
          Object.entries(form).map(([key, value]) => [
            key,
            ["projects", "capacity", "years", "customers"].includes(key) && value
              ? Number(value)
              : value,
          ]),
        );
        const { error } = await supabase
          .from("site_settings")
          .upsert({
            setting_key: settingGroup,
            setting_value: payload as Json,
            updated_at: new Date().toISOString(),
          });
        if (error) throw error;
      } else if (section !== "dashboard" && section !== "contact_requests") {
        const table = section;
        const payload: Record<string, unknown> = { published };
        for (const field of fields[table])
          payload[field.key] =
            field.type === "number"
              ? form[field.key]
                ? Number(form[field.key])
                : null
              : (form[field.key] ?? (field.key === "category" ? "Residential" : ""));
        if (payload["slug"] && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(String(payload["slug"])))
          throw new Error("Use lowercase letters, numbers and hyphens for the URL slug.");
        if (payload["rating"] && (Number(payload["rating"]) < 1 || Number(payload["rating"]) > 5))
          throw new Error("Rating must be between 1 and 5.");
        if (table === "blog_posts" && published) payload["published_at"] = new Date().toISOString();
        const result = await saveContent(table, payload, editing);
        if (result.error) throw result.error;
      }
      toast.success("Changes saved");
      clearEditor();
      await refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error["message"]
          : "Could not save. Check required fields and unique slugs.",
      );
    } finally {
      setBusy(false);
    }
  }
  async function remove(row: RecordRow) {
    if (!window.confirm("Permanently delete this content?")) return;
    if (section === "dashboard" || section === "contact_requests") return;
    setBusy(true);
    try {
      const key = section === "site_settings" ? "setting_key" : "id";
      const { error } =
        section === "site_settings"
          ? await supabase.from("site_settings").delete().eq("setting_key", String(row[key]))
          : await supabase.from(section).delete().eq("id", String(row[key]));
      if (error) throw error;
      toast.success("Content deleted");
      await refresh();
      if (editing === row[key]) clearEditor();
    } catch {
      toast.error("Content could not be deleted.");
    } finally {
      setBusy(false);
    }
  }
  async function status(row: RecordRow, value: string) {
    const { error } = await supabase
      .from("contact_requests")
      .update({ status: value })
      .eq("id", String(row.id));
    if (error) toast.error("Status could not be saved.");
    else await refresh();
  }
  if (checking)
    return (
      <div className="site-wrap py-40" role="status">
        Checking secure administrator access…
      </div>
    );
  if (!authorized)
    return (
      <section className="site-wrap py-12">
        <form onSubmit={signIn} className="admin-login">
          <p className="eyebrow">SECURE ACCESS</p>
          <h2 className="mt-3 text-2xl font-semibold">Welcome back.</h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Use an account with the administrator role. Public registration is disabled.
          </p>
          <label className="field-label mt-6" htmlFor="admin-email">
            Email address
          </label>
          <input
            id="admin-email"
            className="form-control"
            name="email"
            type="email"
            autoComplete="username"
            required
          />
          <label className="field-label mt-5" htmlFor="admin-password">
            Password
          </label>
          <input
            id="admin-password"
            className="form-control"
            name="password"
            type="password"
            autoComplete="current-password"
            required
          />
          {authError && (
            <p className="mt-4 text-sm text-destructive" role="alert">
              {authError}
            </p>
          )}
          <button className="admin-save" disabled={busy}>
            {busy ? "Signing in…" : "Sign in"}
            <ArrowRight size={15} />
          </button>
          {user && (
            <button type="button" className="mt-5 text-sm underline" onClick={() => void signOut()}>
              Sign out of {user["email"]}
            </button>
          )}
        </form>
      </section>
    );
  const editable = section !== "dashboard" && section !== "contact_requests";
  const editorFields =
    section === "site_settings" ? settingsFields[settingGroup] : editable ? fields[section] : [];
  const rows = records.data ?? [];
  const filtered =
    section === "contact_requests" && statusFilter !== "all"
      ? rows.filter((row) => row["status"] === statusFilter)
      : rows;
  return (
    <section className="site-wrap py-10 pb-20">
      <div className="flex flex-wrap items-center justify-between gap-5 border-b border-border pb-6">
        <p className="text-xs text-muted-foreground">Signed in as {user?.["email"]}</p>
        <button className="inline-flex items-center gap-2 text-xs" onClick={() => void signOut()}>
          <LogOut size={15} />
          Sign out
        </button>
      </div>
      <div className="admin-tabs" aria-label="Admin sections">
        {sections.map((item) => (
          <button
            className={`admin-tab ${section === item.key ? "active" : ""}`}
            key={item.key}
            aria-pressed={section === item.key}
            onClick={() => {
              setSection(item.key);
              clearEditor();
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
      {section === "dashboard" ? (
        <div>
          {overview.isPending ? (
            <p role="status">Loading dashboard…</p>
          ) : overview.isError ? (
            <p role="alert">
              Dashboard unavailable.{" "}
              <button className="underline" onClick={() => void overview.refetch()}>
                Retry
              </button>
            </p>
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-3">
                {[
                  ["Total enquiries", overview.data?.inquiries],
                  ["Projects", overview.data?.["projects"]],
                  ["Services", overview.data?.services],
                ].map(([label, count]) => (
                  <div key={label} className="border border-border p-7">
                    <p className="eyebrow">{label}</p>
                    <p className="stat-mark mt-4">{count}</p>
                  </div>
                ))}
              </div>
              <h2 className="mt-12 text-2xl font-semibold">Recent enquiries</h2>
              {overview.data?.recent.map((row) => (
                <div className="admin-row" key={row.id}>
                  <div>
                    <p className="font-semibold">{row["name"]}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {row["email"]} · {new Date(row["created_at"]).toLocaleDateString("en-IN")}
                    </p>
                  </div>
                  <span className="text-xs">{row["status"]}</span>
                </div>
              ))}
              {!overview.data?.recent.length && <p className="mt-5 text-sm">No enquiries yet.</p>}
              <p className="mt-8 text-xs text-muted-foreground">
                Traffic analytics are not connected. These totals reflect database records.
              </p>
            </>
          )}
        </div>
      ) : (
        <div className={editable ? "admin-layout" : ""}>
          <div>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-2xl font-semibold">
                {sections.find((item) => item.key === section)?.label}
              </h2>
              {section === "contact_requests" ? (
                <button
                  className="inline-flex items-center gap-2 text-xs"
                  onClick={() => exportEnquiries(rows)}
                >
                  <Download size={15} />
                  Export CSV
                </button>
              ) : (
                <button className="inline-flex items-center gap-2 text-xs" onClick={clearEditor}>
                  <Plus size={15} />
                  New content
                </button>
              )}
            </div>
            {section === "contact_requests" && (
              <select
                className="form-control mt-6 max-w-xs"
                aria-label="Filter enquiries by status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All statuses</option>
                {["new", "contacted", "in_progress", "closed"].map((value) => (
                  <option key={value} value={value}>
                    {value.replaceAll("_", " ")}
                  </option>
                ))}
              </select>
            )}
            {records.isPending ? (
              <p className="py-8" role="status">
                Loading records…
              </p>
            ) : records.isError ? (
              <p className="py-8 text-sm text-destructive" role="alert">
                {records.error["message"]}{" "}
                <button className="underline" onClick={() => void records.refetch()}>
                  Retry
                </button>
              </p>
            ) : !filtered.length ? (
              <p className="py-10 text-sm text-muted-foreground">No records yet.</p>
            ) : (
              filtered.map((row) => (
                <article className="admin-row" key={String(row.id ?? row.setting_key)}>
                  <div className="min-w-0">
                    <h3 className="font-semibold">
                      {String(
                        row["name"] ?? row["title"] ?? row["customer_name"] ?? row.setting_key,
                      )}
                    </h3>
                    {section === "contact_requests" ? (
                      <>
                        <p className="mt-2 break-words text-xs text-muted-foreground">
                          {String(row["email"])} · {String(row["phone"] ?? "")}
                          <br />
                          {String(row["service_interest"] ?? "General enquiry")} ·{" "}
                          {new Date(String(row["created_at"])).toLocaleString("en-IN")}
                        </p>
                        <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-6">
                          {String(row["message"])}
                        </p>
                      </>
                    ) : (
                      <p className="mt-2 text-xs text-muted-foreground">
                        {section === "site_settings"
                          ? "Website configuration"
                          : row["published"]
                            ? "Published"
                            : "Draft"}
                      </p>
                    )}
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    {section === "contact_requests" ? (
                      <select
                        className="admin-status"
                        aria-label={`Status for ${row["name"]}`}
                        value={String(row["status"])}
                        onChange={(e) => void status(row, e.target.value)}
                      >
                        {["new", "contacted", "in_progress", "closed"].map((value) => (
                          <option key={value} value={value}>
                            {value.replaceAll("_", " ")}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <>
                        <button
                          disabled={busy}
                          aria-label={`Edit ${row["title"] ?? row["name"] ?? row.setting_key ?? "content"}`}
                          onClick={() => edit(row)}
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          disabled={busy}
                          className="text-destructive"
                          aria-label="Delete content"
                          onClick={() => void remove(row)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </article>
              ))
            )}
          </div>
          {editable && (
            <form onSubmit={save} className="admin-editor">
              <p className="eyebrow">{editing ? "EDIT CONTENT" : "CREATE CONTENT"}</p>
              {section === "site_settings" && (
                <>
                  <label className="field-label mt-5" htmlFor="setting-group">
                    Settings group
                  </label>
                  <select
                    id="setting-group"
                    className="form-control"
                    value={settingGroup}
                    onChange={(e) => {
                      const group = e.target.value;
                      setSettingGroup(group);
                      const row = rows.find((item) => item.setting_key === group);
                      setForm(
                        row
                          ? Object.fromEntries(
                              Object.entries(row["setting_value"] as Record<string, unknown>).map(
                                ([key, value]) => [key, String(value)],
                              ),
                            )
                          : {},
                      );
                    }}
                  >
                    {Object.keys(settingsFields).map((group) => (
                      <option key={group}>{group}</option>
                    ))}
                  </select>
                  <p className="mt-4 text-xs leading-6 text-muted-foreground">
                    Only enter verified public details. Leave unavailable company figures blank.
                  </p>
                </>
              )}
              {editorFields?.map((field) => (
                <div key={field.key}>
                  <label className="field-label mt-5" htmlFor={`edit-${field.key}`}>
                    {field.label}
                    {field.required ? " *" : ""}
                  </label>
                  {field.key === "category" && section === "projects" ? (
                    <select
                      className="form-control"
                      id={`edit-${field.key}`}
                      value={form[field.key] ?? "Residential"}
                      onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                    >
                      {["Residential", "Commercial", "Industrial"].map((value) => (
                        <option key={value}>{value}</option>
                      ))}
                    </select>
                  ) : field.long ? (
                    <textarea
                      id={`edit-${field.key}`}
                      className="form-control min-h-28"
                      value={form[field.key] ?? ""}
                      required={field.required}
                      maxLength={field.key === "quote" ? 2000 : 20000}
                      onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                    />
                  ) : (
                    <input
                      id={`edit-${field.key}`}
                      className="form-control"
                      type={field.type ?? "text"}
                      min={field.type === "number" ? 0 : undefined}
                      step={field.type === "number" ? "any" : undefined}
                      value={form[field.key] ?? ""}
                      required={field.required}
                      maxLength={field.key === "slug" ? 100 : 500}
                      onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                    />
                  )}
                </div>
              ))}
              {section !== "site_settings" && (
                <label className="mt-6 flex items-center gap-3 text-sm">
                  <input
                    type="checkbox"
                    checked={published}
                    onChange={(e) => setPublished(e.target.checked)}
                  />
                  Publish on website
                </label>
              )}
              <button className="admin-save" disabled={busy}>
                {busy ? "Saving…" : "Save changes"}
                <ArrowRight size={15} />
              </button>
              {editing && (
                <button type="button" className="mt-4 text-xs underline" onClick={clearEditor}>
                  Cancel editing
                </button>
              )}
              <p className="mt-5 text-xs leading-6 text-muted-foreground">
                Photos use hosted image URLs. Direct uploads and separate SEO fields need
                Lovable-managed storage/schema setup.
              </p>
            </form>
          )}
        </div>
      )}
    </section>
  );
}

async function saveContent(
  table: ContentTable,
  payload: Record<string, unknown>,
  id: string | null,
) {
  switch (table) {
    case "services": {
      const value = payload as TablesInsert<"services">;
      return id
        ? await supabase.from("services").update(value).eq("id", id)
        : await supabase.from("services").insert(value);
    }
    case "projects": {
      const value = payload as TablesInsert<"projects">;
      return id
        ? await supabase.from("projects").update(value).eq("id", id)
        : await supabase.from("projects").insert(value);
    }
    case "blog_posts": {
      const value = payload as TablesInsert<"blog_posts">;
      return id
        ? await supabase.from("blog_posts").update(value).eq("id", id)
        : await supabase.from("blog_posts").insert(value);
    }
    case "gallery_items": {
      const value = payload as TablesInsert<"gallery_items">;
      return id
        ? await supabase.from("gallery_items").update(value).eq("id", id)
        : await supabase.from("gallery_items").insert(value);
    }
    case "testimonials": {
      const value = payload as TablesInsert<"testimonials">;
      return id
        ? await supabase.from("testimonials").update(value).eq("id", id)
        : await supabase.from("testimonials").insert(value);
    }
  }
}
