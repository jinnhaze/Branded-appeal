import React, { useContext, useEffect } from 'react';
import { NavLink, Navigate, Outlet, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
    LayoutDashboard, 
    Package, 
    Users, 
    LogOut, 
    ShoppingBag, 
    ShieldCheck, 
    Menu, 
    X 
} from 'lucide-react';

const AdminLayout = () => {
    const { user, loading, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

    useEffect(() => {
        if (!loading && (!user || !user.is_staff)) {
            navigate('/admin/login');
        }
    }, [user, loading, navigate]);

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    if (!user || !user.is_staff) return <Navigate to="/admin/login" />;

    const navItems = [
        { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
        { path: '/admin/orders', icon: Package, label: 'Orders' },
        { path: '/admin/users', icon: Users, label: 'Customers' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans">
            {/* Sidebar */}
            <aside 
                className={`bg-gray-900 text-white w-64 fixed inset-y-0 left-0 transform transition-transform duration-300 ease-in-out z-50 ${
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold">
                            B
                        </div>
                        <span className="text-xl font-black tracking-tight text-white uppercase italic">
                            Branded<span className="text-blue-500">Panel</span>
                        </span>
                    </div>

                    <nav className="space-y-1">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                end={item.end}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                                        isActive 
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' 
                                        : 'text-gray-400 hover:text-white hover:bg-gray-800'
                                    }`
                                }
                            >
                                <item.icon className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110`} />
                                <span className="font-bold text-sm tracking-wide">{item.label}</span>
                            </NavLink>
                        ))}
                    </nav>
                </div>

                <div className="absolute bottom-0 w-full p-6 space-y-4">
                    <button 
                        onClick={() => navigate('/')}
                        className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-all font-bold text-sm"
                    >
                        <ShoppingBag className="w-5 h-5" />
                        Exit to Shop
                    </button>
                    <button 
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-white hover:bg-red-600 rounded-xl transition-all font-bold text-sm"
                    >
                        <LogOut className="w-5 h-5" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className={`flex-grow transition-all duration-300 ${isSidebarOpen ? 'pl-64' : 'pl-0'}`}>
                {/* Top Header */}
                <header className="bg-white border-b border-gray-200 sticky top-0 z-40 px-8 py-4 flex justify-between items-center shadow-sm">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"
                        >
                            {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                        <h2 className="text-lg font-black text-gray-900 uppercase tracking-widest">
                            {user.username}'s Workspace
                        </h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex flex-col items-end">
                            <span className="text-sm font-black text-gray-900 leading-none mb-0.5">{user.username}</span>
                            <span className="text-[10px] font-black text-blue-600 uppercase tracking-tighter">System Administrator</span>
                        </div>
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-black shadow-inner">
                            {user.username[0].toUpperCase()}
                        </div>
                    </div>
                </header>

                <main className="p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
