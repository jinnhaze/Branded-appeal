import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import { Camera, Heart, Star, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

const Shop = () => {
    const [searchParams] = useSearchParams();
    const initialCategory = searchParams.get('category');
    const searchQuery = searchParams.get('search') || '';
    
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Filter States
    const [selectedCategory, setSelectedCategory] = useState(initialCategory || 'all');
    const [maxPrice, setMaxPrice] = useState(500);
    const [frameWidthPreset, setFrameWidthPreset] = useState('all'); // all, narrow, medium, wide
    
    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 6;

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await api.get('products/products/');
                setProducts(response.data);
            } catch (err) {
                console.error("Failed to fetch products", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // Filter products
    const filteredProducts = products.filter(p => {
        // Category Filter
        const matchCategory = selectedCategory === 'all' 
            || p.category?.slug === selectedCategory 
            || p.category?.name.toLowerCase().includes(selectedCategory.split('-')[0]);
            
        // Search Filter (if any)
        const matchSearch = searchQuery === '' 
            || p.name.toLowerCase().includes(searchQuery.toLowerCase());
            
        // Price Filter
        const matchPrice = parseFloat(p.price) <= maxPrice;

        // Frame Width Filter (Assuming 'narrow' < 135, 'medium' 135-145, 'wide' > 145)
        let matchWidth = true;
        if (frameWidthPreset !== 'all' && p.frame_width) {
            if (frameWidthPreset === 'narrow') matchWidth = p.frame_width < 135;
            else if (frameWidthPreset === 'medium') matchWidth = p.frame_width >= 135 && p.frame_width <= 145;
            else if (frameWidthPreset === 'wide') matchWidth = p.frame_width > 145;
        }

        return matchCategory && matchSearch && matchPrice && matchWidth;
    });

    // Pagination Logic
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const categories = [
        { id: 'all', name: 'All Eyewear', icon: '👓' },
        { id: 'reading-glasses', name: 'Reading', icon: '📖' },
        { id: 'sunglasses', name: 'Sunglasses', icon: '☀️' },
        { id: 'computer-glasses', name: 'Computer', icon: '💻' },
    ];

    if (loading) return <div className="text-center py-20 text-gray-500">Loading collection...</div>;

    const pageTitle = searchQuery ? `Search: "${searchQuery}"` : (categories.find(c => c.id === selectedCategory)?.name || 'All Eyewear');

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            {/* Breadcrumb */}
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
                <p className="text-sm text-gray-500">
                    <Link to="/" className="hover:text-blue-600 transition">Home</Link> <span className="mx-2">›</span> 
                    <span className="text-gray-900 font-medium">Shop</span>
                </p>
            </div>

            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-10 mt-4">
                
                {/* Left Sidebar */}
                <div className="w-full lg:w-64 flex-shrink-0 space-y-10">
                    
                    {/* Categories Filter */}
                    <div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Categories</h3>
                        <ul className="space-y-2">
                            {categories.map(cat => (
                                <li key={cat.id}>
                                    <button 
                                        onClick={() => { setSelectedCategory(cat.id); setCurrentPage(1); }}
                                        className={`w-full flex items-center px-4 py-2.5 rounded-xl transition text-sm font-medium ${
                                            selectedCategory === cat.id 
                                                ? 'bg-blue-100 text-blue-700' 
                                                : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                    >
                                        <span className="mr-3 opacity-70">{cat.icon}</span>
                                        {cat.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Price Range Filter */}
                    <div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Max Price: ${maxPrice}</h3>
                        <div className="px-2">
                            <input 
                                type="range" 
                                min="10" 
                                max="1000" 
                                value={maxPrice}
                                onChange={(e) => { setMaxPrice(e.target.value); setCurrentPage(1); }}
                                className="w-full h-1.5 bg-gray-200 rounded-full appearance-none cursor-pointer accent-blue-600"
                            />
                            <div className="flex justify-between text-sm font-bold text-gray-700 mt-2">
                                <span>$10</span>
                                <span>$1000</span>
                            </div>
                        </div>
                    </div>

                    {/* Frame Width Filter */}
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Frame Width</h3>
                            {frameWidthPreset !== 'all' && (
                                <button onClick={() => { setFrameWidthPreset('all'); setCurrentPage(1); }} className="text-[10px] text-blue-600 font-bold hover:underline">Clear</button>
                            )}
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <button 
                                onClick={() => { setFrameWidthPreset('narrow'); setCurrentPage(1); }}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${frameWidthPreset === 'narrow' ? 'bg-blue-50 border border-blue-600 text-blue-700' : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300'}`}
                            >Narrow</button>
                            <button 
                                onClick={() => { setFrameWidthPreset('medium'); setCurrentPage(1); }}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${frameWidthPreset === 'medium' ? 'bg-blue-50 border border-blue-600 text-blue-700' : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300'}`}
                            >Medium</button>
                            <button 
                                onClick={() => { setFrameWidthPreset('wide'); setCurrentPage(1); }}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${frameWidthPreset === 'wide' ? 'bg-blue-50 border border-blue-600 text-blue-700' : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300'}`}
                            >Wide</button>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1">
                    
                    {/* Header: Title and Sort */}
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 border-b border-gray-200 pb-4">
                        <div>
                            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">{pageTitle}</h1>
                            <p className="text-sm text-gray-500 mt-1">{filteredProducts.length} styles found</p>
                        </div>
                        
                        <div className="mt-4 sm:mt-0 flex items-center gap-2">
                            <span className="text-sm text-gray-500">Sort by:</span>
                            <button className="flex items-center gap-2 border border-gray-200 bg-white px-4 py-2 rounded-lg text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
                                Recommended <ChevronDown className="w-4 h-4 text-gray-400" />
                            </button>
                        </div>
                    </div>

                    {/* Product Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                        {currentProducts.map(product => (
                            <div key={product.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 relative group">
                                
                                {/* Image Box */}
                                <div className="relative h-64 bg-gray-50 rounded-xl mb-4 overflow-hidden flex items-center justify-center">
                                    <button className="absolute top-3 right-3 z-10 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center text-gray-400 hover:text-red-500 transition">
                                        <Heart className="w-4 h-4 fill-current opacity-0 group-hover:opacity-100 transition-opacity absolute" />
                                        <Heart className="w-4 h-4 relative z-10" />
                                    </button>
                                    
                                    <div className="absolute bottom-3 left-3 z-10">
                                        <span className="bg-green-100/90 text-green-700 text-[9px] font-extrabold uppercase tracking-wide px-2 py-1 rounded flex items-center gap-1 backdrop-blur-sm shadow-sm">
                                            <Camera className="w-3 h-3" /> Virtual Try-On
                                        </span>
                                    </div>

                                    {product.image ? (
                                        <img src={product.image} alt={product.name} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition duration-500 p-4" />
                                    ) : (
                                        <div className="text-gray-400 text-sm">No Image</div>
                                    )}
                                </div>

                                {/* Product Info */}
                                <div>
                                    <div className="flex justify-between items-start mb-1">
                                        <Link to={`/product/${product.id}`} className="font-bold text-gray-900 hover:text-blue-600 line-clamp-1 pr-2 text-lg">
                                            {product.name}
                                        </Link>
                                        <span className="font-bold text-blue-600 text-lg">${product.price}</span>
                                    </div>
                                    
                                    <div className="flex items-center gap-1 mb-6 mt-1">
                                        <div className="flex text-yellow-400">
                                            <Star className="w-3 h-3 fill-current" />
                                            <Star className="w-3 h-3 fill-current" />
                                            <Star className="w-3 h-3 fill-current" />
                                            <Star className="w-3 h-3 fill-current" />
                                            <Star className="w-3 h-3 fill-current text-gray-300" />
                                        </div>
                                        <span className="text-xs text-gray-400">(42)</span>
                                    </div>
                                </div>

                                <Link to={`/try-on/${product.id}`} className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-blue-700 transition shadow-md shadow-blue-600/20 active:scale-[0.98]">
                                    <Camera className="w-4 h-4" />
                                    Try On
                                </Link>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-2">
                            <button 
                                onClick={() => paginate(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            
                            {[...Array(totalPages)].map((_, index) => (
                                <button 
                                    key={index + 1}
                                    onClick={() => paginate(index + 1)}
                                    className={`w-10 h-10 flex items-center justify-center rounded-lg font-medium transition-colors ${currentPage === index + 1 ? 'bg-blue-600 text-white shadow-sm font-bold' : 'hover:bg-gray-100 text-gray-700'}`}
                                >
                                    {index + 1}
                                </button>
                            ))}

                            <button 
                                onClick={() => paginate(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    )}

                    {filteredProducts.length === 0 && (
                        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm mt-8">
                            <p className="text-gray-500 text-lg">No styles found matching your criteria.</p>
                            <button onClick={() => { setSelectedCategory('all'); setMaxPrice(1000); setFrameWidthPreset('all'); }} className="mt-4 text-blue-600 font-bold hover:underline">Clear Filters</button>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default Shop;
