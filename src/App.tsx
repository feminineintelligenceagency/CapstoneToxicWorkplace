import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import LobbyEntry from "./pages/LobbyEntry";
import AboutPage from "./pages/AboutPage";
import Contact from "./pages/ContactUs";
import TutorialPage from "./pages/TutorialPage";
import Lobby from "./pages/Lobby";
import Game from "./pages/Game";
import NotFound from "./pages/NotFound";
import { SpeechRecognitionBrowserBanner } from "@/components/SpeechRecognitionBrowserBanner";
import { SiteFooter } from "@/components/SiteFooter";
import { cn } from "@/lib/utils";

const queryClient = new QueryClient();

const FIA_LOGO_SRC = "/FIA_logo.png";

const navLinkClass =
  "flex min-h-[44px] items-center justify-center px-3 py-2 text-sm font-[Poppins,sans-serif] no-underline transition-colors hover:bg-white/10 sm:px-5 sm:text-lg md:text-[22px]";

function AppShell() {
  const location = useLocation();
  const hideFooter =
    location.pathname.startsWith("/lobby/") || location.pathname === "/game";
  const isHomeRoute = location.pathname === "/";

  return (
    <div
      className={cn(
        "flex flex-col",
        isHomeRoute ? "h-dvh max-h-dvh overflow-hidden" : "min-h-screen",
      )}
    >
      <header className="fixed left-0 right-0 top-0 z-[1000] w-full max-w-none backdrop-blur-md">
        <nav className="app-header-nav flex h-[70px] w-full max-w-none items-center justify-between gap-3 border-b border-white/10 px-3 text-white sm:px-5">
          <Link
            to="/"
            className="flex shrink-0 items-center gap-2 no-underline outline-none ring-offset-2 ring-offset-transparent focus-visible:ring-2 focus-visible:ring-white/60"
            aria-label="FIA — Home"
          >
            <img
              src={FIA_LOGO_SRC}
              alt=""
              className="h-9 w-auto max-w-[140px] object-contain object-left sm:h-11 sm:max-w-[180px]"
              width={180}
              height={44}
            />
          </Link>
          <div className="flex min-w-0 flex-1 flex-wrap items-center justify-end divide-x divide-white/20 font-medium">
            <Link to="/" className={navLinkClass}>
              Play
            </Link>
            <Link to="/about" className={navLinkClass}>
              About
            </Link>
            <Link to="/tutorial" className={navLinkClass}>
              Tutorial
            </Link>
            <Link to="/contact" className={navLinkClass}>
              Contact
            </Link>
          </div>
        </nav>
      </header>

      <div
        className={cn(
          "flex min-h-0 flex-col",
          isHomeRoute
            ? "mt-[70px] h-[calc(100dvh-70px)] overflow-hidden"
            : "flex-1 pt-[70px]",
        )}
      >
        <SpeechRecognitionBrowserBanner />
        <div
          className={cn(
            "flex min-h-0 flex-1 flex-col",
            isHomeRoute && "overflow-hidden",
          )}
        >
          <Routes>
            <Route path="/" element={<LobbyEntry />} />
            <Route path="/solo" element={<Index />} />
            <Route path="/lobby/:code" element={<Lobby />} />
            <Route path="/game" element={<Game />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/tutorial" element={<TutorialPage />} />
            <Route path="/contact" element={<Contact />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        {!hideFooter && <SiteFooter />}
      </div>
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Router>
        <AppShell />
      </Router>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
