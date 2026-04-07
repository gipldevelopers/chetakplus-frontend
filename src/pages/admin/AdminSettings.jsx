import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader, Panel } from "@/components/admin/AdminUi";
import api from "@/api";

const AdminSettings = () => {
  const [storeName, setStoreName] = useState("Chetak Plus");
  const [supportEmail, setSupportEmail] = useState("support@chetakplus.com");
  const [invoicePrefix, setInvoicePrefix] = useState("CP");
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [brandBio, setBrandBio] = useState(
    "Premium stationery and office essentials for modern teams and creators.",
  );
  const [upiId, setUpiId] = useState("");
  const [upiQrImageUrl, setUpiQrImageUrl] = useState("");
  const [enableUpi, setEnableUpi] = useState(true);
  const [enableCod, setEnableCod] = useState(true);
  const [defaultCodPaymentStatus, setDefaultCodPaymentStatus] = useState("pending");
  const [defaultCodOrderStatus, setDefaultCodOrderStatus] = useState("placed");
  const [codVerificationRequired, setCodVerificationRequired] = useState(true);
  const [requireUpiReference, setRequireUpiReference] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadSettings = async () => {
      try {
        const data = await api.adminGetSettings();
        if (!isMounted) return;

        setStoreName(data?.storeName || "Chetak Plus");
        setSupportEmail(data?.supportEmail || "");
        setInvoicePrefix(data?.invoicePrefix || "CP");
        setMaintenanceMode(Boolean(data?.maintenanceMode));
        setEmailNotifications(data?.emailNotifications !== false);
        setBrandBio(data?.brandBio || "");
        setUpiId(data?.upiId || "");
        setUpiQrImageUrl(data?.upiQrImageUrl || "");
        setEnableUpi(data?.enableUpi !== false);
        setEnableCod(data?.enableCod !== false);
        setDefaultCodPaymentStatus(data?.defaultCodPaymentStatus || "pending");
        setDefaultCodOrderStatus(data?.defaultCodOrderStatus || "placed");
        setCodVerificationRequired(data?.codVerificationRequired !== false);
        setRequireUpiReference(Boolean(data?.requireUpiReference));
        setError("");
      } catch (fetchError) {
        if (!isMounted) return;
        setError(fetchError?.message || "Unable to load settings.");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadSettings();
    return () => {
      isMounted = false;
    };
  }, []);

  const saveSettings = async () => {
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const payload = {
        storeName,
        supportEmail,
        invoicePrefix,
        maintenanceMode,
        emailNotifications,
        brandBio,
        upiId,
        upiQrImageUrl,
        enableUpi,
        enableCod,
        defaultCodPaymentStatus,
        defaultCodOrderStatus,
        codVerificationRequired,
        requireUpiReference,
      };

      const updated = await api.adminUpdateSettings(payload);

      setStoreName(updated?.storeName || storeName);
      setSupportEmail(updated?.supportEmail || supportEmail);
      setInvoicePrefix(updated?.invoicePrefix || invoicePrefix);
      setMaintenanceMode(Boolean(updated?.maintenanceMode));
      setEmailNotifications(updated?.emailNotifications !== false);
      setBrandBio(updated?.brandBio || brandBio);
      setUpiId(updated?.upiId || "");
      setUpiQrImageUrl(updated?.upiQrImageUrl || "");
      setEnableUpi(updated?.enableUpi !== false);
      setEnableCod(updated?.enableCod !== false);
      setDefaultCodPaymentStatus(updated?.defaultCodPaymentStatus || "pending");
      setDefaultCodOrderStatus(updated?.defaultCodOrderStatus || "placed");
      setCodVerificationRequired(updated?.codVerificationRequired !== false);
      setRequireUpiReference(Boolean(updated?.requireUpiReference));
      setMessage("Settings saved successfully.");
    } catch (saveError) {
      setError(saveError?.message || "Unable to save settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Panel className="p-6">
        <p className="text-sm text-slate-500">Loading settings...</p>
      </Panel>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Control business profile, notifications, and operational defaults." />

      {error ? (
        <Panel className="border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </Panel>
      ) : null}

      {message ? (
        <Panel className="border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
          {message}
        </Panel>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel className="space-y-4 p-5 sm:p-6">
          <h2 className="text-base font-semibold text-slate-900">Store Profile</h2>
          <div className="space-y-2">
            <Label htmlFor="store-name">Store Name</Label>
            <Input id="store-name" value={storeName} onChange={(event) => setStoreName(event.target.value)} className="rounded-xl" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="support-email">Support Email</Label>
            <Input
              id="support-email"
              value={supportEmail}
              onChange={(event) => setSupportEmail(event.target.value)}
              className="rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="brand-bio">Brand Description</Label>
            <Textarea
              id="brand-bio"
              rows={5}
              value={brandBio}
              onChange={(event) => setBrandBio(event.target.value)}
              className="rounded-xl"
            />
          </div>
        </Panel>

        <Panel className="space-y-4 p-5 sm:p-6">
          <h2 className="text-base font-semibold text-slate-900">Operations</h2>
          <div className="space-y-2">
            <Label htmlFor="invoice-prefix">Invoice Prefix</Label>
            <Input
              id="invoice-prefix"
              value={invoicePrefix}
              onChange={(event) => setInvoicePrefix(event.target.value)}
              className="rounded-xl"
            />
          </div>

          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
            <div>
              <p className="text-sm font-medium text-slate-800">Maintenance Mode</p>
              <p className="text-xs text-slate-500">Temporarily disable storefront checkout.</p>
            </div>
            <Switch checked={maintenanceMode} onCheckedChange={setMaintenanceMode} />
          </div>

          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
            <div>
              <p className="text-sm font-medium text-slate-800">Email Notifications</p>
              <p className="text-xs text-slate-500">Get alerts for new orders and contact forms.</p>
            </div>
            <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="upi-id">UPI ID</Label>
            <Input id="upi-id" value={upiId} onChange={(event) => setUpiId(event.target.value)} className="rounded-xl" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="upi-qr">UPI QR Image URL (optional)</Label>
            <Input id="upi-qr" value={upiQrImageUrl} onChange={(event) => setUpiQrImageUrl(event.target.value)} className="rounded-xl" />
          </div>

          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
            <div>
              <p className="text-sm font-medium text-slate-800">Enable UPI</p>
              <p className="text-xs text-slate-500">Allow prepaid UPI checkout.</p>
            </div>
            <Switch checked={enableUpi} onCheckedChange={setEnableUpi} />
          </div>

          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
            <div>
              <p className="text-sm font-medium text-slate-800">Enable COD</p>
              <p className="text-xs text-slate-500">Allow cash on delivery checkout.</p>
            </div>
            <Switch checked={enableCod} onCheckedChange={setEnableCod} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cod-payment-default">Default COD Payment Status</Label>
            <select
              id="cod-payment-default"
              value={defaultCodPaymentStatus}
              onChange={(event) => setDefaultCodPaymentStatus(event.target.value)}
              className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm"
            >
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cod-order-default">Default COD Order Status</Label>
            <select
              id="cod-order-default"
              value={defaultCodOrderStatus}
              onChange={(event) => setDefaultCodOrderStatus(event.target.value)}
              className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm"
            >
              <option value="placed">Placed</option>
              <option value="confirmed">Confirmed</option>
            </select>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
            <div>
              <p className="text-sm font-medium text-slate-800">COD Verification Toggle</p>
              <p className="text-xs text-slate-500">Require delivery code scan/verification for COD.</p>
            </div>
            <Switch checked={codVerificationRequired} onCheckedChange={setCodVerificationRequired} />
          </div>

          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
            <div>
              <p className="text-sm font-medium text-slate-800">Require UPI Transaction Ref</p>
              <p className="text-xs text-slate-500">Ask users to enter UPI transaction reference.</p>
            </div>
            <Switch checked={requireUpiReference} onCheckedChange={setRequireUpiReference} />
          </div>

          <Button onClick={saveSettings} disabled={saving} className="w-full rounded-xl bg-slate-900 text-white hover:bg-slate-800">
            <Save className="mr-2 h-4 w-4" />
            {saving ? "Saving..." : "Save Settings"}
          </Button>
        </Panel>
      </div>
    </div>
  );
};

export default AdminSettings;
