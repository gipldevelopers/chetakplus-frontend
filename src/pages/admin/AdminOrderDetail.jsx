import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader, Panel, StatusBadge } from "@/components/admin/AdminUi";
import api from "@/api";

const formatCurrency = (value) => `Rs ${Number(value || 0).toLocaleString("en-IN")}`;

const timelineTone = {
  done: "bg-emerald-500",
  current: "bg-blue-500",
  pending: "bg-slate-300",
  cancelled: "bg-rose-500",
};

const AdminOrderDetail = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();

  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState("Pending");
  const [paymentStatus, setPaymentStatus] = useState("Pending");
  const [verifyCode, setVerifyCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadOrder = async () => {
      try {
        const data = await api.adminGetOrderById(orderId);
        if (!isMounted) return;
        setOrder(data || null);
        setStatus(data?.status || "Pending");
        setPaymentStatus(data?.paymentStatus || "Pending");
        setError("");
      } catch (fetchError) {
        if (!isMounted) return;
        setError(fetchError?.message || "Unable to load order details.");
        setOrder(null);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadOrder();
    return () => {
      isMounted = false;
    };
  }, [orderId]);

  const handleStatusChange = async (nextStatus) => {
    setStatus(nextStatus);
    setSaving(true);
    setError("");

    try {
      const updated = await api.adminUpdateOrder(orderId, { status: nextStatus });
      setOrder(updated);
      setStatus(updated?.status || nextStatus);
      setPaymentStatus(updated?.paymentStatus || paymentStatus);
    } catch (saveError) {
      setError(saveError?.message || "Unable to update order status.");
      setStatus(order?.status || "Pending");
    } finally {
      setSaving(false);
    }
  };

  const handlePaymentStatusChange = async (nextPaymentStatus) => {
    setPaymentStatus(nextPaymentStatus);
    setSaving(true);
    setError("");

    try {
      const updated = await api.adminUpdateOrder(orderId, { paymentStatus: nextPaymentStatus });
      setOrder(updated);
      setStatus(updated?.status || status);
      setPaymentStatus(updated?.paymentStatus || nextPaymentStatus);
    } catch (saveError) {
      setError(saveError?.message || "Unable to update payment status.");
      setPaymentStatus(order?.paymentStatus || "Pending");
    } finally {
      setSaving(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verifyCode.trim()) {
      setError("Enter verification code first.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const updated = await api.adminUpdateOrder(orderId, { verifyCode: verifyCode.trim() });
      setOrder(updated);
      setStatus(updated?.status || status);
      setPaymentStatus(updated?.paymentStatus || paymentStatus);
      setVerifyCode("");
    } catch (verifyError) {
      setError(verifyError?.message || "Verification failed.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Panel className="p-6">
        <p className="text-sm text-slate-500">Loading order details...</p>
      </Panel>
    );
  }

  if (!order) {
    return (
      <Panel className="p-6">
        <p className="text-sm text-slate-500">{error || "Order not found."}</p>
      </Panel>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Order ${order.id}`}
        description="Track lifecycle events, customer details, item summary, and status updates."
        actions={
          <Button variant="outline" className="rounded-xl" onClick={() => navigate("/admin/orders")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </Button>
        }
      />

      {error ? (
        <Panel className="border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </Panel>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1.25fr_1fr]">
        <Panel className="space-y-4 p-5 sm:p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Customer Info</p>
              <p className="mt-2 text-sm font-semibold text-slate-800">{order.customerName}</p>
              <p className="text-sm text-slate-600">ID: {order.customerId || "-"}</p>
              <p className="text-sm text-slate-600">Payment method: {order.paymentMethod}</p>
              {order.paymentMethod?.toLowerCase() === "upi" ? (
                <p className="text-sm text-slate-600">UPI ref: {order.upiTransactionRef || "-"}</p>
              ) : null}
              {order.codVerificationCode ? <p className="text-sm text-slate-600">COD code: {order.codVerificationCode}</p> : null}
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Shipping Address</p>
              <p className="mt-2 text-sm text-slate-700">{order.shippingAddress || "-"}</p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200">
            <div className="border-b border-slate-200 px-4 py-3">
              <h2 className="text-sm font-semibold text-slate-900">Product List</h2>
            </div>
            <div className="divide-y divide-slate-200">
              {(order.items || []).map((item) => (
                <div key={`${item.name}-${item.price}`} className="flex items-center justify-between px-4 py-3 text-sm">
                  <div>
                    <p className="font-medium text-slate-800">{item.name}</p>
                    <p className="text-xs text-slate-500">Qty {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-slate-800">{formatCurrency(item.price * item.quantity)}</p>
                </div>
              ))}
              {!order.items?.length ? (
                <div className="px-4 py-6 text-sm text-slate-500">No items found for this order.</div>
              ) : null}
            </div>
          </div>
        </Panel>

        <div className="space-y-4">
          <Panel className="space-y-3 p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-900">Order Status</p>
              <StatusBadge value={status} />
            </div>
            <select
              value={status}
              onChange={(event) => void handleStatusChange(event.target.value)}
              className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm"
              disabled={saving}
            >
              <option value="Placed">Placed</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <select
              value={paymentStatus}
              onChange={(event) => void handlePaymentStatusChange(event.target.value)}
              className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm"
              disabled={saving}
            >
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
              <option value="Failed">Failed</option>
              <option value="Refunded">Refunded</option>
            </select>
            {order.paymentMethod?.toLowerCase() === "cash on delivery" && order.codVerificationCode ? (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700 space-y-2">
                <p className="font-semibold">COD Verification Code: {order.codVerificationCode}</p>
                <div className="flex gap-2">
                  <input
                    value={verifyCode}
                    onChange={(event) => setVerifyCode(event.target.value)}
                    placeholder="Scan / enter code"
                    className="h-9 flex-1 rounded-lg border border-slate-200 bg-white px-2 text-sm"
                  />
                  <button onClick={handleVerifyCode} type="button" className="px-3 rounded-lg bg-slate-900 text-white text-xs font-semibold">
                    Verify
                  </button>
                </div>
              </div>
            ) : null}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
              Payment: <StatusBadge value={order.paymentStatus} />
              {saving ? <p className="mt-2 text-xs text-slate-500">Updating status...</p> : null}
              <p className="mt-2 font-semibold text-slate-800">Total: {formatCurrency(order.total)}</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => void handleStatusChange("Confirmed")}
                className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold hover:bg-slate-50"
              >
                Confirm Order
              </button>
              <button
                type="button"
                onClick={() => void handlePaymentStatusChange("Paid")}
                className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold hover:bg-slate-50"
              >
                Mark Paid
              </button>
            </div>
          </Panel>

          <Panel className="space-y-3 p-5">
            <h2 className="text-sm font-semibold text-slate-900">Order Timeline</h2>
            <div className="space-y-3">
              {(order.timeline || []).map((entry) => (
                <div key={entry.label} className="flex items-start gap-3">
                  <span className={`mt-1 h-2.5 w-2.5 rounded-full ${timelineTone[entry.state] || "bg-slate-300"}`} />
                  <div>
                    <p className="text-sm font-medium text-slate-800">{entry.label}</p>
                    <p className="text-xs text-slate-500">{entry.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetail;
