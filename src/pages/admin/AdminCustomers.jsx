import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { customersData } from "@/data/adminMockData";
import { PageHeader, Panel, StatusBadge, Pagination } from "@/components/admin/AdminUi";

const AdminCustomers = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredCustomers = useMemo(() => {
    const token = searchValue.toLowerCase();
    const result = customersData.filter(
      (customer) => customer.name.toLowerCase().includes(token) || customer.email.toLowerCase().includes(token)
    );
    if (searchValue && currentPage !== 1) setCurrentPage(1);
    return result;
  }, [searchValue, currentPage]);

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Customers" description="Track customer profiles, order activity, and account health." />

      <Panel className="overflow-hidden">
        <div className="border-b border-slate-200 p-4">
          <div className="relative max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="Search by customer name or email"
              className="h-10 rounded-xl border-slate-200 bg-slate-50 pl-9"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table className="admin-table min-w-[900px]">
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Total Orders</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedCustomers.map((customer) => (
                <TableRow key={customer.id} onClick={() => navigate(`/admin/customers/${customer.id}`)} className="cursor-pointer">
                  <TableCell>
                    <p className="font-semibold text-slate-800">{customer.name}</p>
                    <p className="text-xs text-slate-500">{customer.id}</p>
                  </TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>{customer.totalOrders}</TableCell>
                  <TableCell>
                    <StatusBadge value={customer.status} />
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
          totalItems={filteredCustomers.length}
          itemsPerPage={itemsPerPage}
        />
      </Panel>
    </div>
  );
};

export default AdminCustomers;
