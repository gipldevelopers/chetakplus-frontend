import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { reviewsData } from "@/data/adminMockData";
import { PageHeader, Panel, StatusBadge, Pagination } from "@/components/admin/AdminUi";

const ratingStars = (count) => "*".repeat(count) + "-".repeat(5 - count);

const AdminReviews = () => {
  const [reviews, setReviews] = useState(reviewsData);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(reviews.length / itemsPerPage);
  const paginatedReviews = reviews.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const updateStatus = (id, status) => {
    setReviews((prev) => prev.map((review) => (review.id === id ? { ...review, status } : review)));
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Reviews" description="Moderate product reviews with approve and reject status controls." />

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
              {paginatedReviews.map((review) => (
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
                        onClick={() => updateStatus(review.id, "Approved")}
                        className="rounded-lg border border-emerald-200 px-2.5 py-1.5 text-xs font-medium text-emerald-700 transition hover:bg-emerald-50"
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        onClick={() => updateStatus(review.id, "Rejected")}
                        className="rounded-lg border border-rose-200 px-2.5 py-1.5 text-xs font-medium text-rose-600 transition hover:bg-rose-50"
                      >
                        Reject
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
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
