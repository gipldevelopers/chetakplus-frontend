import { useEffect, useState } from "react";
import { Search, Trash2, Eye, Building2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader, Panel, StatusBadge } from "@/components/admin/AdminUi";
import { useToast } from "@/hooks/use-toast";
import InfiniteScroll from "react-infinite-scroll-component";
import api from "@/api";

const AdminCorporateOrders = () => {
  const { toast } = useToast();
  const [searchValue, setSearchValue] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

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
      const data = await api.adminGetCorporateOrders({ page: targetPage, limit: 10, search: searchValue });
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
      setError(fetchError?.message || "Unable to load corporate orders.");
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchMoreData(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);

  const updateStatus = async (id, newStatus) => {
    try {
      await api.adminUpdateCorporateOrderStatus(id, newStatus);
      setItems((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
      );
      toast({ title: "Status Updated", description: "The order status has been changed." });
    } catch (err) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const removeOrder = async (id) => {
    if (!window.confirm("Delete this enquiry?")) return;
    try {
      await api.adminDeleteCorporateOrder(id);
      setItems((prev) => prev.filter((o) => o.id !== id));
      toast({ title: "Order Deleted" });
    } catch (err) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Corporate Orders"
        description="Review and manage bulk/corporate enquiries received from the website."
      />

      <Panel className="overflow-hidden">
        <div className="border-b border-slate-200 p-4">
          <div className="relative max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search by company, email, product..."
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
                  <b>No more corporate orders</b>
                </div>
              ) : null
            }
          >
            <Table className="admin-table">
              <TableHeader>
                <TableRow>
                  <TableHead>Company & Date</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead>Estimate</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <div className="font-semibold text-slate-800">{order.companyName}</div>
                      <div className="text-[10px] text-slate-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{order.email}</div>
                      <div className="text-xs text-slate-500">{order.phone}</div>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs font-medium px-2 py-1 bg-slate-100 rounded-md">
                        {order.productType}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium text-slate-700">{order.quantity}</TableCell>
                    <TableCell className="text-sm font-semibold">
                      {order.estimatedPrice > 0 ? `₹${order.estimatedPrice.toLocaleString()}` : "-"}
                    </TableCell>
                    <TableCell>
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        className="text-xs border rounded-md px-1 py-1 bg-white outline-none focus:ring-1 focus:ring-primary/30"
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="pending">Pending</option>
                        <option value="processed">Processed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-2 text-slate-500 hover:text-primary hover:bg-slate-100 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => removeOrder(order.id)}
                          className="p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}

                {!loading && items.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="py-12 text-center text-slate-500">
                      No corporate orders found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </InfiniteScroll>
        </div>
      </Panel>

      {/* Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="border-b border-slate-100 p-6 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Building2 size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{selectedOrder.companyName}</h3>
                  <p className="text-xs text-slate-500">Order Enquiry #{selectedOrder.id}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                &times;
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Product</p>
                  <p className="text-sm font-medium">{selectedOrder.productType}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Quantity</p>
                  <p className="text-sm font-medium">{selectedOrder.quantity}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Email</p>
                  <p className="text-sm font-medium">{selectedOrder.email}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Phone</p>
                  <p className="text-sm font-medium">{selectedOrder.phone}</p>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-50">
                <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Requirements</p>
                <div className="bg-slate-50 p-3 rounded-xl text-sm text-slate-700 whitespace-pre-line min-h-[100px]">
                  {selectedOrder.requirements || "No specific requirements provided."}
                </div>
              </div>
            </div>
            <div className="bg-slate-50 p-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-6 py-2 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCorporateOrders;
