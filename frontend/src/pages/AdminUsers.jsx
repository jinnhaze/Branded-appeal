import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Users, Mail, Phone, MapPin, Search, Calendar } from 'lucide-react';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await api.get('api/users/admin-users/');
                setUsers(response.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const filteredUsers = users.filter(u => 
        u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
                <div className="relative flex-grow max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Search Customers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                </div>
                <div className="flex items-center gap-3 bg-blue-50 px-4 py-2 rounded-2xl border border-blue-100">
                    <Users className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-black text-blue-600 uppercase tracking-widest">{users.length} Total Accounts</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full py-20 text-center text-gray-400 font-black uppercase tracking-[0.2em]">Synchronizing user registry...</div>
                ) : filteredUsers.length === 0 ? (
                    <div className="col-span-full py-20 text-center text-gray-300 font-black uppercase tracking-widest">No customer profiles found</div>
                ) : (
                    filteredUsers.map(user => (
                        <div key={user.id} className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
                            <div className="flex items-center gap-5 mb-8">
                                <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center text-2xl font-black text-gray-400 group-hover:from-blue-600 group-hover:to-indigo-600 group-hover:text-white transition-all duration-500 shadow-inner">
                                    {user.username[0].toUpperCase()}
                                </div>
                                <div className="flex flex-col">
                                    <h4 className="text-xl font-black text-gray-900 tracking-tight leading-none mb-1">
                                        {user.first_name} {user.last_name || user.username}
                                    </h4>
                                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">@{user.username}</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-4 text-gray-500 group-hover:text-gray-900 transition-colors">
                                    <div className="p-2 bg-gray-50 rounded-xl group-hover:bg-blue-50 transition-colors">
                                        <Mail className="w-4 h-4" />
                                    </div>
                                    <span className="text-xs font-bold truncate">{user.email}</span>
                                </div>
                                <div className="flex items-center gap-4 text-gray-500 group-hover:text-gray-900 transition-colors">
                                    <div className="p-2 bg-gray-50 rounded-xl group-hover:bg-blue-50 transition-colors">
                                        <Phone className="w-4 h-4" />
                                    </div>
                                    <span className="text-xs font-bold">{user.phone_number || 'No contact provided'}</span>
                                </div>
                                <div className="flex items-start gap-4 text-gray-500 group-hover:text-gray-900 transition-colors">
                                    <div className="p-2 bg-gray-50 rounded-xl group-hover:bg-blue-50 transition-colors mt-0.5">
                                        <MapPin className="w-4 h-4" />
                                    </div>
                                    <span className="text-xs font-bold leading-relaxed">{user.address || 'No registered address'}</span>
                                </div>
                            </div>

                            <div className="mt-8 pt-8 border-t border-gray-50 flex justify-between items-center">
                                <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-tighter">
                                    <Calendar className="w-3 h-3" />
                                    Member since {new Date().getFullYear()}
                                </div>
                                <button className="text-[10px] font-black text-white bg-gray-900 px-4 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest">
                                    Edit Profile
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AdminUsers;
