import React from 'react';
import {
    Users,
    ShoppingBag,
    DollarSign,
    Activity,
    ArrowUpRight,
    TrendingUp,
    Package
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useData } from '@/context/DataContext';

const AdminDashboard = () => {
    const { products, categories, loading } = useData();

    const statCards = [
        {
            title: 'Total Revenue',
            value: '₹3,45,231',
            trend: '+20.1% from last month',
            icon: DollarSign,
            color: 'text-amber-500',
            bg: 'bg-amber-500/10'
        },
        {
            title: 'Active Categories',
            value: categories ? categories.length.toString() : '0',
            trend: 'Recently updated',
            icon: Users,
            color: 'text-blue-500',
            bg: 'bg-blue-500/10'
        },
        {
            title: 'Total Sales',
            value: '+1,234',
            trend: '+19% from last month',
            icon: ShoppingBag,
            color: 'text-purple-500',
            bg: 'bg-purple-500/10'
        },
        {
            title: 'Active Products',
            value: products ? products.length.toString() : '0',
            trend: 'Live on website',
            icon: Package,
            color: 'text-emerald-500',
            bg: 'bg-emerald-500/10'
        }
    ];

    const recentOrders = [
        { id: 'ORD-001', customer: 'Liam Johnson', total: '₹2,500', status: 'Completed', date: 'Today, 10:20 AM' },
        { id: 'ORD-002', customer: 'Olivia Smith', total: '₹1,450', status: 'Processing', date: 'Today, 09:12 AM' },
        { id: 'ORD-003', customer: 'Noah Williams', total: '₹850', status: 'Completed', date: 'Yesterday, 04:30 PM' },
        { id: 'ORD-004', customer: 'Emma Brown', total: '₹3,200', status: 'Pending', date: 'Yesterday, 02:15 PM' },
        { id: 'ORD-005', customer: 'Ava Jones', total: '₹1,999', status: 'Completed', date: 'Oct 24, 11:00 AM' },
    ];

    if (loading) {
        return <div className="p-8 text-center animate-pulse text-muted-foreground">Loading dashboard data...</div>;
    }

    return (
        <div className="space-y-8 animate-fade-in">
            <div>
                <h1 className="text-3xl font-display font-bold text-foreground">Dashboard Overview</h1>
                <p className="text-muted-foreground mt-1 text-sm">Here's what's happening in your store today.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {statCards.map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={i} className="border-none shadow-sm bg-white overflow-hidden group hover-lift">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center transition-transform group-hover:scale-110`}>
                                        <Icon size={24} />
                                    </div>
                                    <TrendingUp className="text-muted-foreground w-4 h-4" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                                    <h3 className="text-2xl font-bold tracking-tight text-foreground">{stat.value}</h3>
                                    <p className="text-xs text-muted-foreground flex items-center gap-1 font-medium">
                                        <ArrowUpRight className="w-3 h-3 text-emerald-500" />
                                        {stat.trend}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                <Card className="lg:col-span-4 border-none shadow-sm">
                    <CardHeader>
                        <CardTitle className="font-display">Recent Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {recentOrders.map((order, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center font-bold text-xs text-foreground tracking-wider">
                                            {order.customer.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-foreground leading-none mb-1">{order.customer}</p>
                                            <p className="text-xs text-muted-foreground font-mono">{order.id} &bull; {order.date}</p>
                                        </div>
                                    </div>
                                    <div className="text-right flex flex-col items-end gap-1.5">
                                        <p className="text-sm font-semibold">{order.total}</p>
                                        <span className={`text-[10px] uppercase tracking-wide font-bold px-2.5 py-0.5 rounded-full ${order.status === 'Completed' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                                                order.status === 'Processing' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                                                    'bg-orange-50 text-orange-600 border border-orange-100'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="lg:col-span-3 border-none shadow-sm">
                    <CardHeader>
                        <CardTitle className="font-display">System Status</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-8">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                                <Activity size={24} />
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-foreground">API Connection Active</h4>
                                <p className="text-xs text-muted-foreground mt-0.5">Fetching from PHP backend correctly</p>
                            </div>
                        </div>

                        <div className="space-y-5 mt-2">
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium">Storage</span>
                                    <span className="text-sm text-muted-foreground">65% used</span>
                                </div>
                                <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                                    <div className="h-full bg-primary w-[65%] rounded-full" />
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium">Server Load</span>
                                    <span className="text-sm text-muted-foreground">32% load</span>
                                </div>
                                <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 w-[32%] rounded-full" />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AdminDashboard;
