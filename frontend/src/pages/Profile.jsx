import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, Phone, MapPin, Package, ChevronRight, Clock, Settings, Truck, CheckCircle } from 'lucide-react';

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchProfileAndOrders = async () => {
            try {
                const [profileRes, ordersRes] = await Promise.all([
                    api.get('users/profile/'),
                    api.get('orders/')
                ]);
                setProfile(profileRes.data);
                setOrders(ordersRes.data.slice(0, 3)); // show last 3 orders
            } catch (err) {
                console.error("Failed to fetch profile data", err);
            } finally {
                setLoading(false);
            }
        };
        if (user) fetchProfileAndOrders();
    }, [user]);

    if (loading) return (
        <div className="flex justify-center items-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    if (!profile) return <div className="text-center py-20 text-gray-500">Please login to view your profile.</div>;

    const getStatusToken = (status) => {
        switch(status) {
            case 'Processing': return { icon: <Settings className="w-4 h-4" />, color: 'bg-blue-100 text-blue-700' };
            case 'Shipped': return { icon: <Truck className="w-4 h-4" />, color: 'bg-yellow-100 text-yellow-700' };
            case 'Delivered': return { icon: <CheckCircle className="w-4 h-4" />, color: 'bg-green-100 text-green-700' };
            default: return { icon: <Clock className="w-4 h-4" />, color: 'bg-gray-100 text-gray-700' };
        }
    };

    return (
        <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* User Info Card */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
                        <div className="bg-blue-600 h-24"></div>
                        <div className="px-6 pb-8 -mt-12 text-center">
                            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full border-4 border-white bg-gray-100 text-gray-400 mb-4 overflow-hidden">
                                <User className="w-12 h-12" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">{profile.first_name} {profile.last_name}</h2>
                            <p className="text-sm text-gray-500 font-medium">@{profile.username}</p>
                            
                            <div className="mt-8 space-y-4 text-left">
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                                        <Mail className="w-4 h-4" />
                                    </div>
                                    <span>{profile.email}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                                        <Phone className="w-4 h-4" />
                                    </div>
                                    <span>{profile.phone_number || 'Not provided'}</span>
                                </div>
                                <div className="flex items-start gap-3 text-sm text-gray-600">
                                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 shrink-0">
                                        <MapPin className="w-4 h-4" />
                                    </div>
                                    <span className="leading-relaxed">{profile.address || 'No address saved'}</span>
                                </div>
                            </div>
                            
                            <button className="w-full mt-8 py-3 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-black transition">
                                Edit Profile
                            </button>
                        </div>
                    </div>
                </div>

                {/* Orders Tracking Section */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-2xl font-bold text-gray-900">Recent Orders</h3>
                        <Link to="/orders" className="text-blue-600 font-bold text-sm hover:underline flex items-center gap-1">
                            View All <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>

                    {orders.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-12 text-center">
                            <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 font-medium">No recent orders found</p>
                            <Link to="/shop" className="text-blue-600 font-bold mt-2 inline-block">Start Shopping</Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {orders.map(order => {
                                const statusInfo = getStatusToken(order.status);
                                return (
                                    <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 transition hover:border-blue-200">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Order #{order.id}</p>
                                                <p className="text-sm font-bold text-gray-900">{new Date(order.created_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                                            </div>
                                            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${statusInfo.color}`}>
                                                {statusInfo.icon}
                                                {order.status}
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-4">
                                            <div className="flex -space-x-3 overflow-hidden">
                                                {order.items.slice(0, 3).map((item, idx) => (
                                                    <div key={idx} className="inline-block h-12 w-12 rounded-xl ring-2 ring-white bg-gray-50 border border-gray-100 overflow-hidden p-1">
                                                        <img src={item.product.image} alt="" className="h-full w-full object-contain mix-blend-multiply" />
                                                    </div>
                                                ))}
                                                {order.items.length > 3 && (
                                                    <div className="flex items-center justify-center h-12 w-12 rounded-xl ring-2 ring-white bg-gray-100 border border-gray-100 text-xs font-bold text-gray-500">
                                                        +{order.items.length - 3}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="ml-2">
                                                <p className="text-sm font-bold text-gray-900">${order.total_amount}</p>
                                                <p className="text-xs text-gray-500">{order.items.length} {order.items.length === 1 ? 'item' : 'items'}</p>
                                            </div>
                                            <Link 
                                                to="/orders" 
                                                className="ml-auto p-2 bg-gray-50 rounded-full text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition"
                                            >
                                                <ChevronRight className="w-5 h-5" />
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                    
                    {/* Saved Addresses Section (Quick View) */}
                    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm mt-8">
                        <div className="flex items-center gap-3 mb-6">
                            <MapPin className="w-6 h-6 text-blue-600" />
                            <h3 className="text-xl font-bold text-gray-900">Default Shipping Address</h3>
                        </div>
                        <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                            <p className="text-gray-700 leading-relaxed font-medium">
                                {profile.address || 'No address saved yet. Add an address during checkout or edit your profile.'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
