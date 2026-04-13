import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader, Panel, StatusBadge } from "@/components/admin/AdminUi";
import InfiniteScroll from "react-infinite-scroll-component";
import api from "@/api";

const formatCurrency = (value) => `Rs ${Number(value || 0).toLocaleString("en-IN")}`;

const AdminOrders = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");
  
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
      const params = { page: targetPage, limit: 10 };
      if (statusFilter !== "all") params.status = statusFilter;
      if (paymentFilter !== "all") params.paymentStatus = paymentFilter;
      if (methodFilter !== "all") params.paymentMethod = methodFilter;
      if (searchValue.trim() !== "") params.search = searchValue;

      const data = await api.adminGetOrders(params);
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
      setError(fetchError?.message || "Unable to load orders.");
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchMoreData(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue, statusFilter, paymentFilter, methodFilter]);

  return (
    <div className="space-y-6">
      <PageHeader title="Orders" description="Monitor order lifecycle, payment confirmation, and fulfillment status." />

      {error ? (
        <Panel className="border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </Panel>
      ) : null}

      <Panel className="overflow-hidden">
        <div className="border-b border-slate-200 p-4">
          <div className="grid gap-3 md:grid-cols-4">
            <div className="relative max-w-sm md:col-span-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder="Search by order ID or customer"
                className="h-10 rounded-xl border-slate-200 bg-slate-50 pl-9"
              />
            </div>
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm">
              <option value="all">All Status</option>
              <option value="placed">Placed</option>
              <option value="confirmed">Confirmed</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
            </select>
            <select value={paymentFilter} onChange={(event) => setPaymentFilter(event.target.value)} className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm">
              <option value="all">All Payments</option>
              <option value="pending">Pending Payment</option>
              <option value="paid">Paid</option>
            </select>
            <select value={methodFilter} onChange={(event) => setMethodFilter(event.target.value)} className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm">
              <option value="all">All Methods</option>
              <option value="cash on delivery">COD Orders</option>
              <option value="upi">UPI Orders</option>
            </select>
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
                  <b>No more orders</b>
                </div>
              ) : null
            }
          >
            <Table className="admin-table min-w-[940px]">
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer Name</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((order) => (
                  <TableRow key={order.id} onClick={() => navigate(`/admin/orders/${order.id}`)} className="cursor-pointer">
                    <TableCell className="font-semibold text-slate-800">{order.id}</TableCell>
                    <TableCell>{order.customerName}</TableCell>
                    <TableCell>{formatCurrency(order.total)}</TableCell>
                    <TableCell>
                      <StatusBadge value={order.status} />
                    </TableCell>
                    <TableCell>
                      <StatusBadge value={order.paymentStatus} />
                    </TableCell>
                    <TableCell className="text-slate-500">{order.date}</TableCell>
                  </TableRow>
                ))}

                {!loading && items.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-8 text-center text-sm text-slate-500">
                      No orders found.
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

export default AdminOrders;
