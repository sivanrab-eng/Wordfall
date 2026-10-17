import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRootRouteWithContext, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import type { ReactNode } from "react";
import appCss from "../styles.css?url";
const base = import.meta.env["BASE_URL"];
export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
 head: () => ({ meta: [{ charSet: "utf-8" }, { name: "viewport", content: "width=device-width, initial-scale=1" }, { name: "theme-color", content: "#210c38" }, { name: "apple-mobile-web-app-title", content: "Wordfall" }], links: [{ rel: "stylesheet", href: appCss }, { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Heebo:wght@400;600;700;900&family=Secular+One&family=Frank+Ruhl+Libre:wght@400;700&display=swap" }, { rel: "manifest", href: `${base}manifest.webmanifest` }, { rel: "icon", href: `${base}wordfall-favicon.png` }, { rel: "apple-touch-icon", href: `${base}wordfall-180.png` }] }), component: Root, shellComponent: Document });
function Root() { const { queryClient } = Route.useRouteContext(); return <QueryClientProvider client={queryClient}><Outlet /></QueryClientProvider>; }
function Document({ children }: { children: ReactNode }) { return <html lang="he" dir="rtl"><head><HeadContent /></head><body>{children}<Scripts /></body></html>; }
