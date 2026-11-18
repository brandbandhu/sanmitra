import { Component, useEffect, type ErrorInfo, type ReactNode } from "react";
import { Link, Outlet, ScrollRestoration, useLocation } from "react-router";
import { Toaster } from "sonner";
import { SitePreloader } from "@/components/site-preloader";
import { reportLovableError } from "@/lib/lovable-error-reporting";

class AppErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  override state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  override componentDidCatch(error: Error, info: ErrorInfo) {
    reportLovableError(error, { componentStack: info.componentStack ?? "" });
  }

  override render() {
    if (!this.state.failed) return this.props.children;

    return (
      <main className="grid min-h-screen place-items-center bg-background px-4 text-center">
        <div>
          <h1 className="text-xl font-semibold text-foreground">This page didn't load</h1>
          <p className="mt-2 text-sm text-muted-foreground">Refresh the page to try again.</p>
          <button
            type="button"
            className="mt-6 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
            onClick={() => window.location.reload()}
          >
            Try again
          </button>
        </div>
      </main>
    );
  }
}

export function AppLayout() {
  const { pathname } = useLocation();

  useEffect(() => {
    document.documentElement.dataset["hydrated"] = "true";
    return () => {
      delete document.documentElement.dataset["hydrated"];
    };
  }, []);

  return (
    <>
      <SitePreloader />
      <AppErrorBoundary key={pathname}>
        <Outlet />
      </AppErrorBoundary>
      <ScrollRestoration />
      <Toaster richColors position="top-right" />
    </>
  );
}

export function NotFoundPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-background px-4 text-center">
      <div className="max-w-md">
        <p className="text-7xl font-bold text-foreground">404</p>
        <h1 className="mt-4 text-xl font-semibold text-foreground">Page not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          Go home
        </Link>
      </div>
    </main>
  );
}
