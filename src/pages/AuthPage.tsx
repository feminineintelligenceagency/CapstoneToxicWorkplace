import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Mail, Lock, ArrowRight } from "lucide-react";

const AuthPage = () => {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    const { error } = await signIn(email, password);
    if (error) {
      setError(error);
      toast.error(error);
    } else {
      toast.success("You have been signed in");
      navigate("/");
    }
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    const { error } = await signUp(email, password);
    if (error) {
      setError(error);
      toast.error(error);
    } else {
      toast.success("Please check your email to verify your account");
      setMode("signin");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 mt-20">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-pink-500 bg-clip-text text-transparent">
            {mode === "signin" ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="text-muted-foreground">
            {mode === "signin"
              ? "Sign in to access scenario and asset management"
              : "Create an account to get started"}
          </p>
        </div>

        <Card className="gradient-card p-8 shadow-card space-y-6">
          <form
            onSubmit={mode === "signin" ? handleSignIn : handleSignUp}
            className="space-y-4"
          >
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  className="h-12 pl-10"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  className="h-12 pl-10"
                  disabled={loading}
                />
              </div>
            </div>

            {mode === "signup" && (
              <div className="space-y-2">
                <label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setError("");
                    }}
                    className="h-12 pl-10"
                    disabled={loading}
                  />
                </div>
              </div>
            )}

            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/50 rounded-md">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              variant="game"
              size="lg"
              className="w-full h-12"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="inline-block w-4 h-4 border-2 border-transparent border-t-current rounded-full animate-spin" />
                  Processing...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  {mode === "signin" ? "Sign In" : "Create Account"}
                  <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-muted" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-card text-muted-foreground">Or</span>
            </div>
          </div>

          <Button
            type="button"
            variant="secondary"
            size="lg"
            className="w-full h-12"
            onClick={() => {
              setMode(mode === "signin" ? "signup" : "signin");
              setError("");
              setEmail("");
              setPassword("");
              setConfirmPassword("");
            }}
            disabled={loading}
          >
            {mode === "signin"
              ? "Don't have an account? Sign Up"
              : "Already have an account? Sign In"}
          </Button>

          <Button
            type="button"
            variant="outline"
            size="lg"
            className="w-full h-12"
            onClick={() => navigate("/")}
            disabled={loading}
          >
            Back to Home
          </Button>
        </Card>

        <p className="text-center text-sm text-muted-foreground">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
