import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isAdminAuthenticated, setAdminSession } from "@/lib/adminAuth";
import api from "@/api";

const defaultForm = {
  email: "",
  password: "",
};

const AdminLogin = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formValues, setFormValues] = useState(defaultForm);
  const [errors, setErrors] = useState({});
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    if (isAdminAuthenticated()) {
      navigate("/admin", { replace: true });
    }
  }, [navigate]);

  const validate = () => {
    const nextErrors = {};

    if (!formValues.email.trim()) {
      nextErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formValues.email)) {
      nextErrors.email = "Enter a valid email address";
    }

    if (!formValues.password.trim()) {
      nextErrors.password = "Password is required";
    } else if (formValues.password.length < 6) {
      nextErrors.password = "Password must have at least 6 characters";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setAuthError("");

    if (!validate()) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.adminLogin({
        email: formValues.email,
        password: formValues.password,
      });

      setAdminSession({
        token: response?.token,
        admin: response?.admin,
      });

      navigate("/admin", { replace: true });
    } catch (error) {
      setAuthError(error?.message || "Unable to sign in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-panel relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-100 px-4 py-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(30,64,175,0.15),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(14,116,144,0.14),transparent_40%)]" />

      <div className="relative w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-[0_24px_55px_rgba(15,23,42,0.14)] sm:p-10">
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex h-16 w-auto items-center justify-center">
              <img src="/logo.jpg" alt="Chetak Plus" className="h-full w-auto object-contain rounded-xl" />
            </div>
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Admin Portal</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">Sign in</h1>
          <p className="mt-2 text-sm text-slate-500">Access dashboard controls, content operations, and commerce analytics.</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit} noValidate>
          <div className="space-y-2">
            <Label htmlFor="admin-email" className="text-sm font-medium text-slate-700">
              Email
            </Label>
            <Input
              id="admin-email"
              name="email"
              type="email"
              autoComplete="email"
              value={formValues.email}
              onChange={(event) => {
                setFormValues((prev) => ({ ...prev, email: event.target.value }));
                setErrors((prev) => ({ ...prev, email: "" }));
              }}
              placeholder="admin@chetakplus.com"
              className="h-11 rounded-xl border-slate-200 bg-slate-50"
            />
            {errors.email ? <p className="text-xs text-rose-600">{errors.email}</p> : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="admin-password" className="text-sm font-medium text-slate-700">
              Password
            </Label>
            <div className="relative">
              <Input
                id="admin-password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={formValues.password}
                onChange={(event) => {
                  setFormValues((prev) => ({ ...prev, password: event.target.value }));
                  setErrors((prev) => ({ ...prev, password: "" }));
                }}
                placeholder="Enter your password"
                className="h-11 rounded-xl border-slate-200 bg-slate-50 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password ? <p className="text-xs text-rose-600">{errors.password}</p> : null}
          </div>

          {authError ? (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">{authError}</div>
          ) : null}

          <Button type="submit" disabled={isLoading} className="h-11 w-full rounded-xl bg-slate-900 text-white hover:bg-slate-800">
            {isLoading ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Signing in...
              </span>
            ) : (
              "Continue to Admin"
            )}
          </Button>
        </form>

      </div>
    </div>
  );
};

export default AdminLogin;
