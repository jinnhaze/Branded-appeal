import React from 'react';
import { Link } from 'react-router-dom';
import { Video, ArrowRight, Laptop, Sun, BookOpen, CheckCircle2 } from 'lucide-react';

const Home = () => {
    return (
        <div className="bg-gray-50 min-h-screen py-8 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
                
                {/* Hero Section */}
                <div className="relative w-full h-[600px] bg-slate-900 rounded-3xl overflow-hidden flex items-center">
                    <img 
                        src="/images/hero_banner.png" 
                        alt="Man wearing glasses" 
                        className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay"
                    />
                    <div className="relative z-10 px-10 md:px-20 max-w-2xl">
                        <span className="inline-block px-4 py-1 rounded-full bg-blue-600/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-6 backdrop-blur-sm border border-blue-500/20">
                            Summer Collection 2024
                        </span>
                        <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight tracking-tight">
                            See Your <span className="text-blue-500">Best<br/>Self</span>
                        </h1>
                        <p className="text-lg text-gray-300 mb-10 leading-relaxed">
                            Experience the future of eyewear shopping with AI-powered virtual try-on that mirrors your style perfectly.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link to="/try-on/fallback" className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition flex items-center gap-2 shadow-lg shadow-blue-600/30">
                                <Video className="w-5 h-5" />
                                Try on Virtually
                            </Link>
                            <Link to="/shop" className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/20 transition">
                                Shop Collection
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Shop by Category */}
                <section>
                    <div className="flex justify-between items-end mb-8">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">Shop by Category</h2>
                            <p className="text-gray-500">Discover frames tailored to your lifestyle</p>
                        </div>
                        <Link to="/shop" className="text-blue-600 font-semibold hover:text-blue-800 flex items-center gap-1 text-sm">
                            View All <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Computer Glasses */}
                        <Link to="/shop?category=computer-glasses" className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition group">
                            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                <Laptop className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Computer Glasses</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                Advanced blue light protection for extended screen time and eye comfort.
                            </p>
                        </Link>

                        {/* Sunglasses */}
                        <Link to="/shop?category=sunglasses" className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition group">
                            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                <Sun className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Sunglasses</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                100% UV protection combined with iconic fashion silhouettes for sun safety.
                            </p>
                        </Link>

                        {/* Reading Glasses */}
                        <Link to="/shop?category=reading-glasses" className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition group">
                            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                <BookOpen className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Reading Glasses</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                Crystal clear precision for reading and close-up work with ergonomic fits.
                            </p>
                        </Link>
                    </div>
                </section>

                {/* Virtual Mirror Promo */}
                <section className="bg-slate-100 rounded-3xl p-8 md:p-16 flex flex-col md:flex-row items-center gap-12 overflow-hidden relative">
                    <div className="md:w-1/2 relative z-10">
                        <span className="inline-flex items-center gap-2 bg-white px-3 py-1.5 rounded-full text-xs font-bold text-blue-600 shadow-sm mb-6 uppercase tracking-wider">
                            <Video className="w-3 h-3" /> Powered by MediaPipe AI
                        </span>
                        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight tracking-tight">
                            Virtual Mirror: See the fit, before you buy.
                        </h2>
                        <p className="text-gray-600 mb-8 leading-relaxed text-lg">
                            Our advanced 3D face mapping technology uses your camera to overlay frames onto your face in real-time. It measures pupillary distance and frame width automatically to ensure a perfect fit from the comfort of your home.
                        </p>
                        
                        <ul className="space-y-4 mb-10">
                            <li className="flex items-center gap-3 text-gray-700 font-medium">
                                <CheckCircle2 className="w-6 h-6 text-blue-600" />
                                99.8% Accuracy in size estimation
                            </li>
                            <li className="flex items-center gap-3 text-gray-700 font-medium">
                                <CheckCircle2 className="w-6 h-6 text-blue-600" />
                                Real-time lighting adjustment
                            </li>
                            <li className="flex items-center gap-3 text-gray-700 font-medium">
                                <CheckCircle2 className="w-6 h-6 text-blue-600" />
                                Share your look with friends instantly
                            </li>
                        </ul>

                        <Link to="/try-on/fallback" className="inline-block bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition shadow-lg shadow-blue-600/30">
                            Launch 3D Camera
                        </Link>
                    </div>

                    <div className="md:w-1/2 relative">
                        {/* Decorative background circle */}
                        <div className="absolute inset-0 bg-blue-200/50 rounded-full blur-3xl transform scale-150"></div>
                        
                        <div className="relative bg-white p-2 rounded-3xl shadow-2xl border-4 border-white/50 backdrop-blur-sm z-10">
                            <img 
                                src="/images/hero_banner.png" 
                                alt="Virtual Try On Interface" 
                                className="w-full h-[400px] object-cover rounded-2xl"
                            />
                            {/* Scanning overlay effect mock */}
                            <div className="absolute top-1/2 left-0 w-full h-1 bg-blue-400 shadow-[0_0_20px_theme('colors.blue.500')] opacity-70 animate-pulse"></div>
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border border-blue-400 border-dashed rounded-[100%] w-3/4 h-1/2"></div>
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 translate-y-8 bg-white/90 backdrop-blur px-3 py-1 rounded text-xs font-bold text-blue-600 tracking-wider">
                                FACE ALIGNMENT
                            </div>
                            
                            {/* Dummy Success Badge */}
                            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3 border border-gray-100">
                                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                                    <CheckCircle2 className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Frame Analysis</p>
                                    <p className="text-sm font-bold text-gray-900">Perfect Fit (Size L)</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

            </div>
        </div>
    );
};

export default Home;
