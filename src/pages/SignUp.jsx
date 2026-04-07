import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Eye, EyeOff, Mail, Lock, User, Phone } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { useAuth } from "@/context/AuthContext";
import api from "@/api";
import { GoogleLogin } from "@react-oauth/google";

const SignUp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginWithGoogle } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const redirectTarget = (() => {
    const fromQuery = new URLSearchParams(location.search).get("redirect") || "";
    if (fromQuery.startsWith("/")) return fromQuery;
    return "/shop";
  })();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const email = formData.email.trim().toLowerCase();
    const phone = formData.phone.trim();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.authSignUp({
        name: formData.name,
        email,
        phone,
        password: formData.password,
      });

      login(response.user);

      toast.success(response.message || "Account created successfully!");
      navigate(redirectTarget, { replace: true });
    } catch (error) {
      console.error("Sign up error:", error);

      if (error?.status === 409) {
        toast.error(error?.message || "Email or phone already exists.");
      } else if (error?.status === 422) {
        toast.error(error?.message || "Please enter valid signup details.");
      } else {
        toast.error(error?.message || "Failed to create account. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-background">
      {/* Left Panel */}
      <div className="hidden lg:flex w-full lg:w-1/2 bg-secondary flex-col justify-center px-10 xl:px-20 relative overflow-hidden text-center items-center">
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
          <div className="max-w-md relative z-10 flex flex-col items-center">
            <h1 className="font-display text-4xl xl:text-5xl font-bold text-foreground leading-tight mb-6">
              Join ChetakPlus Today
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-sm">
              Create an account to gain access to exclusive premium stationery and a seamless workspace experience.
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
              <h2 className="text-2xl font-bold text-foreground mb-1.5 font-display">Create your account</h2>
              <p className="text-[13px] text-muted-foreground">Sign up to get started</p>
            </div>

            <div className="mb-8 flex justify-center">
              <GoogleLogin
                onSuccess={(credentialResponse) => {
                  const userData = loginWithGoogle(credentialResponse.credential);
                  if (userData) {
                    toast.success("Account created with Google!");
                    navigate(redirectTarget, { replace: true });
                  }
                }}
                onError={() => {
                  toast.error("Google Registration failed.");
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
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest leading-none">OR REGISTER WITH EMAIL</span>
              <div className="flex-1 border-t border-border"></div>
            </div>

            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5 flex items-center gap-1">Full Name <span className="text-primary text-[10px]">*</span></label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                    <User size={16} strokeWidth={2} />
                  </div>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary shadow-sm transition-all text-[13px] text-foreground placeholder:text-muted-foreground/50"
                  />
                </div>
              </div>

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
                <label className="block text-sm font-medium text-foreground mb-1.5 flex items-center gap-1">Phone <span className="text-primary text-[10px]">*</span></label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                    <Phone size={16} strokeWidth={2} />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    required
                    pattern="[0-9]{10,15}"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="10 digit phone number"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary shadow-sm transition-all text-[13px] text-foreground placeholder:text-muted-foreground/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5 flex items-center gap-1">Password <span className="text-primary text-[10px]">*</span></label>
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
                    placeholder="Create a password"
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

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5 flex items-center gap-1">Confirm Password <span className="text-primary text-[10px]">*</span></label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                    <Lock size={16} strokeWidth={2} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary shadow-sm transition-all text-[13px] text-foreground placeholder:text-muted-foreground/50"
                  />
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
                  <>Sign Up <span className="text-[15px] font-medium leading-none ml-1">→</span></>
                )}
              </button>
            </form>

            <div className="text-center mt-10">
              <p className="text-[13px] text-muted-foreground">
                Already have an account?{" "}
                <Link
                  to={redirectTarget !== "/shop" ? `/signin?redirect=${encodeURIComponent(redirectTarget)}` : "/signin"}
                  className="text-primary font-bold hover:underline"
                >
                  Sign in
                </Link>
                {" "}•{" "}
                <Link to="/privacy-policy" className="text-muted-foreground hover:text-foreground hover:underline transition-colors">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
