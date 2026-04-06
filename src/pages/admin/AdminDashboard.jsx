import { Link } from "react-router-dom";
import { BarChart3, DollarSign, ShoppingCart, Users, ArrowRight } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  adminSummary,
  categoryPerformance,
  dashboardSeries,
  ordersData,
  formatCurrency,
} from "@/data/adminMockData";
import { MetricCard, PageHeader, Panel, StatusBadge } from "@/components/admin/AdminUi";

const metricConfig = [
  {
    title: "Total Sales",
    value: adminSummary.totalSales,
    trend: "up 14.3% vs last month",
    icon: ShoppingCart,
    gradient: "bg-gradient-to-br from-sky-500 to-indigo-500",
  },
  {
    title: "Orders",
    value: adminSummary.totalOrders,
    trend: "up 8.9% vs last month",
    icon: BarChart3,
    gradient: "bg-gradient-to-br from-emerald-500 to-cyan-500",
  },
  {
    title: "Customers",
    value: adminSummary.totalCustomers,
    trend: "up 11.2% vs last month",
    icon: Users,
    gradient: "bg-gradient-to-br from-amber-500 to-orange-500",
  },
  {
    title: "Revenue",
    value: adminSummary.revenue,
    trend: "up 17.4% vs last month",
    icon: DollarSign,
    gradient: "bg-gradient-to-br from-indigo-500 to-violet-500",
  },
];

const pieColors = ["#1d4ed8", "#0f766e", "#7c3aed", "#f97316"];

const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="A high-level view of revenue, orders, customer health, and operations activity."
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metricConfig.map((item) => (
          <MetricCard key={item.title} {...item} />
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.7fr_1fr]">
        <Panel className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Sales and Order Trend</h2>
              <p className="text-sm text-slate-500">Static analytics preview for the last 6 months.</p>
            </div>
          </div>
          <div className="h-[290px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dashboardSeries}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="sales" stroke="#1d4ed8" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="orders" stroke="#0f766e" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel className="p-5">
          <h2 className="text-base font-semibold text-slate-900">Revenue Share by Category</h2>
          <p className="mb-4 text-sm text-slate-500">Distribution snapshot by key category segments.</p>
          <div className="h-[230px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryPerformance} dataKey="value" nameKey="name" innerRadius={58} outerRadius={84} paddingAngle={3}>
                  {categoryPerformance.map((entry, index) => (
                    <Cell key={entry.name} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {categoryPerformance.map((segment, index) => (
              <div key={segment.name} className="flex items-center gap-2 rounded-lg border border-slate-200 px-2.5 py-2 text-xs">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: pieColors[index % pieColors.length] }} />
                <span className="font-medium text-slate-700">{segment.name}</span>
              </div>
            ))}
          </div>
        </Panel>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.4fr_1fr]">
        <Panel className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Recent Orders</h2>
              <p className="text-sm text-slate-500">Latest transactions coming through the storefront.</p>
            </div>
            <Link
              to="/admin/orders"
              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 hover:text-slate-900 transition-colors"
            >
              View All
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <Table className="admin-table">
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ordersData.slice(0, 3).map((order) => (
                <TableRow key={order.id}>
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
        </Panel>

        <Panel className="p-5">
          <h2 className="text-base font-semibold text-slate-900">Order Volume Bars</h2>
          <p className="mb-4 text-sm text-slate-500">Quick monthly volume check.</p>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dashboardSeries}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="orders" fill="#1e293b" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </section>
    </div>
  );
};

export default AdminDashboard;
