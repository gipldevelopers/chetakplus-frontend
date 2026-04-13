import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { useAuth } from "@/context/AuthContext";
import api from "@/api";
import { GoogleLogin } from "@react-oauth/google";

const SignIn = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginWithGoogle } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const redirectFromState = location.state?.from?.pathname
    ? `${location.state.from.pathname}${location.state.from.search || ""}${location.state.from.hash || ""}`
    : "";
  const redirectFromQuery = new URLSearchParams(location.search).get("redirect") || "";
  const redirectTarget = (redirectFromQuery || redirectFromState || "/shop").startsWith("/")
    ? (redirectFromQuery || redirectFromState || "/shop")
    : "/shop";

  useEffect(() => {
    const resetSuccess = new URLSearchParams(location.search).get("reset");
    if (resetSuccess === "success") {
      toast.success("Password reset successful. Please sign in.");
    }
  }, [location.search]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const email = formData.email.trim().toLowerCase();
    const password = formData.password;

    try {
      const response = await api.authSignIn({ email, password });

      login(response.user);
      toast.success(response.message || "Signed in successfully!");
      navigate(redirectTarget, { replace: true });
    } catch (error) {
      console.error("Sign in error:", error);

      if (error?.status === 429) {
        const retryAfterSeconds = Number(error?.body?.meta?.retryAfterSeconds || 30);
        const retryAfterMinutes = Math.max(1, Math.ceil(retryAfterSeconds / 60));
        const retryLabel = retryAfterSeconds < 60
          ? `${retryAfterSeconds} second${retryAfterSeconds === 1 ? "" : "s"}`
          : `${retryAfterMinutes} minute${retryAfterMinutes === 1 ? "" : "s"}`;
        toast.error(error?.message || `Too many attempts. Try again in ${retryLabel}.`);
      } else if (error?.status === 401) {
        const remaining = Number(error?.body?.meta?.remainingAttempts);
        if (Number.isFinite(remaining) && remaining > 0) {
          toast.error(`Invalid email or password. ${remaining} attempt${remaining === 1 ? "" : "s"} left.`);
        } else {
          toast.error("Invalid email or password.");
        }
      } else if (error?.status === 422) {
        toast.error(error?.message || "Please enter valid sign in details.");
      } else {
        toast.error(error?.message || "Failed to sign in. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // const handleGoogleSignIn = () => {
  //   toast.info("Google sign-in is not configured yet.");
  // };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-background">
      {/* Left Panel */}
      <div className="hidden lg:flex w-full lg:w-1/2 bg-secondary flex-col justify-center px-10 xl:px-20 relative overflow-hidden">
        {/* Decorative elements for stationey vibe */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4"></div>

        <div className="absolute top-10 left-10 xl:left-20 z-10">
          <Link to="/" className="inline-block">
            <span className="font-display text-2xl lg:text-3xl font-bold tracking-tight text-foreground">
              Chetak<span className="text-primary">Plus</span>
            </span>
          </Link>
        </div>
        
        <ScrollReveal>
          <div className="max-w-md relative z-10">
            <h1 className="font-display text-4xl xl:text-5xl font-bold text-foreground leading-tight mb-6">
              Welcome Back to ChetakPlus
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Sign in to access your curated collection of premium stationery and keep your workspace inspired.
            </p>
          </div>
        </ScrollReveal>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
        {/* Mobile Logo */}
        <div className="absolute top-6 left-6 lg:hidden">
          <Link to="/" className="inline-block">
            <span className="font-display text-2xl font-bold tracking-tight text-foreground">
              Chetak<span className="text-primary">Plus</span>
            </span>
          </Link>
        </div>

        <div className="w-full max-w-[420px] bg-card p-8 sm:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-border mt-10 lg:mt-0">
          <ScrollReveal delay={0.1}>
            <div className="mb-8 text-center sm:text-left">
              <h2 className="text-2xl font-bold text-foreground mb-1.5 font-display">Sign in to your account</h2>
              <p className="text-[13px] text-muted-foreground">Welcome back! Please enter your details</p>
            </div>

            <div className="mb-8 flex justify-center">
              <GoogleLogin
                onSuccess={(credentialResponse) => {
                  const userData = loginWithGoogle(credentialResponse.credential);
                  if (userData) {
                    toast.success("Signed in with Google!");
                    navigate(redirectTarget, { replace: true });
                  }
                }}
                onError={() => {
                  toast.error("Google Sign-In failed.");
                }}
                useOneTap
                theme="outline"
                shape="pill"
                size="large"
                width="100%"
              />
            </div>

            <div className="flex items-center gap-4 mb-8">
              <div className="flex-1 border-t border-border"></div>
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest leading-none">OR CONTINUE WITH EMAIL</span>
              <div className="flex-1 border-t border-border"></div>
            </div>

            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5 flex items-center gap-1">Email <span className="text-primary text-[10px]">*</span></label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                    <Mail size={16} strokeWidth={2} />
                  </div>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email address"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary shadow-sm transition-all text-[13px] text-foreground placeholder:text-muted-foreground/50"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-medium text-foreground flex items-center gap-1">Password <span className="text-primary text-[10px]">*</span></label>
                  <Link
                    to={redirectTarget !== "/shop" ? `/forgot-password?redirect=${encodeURIComponent(redirectTarget)}` : "/forgot-password"}
                    size="sm"
                    className="text-[11px] font-bold text-primary hover:underline transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                    <Lock size={16} strokeWidth={2} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary shadow-sm transition-all text-[13px] text-foreground placeholder:text-muted-foreground/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} strokeWidth={2} /> : <Eye size={16} strokeWidth={2} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl font-semibold text-[15px] hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-70 mt-6"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>Sign In <span className="text-[15px] font-medium leading-none ml-1">→</span></>
                )}
              </button>
            </form>

            <div className="text-center mt-10">
              <p className="text-[13px] text-muted-foreground">
                Don't have an account?{" "}
                <Link
                  to={redirectTarget !== "/shop" ? `/signup?redirect=${encodeURIComponent(redirectTarget)}` : "/signup"}
                  className="text-primary font-bold hover:underline"
                >
                  Create Account
                </Link>
              </p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
