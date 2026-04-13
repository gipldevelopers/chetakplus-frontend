import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { MetricCard, PageHeader, Panel, StatusBadge } from "@/components/admin/AdminUi";
import api from "@/api";

const formatCurrency = (value) => `Rs ${Number(value || 0).toLocaleString("en-IN")}`;
const formatNumber = (value) => Number(value || 0).toLocaleString("en-IN");

const pieColors = ["#1d4ed8", "#0f766e", "#7c3aed", "#f97316"];
const defaultSummary = {
  totalSales: 0,
  totalOrders: 0,
  totalCustomers: 0,
  revenue: 0,
  trends: {
    totalSales: "flat vs last month",
    totalOrders: "flat vs last month",
    totalCustomers: "flat vs last month",
    revenue: "flat vs last month",
  },
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [summary, setSummary] = useState(defaultSummary);
  const [dashboardSeries, setDashboardSeries] = useState([]);
  const [categoryPerformance, setCategoryPerformance] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    let mounted = true;

    const loadDashboard = async () => {
      try {
        const data = await api.adminGetDashboard();
        if (!mounted) return;

        setSummary(data?.summary || defaultSummary);
        setDashboardSeries(Array.isArray(data?.dashboardSeries) ? data.dashboardSeries : []);
        setCategoryPerformance(Array.isArray(data?.categoryPerformance) ? data.categoryPerformance : []);
        setRecentOrders(Array.isArray(data?.recentOrders) ? data.recentOrders : []);
        setError("");
      } catch (fetchError) {
        if (!mounted) return;
        setError(fetchError?.message || "Unable to load dashboard data.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadDashboard();
    const timer = setInterval(loadDashboard, 15000);

    return () => {
      mounted = false;
      clearInterval(timer);
    };
  }, []);

  const metricConfig = useMemo(
    () => [
      {
        title: "Total Sales",
        value: formatCurrency(summary.totalSales),
        trend: summary?.trends?.totalSales || "flat vs last month",
        icon: ShoppingCart,
        gradient: "bg-gradient-to-br from-sky-500 to-indigo-500",
        to: "/admin/orders",
      },
      {
        title: "Orders",
        value: formatNumber(summary.totalOrders),
        trend: summary?.trends?.totalOrders || "flat vs last month",
        icon: BarChart3,
        gradient: "bg-gradient-to-br from-emerald-500 to-cyan-500",
        to: "/admin/orders",
      },
      {
        title: "Customers",
        value: formatNumber(summary.totalCustomers),
        trend: summary?.trends?.totalCustomers || "flat vs last month",
        icon: Users,
        gradient: "bg-gradient-to-br from-amber-500 to-orange-500",
        to: "/admin/customers",
      },
      {
        title: "Revenue",
        value: formatCurrency(summary.revenue),
        trend: summary?.trends?.revenue || "flat vs last month",
        icon: DollarSign,
        gradient: "bg-gradient-to-br from-indigo-500 to-violet-500",
        to: "/admin/payments",
      },
    ],
    [summary],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Live analytics from your current orders, payments, and customers data."
      />

      {error ? (
        <Panel className="border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error}</Panel>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metricConfig.map((item) => (
          <Link key={item.title} to={item.to} className="block rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/60">
            <MetricCard {...item} />
          </Link>
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.7fr_1fr]">
        <Panel className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Sales and Order Trend</h2>
              <p className="text-sm text-slate-500">Live analytics for the last 6 months.</p>
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
          <p className="mb-4 text-sm text-slate-500">Live distribution by product category contribution.</p>
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
                <span className="font-medium text-slate-700">
                  {segment.name} ({Number(segment.value || 0).toFixed(1)}%)
                </span>
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
              <p className="text-sm text-slate-500">Latest transactions from live order activity.</p>
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
              {recentOrders.slice(0, 3).map((order) => (
                <TableRow
                  key={order.id}
                  onClick={() => navigate(`/admin/orders/${order.id}`)}
                  className="cursor-pointer hover:bg-slate-50"
                >
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
              {!loading && recentOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-8 text-center text-sm text-slate-500">
                    No recent orders found.
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </Panel>

        <Panel className="p-5">
          <h2 className="text-base font-semibold text-slate-900">Order Volume Bars</h2>
          <p className="mb-4 text-sm text-slate-500">Live monthly order volume check.</p>
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
