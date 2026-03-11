import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Mail, ArrowLeft } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate sending password reset email
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      toast.success("Password reset instructions sent to your email!");
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
              Reset Your Password
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-sm">
              Don't worry, it happens to the best of us. Let's get you back to your premium stationery workspace.
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
            {!isSubmitted ? (
              <>
                <div className="mb-8 text-center sm:text-left">
                  <h2 className="text-2xl font-bold text-foreground mb-1.5 font-display">Forgot password?</h2>
                  <p className="text-[13px] text-muted-foreground">Enter the email address associated with your account and we'll send you a link to reset your password.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5 flex items-center gap-1">Email Address <span className="text-primary text-[10px]">*</span></label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                        <Mail size={16} strokeWidth={2} />
                      </div>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary shadow-sm transition-all text-[13px] text-foreground placeholder:text-muted-foreground/50"
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
                      <>Send Reset Link <span className="text-[15px] font-medium leading-none ml-1">→</span></>
                    )}
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                  <Mail size={32} />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-3 font-display">Check your email</h2>
                <p className="text-[13px] text-muted-foreground mb-8">
                  We've sent password reset instructions to <br/><span className="font-medium text-foreground">{email}</span>
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Didn't receive the email? Try again.
                </button>
              </div>
            )}

            <div className="text-center mt-10">
              <Link to="/signin" className="inline-flex items-center gap-2 text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors group">
                <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Sign In
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
