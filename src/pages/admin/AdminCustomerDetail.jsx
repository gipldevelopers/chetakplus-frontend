import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency, getCustomerById, ordersData } from "@/data/adminMockData";
import { PageHeader, Panel, StatLabel, StatusBadge } from "@/components/admin/AdminUi";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const AdminCustomerDetail = () => {
  const navigate = useNavigate();
  const { customerId } = useParams();
  const customer = useMemo(() => getCustomerById(customerId), [customerId]);
  const [notes, setNotes] = useState(customer?.notes || "");

  const customerOrders = useMemo(() => {
    if (!customer) return [];
    return ordersData.filter((order) => customer.orderIds.includes(order.id));
  }, [customer]);

  if (!customer) {
    return (
      <Panel className="p-6">
        <p className="text-sm text-slate-500">Customer not found.</p>
      </Panel>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={customer.name}
        description="Customer profile, order history, spending data, and internal notes."
        actions={
          <Button variant="outline" className="rounded-xl" onClick={() => navigate("/admin/customers")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Customers
          </Button>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
        <Panel className="space-y-4 p-5 sm:p-6">
          <div className="grid gap-3 sm:grid-cols-2">
            <StatLabel label="Email" value={customer.email} />
            <StatLabel label="Phone" value={customer.phone} />
            <StatLabel label="Joined" value={customer.joinedAt} />
            <StatLabel label="Address" value={customer.address} />
          </div>

          <div className="rounded-xl border border-slate-200">
            <div className="border-b border-slate-200 px-4 py-3">
              <h2 className="text-sm font-semibold text-slate-900">Order History</h2>
            </div>
            <div className="overflow-x-auto">
              <Table className="admin-table min-w-[620px]">
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customerOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-semibold text-slate-800">{order.id}</TableCell>
                      <TableCell>{order.date}</TableCell>
                      <TableCell>{formatCurrency(order.total)}</TableCell>
                      <TableCell>
                        <StatusBadge value={order.status} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </Panel>

        <div className="space-y-4">
          <Panel className="space-y-3 p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-900">Account Summary</p>
              <StatusBadge value={customer.status} />
            </div>
            <StatLabel label="Total Orders" value={String(customer.totalOrders)} />
            <StatLabel label="Total Spending" value={formatCurrency(customer.totalSpending)} />
          </Panel>

          <Panel className="space-y-3 p-5">
            <h2 className="text-sm font-semibold text-slate-900">Notes</h2>
            <Textarea
              rows={7}
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Add internal notes about this customer"
              className="rounded-xl"
            />
            <Button className="w-full rounded-xl bg-slate-900 text-white hover:bg-slate-800">Save Notes</Button>
          </Panel>
        </div>
      </div>
    </div>
  );
};

export default AdminCustomerDetail;
