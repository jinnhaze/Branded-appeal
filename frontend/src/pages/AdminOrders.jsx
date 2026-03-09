import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Package, RefreshCw, Search, ChevronRight } from 'lucide-react';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const statuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await api.get('orders/admin-orders/');
            setOrders(response.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            setUpdatingId(orderId);
            await api.put(`orders/admin-orders/${orderId}/update_status/`, { status: newStatus });
            setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        } catch (err) {
            console.error(err);
            alert("Failed to update status");
        } finally {
            setUpdatingId(null);
        }
    };

    const filteredOrders = orders.filter(o => 
        o.id.toString().includes(searchTerm) || 
        (o.user_details?.email || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
                <div className="relative flex-grow max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Search IDs or Emails..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                </div>
                <button 
                    onClick={fetchOrders}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition shadow-lg shadow-blue-200 text-xs font-black uppercase tracking-widest"
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                </button>
            </div>

            <div className="bg-white shadow-xl border border-gray-100 rounded-[2.5rem] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100 text-[10px] uppercase font-black tracking-widest text-gray-400">
                                <th className="p-6">Order Entry</th>
                                <th className="p-6">Customer Info</th>
                                <th className="p-6">Shipping Destination</th>
                                <th className="p-6">Total Cost</th>
                                <th className="p-6">Workflow Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-20 text-center opacity-30">
                                        <Package className="w-16 h-16 mx-auto mb-4" />
                                        <p className="font-black text-lg uppercase tracking-widest">No matching records found</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map(order => (
                                    <tr key={order.id} className="hover:bg-blue-50/20 transition-colors group">
                                        <td className="p-6">
                                            <div className="flex items-center gap-3">
                                                <span className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-xs font-black text-gray-400 group-hover:bg-blue-100 group-hover:text-blue-600 transition">#{order.id}</span>
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">{new Date(order.created_at).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black text-gray-900 leading-tight">
                                                    {order.user_details?.first_name} {order.user_details?.last_name}
                                                </span>
                                                <span className="text-[10px] font-bold text-gray-500">{order.user_details?.email}</span>
                                                <span className="text-[10px] font-bold text-blue-600">{order.user_details?.phone_number}</span>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="max-w-[200px]">
                                                <p className="text-xs text-gray-600 font-medium italic border-l-2 border-blue-200 pl-3 leading-relaxed truncate" title={order.shipping_address}>
                                                    {order.shipping_address}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <span className="text-sm font-black text-gray-900">${order.total_amount}</span>
                                        </td>
                                        <td className="p-6">
                                            <div className="relative">
                                                <select
                                                    value={order.status}
                                                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                    disabled={updatingId === order.id}
                                                    className={`w-full max-w-[160px] text-[10px] font-black uppercase tracking-widest rounded-xl px-4 py-2.5 border-2 outline-none appearance-none transition shadow-sm cursor-pointer ${
                                                        order.status === 'Processing' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                        order.status === 'Shipped' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                                        order.status === 'Delivered' ? 'bg-green-50 text-green-700 border-green-200' :
                                                        order.status === 'Cancelled' ? 'bg-red-50 text-red-700 border-red-200' :
                                                        'bg-gray-50 text-gray-700 border-gray-200'
                                                    }`}
                                                >
                                                    {statuses.map(s => (
                                                        <option key={s} value={s}>{s}</option>
                                                    ))}
                                                </select>
                                                {updatingId === order.id && (
                                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                                        <RefreshCw className="w-3 h-3 text-blue-600 animate-spin" />
                                                    </div>
                                                )}
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
    );
};

export default AdminOrders;
