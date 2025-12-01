import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Index from "./pages/Index";
import LobbyEntry from "./pages/LobbyEntry";
import AboutPage from "./pages/AboutPage";
import Contact from "./pages/ContactUs";
import Lobby from "./pages/Lobby";
import Game from "./pages/Game";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const Header = () => (
    <header
      style={{
        padding: "15px",
        textAlign: "center",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 1000,
        backgroundColor: "240 18% 8%",
        backdropFilter: "blur(9px)",
      }}
      className="text-muted-foreground"
    >
      <nav
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "30px",
        }}
      >
        <Link to="/" style={{ color: "white", textDecoration: "none" }}>
          Play
        </Link>
        <Link to="/about" style={{ color: "white", textDecoration: "none" }}>
          About
        </Link>
        <Link to="/contact" style={{ color: "white", textDecoration: "none" }}>
          Contact
        </Link>
      </nav>
    </header>
  );

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Router>
          <Header />
          <Routes>
            <Route path="/" element={<LobbyEntry />} />
            <Route path="/solo" element={<Index />} />
            <Route path="/lobby/:code" element={<Lobby />} />
            <Route path="/game" element={<Game />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<Contact />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
