import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader, Panel, StatusBadge } from "@/components/admin/AdminUi";
import InfiniteScroll from "react-infinite-scroll-component";
import api from "@/api";

const ratingStars = (count) => "*".repeat(Math.max(0, count)) + "-".repeat(Math.max(0, 5 - count));

const AdminReviews = () => {
  const [statusFilter, setStatusFilter] = useState("all");
  const [savingId, setSavingId] = useState(null);
  const [error, setError] = useState("");

  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const fetchMoreData = async (reset = false) => {
    if (loading && !reset) return;

    setLoading(true);
    const targetPage = reset ? 1 : page;

    try {
      const params = { page: targetPage, limit: 10 };
      if (statusFilter !== "all") params.status = statusFilter;

      const data = await api.adminGetReviews(params);
      setError("");

      if (!data || data.length === 0) {
        setHasMore(false);
        if (reset) setItems([]);
      } else {
        setItems((prev) => reset ? data : [...prev, ...data]);
        setPage((prev) => reset ? 2 : prev + 1);

        if (data.length < 10) setHasMore(false);
        else setHasMore(true);
      }
    } catch (loadError) {
      setError(loadError?.message || "Unable to load reviews.");
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchMoreData(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const updateStatus = async (id, status) => {
    setSavingId(id);
    setError("");
    try {
      const updated = await api.adminUpdateReview(id, { status });
      setItems((prev) => prev.map((review) => (review.id === id ? updated : review)));
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
            onChange={(event) => setStatusFilter(event.target.value)}
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
          <InfiniteScroll
            dataLength={items.length}
            next={() => fetchMoreData(false)}
            hasMore={hasMore}
            loader={
              <div className="py-4 text-center text-sm text-slate-500">
                Loading...
              </div>
            }
            endMessage={
              items.length > 0 ? (
                <div className="py-4 text-center text-sm text-slate-500">
                  <b>No more reviews</b>
                </div>
              ) : null
            }
          >
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
                {items.map((review) => (
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
                ))}

                {!loading && items.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-8 text-center text-sm text-slate-500">
                      No reviews found.
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </InfiniteScroll>
        </div>
      </Panel>
    </div>
  );
};

export default AdminReviews;

