import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Edit, Plus, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader, Panel, StatusBadge } from "@/components/admin/AdminUi";
import { useToast } from "@/hooks/use-toast";
import InfiniteScroll from "react-infinite-scroll-component";
import api from "@/api";

const AdminFAQs = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchValue, setSearchValue] = useState("");
  
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchMoreData = async (reset = false) => {
    if (loading && !reset) return;

    setLoading(true);
    const targetPage = reset ? 1 : page;

    try {
      const data = await api.adminGetFaqs({ page: targetPage, limit: 10, search: searchValue });
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
    } catch (fetchError) {
      setError(fetchError?.message || "Unable to load FAQs.");
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchMoreData(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);

  const toggleFaqStatus = async (faq) => {
    const newStatus = faq.status === "Active" ? "Inactive" : "Active";
    try {
      await api.adminUpdateFaq(faq.id, {
        ...faq,
        status: newStatus,
      });
      setItems((prev) =>
        prev.map((item) =>
          item.id === faq.id ? { ...item, status: newStatus } : item
        )
      );
      toast({
        title: `FAQ ${newStatus}`,
        description: `The FAQ has been turned ${newStatus.toLowerCase()}.`,
      });
    } catch (err) {
      setError(err?.message || "Unable to update status.");
      toast({
        title: "Update Failed",
        description: err?.message || "Something went wrong.",
        variant: "destructive",
      });
    }
  };

  const removeFaq = async (id) => {
    const shouldDelete = window.confirm("Delete this FAQ?");
    if (!shouldDelete) return;

    try {
      await api.adminDeleteFaq(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (deleteError) {
      setError(deleteError?.message || "Unable to delete FAQ.");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="FAQs"
        description="Manage frequently asked questions and their categories for the help center."
        actions={
          <Button onClick={() => navigate("/admin/faqs/new")} className="rounded-xl bg-slate-900 text-white hover:bg-slate-800">
            <Plus className="mr-2 h-4 w-4" />
            Add FAQ
          </Button>
        }
      />

      {error ? (
        <Panel className="border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </Panel>
      ) : null}

      <Panel className="overflow-hidden">
        <div className="border-b border-slate-200 p-4">
          <div className="relative max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="Search by question or category"
              className="h-10 rounded-xl border-slate-200 bg-slate-50 pl-9"
            />
          </div>
        </div>

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
                  <b>No more FAQs</b>
                </div>
              ) : null
            }
          >
            <Table className="admin-table min-w-[900px]">
              <TableHeader>
                <TableRow>
                  <TableHead>Question</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((faq) => (
                  <TableRow key={faq.id}>
                    <TableCell className="max-w-md">
                      <p className="font-semibold text-slate-800 line-clamp-1">{faq.question}</p>
                      <p className="text-xs text-slate-500 line-clamp-2">{faq.answer}</p>
                    </TableCell>
                    <TableCell>{faq.category || "General"}</TableCell>
                    <TableCell>{faq.sortOrder}</TableCell>
                    <TableCell>
                      <button
                        type="button"
                        onClick={() => toggleFaqStatus(faq)}
                        className="hover:opacity-80 transition-opacity"
                        title="Click to toggle status"
                      >
                        <StatusBadge value={faq.status || "Inactive"} />
                      </button>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => navigate(`/admin/faqs/${faq.id}/edit`)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
                        >
                          <Edit className="h-3.5 w-3.5" />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => removeFaq(faq.id)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 px-2.5 py-1.5 text-xs font-medium text-rose-600 transition hover:bg-rose-50"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}

                {!loading && items.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-8 text-center text-sm text-slate-500">
                      No FAQs found.
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

export default AdminFAQs;
