import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader, Panel, StatusBadge, Pagination } from "@/components/admin/AdminUi";
import api from "@/api";

const formatCurrency = (value) => `Rs ${Number(value || 0).toLocaleString("en-IN")}`;

const AdminOrders = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const itemsPerPage = 5;

  useEffect(() => {
    let isMounted = true;

    const loadOrders = async () => {
      try {
        const params = {};
        if (statusFilter !== "all") params.status = statusFilter;
        if (paymentFilter !== "all") params.paymentStatus = paymentFilter;
        if (methodFilter !== "all") params.paymentMethod = methodFilter;
        const data = await api.adminGetOrders(params);
        if (!isMounted) return;
        setOrders(Array.isArray(data) ? data : []);
        setError("");
      } catch (fetchError) {
        if (!isMounted) return;
        setError(fetchError?.message || "Unable to load orders.");
        setOrders([]);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadOrders();
    const timer = setInterval(loadOrders, 15000);
    return () => {
      isMounted = false;
      clearInterval(timer);
    };
  }, [statusFilter, paymentFilter, methodFilter]);

  const filtered = useMemo(() => {
    const token = searchValue.toLowerCase().trim();
    if (!token) return orders;

    return orders.filter(
      (order) =>
        String(order.id || "").toLowerCase().includes(token) ||
        String(order.customerName || "").toLowerCase().includes(token)
    );
  }, [orders, searchValue]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchValue]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const paginatedOrders = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

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
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-8 text-center text-sm text-slate-500">
                    Loading orders...
                  </TableCell>
                </TableRow>
              ) : (
                paginatedOrders.map((order) => (
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
                ))
              )}

              {!loading && paginatedOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-8 text-center text-sm text-slate-500">
                    No orders found.
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filtered.length}
          itemsPerPage={itemsPerPage}
        />
      </Panel>
    </div>
  );
};

export default AdminOrders;
