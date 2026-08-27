import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { Show, UserButton, useAuth } from "@clerk/tanstack-react-start";
import { useAuthStore } from "@/stores/auth-store";
import { useProfile } from "@/hooks/api/use-profile";
import { Button } from "@/components/ui/button";
import {
  LogOut,
  Moon,
  Sun,
  User,
  LayoutGrid,
  Briefcase,
  Settings,
  FileText,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useLogout } from "@/hooks/api/use-auth";
import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { LoadingSpinner } from "@/components/ui/spinner";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

function AppLayout() {
  const { theme, setTheme } = useTheme();
  const logout = useLogout();
  const {
    isSignedIn,
    isLoaded: clerkLoaded,
    signOut: clerkSignOut,
  } = useAuth();
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const token = useAuthStore((state) => state.token);
  const navigate = useNavigate();
  const isAuthenticated = isSignedIn || !!token;
  const { data: profile } = useProfile({
    enabled: isAuthenticated,
  });

  const isReady = clerkLoaded && isInitialized;

  useEffect(() => {
    if (!isReady) return;

    if (!isAuthenticated) {
      navigate({ to: "/login", replace: true });
      return;
    }

    // Auth confirmed — now enforce onboarding
    if (
      profile === null ||
      (profile !== undefined &&
        (!profile.role ||
          !profile.seniority ||
          !profile.location ||
          profile.skills.length === 0 ||
          profile.jobTitles.length === 0))
    ) {
      navigate({ to: "/onboarding", replace: true });
    }
  }, [isReady, isAuthenticated, profile, navigate]);

  if (!isReady) return <LoadingSpinner className="min-h-screen" size={40} />;

  if (!isAuthenticated) return null;

  const handleLogout = () => {
    if (isSignedIn) {
      clerkSignOut().finally(() => {
        useAuthStore.getState().clearAuth();
        window.location.href = "/login";
      });
    } else {
      logout.mutate();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur dark:bg-[#353535]/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/dashboard" className="text-lg font-bold tracking-tight">
            Crawler
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            <Link
              to="/dashboard"
              className="flex items-center gap-2 text-sm font-medium text-[#353535]/70 hover:text-[#353535] dark:text-[#d9d9d9]/70 dark:hover:text-white"
            >
              <LayoutGrid className="h-4 w-4" />
              Feed
            </Link>
            <Link
              to="/applications"
              className="flex items-center gap-2 text-sm font-medium text-[#353535]/70 hover:text-[#353535] dark:text-[#d9d9d9]/70 dark:hover:text-white"
            >
              <Briefcase className="h-4 w-4" />
              Applications
            </Link>
            <Link
              to="/cvs"
              className="flex items-center gap-2 text-sm font-medium text-[#353535]/70 hover:text-[#353535] dark:text-[#d9d9d9]/70 dark:hover:text-white"
            >
              <FileText className="h-4 w-4" />
              My CVs
            </Link>
            <Link
              to="/settings"
              className="flex items-center gap-2 text-sm font-medium text-[#353535]/70 hover:text-[#353535] dark:text-[#d9d9d9]/70 dark:hover:text-white"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>
          </nav>

          <div className="flex items-center gap-1 sm:gap-3">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Toggle color theme"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>

            <Show when="signed-in">
              <UserButton />
            </Show>

            <Show when="signed-out">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#3c6e71] text-xs font-medium text-white">
                  <User className="h-4 w-4" />
                </div>
                <span className="hidden text-sm font-medium md:block">
                  {profile?.fullName || "User"}
                </span>
              </div>
            </Show>

            <Button
              variant="ghost"
              size="icon"
              aria-label="Log out"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-5 pb-24 sm:px-6 sm:py-8 md:pb-8 lg:px-8">
        <Outlet />
      </main>

      <nav
        aria-label="Mobile navigation"
        className="fixed inset-x-0 bottom-0 z-50 border-t bg-white/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur dark:bg-[#353535]/95 md:hidden"
      >
        <div className="mx-auto grid max-w-md grid-cols-4">
          {([
            { to: "/dashboard", label: "Feed", icon: LayoutGrid },
            { to: "/applications", label: "Applications", icon: Briefcase },
            { to: "/cvs", label: "CVs", icon: FileText },
            { to: "/settings", label: "Settings", icon: Settings },
          ] as const).map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              activeProps={{ className: "text-[#3c6e71]" }}
              inactiveProps={{
                className:
                  "text-[#353535]/55 dark:text-[#d9d9d9]/60",
              }}
              className="flex min-h-12 flex-col items-center justify-center gap-1 rounded-lg px-1 text-[11px] font-medium"
            >
              <Icon className="h-5 w-5" />
              <span className="max-w-full truncate">{label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
