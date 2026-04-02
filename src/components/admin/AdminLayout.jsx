import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Tags,
    Package,
    LogOut,
    Menu,
    Bell,
    Search,
    ChevronLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const AdminLayout = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        // mock logout
        navigate('/admin/login');
    };

    const navItems = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
        { name: 'Categories', icon: Tags, path: '/admin/categories' },
        { name: 'Products', icon: Package, path: '/admin/products' },
    ];

    return (
        <div className="admin-panel min-h-screen bg-gray-50/50 flex">
            {/* Sidebar */}
            <aside
                className={`${isCollapsed ? 'w-20' : 'w-64'
                    } bg-white border-r border-border transition-all duration-300 ease-in-out flex flex-col sticky top-0 h-screen z-40 shadow-[4px_0_24px_rgba(0,0,0,0.02)]`}
            >
                <div className="h-16 flex items-center justify-between px-4 border-b border-border">
                    {!isCollapsed && (
                        <span className="text-xl font-display font-semibold tracking-tight text-primary">Chetak Plus</span>
                    )}
                    {isCollapsed && (
                        <span className="text-xl font-display font-bold text-primary mx-auto">CP</span>
                    )}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className={`h-8 w-8 text-muted-foreground hover:text-foreground ${isCollapsed ? 'hidden' : ''}`}
                    >
                        <ChevronLeft size={18} />
                    </Button>
                </div>

                <nav className="flex-1 py-6 flex flex-col gap-2 px-3">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path ||
                            (item.path !== '/admin' && location.pathname.startsWith(item.path));
                        return (
                            <NavLink
                                key={item.name}
                                to={item.path}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${isActive
                                    ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                                    : 'text-muted-foreground hover:bg-secondary/80 hover:text-foreground'
                                    }`}
                            >
                                <Icon size={20} className={isActive ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-foreground'} />
                                {!isCollapsed && <span className="font-medium text-sm">{item.name}</span>}
                            </NavLink>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-border">
                    <button
                        onClick={handleLogout}
                        className={`flex items-center gap-3 px-3 py-2.5 w-full rounded-xl transition-colors text-destructive hover:bg-destructive/10 ${isCollapsed ? 'justify-center' : ''
                            }`}
                    >
                        <LogOut size={20} />
                        {!isCollapsed && <span className="font-medium text-sm">Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Top Header */}
                <header className="h-16 bg-white/80 backdrop-blur-md border-b border-border sticky top-0 z-30 flex items-center justify-between px-6 shadow-sm">
                    <div className="flex items-center gap-4 flex-1">
                        {isCollapsed && (
                            <Button variant="ghost" size="icon" onClick={() => setIsCollapsed(false)} className="md:hidden">
                                <Menu size={20} />
                            </Button>
                        )}
                        <div className="relative w-full max-w-md hidden sm:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                            <Input
                                placeholder="Search everywhere..."
                                className="pl-10 bg-gray-50/50 border-gray-200 focus-visible:ring-primary/20 h-10 rounded-full"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground hidden sm:flex">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full border-2 border-white"></span>
                        </Button>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                                    <Avatar className="h-10 w-10 border border-gray-100 shadow-sm">
                                        <AvatarImage src="https://i.pravatar.cc/150?u=admin" alt="Admin" />
                                        <AvatarFallback className="bg-primary/10 text-primary">AD</AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">Admin User</p>
                                        <p className="text-xs leading-none text-muted-foreground">admin@chetakplus.com</p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Log out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-auto p-6 lg:p-8 animate-fade-in scrollbar-hide">
                    <div className="max-w-7xl mx-auto w-full">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
