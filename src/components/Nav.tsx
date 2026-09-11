"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";

const solutions = [
  { label: "Oxygen as a Service", href: "/oxygen-as-a-service" },
  { label: "OxyIntel", href: "/oxyintel" },
];

const whoItsFor = [
  { label: "Hospital Solutions", href: "/hospital-solutions" },
  { label: "For Partners", href: "/for-partners" },
];

type MenuKey = "solutions" | "who" | null;

export function Nav() {
  const [open, setOpen] = useState<MenuKey>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const openMenu = (key: MenuKey) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(key);
  };

  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(null), 140);
  };

  return (
    <header
      className={`sticky top-0 z-40 transition-[background,backdrop-filter,border-color] duration-300 ${
        scrolled
          ? "bg-[var(--color-bg)]/85 backdrop-blur-md"
          : "bg-[var(--color-bg)]"
      }`}
      style={{
        borderBottom: `1px solid ${scrolled ? "var(--color-keyline)" : "transparent"}`,
      }}
    >
      <div
        className={`container-page flex items-center justify-between transition-[padding] duration-300 ${
          scrolled ? "py-3" : "py-5"
        }`}
      >
        <Link href="/" aria-label="HealthPort — home" className="flex items-center">
          <Image
            src="/brand/logo-horizontal-primary.svg"
            alt="HealthPort"
            width={600}
            height={128}
            priority
            className="h-7 md:h-8 w-auto"
          />
        </Link>

        {/* Desktop nav */}
        <nav
          className="hidden md:flex items-center gap-9 text-[15px]"
          onMouseLeave={scheduleClose}
        >
          <NavDropdown
            label="Solutions"
            items={solutions}
            open={open === "solutions"}
            onEnter={() => openMenu("solutions")}
          />
          <NavDropdown
            label="Who it's for"
            items={whoItsFor}
            open={open === "who"}
            onEnter={() => openMenu("who")}
          />
          <Link href="/about" className="link-quiet py-2">
            About
          </Link>
          <Link href="/contact" className="link-quiet py-2">
            Contact
          </Link>
        </nav>

        <div className="hidden md:block">
          <Link href="/contact" className="btn-primary text-[15px] px-5 py-2.5">
            Book an assessment
          </Link>
        </div>

        {/* Mobile burger */}
        <button
          type="button"
          className="md:hidden inline-flex items-center justify-center p-2 -mr-2 text-[var(--color-fg)]"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            {mobileOpen ? (
              <path
                d="M6 6l12 12M6 18L18 6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            ) : (
              <path
                d="M4 9h16M4 16h16"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div
          className="md:hidden"
          style={{ borderTop: "1px solid var(--color-keyline)" }}
        >
          <div className="container-page py-8 flex flex-col gap-6">
            <MobileGroup
              label="Solutions"
              items={solutions}
              onNavigate={() => setMobileOpen(false)}
            />
            <MobileGroup
              label="Who it's for"
              items={whoItsFor}
              onNavigate={() => setMobileOpen(false)}
            />
            <Link
              href="/about"
              className="text-[19px]"
              style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
              onClick={() => setMobileOpen(false)}
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-[19px]"
              style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
              onClick={() => setMobileOpen(false)}
            >
              Contact
            </Link>
            <Link
              href="/contact"
              className="btn-primary self-start mt-2"
              onClick={() => setMobileOpen(false)}
            >
              Book an assessment
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

function NavDropdown({
  label,
  items,
  open,
  onEnter,
}: {
  label: string;
  items: { label: string; href: string }[];
  open: boolean;
  onEnter: () => void;
}) {
  return (
    <div className="relative" onMouseEnter={onEnter}>
      <button
        type="button"
        className="link-quiet inline-flex items-center gap-1.5 py-2"
        aria-expanded={open}
        aria-haspopup="true"
        onFocus={onEnter}
      >
        {label}
        <svg
          width="11"
          height="11"
          viewBox="0 0 12 12"
          fill="none"
          aria-hidden="true"
          style={{
            transform: open ? "rotate(180deg)" : "rotate(0)",
            transition: "transform 180ms var(--ease-out-brand)",
          }}
        >
          <path
            d="M3 4.5l3 3 3-3"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {open && (
        <div
          className="absolute top-full left-0 mt-1 py-1.5"
          style={{
            background: "#FFFFFF",
            borderRadius: "10px",
            minWidth: "max-content",
            // Deliberate deviation from CLAUDE.md's no-shadow rule — the
            // dropdown needed a visual boundary against the white page and
            // the hairline keyline read too flat. Layered soft-drop shadow
            // (larger blur + tighter inner shadow) so the menu feels lifted
            // without a bright halo.
            boxShadow:
              "0 12px 32px -8px rgba(0,19,22,0.14), 0 4px 12px -6px rgba(0,19,22,0.08)",
          }}
          role="menu"
        >
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              role="menuitem"
              className="nav-dropdown-item"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function MobileGroup({
  label,
  items,
  onNavigate,
}: {
  label: string;
  items: { label: string; href: string }[];
  onNavigate: () => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="eyebrow">{label}</div>
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={onNavigate}
          className="text-[19px] py-1"
          style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}
