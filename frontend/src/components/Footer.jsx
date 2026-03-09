import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-slate-900 text-white mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-gray-800 pb-12">
                    
                    {/* Brand Info */}
                    <div className="md:col-span-1 border-r border-gray-800 pr-8">
                        <Link to="/" className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center text-white font-bold text-xl">
                                B
                            </div>
                            <span className="text-xl font-bold tracking-tight">Branded Appeal</span>
                        </Link>
                        <p className="text-sm text-gray-400 leading-relaxed mb-6">
                            Premium eyewear for the modern visionary. Virtual try-ons, expert styling, and lifetime frame support.
                        </p>
                    </div>

                    {/* Links */}
                    <div className="md:col-span-1">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">Shop</h4>
                        <ul className="space-y-3 text-sm text-gray-300">
                            <li><Link to="/shop" className="hover:text-blue-400 transition">New Arrivals</Link></li>
                            <li><Link to="/shop" className="hover:text-blue-400 transition">Best Sellers</Link></li>
                            <li><Link to="/shop" className="hover:text-blue-400 transition">Prescription</Link></li>
                            <li><Link to="/shop" className="hover:text-blue-400 transition">Accessories</Link></li>
                        </ul>
                    </div>

                    <div className="md:col-span-1">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">Company</h4>
                        <ul className="space-y-3 text-sm text-gray-300">
                            <li><Link to="/" className="hover:text-blue-400 transition">About Us</Link></li>
                            <li><Link to="/" className="hover:text-blue-400 transition">Stores</Link></li>
                            <li><Link to="/" className="hover:text-blue-400 transition">Sustainability</Link></li>
                            <li><Link to="/" className="hover:text-blue-400 transition">Careers</Link></li>
                        </ul>
                    </div>

                    <div className="md:col-span-1">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">Support</h4>
                        <ul className="space-y-3 text-sm text-gray-300">
                            <li><Link to="/" className="hover:text-blue-400 transition">Contact</Link></li>
                            <li><Link to="/orders" className="hover:text-blue-400 transition">Track Order</Link></li>
                            <li><Link to="/" className="hover:text-blue-400 transition">Returns</Link></li>
                            <li><Link to="/" className="hover:text-blue-400 transition">FAQ</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-gray-500">
                        &copy; 2024 Branded Appeal Eyewear. All rights reserved.
                    </p>
                    <div className="flex items-center gap-4">
                        <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition">
                            <Facebook className="w-5 h-5" />
                        </a>
                        <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition">
                            <Twitter className="w-5 h-5" />
                        </a>
                        <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition">
                            <Instagram className="w-5 h-5" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
