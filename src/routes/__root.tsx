import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router"
import { ClerkProvider } from "@clerk/tanstack-react-start"
import { QueryProvider } from "@/providers/query-provider"
import { ThemeProvider } from "@/providers/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { useSessionBootstrap } from "@/hooks/use-session-bootstrap"
import "../styles.css"

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Crawler" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Raleway:wght@400;500;600;700&display=swap",
      },
    ],
  }),
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-[#353535]">404</h1>
        <p className="mt-2 text-[#353535]/70">Page not found.</p>
      </div>
    </div>
  ),
  component: RootComponent,
})

function RootComponent() {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="font-sans">
        <ClerkProvider>
          <ThemeProvider>
            <QueryProvider>
              <SessionBootstrapWrapper>
                <Outlet />
                <Toaster position="top-right" richColors />
              </SessionBootstrapWrapper>
            </QueryProvider>
          </ThemeProvider>
        </ClerkProvider>
        <Scripts />
      </body>
    </html>
  )
}

function SessionBootstrapWrapper({ children }: { children: React.ReactNode }) {
  useSessionBootstrap()
  return children
}
