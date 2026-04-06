import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency, ordersData } from "@/data/adminMockData";
import { PageHeader, Panel, StatusBadge, Pagination } from "@/components/admin/AdminUi";

const AdminOrders = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filtered = useMemo(() => {
    const token = searchValue.toLowerCase();
    const result = ordersData.filter(
      (order) => order.id.toLowerCase().includes(token) || order.customerName.toLowerCase().includes(token)
    );
    if (searchValue && currentPage !== 1) setCurrentPage(1);
    return result;
  }, [searchValue, currentPage]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedOrders = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Orders" description="Monitor order lifecycle, payment confirmation, and fulfillment status." />

      <Panel className="overflow-hidden">
        <div className="border-b border-slate-200 p-4">
          <div className="relative max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="Search by order ID or customer"
              className="h-10 rounded-xl border-slate-200 bg-slate-50 pl-9"
            />
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
              {paginatedOrders.map((order) => (
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
