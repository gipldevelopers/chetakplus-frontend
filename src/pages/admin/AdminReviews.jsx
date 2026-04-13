import { useEffect, useMemo, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader, Panel, StatusBadge, Pagination } from "@/components/admin/AdminUi";
import api from "@/api";

const ratingStars = (count) => "*".repeat(Math.max(0, count)) + "-".repeat(Math.max(0, 5 - count));

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [error, setError] = useState("");
  const itemsPerPage = 5;

  useEffect(() => {
    let isMounted = true;

    const loadReviews = async () => {
      try {
        const params = {};
        if (statusFilter !== "all") params.status = statusFilter;
        const data = await api.adminGetReviews(params);
        if (!isMounted) return;
        setReviews(Array.isArray(data) ? data : []);
        setError("");
      } catch (loadError) {
        if (!isMounted) return;
        setError(loadError?.message || "Unable to load reviews.");
        setReviews([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    setLoading(true);
    loadReviews();
    return () => {
      isMounted = false;
    };
  }, [statusFilter]);

  const totalPages = Math.max(1, Math.ceil(reviews.length / itemsPerPage));
  const paginatedReviews = useMemo(
    () => reviews.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage),
    [reviews, currentPage, itemsPerPage]
  );

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const updateStatus = async (id, status) => {
    setSavingId(id);
    setError("");
    try {
      const updated = await api.adminUpdateReview(id, { status });
      setReviews((prev) => prev.map((review) => (review.id === id ? updated : review)));
    } catch (saveError) {
      setError(saveError?.message || "Unable to update review status.");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reviews"
        description="Moderate product reviews with approve and reject status controls."
        actions={
          <select
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(event.target.value);
              setCurrentPage(1);
            }}
            className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        }
      />

      {error ? (
        <Panel className="border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </Panel>
      ) : null}

      <Panel className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table className="admin-table min-w-[980px]">
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Comment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-8 text-center text-sm text-slate-500">
                    Loading reviews...
                  </TableCell>
                </TableRow>
              ) : paginatedReviews.length > 0 ? (
                paginatedReviews.map((review) => (
                  <TableRow key={review.id}>
                    <TableCell>{review.product}</TableCell>
                    <TableCell>{review.customer}</TableCell>
                    <TableCell className="font-mono text-xs">{ratingStars(review.rating)}</TableCell>
                    <TableCell className="max-w-[340px]">
                      <p className="line-clamp-2 text-sm text-slate-600">{review.comment}</p>
                    </TableCell>
                    <TableCell>
                      <StatusBadge value={review.status} />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          disabled={savingId === review.id}
                          onClick={() => updateStatus(review.id, "approved")}
                          className="rounded-lg border border-emerald-200 px-2.5 py-1.5 text-xs font-medium text-emerald-700 transition hover:bg-emerald-50 disabled:opacity-50"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          disabled={savingId === review.id}
                          onClick={() => updateStatus(review.id, "rejected")}
                          className="rounded-lg border border-rose-200 px-2.5 py-1.5 text-xs font-medium text-rose-600 transition hover:bg-rose-50 disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="py-8 text-center text-sm text-slate-500">
                    No reviews found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={reviews.length}
          itemsPerPage={itemsPerPage}
        />
      </Panel>
    </div>
  );
};

export default AdminReviews;

