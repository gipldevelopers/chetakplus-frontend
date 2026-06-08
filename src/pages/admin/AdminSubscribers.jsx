import { useEffect, useState } from "react";
import { Search, Trash2, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader, Panel } from "@/components/admin/AdminUi";
import { useToast } from "@/hooks/use-toast";
import InfiniteScroll from "react-infinite-scroll-component";
import api from "@/api";

const AdminSubscribers = () => {
  const { toast } = useToast();
  const [searchValue, setSearchValue] = useState("");

  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const fetchMoreData = async (reset = false) => {
    if (loading && !reset) return;

    setLoading(true);
    const targetPage = reset ? 1 : page;

    try {
      const data = await api.adminGetSubscribers({ page: targetPage, limit: 15, search: searchValue });

      if (!data || data.length === 0) {
        setHasMore(false);
        if (reset) setItems([]);
      } else {
        setItems((prev) => reset ? data : [...prev, ...data]);
        setPage((prev) => reset ? 2 : prev + 1);

        if (data.length < 15) setHasMore(false);
        else setHasMore(true);
      }
    } catch (err) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchMoreData(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);

  const removeSubscriber = async (id) => {
    if (!window.confirm("Remove this subscriber?")) return;
    try {
      await api.adminDeleteSubscriber(id);
      setItems((prev) => prev.filter((s) => s.id !== id));
      toast({ title: "Subscriber Removed" });
    } catch (err) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Newsletter Subscribers"
        description="View and manage users who have subscribed for updates and offers."
      />

      <Panel className="overflow-hidden">
        <div className="border-b border-slate-200 p-4">
          <div className="relative max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search by email..."
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
                  <b>No more subscribers</b>
                </div>
              ) : null
            }
          >
            <Table className="admin-table">
              <TableHeader>
                <TableRow>
                  <TableHead>Email Address</TableHead>
                  <TableHead>Subscription Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((sub) => (
                  <TableRow key={sub.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-slate-400" />
                        <span className="font-medium text-slate-700">{sub.email}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-500 text-sm">
                      {new Date(sub.created_at).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <button
                        onClick={() => removeSubscriber(sub.id)}
                        className="p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}

                {!loading && items.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="py-12 text-center text-slate-500">
                      No subscribers found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </InfiniteScroll>
        </div>
      </Panel>
    </div>
  );
};

export default AdminSubscribers;
