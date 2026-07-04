import { useEffect, useState } from "react";
import { Menu, X, Leaf, XIcon } from "lucide-react";

const NAV = [
  { label: "HOME", href: "#home" },
  { label: "ABOUT", href: "#about" },
  { label: "ROADMAP", href: "#roadmap" },
  { label: "FAQ", href: "#faq" },
];


function LogoMark() {
  return (
    <span className="grid place-items-center size-9 rounded-md bg-primary text-primary-foreground border-2 border-ink shadow-[3px_3px_0_0_var(--ink)]">
      <Leaf className="size-5" strokeWidth={2.5} />
    </span>
  );
}

function IconLink({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <button
      aria-label={label}
      className="size-10 grid place-items-center rounded-md text-foreground/80 hover:text-primary hover:bg-primary/10 transition-colors"
    >
      {children}
    </button>
  );
}

function DiscordIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden>
      <path d="M20.317 4.369A19.79 19.79 0 0 0 16.885 3l-.243.507a17.87 17.87 0 0 0-9.284 0L7.115 3A19.79 19.79 0 0 0 3.683 4.369C1.14 8.34.42 12.21.72 16.02a20.15 20.15 0 0 0 5.99 3.03l.79-1.24c-1.05-.4-2.05-.9-2.98-1.5l.24-.19c3.51 1.66 7.33 1.66 10.8 0l.24.19c-.93.6-1.93 1.1-2.98 1.5l.79 1.24c2.14-.68 4.16-1.7 5.99-3.03.36-4.44-.7-8.28-3.28-11.65ZM9.55 14.5c-1.03 0-1.87-.94-1.87-2.09s.82-2.09 1.87-2.09 1.89.95 1.87 2.09c0 1.15-.83 2.09-1.87 2.09Zm4.9 0c-1.03 0-1.87-.94-1.87-2.09s.82-2.09 1.87-2.09 1.89.95 1.87 2.09c0 1.15-.82 2.09-1.87 2.09Z" />
    </svg>
  );
}
function RobinIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden>
      <path d="M12 2 3 7v10l9 5 9-5V7l-9-5Zm0 2.3 6.9 3.8L12 12 5.1 8.1 12 4.3Z" />
    </svg>
  );
}

/* ---------------- Navbar ---------------- */
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all ${
        scrolled
          ? "backdrop-blur-md bg-background/80 border-b border-primary/30"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 md:h-20 flex items-center justify-between gap-4">
        <a href="#home" className="flex items-center gap-2 group">
          <LogoMark />
          <span className="font-brush text-3xl tracking-wide brush">HOODIE</span>
        </a>
        <nav className="hidden lg:flex items-center gap-1">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="px-3 py-2 text-xs font-display tracking-widest text-foreground/80 hover:text-primary transition-colors"
            >
              {n.label}
            </a>
          ))}
        </nav>
        <div className="hidden md:flex items-center gap-2">
          <a
            href="/collection"
            className="inline-flex min-w-[180px] items-center justify-center gap-2 px-5 py-3 font-display text-sm tracking-widest bg-primary text-primary-foreground rounded-md border-2 border-ink shadow-[5px_5px_0_0_#007017] hover:-translate-y-0.5 transition-all w-full sm:w-auto"
            >
            VIEW COLLECTION <Leaf className="size-4" />
          </a>
        </div>
        <button
          className="lg:hidden inline-flex items-center justify-center size-10 rounded-md border-2 border-primary/60 text-primary"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>
      {open && (
        <div className="lg:hidden border-t border-primary/30 bg-background/95 backdrop-blur px-4 py-4">
          <nav className="flex flex-col gap-1">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="px-3 py-3 text-sm font-display tracking-widest text-foreground/90 hover:text-primary border-b border-border/50"
              >
                {n.label}
              </a>
            ))}
          </nav>
          <div className="mt-4">
            <a
            href="/collection"
            className="inline-flex min-w-[180px] items-center justify-center gap-2 px-5 py-3 font-display text-sm tracking-widest bg-primary text-primary-foreground rounded-md border-2 border-ink shadow-[5px_5px_0_0_#007017] hover:-translate-y-0.5 transition-all w-full sm:w-auto"
            >
            VIEW COLLECTION <Leaf className="size-4" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}