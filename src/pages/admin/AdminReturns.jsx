import { getImageUrl } from "@/lib/utils";
import { useEffect, useMemo, useState } from "react";
import { PageHeader, Panel, StatusBadge } from "@/components/admin/AdminUi";
import api from "@/api";

const formatDateTime = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
};

const statusOptionsByAction = {
  return: [
    { value: "requested", label: "Requested" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
    { value: "pickup_pending", label: "Pickup Pending" },
    { value: "received", label: "Received" },
    { value: "refund_processing", label: "Refund Processing" },
    { value: "refunded", label: "Refunded" },
    { value: "cancelled", label: "Cancelled" },
  ],
  exchange: [
    { value: "requested", label: "Requested" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
    { value: "pickup_pending", label: "Pickup Pending" },
    { value: "received", label: "Received" },
    { value: "replacement_sent", label: "Replacement Sent" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" },
  ],
};

const AdminReturns = () => {
  const [requests, setRequests] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [actionFilter, setActionFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [adminNote, setAdminNote] = useState("");
  const [nextStatus, setNextStatus] = useState("");

  const selectedRequest = useMemo(
    () => requests.find((entry) => entry.id === selectedId) || null,
    [requests, selectedId]
  );

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        const params = {};
        if (statusFilter !== "all") params.status = statusFilter;
        if (actionFilter !== "all") params.actionType = actionFilter;
        if (priorityFilter !== "all") params.priority = priorityFilter;
        const data = await api.adminGetReturns(params);
        if (!isMounted) return;
        const list = Array.isArray(data) ? data : [];
        setRequests(list);
        setError("");
        if (list.length > 0) {
          setSelectedId((prev) => (prev && list.some((r) => r.id === prev) ? prev : list[0].id));
        } else {
          setSelectedId(null);
        }
      } catch (loadError) {
        if (!isMounted) return;
        setError(loadError?.message || "Unable to load return/exchange requests.");
        setRequests([]);
        setSelectedId(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    setLoading(true);
    load();
    return () => {
      isMounted = false;
    };
  }, [statusFilter, actionFilter, priorityFilter]);

  useEffect(() => {
    if (!selectedRequest) {
      setAdminNote("");
      setNextStatus("");
      return;
    }
    setAdminNote(selectedRequest.adminNote || "");
    setNextStatus(selectedRequest.statusCode || "");
  }, [selectedRequest]);

  const syncRequest = (updated) => {
    setRequests((prev) => prev.map((entry) => (entry.id === updated.id ? updated : entry)));
    setSelectedId(updated.id);
  };

  const handleUpdate = async (payload) => {
    if (!selectedRequest) return;
    setSaving(true);
    setError("");
    try {
      const updated = await api.adminUpdateReturn(selectedRequest.id, payload);
      syncRequest(updated);
    } catch (saveError) {
      setError(saveError?.message || "Unable to update request.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Returns & Exchanges"
        description="Approve, reject, and process return/refund and exchange requests."
        actions={
          <div className="flex flex-wrap gap-2">
            <select value={actionFilter} onChange={(event) => setActionFilter(event.target.value)} className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm">
              <option value="all">All Types</option>
              <option value="return">Return</option>
              <option value="exchange">Exchange</option>
            </select>
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm">
              <option value="all">All Statuses</option>
              <option value="requested">Requested</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="pickup_pending">Pickup Pending</option>
              <option value="received">Received</option>
              <option value="refund_processing">Refund Processing</option>
              <option value="refunded">Refunded</option>
              <option value="replacement_sent">Replacement Sent</option>
              <option value="delivered">Delivered</option>
            </select>
            <select value={priorityFilter} onChange={(event) => setPriorityFilter(event.target.value)} className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm">
              <option value="all">All Queues</option>
              <option value="pending_approvals">Pending Approvals</option>
              <option value="refund_pending">Refund Pending</option>
              <option value="exchange_pending">Exchange Pending</option>
            </select>
          </div>
        }
      />

      {error ? (
        <Panel className="border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error}</Panel>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1.1fr_1fr]">
        <Panel className="overflow-hidden">
          <div className="max-h-[72vh] overflow-y-auto">
            {loading ? (
              <div className="p-6 text-sm text-slate-500">Loading requests...</div>
            ) : requests.length === 0 ? (
              <div className="p-6 text-sm text-slate-500">No return/exchange requests found.</div>
            ) : (
              <div className="divide-y divide-slate-200">
                {requests.map((request) => (
                  <button
                    key={request.id}
                    type="button"
                    onClick={() => setSelectedId(request.id)}
                    className={`w-full p-4 text-left transition ${selectedId === request.id ? "bg-blue-50/60" : "hover:bg-slate-50"}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{request.orderNumber}</p>
                        <p className="text-xs text-slate-500">{request.item?.name}</p>
                      </div>
                      <StatusBadge value={request.status} />
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs">
                      <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 font-medium uppercase">{request.actionType}</span>
                      <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1">{request.reason}</span>
                      {request.isFlagged ? <span className="rounded-full border border-rose-200 bg-rose-50 px-2.5 py-1 font-medium text-rose-700">Flagged</span> : null}
                    </div>
                    <p className="mt-2 text-[11px] text-slate-500">Requested: {formatDateTime(request.requestedAt)}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </Panel>

        <Panel className="p-5 sm:p-6">
          {!selectedRequest ? (
            <p className="text-sm text-slate-500">Select a request to view and update details.</p>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Order</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{selectedRequest.orderNumber}</p>
                <p className="text-xs text-slate-500">{selectedRequest.customerName} • {selectedRequest.customerEmail}</p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Item</p>
                <div className="mt-2 flex gap-3">
                  <img src={getImageUrl(selectedRequest.item?.imageUrl || "/placeholder.svg")} alt={selectedRequest.item?.name || "Item"} className="h-14 w-14 rounded-lg border border-slate-200 object-cover" />
                  <div>
                    <p className="text-sm font-medium text-slate-800">{selectedRequest.item?.name}</p>
                    <p className="text-xs text-slate-500">Qty {selectedRequest.item?.quantity} • Rs {Number(selectedRequest.item?.price || 0).toLocaleString("en-IN")}</p>
                    <p className="mt-1 text-xs uppercase text-slate-500">{selectedRequest.actionType} • {selectedRequest.reason}</p>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-white p-3">
                  <p className="text-xs text-slate-500">Current Status</p>
                  <div className="mt-2"><StatusBadge value={selectedRequest.status} /></div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-3">
                  <p className="text-xs text-slate-500">Requested At</p>
                  <p className="mt-2 text-sm font-medium text-slate-700">{formatDateTime(selectedRequest.requestedAt)}</p>
                </div>
              </div>

              {selectedRequest.comment ? (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-400 mb-1">Customer Comment</p>
                  {selectedRequest.comment}
                </div>
              ) : null}

              {selectedRequest.evidenceImages?.length ? (
                <div>
                  <p className="mb-2 text-xs uppercase tracking-[0.14em] text-slate-400">Evidence</p>
                  <div className="grid grid-cols-3 gap-2">
                    {selectedRequest.evidenceImages.map((image) => (
                      <img key={image} src={getImageUrl(image)} alt="Evidence" className="h-20 w-full rounded-lg border border-slate-200 object-cover" />
                    ))}
                  </div>
                </div>
              ) : null}

              {selectedRequest.refundMethod === "bank_transfer" ? (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600 space-y-1">
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Bank Details</p>
                  <p>Holder: {selectedRequest.bankDetails?.accountHolderName || "-"}</p>
                  <p>Bank: {selectedRequest.bankDetails?.bankName || "-"}</p>
                  <p>Account: {selectedRequest.bankDetails?.accountNumber || "-"}</p>
                  <p>IFSC: {selectedRequest.bankDetails?.ifscCode || "-"}</p>
                </div>
              ) : null}

              <div className="space-y-3 border-t border-slate-200 pt-4">
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => handleUpdate({ decision: "approve", adminNote })}
                    className="rounded-lg border border-emerald-200 px-3 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 disabled:opacity-50"
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => handleUpdate({ decision: "reject", adminNote })}
                    className="rounded-lg border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50 disabled:opacity-50"
                  >
                    Reject
                  </button>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Update Status</label>
                  <div className="flex gap-2">
                    <select
                      value={nextStatus}
                      onChange={(event) => setNextStatus(event.target.value)}
                      className="h-10 flex-1 rounded-xl border border-slate-200 bg-white px-3 text-sm"
                    >
                      {(statusOptionsByAction[selectedRequest.actionType] || []).map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      disabled={saving || !nextStatus}
                      onClick={() => handleUpdate({ status: nextStatus, adminNote })}
                      className="rounded-xl bg-slate-900 px-4 text-xs font-semibold text-white disabled:opacity-50"
                    >
                      Save
                    </button>
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Internal Note</label>
                  <textarea
                    value={adminNote}
                    onChange={(event) => setAdminNote(event.target.value)}
                    rows={3}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                    placeholder="Add note for team context..."
                  />
                </div>
              </div>
            </div>
          )}
        </Panel>
      </div>
    </div>
  );
};

export default AdminReturns;

