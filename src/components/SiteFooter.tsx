import { Link } from "react-router-dom";

const footerLinks = [
  { to: "/", label: "Play" },
  { to: "/solo", label: "Solo practice" },
  { to: "/about", label: "About" },
  { to: "/tutorial", label: "Tutorial" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="app-header-nav box-border w-full max-w-none shrink-0 border-t border-white/10 text-white">
      <div className="mx-auto box-border flex w-full max-w-none flex-col gap-3 px-4 py-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-x-6 sm:gap-y-2 sm:px-5 sm:py-2.5 lg:px-8">
        <div className="flex min-w-0 flex-1 items-center gap-3 sm:flex-initial">
          <Link
            to="/"
            className="shrink-0 no-underline opacity-95 transition-opacity hover:opacity-100"
            aria-label="FIA — Home"
          >
            <img
              src="/FIA_logo.png"
              alt=""
              className="h-6 w-auto object-contain object-left sm:h-7"
              width={120}
              height={28}
            />
          </Link>
          <p className="hidden min-w-0 text-xs leading-snug text-white/65 sm:inline sm:max-w-md lg:max-w-lg">
            Social deduction &amp; roleplay — play together or practice solo.
          </p>
        </div>

        <nav
          className="flex w-full flex-wrap items-center gap-x-5 gap-y-1 text-xs font-medium font-[Poppins,sans-serif] sm:w-auto sm:justify-end sm:text-sm"
          aria-label="Footer"
        >
          {footerLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="text-white/85 no-underline transition-colors hover:text-white hover:underline"
            >
              {label}
            </Link>
          ))}
        </nav>

        <p className="w-full text-center text-[11px] text-white/40 sm:w-auto sm:text-left sm:text-xs">
          © {year} FIA
        </p>
      </div>
    </footer>
  );
}
