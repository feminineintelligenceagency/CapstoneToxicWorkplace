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
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                zIndex: 1000,
                backdropFilter: "blur(9px)",
                background: "linear-gradient(90deg, #60a5fa, #f472b6)",
                border: "1px linear-gradient(90deg, #60a5fa, #f472b6)",
                borderRadius: "8px",
            }}
        >
            {/* TOP BANNER */}
            <div
                style={{
                    padding: "8px",
                    textAlign: "center",
                    background:
                        "linear-gradient(90deg, #60a5fa, #f472b6)",
                    color: "white",
                    fontSize: "14px",
                    fontWeight: 500,
                }}
            >
            </div>

            {/* NAV */}
            <nav
                style={{
                    padding: "10px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "stretch",
                    height: "70px",
                    fontWeight: 500,
                    fontSize: 30
                }}
            >
                <Link to="/" style={{ color: "black", textDecoration: "none", padding: "0 30px", borderRight: "4px solid black", textAlign: "center", height: "100%", width: "15rem" }}
                    onMouseEnter={(e) => (e.currentTarget.style.fontWeight = "700")}
                    onMouseLeave={(e) => (e.currentTarget.style.fontWeight = "500")}>
                    Play
                </Link>
                <Link to="/about" style={{ color: "black", textDecoration: "none", padding: "0 30px", textAlign: "center", height: "100%", width: "15rem" }}
                    onMouseEnter={(e) => (e.currentTarget.style.fontWeight = "700")}
                    onMouseLeave={(e) => (e.currentTarget.style.fontWeight = "500")}>
                    About
                </Link>
                <Link to="/contact" style={{ color: "black", textDecoration: "none", borderLeft: "4px solid black", padding: "0 30px", textAlign: "center", height: "100%", width: "15rem" }}
                    onMouseEnter={(e) => (e.currentTarget.style.fontWeight = "700")}
                    onMouseLeave={(e) => (e.currentTarget.style.fontWeight = "500")}>
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
