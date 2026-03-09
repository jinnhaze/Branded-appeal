import React, { useContext, useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Heart, Search, ShoppingBag, User as UserIcon, LogOut, Package, MapPin, Box } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleLogout = () => {
        logout();
        navigate('/login');
        setIsProfileOpen(false);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <nav className="bg-white border-b border-gray-100 w-full z-50 sticky top-0">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20 gap-8">
                    {/* Logo & Main Links */}
                    <div className="flex items-center gap-8">
                        <Link to="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-xl">
                                B
                            </div>
                            <span className="text-xl font-bold text-gray-900 tracking-tight">Branded Appeal</span>
                        </Link>
                        
                        <div className="hidden md:flex items-center gap-6">
                            <Link to="/shop" className="text-sm font-medium text-gray-600 hover:text-gray-900">Shop</Link>
                            <Link to="/shop" className="text-sm font-medium text-gray-600 hover:text-gray-900">Collections</Link>
                            <Link to="/about" className="text-sm font-medium text-gray-600 hover:text-gray-900">About</Link>
                            <Link to="/help" className="text-sm font-medium text-gray-600 hover:text-gray-900">Help</Link>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="flex-1 max-w-xl hidden md:block">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-full leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white focus:border-blue-500 sm:text-sm transition-colors"
                                placeholder="What are you looking for?"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && e.target.value.trim()) {
                                        navigate(`/shop?search=${encodeURIComponent(e.target.value.trim())}`);
                                    }
                                }}
                            />
                        </div>
                    </div>

                    {/* Icons */}
                    <div className="flex items-center gap-4 sm:gap-6">
                        <button className="md:hidden text-gray-600 hover:text-blue-600">
                            <Search className="w-6 h-6" />
                        </button>
                        
                        <Link to="/wishlist" className="text-gray-600 hover:text-blue-600 relative">
                            <Heart className="w-6 h-6" />
                            {/* Dummy badge */}
                            <span className="absolute -top-1.5 -right-1.5 bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[16px] text-center border-2 border-white">
                                0
                            </span>
                        </Link>
                        
                        <Link to="/cart" className="text-gray-600 hover:text-blue-600 relative">
                            <ShoppingBag className="w-6 h-6" />
                            {/* Dummy badge */}
                            <span className="absolute -top-1.5 -right-1.5 bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[16px] text-center border-2 border-white">
                                0
                            </span>
                        </Link>
                        
                        <div className="relative" ref={dropdownRef}>
                            <button 
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition"
                            >
                                <UserIcon className="w-5 h-5 fill-current" />
                            </button>

                            {/* Dropdown Menu */}
                            {isProfileOpen && (
                                <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden py-2 transform opacity-100 scale-100 transition-all origin-top-right">
                                    {userDataSection(user)}
                                    <div className="py-1">
                                        {!user ? (
                                            <Link 
                                                to="/login" 
                                                onClick={() => setIsProfileOpen(false)}
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                                            >
                                                Sign in / Sign up
                                            </Link>
                                        ) : (
                                            <Link 
                                                to="/profile" 
                                                onClick={() => setIsProfileOpen(false)}
                                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 w-full text-left"
                                            >
                                                My Profile
                                            </Link>
                                        )}
                                        <Link 
                                            to="/orders" 
                                            onClick={() => setIsProfileOpen(false)}
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                                        >
                                            Track Order
                                        </Link>
                                        <button 
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 w-full text-left"
                                        >
                                            Locate a store
                                        </button>
                                        <button 
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 w-full text-left"
                                        >
                                            Try @ Home
                                        </button>
                                        
                                        {user && user.is_staff && (
                                            <Link 
                                                to="/admin" 
                                                onClick={() => setIsProfileOpen(false)}
                                                className="block px-4 py-2 mt-1 -mb-1 bg-blue-50 text-sm font-bold text-blue-700 hover:bg-blue-100 w-full text-left border-t border-blue-100"
                                            >
                                                Admin Dashboard
                                            </Link>
                                        )}
                                    </div>
                                    {user && (
                                        <div className="border-t border-gray-100 pt-1 mt-1">
                                            <button 
                                                onClick={handleLogout}
                                                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 bg-white"
                                            >
                                                Logout
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

const userDataSection = (user) => {
    if (!user) return null;
    return (
        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
            <p className="text-sm font-medium text-gray-900 truncate">Logged in as</p>
            <p className="text-xs text-gray-500 truncate">{user.email || user.username || 'User'}</p>
        </div>
    );
}

export default Navbar;
