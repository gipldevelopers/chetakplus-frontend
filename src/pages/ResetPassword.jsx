import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Eye, EyeOff, Lock, ArrowLeft } from "lucide-react";
import api from "@/api";

const padTwo = (value) => String(value).padStart(2, "0");

const getPasswordStrength = (password) => {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 2) return { label: "Weak", color: "bg-rose-500", width: "w-1/3" };
  if (score <= 4) return { label: "Medium", color: "bg-amber-500", width: "w-2/3" };
  return { label: "Strong", color: "bg-emerald-500", width: "w-full" };
};

const formatCountdown = (seconds) => {
  const safe = Math.max(0, Number(seconds || 0));
  const minutes = Math.floor(safe / 60);
  const secs = safe % 60;
  return `${padTwo(minutes)}:${padTwo(secs)}`;
};

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [isLinkValid, setIsLinkValid] = useState(false);
  const [linkMessage, setLinkMessage] = useState("");
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [passwordPolicy, setPasswordPolicy] = useState({
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireDigit: true,
    requireSpecial: false,
  });
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const email = useMemo(() => (searchParams.get("email") || "").trim().toLowerCase(), [searchParams]);
  const token = useMemo(() => (searchParams.get("token") || "").trim(), [searchParams]);
  const hasValidParams = email !== "" && token !== "";

  useEffect(() => {
    if (!hasValidParams) {
      setVerifying(false);
      setIsLinkValid(false);
      setLinkMessage("This reset link is invalid or missing required details.");
      return;
    }

    let mounted = true;
    const verifyLink = async () => {
      try {
        const response = await api.authVerifyResetToken({ email, token });
        if (!mounted) return;
        setIsLinkValid(Boolean(response?.valid));
        setRemainingSeconds(Math.max(0, Number(response?.remainingSeconds || 0)));
        if (response?.passwordPolicy) {
          setPasswordPolicy(response.passwordPolicy);
        }
        setLinkMessage("Link verified. Please set your new password.");
      } catch (error) {
        if (!mounted) return;
        setIsLinkValid(false);
        setLinkMessage(error?.message || "Link expired or invalid.");
      } finally {
        if (mounted) setVerifying(false);
      }
    };

    verifyLink();
    return () => {
      mounted = false;
    };
  }, [email, token, hasValidParams]);

  useEffect(() => {
    if (!isLinkValid || remainingSeconds <= 0) return undefined;

    const timer = setInterval(() => {
      setRemainingSeconds((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [isLinkValid, remainingSeconds]);

  useEffect(() => {
    if (isLinkValid && remainingSeconds === 0 && !verifying) {
      setIsLinkValid(false);
      setLinkMessage("Link expired or invalid.");
    }
  }, [isLinkValid, remainingSeconds, verifying]);

  const strength = getPasswordStrength(password);

  const requirements = [
    {
      active: password.length >= Number(passwordPolicy.minLength || 6),
      label: `At least ${Number(passwordPolicy.minLength || 6)} characters`,
    },
    {
      active: !passwordPolicy.requireUppercase || /[A-Z]/.test(password),
      label: "One uppercase letter",
      hidden: !passwordPolicy.requireUppercase,
    },
    {
      active: !passwordPolicy.requireLowercase || /[a-z]/.test(password),
      label: "One lowercase letter",
      hidden: !passwordPolicy.requireLowercase,
    },
    {
      active: !passwordPolicy.requireDigit || /\d/.test(password),
      label: "One number",
      hidden: !passwordPolicy.requireDigit,
    },
    {
      active: !passwordPolicy.requireSpecial || /[^A-Za-z0-9]/.test(password),
      label: "One special character",
      hidden: !passwordPolicy.requireSpecial,
    },
  ].filter((item) => !item.hidden);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLinkValid) {
      toast.error("Link expired or invalid.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    const unmet = requirements.filter((item) => !item.active);
    if (unmet.length > 0) {
      toast.error(unmet[0].label);
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.authResetPassword({ email, token, password });
      toast.success(response.message || "Password reset successful.");
      navigate("/signin?reset=success", { replace: true });
    } catch (error) {
      if (error?.status === 429) {
        const retryAfterSeconds = Math.max(
          1,
          Number(
            error?.body?.meta?.retryAfterSeconds
              || (Number(error?.body?.meta?.retryAfterMinutes || 1) * 60),
          ),
        );
        const retryAfterMinutes = Math.max(1, Math.ceil(retryAfterSeconds / 60));
        const retryLabel = retryAfterSeconds < 60
          ? `${retryAfterSeconds} second${retryAfterSeconds === 1 ? "" : "s"}`
          : `${retryAfterMinutes} minute${retryAfterMinutes === 1 ? "" : "s"}`;
        toast.error(`Too many reset attempts. Please try again in ${retryLabel}.`);
      } else {
        toast.error(error?.message || "Unable to reset password.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary/30 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-card border border-border rounded-2xl p-7 shadow-sm">
        <h1 className="text-2xl font-bold font-display text-foreground mb-2">Reset Password</h1>
        <p className="text-sm text-muted-foreground mb-6">Create a new password for your account.</p>

        {verifying ? (
          <div className="rounded-xl border border-border bg-secondary/30 text-slate-700 p-4 text-sm">Verifying reset link...</div>
        ) : !isLinkValid ? (
          <div className="space-y-4">
            <div className="rounded-xl border border-red-200 bg-red-50 text-red-700 p-4 text-sm">{linkMessage || "Link expired or invalid."}</div>
            <Link to="/forgot-password" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
              Request a new reset link
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="rounded-xl border border-amber-200 bg-amber-50 text-amber-700 p-3 text-xs">
              Link expires in <span className="font-bold">{formatCountdown(remainingSeconds)}</span>
            </div>

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

            <div className="space-y-2">
              <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
                <div className={`h-2 ${strength.color} ${strength.width} transition-all`} />
              </div>
              <p className="text-xs text-muted-foreground">Strength: <span className="font-semibold">{strength.label}</span></p>
            </div>

            <div className="rounded-xl border border-border bg-secondary/20 p-3 text-xs text-slate-600 space-y-1">
              {requirements.map((item) => (
                <p key={item.label} className={item.active ? "text-emerald-700" : "text-slate-500"}>
                  {item.active ? "✓" : "•"} {item.label}
                </p>
              ))}
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
