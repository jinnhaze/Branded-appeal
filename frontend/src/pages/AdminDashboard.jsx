import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { ShieldCheck, Package, RefreshCw } from 'lucide-react';

const AdminDashboard = () => {
    const { user, loading: authLoading } = useContext(AuthContext);
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [dataLoading, setDataLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);

    const statuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

    const fetchOrders = async () => {
        try {
            const response = await api.get('orders/admin-orders/');
            setOrders(response.data);
        } catch (err) {
            console.error(err);
        } finally {
            setDataLoading(false);
        }
    };

    useEffect(() => {
        if (!authLoading) {
            if (!user) {
                navigate('/login');
            } else if (!user.is_staff) {
                console.log("User is not staff:", user);
                navigate('/');
            } else {
                fetchOrders();
            }
        }
    }, [user, navigate, authLoading]);

    if (authLoading || (user && user.is_staff && dataLoading)) return (
        <div className="flex justify-center items-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            setUpdatingId(orderId);
            await api.put(`orders/admin-orders/${orderId}/update_status/`, { status: newStatus });
            // Update local state
            setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        } catch (err) {
            console.error("Failed to update status", err);
            alert("Failed to update order status");
        } finally {
            setUpdatingId(null);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
            {/* Admin Header */}
            <header className="bg-gray-900 text-white shadow-lg z-50">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-4">
                            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-lg">
                                B
                            </div>
                            <h1 className="text-xl font-bold tracking-tight">Admin <span className="text-blue-400">Control Panel</span></h1>
                        </div>
                        
                        <div className="flex items-center gap-4">
                            <Link 
                                to="/" 
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition"
                            >
                                <Package className="w-4 h-4" />
                                Back to Shop
                            </Link>
                            <div className="h-6 w-[1px] bg-gray-700"></div>
                            <div className="flex items-center gap-3 bg-gray-800 px-3 py-1.5 rounded-xl border border-gray-700">
                                <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-bold">
                                    A
                                </div>
                                <span className="text-xs font-bold text-gray-300">Administrator</span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex-grow flex flex-col">
                <div className="max-w-[1400px] w-full mx-auto py-8 px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <ShieldCheck className="w-8 h-8 text-blue-600" />
                            <h2 className="text-2xl font-extrabold text-gray-900">Order Tracking Management</h2>
                        </div>
                        <div className="flex gap-2">
                            <button 
                                onClick={fetchOrders}
                                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition text-sm font-bold shadow-sm"
                            >
                                <RefreshCw className={`w-4 h-4 ${dataLoading ? 'animate-spin' : ''}`} />
                                Refresh Data
                            </button>
                        </div>
                    </div>
                    
                    <div className="bg-white shadow-xl border border-gray-100 rounded-[2rem] overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-200 text-[10px] uppercase tracking-[0.15em] text-gray-400 font-black">
                                        <th className="p-6">Order Identity</th>
                                        <th className="p-6">Purchase Date</th>
                                        <th className="p-6">Customer Profile</th>
                                        <th className="p-6">Shipping Logistics</th>
                                        <th className="p-6">Total Value</th>
                                        <th className="p-6">Status Pipeline</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {orders.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="p-20 text-center">
                                                <div className="flex flex-col items-center opacity-30">
                                                    <Package className="w-20 h-20 mb-4" />
                                                    <p className="text-xl font-bold">No active orders found</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        orders.map(order => (
                                            <tr key={order.id} className="hover:bg-blue-50/30 transition-colors group">
                                                <td className="p-6">
                                                    <div className="flex items-center gap-3">
                                                        <span className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 group-hover:bg-blue-100 group-hover:text-blue-600 transition">
                                                            ID
                                                        </span>
                                                        <span className="font-black text-gray-900">#{order.id}</span>
                                                    </div>
                                                </td>
                                                <td className="p-6 text-sm text-gray-600 font-medium">
                                                    {new Date(order.created_at).toLocaleDateString(undefined, {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </td>
                                                <td className="p-6">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-bold text-gray-900 mb-0.5">Customer {order.user}</span>
                                                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Verified Account</span>
                                                    </div>
                                                </td>
                                                <td className="p-6">
                                                    <div className="max-w-xs ring-1 ring-gray-100 bg-gray-50/50 rounded-xl p-3">
                                                        <p className="text-xs text-gray-600 leading-relaxed italic" title={order.shipping_address}>
                                                            "{order.shipping_address}"
                                                        </p>
                                                    </div>
                                                </td>
                                                <td className="p-6 text-lg font-black text-blue-600">
                                                    ${order.total_amount}
                                                </td>
                                                <td className="p-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="relative group/select w-full max-w-[180px]">
                                                            <select
                                                                value={order.status}
                                                                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                                disabled={updatingId === order.id}
                                                                className={`w-full text-xs font-black uppercase tracking-widest rounded-xl px-4 py-3 border-2 outline-none cursor-pointer appearance-none transition shadow-sm ${
                                                                    order.status === 'Processing' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                                    order.status === 'Shipped' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                                                    order.status === 'Delivered' ? 'bg-green-50 text-green-700 border-green-200' :
                                                                    order.status === 'Cancelled' ? 'bg-red-50 text-red-700 border-red-200' :
                                                                    'bg-gray-50 text-gray-700 border-gray-200 font-bold'
                                                                } ${updatingId === order.id ? 'opacity-50 grayscale' : ''}`}
                                                            >
                                                                {statuses.map(s => (
                                                                    <option key={s} value={s}>{s}</option>
                                                                ))}
                                                            </select>
                                                            {updatingId === order.id && (
                                                                <div className="absolute inset-0 flex items-center justify-center">
                                                                    <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Simple Admin Footer */}
            <footer className="mt-auto py-6 border-t border-gray-200 bg-white">
                <div className="max-w-[1400px] mx-auto px-8 text-center">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">
                        &copy; 2026 Branded Appeal Proprietary Systems &bull; Administrative Portal v2.1
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default AdminDashboard;
