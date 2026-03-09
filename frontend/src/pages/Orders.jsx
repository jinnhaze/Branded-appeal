import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { Package, Clock, Settings, Truck, CheckCircle } from 'lucide-react';

const Orders = () => {
    const { user } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await api.get('orders/');
                setOrders(response.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        if (user) fetchOrders();
        else setLoading(false);
    }, [user]);

    if (!user) return <div className="text-center py-20 text-gray-500">Please <Link to="/login" className="text-blue-600 underline font-bold">login</Link> to view order history.</div>;
    if (loading) return <div className="text-center py-20 text-gray-500 font-medium">Loading orders...</div>;

    const statuses = ['Pending', 'Processing', 'Shipped', 'Delivered'];
    
    const getStatusIndex = (status) => {
        const idx = statuses.indexOf(status);
        return idx !== -1 ? idx : 0;
    };

    const StatusIcon = ({ status, active, completed }) => {
        let colorClass = completed ? 'text-blue-600' : active ? 'text-blue-600' : 'text-gray-300';
        let bgClass = completed ? 'bg-blue-50 border-blue-600' : active ? 'bg-white border-blue-600 shadow-md ring-4 ring-blue-50' : 'bg-white border-gray-200';
        
        return (
            <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center z-10 relative ${bgClass} ${colorClass}`}>
                {status === 'Pending' && <Clock className="w-5 h-5" />}
                {status === 'Processing' && <Settings className="w-5 h-5" />}
                {status === 'Shipped' && <Truck className="w-5 h-5" />}
                {status === 'Delivered' && <CheckCircle className="w-5 h-5" />}
            </div>
        );
    };

    return (
        <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8 min-h-screen">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Order History & Tracking</h2>
            
            {orders.length === 0 ? (
                <div className="bg-white rounded-3xl shadow-sm text-center py-32 border border-gray-100">
                    <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Package className="w-12 h-12 text-gray-300" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">No orders found</h3>
                    <p className="text-gray-500 mb-8">You haven't placed any orders yet.</p>
                    <Link to="/shop" className="bg-blue-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-blue-700 transition">
                        Start Shopping
                    </Link>
                </div>
            ) : (
                <div className="space-y-8">
                    {orders.map(order => {
                        const currentStatusIdx = getStatusIndex(order.status);
                        
                        return (
                            <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="bg-gray-50 px-8 py-5 border-b border-gray-100 flex justify-between items-center flex-wrap gap-6">
                                    <div>
                                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1">Order Placed</span>
                                        <span className="text-sm font-bold text-gray-900">{new Date(order.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <div>
                                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1">Total Amount</span>
                                        <span className="text-sm font-bold text-gray-900">${order.total_amount}</span>
                                    </div>
                                    <div>
                                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1">Order #</span>
                                        <span className="text-sm font-bold text-gray-900">{order.id}</span>
                                    </div>
                                </div>
                                
                                <div className="p-8">
                                    {/* Tracking Progress Bar */}
                                    <div className="mb-10 px-4 md:px-12">
                                        <div className="relative">
                                            {/* Track background line */}
                                            <div className="absolute top-5 left-0 w-full h-0.5 bg-gray-200"></div>
                                            {/* Track active line */}
                                            <div 
                                                className="absolute top-5 left-0 h-0.5 bg-blue-600 transition-all duration-500"
                                                style={{ width: `${(currentStatusIdx / (statuses.length - 1)) * 100}%` }}
                                            ></div>
                                            
                                            <div className="relative flex justify-between">
                                                {statuses.map((step, idx) => (
                                                    <div key={step} className="flex flex-col items-center">
                                                        <StatusIcon 
                                                            status={step} 
                                                            active={idx === currentStatusIdx} 
                                                            completed={idx < currentStatusIdx} 
                                                        />
                                                        <span className={`mt-3 text-xs font-bold ${idx <= currentStatusIdx ? 'text-gray-900' : 'text-gray-400'}`}>
                                                            {step}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <ul className="space-y-6">
                                        {order.items.map(item => (
                                            <li key={item.id} className="flex items-center gap-6">
                                                <div className="w-20 h-20 bg-gray-50 rounded-xl flex items-center justify-center p-2 shrink-0 border border-gray-100">
                                                    {item.product.image ? (
                                                        <img src={item.product.image} alt={item.product.name} className="max-h-full object-contain mix-blend-multiply" />
                                                    ) : (
                                                        <span className="text-xs font-medium text-gray-400">No Img</span>
                                                    )}
                                                </div>
                                                <div className="flex-grow">
                                                    <Link to={`/product/${item.product.id}`} className="text-lg font-bold text-gray-900 hover:text-blue-600 transition">
                                                        {item.product.name}
                                                    </Link>
                                                    <p className="text-sm font-medium text-gray-500 mt-1">Qty: {item.quantity}  •  ${item.price}</p>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="mt-8 pt-6 border-t border-gray-100 pb-2">
                                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Shipping Information</h4>
                                        <p className="text-sm font-medium text-gray-900 leading-relaxed max-w-2xl">{order.shipping_address}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Orders;
