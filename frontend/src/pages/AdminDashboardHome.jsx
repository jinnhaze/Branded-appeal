import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Users, Package, TrendingUp, DollarSign } from 'lucide-react';

const AdminDashboardHome = () => {
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalUsers: 0,
        totalRevenue: 0,
        recentOrders: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [ordersRes, usersRes] = await Promise.all([
                    api.get('orders/admin-orders/'),
                    api.get('api/users/admin-users/')
                ]);
                
                const orders = ordersRes.data;
                const revenue = orders.filter(o => o.status !== 'Cancelled').reduce((acc, curr) => acc + parseFloat(curr.total_amount), 0);
                
                setStats({
                    totalOrders: orders.length,
                    totalUsers: usersRes.data.length,
                    totalRevenue: revenue.toFixed(2),
                    recentOrders: orders.slice(0, 5)
                });
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const cards = [
        { label: 'Total Revenue', value: `$${stats.totalRevenue}`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-100' },
        { label: 'Total Orders', value: stats.totalOrders, icon: Package, color: 'text-blue-600', bg: 'bg-blue-100' },
        { label: 'Total Customers', value: stats.totalUsers, icon: Users, color: 'text-purple-600', bg: 'bg-purple-100' },
        { label: 'Growth Rate', value: '+12%', icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-100' },
    ];

    if (loading) return <div>Loading Summary...</div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, i) => (
                    <div key={i} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-2xl ${card.bg}`}>
                                <card.icon className={`w-6 h-6 ${card.color}`} />
                            </div>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Live Updates</span>
                        </div>
                        <h3 className="text-sm font-black text-gray-500 uppercase tracking-tighter mb-1">{card.label}</h3>
                        <p className="text-3xl font-black text-gray-900 tracking-tight">{card.value}</p>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-black text-gray-900 uppercase tracking-widest">Recent Activity</h3>
                    <button className="text-xs font-black text-blue-600 hover:underline uppercase tracking-widest">View Analytics &rarr;</button>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b-2 border-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                <th className="pb-4">Order ID</th>
                                <th className="pb-4">Customer</th>
                                <th className="pb-4">Status</th>
                                <th className="pb-4 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {stats.recentOrders.map(order => (
                                <tr key={order.id} className="group transition-colors hover:bg-gray-50/50">
                                    <td className="py-4 font-black text-gray-900 tracking-tighter text-sm">#{order.id}</td>
                                    <td className="py-4 text-sm font-bold text-gray-600">Customer {order.user}</td>
                                    <td className="py-4">
                                        <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                                            order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                                            order.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                                            'bg-blue-100 text-blue-700'
                                        }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="py-4 text-right font-black text-gray-900 text-sm">${order.total_amount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardHome;
