import { useMemo, useState } from "react";
import { Navigate, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Bell,
  ChevronDown,
  ChevronsLeft,
  Contact,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Package,
  Receipt,
  RefreshCcw,
  Search,
  Settings,
  Sparkles,
  Star,
  Tags,
  Users,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { adminNotifications } from "@/data/adminMockData";
import { clearAdminSession, getAdminSession, isAdminAuthenticated } from "@/lib/adminAuth";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", to: "/admin", icon: LayoutDashboard, exact: true },
  { label: "Hero Section", to: "/admin/hero", icon: Sparkles },
  { label: "Categories", to: "/admin/categories", icon: Tags },
  { label: "Products", to: "/admin/products", icon: Package },
  { label: "Orders", to: "/admin/orders", icon: Receipt },
  { label: "Customers", to: "/admin/customers", icon: Users },
  { label: "Reviews", to: "/admin/reviews", icon: Star },
  { label: "Returns", to: "/admin/returns", icon: RefreshCcw },
  { label: "Payments", to: "/admin/payments", icon: CreditCard },
  { label: "Contacts", to: "/admin/contacts", icon: Contact },
  { label: "Settings", to: "/admin/settings", icon: Settings },
];

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const authenticated = isAdminAuthenticated();
  const adminSession = getAdminSession();
  const adminName = adminSession?.admin?.name || "Admin User";
  const adminEmail = adminSession?.admin?.email || "admin@chetakplus.com";

  const pageTitle = useMemo(() => {
    if (location.pathname === "/admin") return "Dashboard";
    const current = navItems.find((item) =>
      item.exact ? location.pathname === item.to : location.pathname.startsWith(item.to),
    );
    return current?.label || "Admin Panel";
  }, [location.pathname]);

  const handleLogout = () => {
    clearAdminSession();
    navigate("/admin/login");
  };

  if (!authenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="admin-shell admin-panel h-screen overflow-hidden">
      <div className="flex h-full text-slate-800">
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 flex h-full flex-col border-r border-white/15 bg-primary text-primary-foreground shadow-2xl shadow-primary/25 transition-all duration-300",
            isSidebarCollapsed ? "w-[88px]" : "w-[280px]",
            isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          )}
        >
          <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="flex h-11 shrink-0 items-center">
                <img src="/logo.jpg" alt="Chetak Plus" className="h-full w-auto object-contain rounded-lg shadow-lg shadow-black/10" />
              </div>
              {!isSidebarCollapsed ? (
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">Chetak Plus</p>
                  <p className="truncate text-[10px] font-bold uppercase tracking-[0.1em] text-white/50">Admin</p>
                </div>
              ) : null}
            </div>
            <button
              type="button"
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-white/70 transition hover:bg-white/10 lg:hidden"
              onClick={() => setIsMobileSidebarOpen(false)}
            >
              <X className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="hidden h-8 w-8 items-center justify-center rounded-lg text-white/70 transition hover:bg-white/10 lg:inline-flex"
              onClick={() => setIsSidebarCollapsed((prev) => !prev)}
            >
              <ChevronsLeft className={cn("h-4 w-4 transition", isSidebarCollapsed && "rotate-180")} />
            </button>
          </div>

          <div className="admin-sidebar-scroll flex-1 overflow-y-auto px-3 py-5">
            <nav className="space-y-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = item.exact ? location.pathname === item.to : location.pathname.startsWith(item.to);

                return (
                  <NavLink
                    key={item.label}
                    to={item.to}
                    onClick={() => setIsMobileSidebarOpen(false)}
                    className={cn(
                      "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                      isActive
                        ? "bg-white text-slate-900 shadow-[0_8px_20px_rgba(15,23,42,0.25)]"
                        : "text-white/78 hover:bg-white/12 hover:text-white",
                      isSidebarCollapsed && "justify-center px-2",
                    )}
                  >
                    <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-slate-900" : "text-white/65 group-hover:text-white")} />
                    {!isSidebarCollapsed ? <span>{item.label}</span> : null}
                  </NavLink>
                );
              })}
            </nav>
          </div>

          <div className="border-t border-white/10 p-3">
            <button
              type="button"
              onClick={handleLogout}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-rose-300 transition hover:bg-rose-500/15 hover:text-rose-100",
                isSidebarCollapsed && "justify-center px-2",
              )}
            >
              <LogOut className="h-4 w-4" />
              {!isSidebarCollapsed ? <span>Logout</span> : null}
            </button>
          </div>
        </aside>

        {isMobileSidebarOpen ? (
          <button
            type="button"
            className="fixed inset-0 z-40 bg-slate-900/50 lg:hidden"
            onClick={() => setIsMobileSidebarOpen(false)}
            aria-label="Close sidebar"
          />
        ) : null}

        <div className={cn(
          "flex min-w-0 flex-1 flex-col overflow-hidden transition-all duration-300",
          isSidebarCollapsed ? "lg:ml-[88px]" : "lg:ml-[280px]"
        )}>
          <header className="z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur">
            <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6">
              <div className="flex min-w-0 items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 rounded-xl lg:hidden"
                  onClick={() => setIsMobileSidebarOpen(true)}
                >
                  <Menu className="h-4 w-4" />
                </Button>
                <div className="hidden min-w-0 sm:block">
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Admin Workspace</p>
                  <p className="truncate text-sm font-semibold text-slate-900">{pageTitle}</p>
                </div>
              </div>

              <div className="hidden max-w-md flex-1 md:block">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input placeholder="Search products, orders, customers..." className="h-10 rounded-xl border-slate-200 bg-slate-50 pl-10" />
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="relative h-9 w-9 rounded-xl border-slate-200">
                      <Bell className="h-4 w-4" />
                      <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80 rounded-xl border-slate-200">
                    <DropdownMenuLabel className="text-xs uppercase tracking-[0.16em] text-slate-400">Notifications</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {adminNotifications.map((notification) => (
                      <DropdownMenuItem
                        key={notification.id}
                        className="flex cursor-pointer flex-col items-start gap-1 rounded-lg px-3 py-3 transition-colors hover:bg-slate-50 data-[highlighted]:!bg-slate-50 data-[highlighted]:!text-slate-900 focus:!bg-slate-50 focus:!text-slate-900"
                      >
                        <p className="text-sm font-medium text-slate-700">{notification.title}</p>
                        <p className="text-xs text-slate-500">{notification.time}</p>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2 py-1.5 transition hover:bg-slate-50"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-slate-900 text-xs text-white">
                          {adminName
                            .split(" ")
                            .map((token) => token[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase() || "AU"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="hidden text-left sm:block">
                        <p className="text-xs font-semibold text-slate-800">{adminName}</p>
                        <p className="text-[11px] text-slate-500">Super Admin</p>
                      </div>
                      <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-52 rounded-xl border-slate-200">
                    <DropdownMenuLabel>
                      <p className="text-sm font-medium text-slate-800">{adminEmail}</p>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate("/admin/settings")} className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-rose-600 focus:text-rose-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 sm:py-7">
            <div className="mx-auto w-full max-w-[1320px]">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
