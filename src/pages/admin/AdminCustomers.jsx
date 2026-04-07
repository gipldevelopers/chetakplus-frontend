import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader, Panel, StatusBadge, Pagination } from "@/components/admin/AdminUi";
import api from "@/api";

const AdminCustomers = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [customers, setCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const itemsPerPage = 5;

  useEffect(() => {
    let isMounted = true;

    const loadCustomers = async () => {
      try {
        const data = await api.adminGetCustomers();
        if (!isMounted) return;
        setCustomers(Array.isArray(data) ? data : []);
        setError("");
      } catch (fetchError) {
        if (!isMounted) return;
        setError(fetchError?.message || "Unable to load customers.");
        setCustomers([]);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadCustomers();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredCustomers = useMemo(() => {
    const token = searchValue.toLowerCase().trim();
    if (!token) return customers;
    return customers.filter(
      (customer) =>
        String(customer.name || "").toLowerCase().includes(token) ||
        String(customer.email || "").toLowerCase().includes(token)
    );
  }, [searchValue, customers]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchValue]);

  const totalPages = Math.max(1, Math.ceil(filteredCustomers.length / itemsPerPage));
  const paginatedCustomers = filteredCustomers.slice(
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
      <PageHeader title="Customers" description="Track customer profiles, order activity, and account health." />

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
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-8 text-center text-sm text-slate-500">
                    Loading customers...
                  </TableCell>
                </TableRow>
              ) : (
                paginatedCustomers.map((customer) => (
                  <TableRow key={customer.id} onClick={() => navigate(`/admin/customers/${customer.id}`)} className="cursor-pointer">
                    <TableCell>
                      <p className="font-semibold text-slate-800">{customer.name}</p>
                      <p className="text-xs text-slate-500">{customer.id}</p>
                    </TableCell>
                    <TableCell>{customer.email || "-"}</TableCell>
                    <TableCell>{customer.phone || "-"}</TableCell>
                    <TableCell>{customer.totalOrders ?? 0}</TableCell>
                    <TableCell>
                      <StatusBadge value={customer.status || "Inactive"} />
                    </TableCell>
                  </TableRow>
                ))
              )}

              {!loading && paginatedCustomers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-8 text-center text-sm text-slate-500">
                    No customers found.
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
          totalItems={filteredCustomers.length}
          itemsPerPage={itemsPerPage}
        />
      </Panel>
    </div>
  );
};

export default AdminCustomers;
