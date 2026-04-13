import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader, Panel, StatLabel, StatusBadge } from "@/components/admin/AdminUi";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import api from "@/api";

const formatCurrency = (value) => `Rs ${Number(value || 0).toLocaleString("en-IN")}`;

const AdminCustomerDetail = () => {
  const navigate = useNavigate();
  const { customerId } = useParams();

  const [customer, setCustomer] = useState(null);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadCustomer = async () => {
      try {
        const data = await api.adminGetCustomerById(customerId);
        if (!isMounted) return;
        setCustomer(data || null);
        setNotes(data?.notes || "");
        setError("");
      } catch (fetchError) {
        if (!isMounted) return;
        setError(fetchError?.message || "Unable to load customer details.");
        setCustomer(null);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadCustomer();
    return () => {
      isMounted = false;
    };
  }, [customerId]);

  const customerOrders = useMemo(() => customer?.orders || [], [customer]);

  const saveNotes = async () => {
    if (!customer) return;

    setSaving(true);
    setError("");

    try {
      const updated = await api.adminUpdateCustomer(customer.id, { notes });
      setCustomer(updated);
      setNotes(updated?.notes || "");
    } catch (saveError) {
      setError(saveError?.message || "Unable to save customer notes.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Panel className="p-6">
        <p className="text-sm text-slate-500">Loading customer details...</p>
      </Panel>
    );
  }

  if (!customer) {
    return (
      <Panel className="p-6">
        <p className="text-sm text-slate-500">{error || "Customer not found."}</p>
      </Panel>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={customer.name}
        description="Customer profile, order history, spending data, and internal notes."
        actions={
          <Button variant="outline" className="rounded-xl" onClick={() => navigate("/admin/customers")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Customers
          </Button>
        }
      />

      {error ? (
        <Panel className="border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </Panel>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
        <Panel className="space-y-4 p-5 sm:p-6">
          <div className="grid gap-3 sm:grid-cols-2">
            <StatLabel label="Email" value={customer.email || "-"} />
            <StatLabel label="Phone" value={customer.phone || "-"} />
            <StatLabel label="Joined" value={customer.joinedAt || "-"} />
            <StatLabel label="Address" value={customer.address || "-"} />
          </div>

          <div className="rounded-xl border border-slate-200">
            <div className="border-b border-slate-200 px-4 py-3">
              <h2 className="text-sm font-semibold text-slate-900">Order History</h2>
            </div>
            <div className="overflow-x-auto">
              <Table className="admin-table min-w-[620px]">
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customerOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-semibold text-slate-800">{order.id}</TableCell>
                      <TableCell>{order.date}</TableCell>
                      <TableCell>{formatCurrency(order.total)}</TableCell>
                      <TableCell>
                        <StatusBadge value={order.status} />
                      </TableCell>
                    </TableRow>
                  ))}
                  {!customerOrders.length ? (
                    <TableRow>
                      <TableCell colSpan={4} className="py-6 text-center text-sm text-slate-500">
                        No orders found for this customer.
                      </TableCell>
                    </TableRow>
                  ) : null}
                </TableBody>
              </Table>
            </div>
          </div>
        </Panel>

        <div className="space-y-4">
          <Panel className="space-y-3 p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-900">Account Summary</p>
              <StatusBadge value={customer.status || "Inactive"} />
            </div>
            <StatLabel label="Total Orders" value={String(customer.totalOrders ?? 0)} />
            <StatLabel label="Total Spending" value={formatCurrency(customer.totalSpending || 0)} />
          </Panel>

          <Panel className="space-y-3 p-5">
            <h2 className="text-sm font-semibold text-slate-900">Notes</h2>
            <Textarea
              rows={7}
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Add internal notes about this customer"
              className="rounded-xl"
            />
            <Button
              onClick={saveNotes}
              disabled={saving}
              className="w-full rounded-xl bg-slate-900 text-white hover:bg-slate-800"
            >
              {saving ? "Saving..." : "Save Notes"}
            </Button>
          </Panel>
        </div>
      </div>
    </div>
  );
};

export default AdminCustomerDetail;
