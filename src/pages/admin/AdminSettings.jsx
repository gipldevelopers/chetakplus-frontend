import { useState } from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader, Panel } from "@/components/admin/AdminUi";

const AdminSettings = () => {
  const [storeName, setStoreName] = useState("Chetak Plus");
  const [supportEmail, setSupportEmail] = useState("support@chetakplus.com");
  const [invoicePrefix, setInvoicePrefix] = useState("CP");
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [brandBio, setBrandBio] = useState(
    "Premium stationery and office essentials for modern teams and creators.",
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Control business profile, notifications, and operational defaults." />

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

          <Button className="w-full rounded-xl bg-slate-900 text-white hover:bg-slate-800">
            <Save className="mr-2 h-4 w-4" />
            Save Settings
          </Button>
        </Panel>
      </div>
    </div>
  );
};

export default AdminSettings;
