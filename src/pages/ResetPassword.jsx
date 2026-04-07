import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Eye, EyeOff, Lock, ArrowLeft } from "lucide-react";
import api from "@/api";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const email = useMemo(() => (searchParams.get("email") || "").trim().toLowerCase(), [searchParams]);
  const token = useMemo(() => (searchParams.get("token") || "").trim(), [searchParams]);
  const hasValidParams = email !== "" && token !== "";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!hasValidParams) {
      toast.error("Invalid or expired reset link.");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.authResetPassword({ email, token, password });
      toast.success(response.message || "Password reset successful.");
      navigate("/signin", { replace: true });
    } catch (error) {
      toast.error(error?.message || "Unable to reset password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary/30 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-card border border-border rounded-2xl p-7 shadow-sm">
        <h1 className="text-2xl font-bold font-display text-foreground mb-2">Reset Password</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Create a new password for your account.
        </p>

        {!hasValidParams ? (
          <div className="rounded-xl border border-red-200 bg-red-50 text-red-700 p-4 text-sm">
            This reset link is invalid or missing details.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">New Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                  <Lock size={16} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Confirm Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                  <Lock size={16} />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm"
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-semibold hover:opacity-90 transition-all disabled:opacity-70"
            >
              {isLoading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}

        <div className="mt-6">
          <Link to="/signin" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft size={14} /> Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;

