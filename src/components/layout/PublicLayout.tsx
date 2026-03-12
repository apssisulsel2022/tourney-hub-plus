import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { BarChart3, Home, Menu, Swords, Trophy, Users } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

type SeoMeta = {
  title: string;
  description?: string;
  imageUrl?: string;
};

type PublicLayoutProps = {
  seo: SeoMeta;
  tournamentName?: string;
  children: React.ReactNode;
};

const setMetaTag = (selector: string, content: string | undefined) => {
  if (!content) return;
  let el = document.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    const nameMatch = selector.match(/meta\[name="([^"]+)"\]/);
    const propMatch = selector.match(/meta\[property="([^"]+)"\]/);
    if (!nameMatch && !propMatch) return;
    el = document.createElement("meta");
    if (nameMatch) el.setAttribute("name", nameMatch[1]);
    if (propMatch) el.setAttribute("property", propMatch[1]);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
};

const setLinkTag = (rel: string, href: string | undefined) => {
  if (!href) return;
  let el = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
};

const PublicBottomNav = ({ tournamentName }: { tournamentName?: string }) => {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const items = useMemo(
    () => [
      { to: "/public", label: "Home", icon: Home },
      { to: "/public/matches", label: "Matches", icon: Swords },
      { to: "/public/standings", label: "Standings", icon: Trophy },
      { to: "/public/teams", label: "Teams", icon: Users },
    ],
    [],
  );

  const moreItems = useMemo(
    () => [
      { to: "/public/players", label: "Players", icon: Users },
      { to: "/public/statistics", label: "Statistics", icon: BarChart3 },
    ],
    [],
  );

  const isActive = (to: string) => location.pathname === to || (to !== "/public" && location.pathname.startsWith(`${to}/`));

  return (
    <div className="sm:hidden fixed inset-x-0 bottom-0 z-50 border-t bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <nav className="container h-16 px-2" aria-label="Primary mobile">
        <div className="grid grid-cols-5 h-full items-center">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                aria-label={item.label}
                className={cn(
                  "h-12 min-h-[48px] rounded-xl flex flex-col items-center justify-center gap-1 text-[11px] font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  isActive(item.to) ? "text-secondary" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
                <span className="leading-none">{item.label}</span>
              </NavLink>
            );
          })}

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                aria-label="More"
                className={cn(
                  "h-12 min-h-[48px] rounded-xl flex flex-col items-center justify-center gap-1 text-[11px] font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  open ? "text-secondary" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Menu className="h-5 w-5" aria-hidden="true" />
                <span className="leading-none">More</span>
              </button>
            </SheetTrigger>
            <SheetContent side="bottom" className="rounded-t-3xl">
              <SheetHeader>
                <SheetTitle className="text-left">Explore</SheetTitle>
              </SheetHeader>
              <div className="mt-4 grid grid-cols-1 gap-2">
                {tournamentName && <div className="text-sm font-bold text-muted-foreground">{tournamentName}</div>}
                {moreItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Button
                      key={item.to}
                      variant="outline"
                      className="h-12 justify-start rounded-2xl font-bold gap-3"
                      asChild
                      onClick={() => setOpen(false)}
                    >
                      <Link to={item.to}>
                        <Icon className="h-5 w-5 text-secondary" aria-hidden="true" />
                        {item.label}
                      </Link>
                    </Button>
                  );
                })}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </div>
  );
};

export default function PublicLayout({ seo, tournamentName = "Premier Cup 2026", children }: PublicLayoutProps) {
  const location = useLocation();

  useEffect(() => {
    document.title = seo.title;
    setMetaTag('meta[name="description"]', seo.description);
    setMetaTag('meta[property="og:title"]', seo.title);
    setMetaTag('meta[property="og:description"]', seo.description);
    setMetaTag('meta[name="twitter:title"]', seo.title);
    setMetaTag('meta[name="twitter:description"]', seo.description);
    if (seo.imageUrl) {
      setMetaTag('meta[property="og:image"]', seo.imageUrl);
      setMetaTag('meta[name="twitter:image"]', seo.imageUrl);
    }
  }, [seo.description, seo.imageUrl, seo.title]);

  useEffect(() => {
    const base = window.location.origin;
    const canonicalUrl = `${base}${location.pathname}${location.search}`;
    setLinkTag("canonical", canonicalUrl);
  }, [location.pathname, location.search]);

  return (
    <div className="min-h-screen bg-background">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:bg-background focus:text-foreground focus:border focus:rounded-lg focus:px-3 focus:py-2 focus:shadow"
      >
        Skip to content
      </a>

      <header className="border-b bg-card">
        <div className="container h-14 flex items-center justify-between gap-3">
          <Link to="/public" className="flex items-center gap-2 font-black">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
              <Trophy className="h-4 w-4" aria-hidden="true" />
            </div>
            KickOff
          </Link>

          <nav className="hidden sm:flex items-center gap-1" aria-label="Primary">
            {[
              { to: "/public", label: "Home" },
              { to: "/public/matches", label: "Matches" },
              { to: "/public/standings", label: "Standings" },
              { to: "/public/teams", label: "Teams" },
              { to: "/public/players", label: "Players" },
              { to: "/public/statistics", label: "Statistics" },
            ].map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className="px-3 py-2 rounded-xl text-sm font-bold text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                activeClassName="text-secondary bg-muted/50"
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <span className="hidden md:inline text-sm font-bold text-muted-foreground">{tournamentName}</span>
            <Button variant="outline" className="h-10 rounded-2xl font-bold" asChild>
              <Link to="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </header>

      <main id="content" className="container py-6 pb-24 sm:pb-10">
        {children}
      </main>

      <footer className="border-t bg-card hidden sm:block">
        <div className="container py-8 text-center text-sm text-muted-foreground">
          Powered by <span className="font-semibold text-foreground">KickOff</span> · Football Tournament Platform
        </div>
      </footer>

      <PublicBottomNav tournamentName={tournamentName} />
    </div>
  );
}
