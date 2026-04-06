import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency, getOrderById } from "@/data/adminMockData";
import { PageHeader, Panel, StatusBadge } from "@/components/admin/AdminUi";

const timelineTone = {
  done: "bg-emerald-500",
  current: "bg-blue-500",
  pending: "bg-slate-300",
};

const AdminOrderDetail = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const order = useMemo(() => getOrderById(orderId), [orderId]);

  const [status, setStatus] = useState(order?.status || "Pending");

  if (!order) {
    return (
      <Panel className="p-6">
        <p className="text-sm text-slate-500">Order not found.</p>
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

      <div className="grid gap-6 xl:grid-cols-[1.25fr_1fr]">
        <Panel className="space-y-4 p-5 sm:p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Customer Info</p>
              <p className="mt-2 text-sm font-semibold text-slate-800">{order.customerName}</p>
              <p className="text-sm text-slate-600">ID: {order.customerId}</p>
              <p className="text-sm text-slate-600">Payment method: {order.paymentMethod}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Shipping Address</p>
              <p className="mt-2 text-sm text-slate-700">{order.shippingAddress}</p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200">
            <div className="border-b border-slate-200 px-4 py-3">
              <h2 className="text-sm font-semibold text-slate-900">Product List</h2>
            </div>
            <div className="divide-y divide-slate-200">
              {order.items.map((item) => (
                <div key={`${item.name}-${item.price}`} className="flex items-center justify-between px-4 py-3 text-sm">
                  <div>
                    <p className="font-medium text-slate-800">{item.name}</p>
                    <p className="text-xs text-slate-500">Qty {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-slate-800">{formatCurrency(item.price * item.quantity)}</p>
                </div>
              ))}
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
              onChange={(event) => setStatus(event.target.value)}
              className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm"
            >
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
            </select>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
              Payment: <StatusBadge value={order.paymentStatus} />
              <p className="mt-2 font-semibold text-slate-800">Total: {formatCurrency(order.total)}</p>
            </div>
          </Panel>

          <Panel className="space-y-3 p-5">
            <h2 className="text-sm font-semibold text-slate-900">Order Timeline</h2>
            <div className="space-y-3">
              {order.timeline.map((entry) => (
                <div key={entry.label} className="flex items-start gap-3">
                  <span className={`mt-1 h-2.5 w-2.5 rounded-full ${timelineTone[entry.state]}`} />
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
