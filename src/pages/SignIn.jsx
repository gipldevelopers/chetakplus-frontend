import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";

const SignIn = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignIn = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Signed in successfully!");
      navigate("/shop");
    }, 1500);
  };

  const handleGoogleSignIn = () => {
    setIsLoading(true);
    // Simulate Google Sign-in
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Signed in with Google!");
      navigate("/shop");
    }, 1500);
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
              Welcome back to ChetakPlus
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-sm">
              Your journey to organized brilliance starts here. Premium quality stationery for your everyday workspace.
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
              <p className="text-[13px] text-muted-foreground">Enter your credentials to continue your journey</p>
            </div>

            <div className="mb-8">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full flex items-center justify-center py-3 px-4 border border-border rounded-xl hover:bg-secondary transition-colors disabled:opacity-50 shadow-sm text-sm font-medium gap-3 bg-background group"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="18px" height="18px" className="group-hover:scale-110 transition-transform">
                  <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.238-2.65-.611-3.917z" />
                  <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
                  <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
                  <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571.001-.001.002-.001.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.238-2.65-.611-3.917z" />
                </svg>
                Sign in with Google
              </button>
            </div>

            <div className="flex items-center gap-4 mb-8">
              <div className="flex-1 border-t border-border"></div>
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest leading-none">OR CONTINUE WITH EMAIL</span>
              <div className="flex-1 border-t border-border"></div>
            </div>

            <form onSubmit={handleSignIn} className="space-y-5">
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

              <div className="flex items-center justify-between pt-1 pb-4">
                <Link to="#" className="text-[13px] font-medium text-primary flex items-center gap-1.5 hover:underline transition-all hover:text-primary/80">
                  <Mail size={14} /> Login without password
                </Link>
                <Link to="/forgot-password" className="text-[13px] font-medium text-primary hover:underline transition-all hover:text-primary/80">Forgot password?</Link>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl font-semibold text-[15px] hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-70"
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
                <Link to="/signup" className="text-primary font-bold hover:underline">
                  Sign up
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

export default SignIn;
