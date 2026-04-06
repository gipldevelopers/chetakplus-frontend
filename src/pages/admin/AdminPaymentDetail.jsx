import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency, getPaymentById } from "@/data/adminMockData";
import { PageHeader, Panel, StatLabel, StatusBadge } from "@/components/admin/AdminUi";

const AdminPaymentDetail = () => {
  const navigate = useNavigate();
  const { paymentId } = useParams();
  const payment = useMemo(() => getPaymentById(paymentId), [paymentId]);

  if (!payment) {
    return (
      <Panel className="p-6">
        <p className="text-sm text-slate-500">Payment record not found.</p>
      </Panel>
    );
  }

  const totalBreakdown = payment.breakdown.subtotal + payment.breakdown.shipping + payment.breakdown.tax;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payment Details"
        description="Complete transaction breakdown and settlement context for finance review."
        actions={
          <Button variant="outline" className="rounded-xl" onClick={() => navigate("/admin/payments")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Payments
          </Button>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
        <Panel className="space-y-4 p-5 sm:p-6">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Transaction</p>
            <p className="mt-2 text-xl font-semibold text-slate-900">{payment.transactionId}</p>
            <p className="text-sm text-slate-500">Order reference: {payment.orderId}</p>
          </div>

          <div className="space-y-2 rounded-xl border border-slate-200 p-4">
            <h2 className="text-sm font-semibold text-slate-900">Breakdown</h2>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Subtotal</span>
                <span className="font-medium text-slate-800">{formatCurrency(payment.breakdown.subtotal)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Shipping</span>
                <span className="font-medium text-slate-800">{formatCurrency(payment.breakdown.shipping)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Tax</span>
                <span className="font-medium text-slate-800">{formatCurrency(payment.breakdown.tax)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Gateway Fee</span>
                <span className="font-medium text-slate-800">{formatCurrency(payment.breakdown.gatewayFee)}</span>
              </div>
              <div className="mt-3 border-t border-slate-200 pt-3" />
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-800">Total Amount</span>
                <span className="text-base font-semibold text-slate-900">{formatCurrency(payment.amount)}</span>
              </div>
              <p className="text-xs text-slate-500">Base cart total before fee: {formatCurrency(totalBreakdown)}</p>
            </div>
          </div>
        </Panel>

        <Panel className="space-y-3 p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-900">Status</p>
            <StatusBadge value={payment.status} />
          </div>
          <StatLabel label="Payment Method" value={payment.method} />
          <StatLabel label="Date" value={payment.date} />
          <StatLabel label="Amount" value={formatCurrency(payment.amount)} />
        </Panel>
      </div>
    </div>
  );
};

export default AdminPaymentDetail;
