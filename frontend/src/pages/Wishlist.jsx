import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { Trash2, HeartOff } from 'lucide-react';

const Wishlist = () => {
    const { user } = useContext(AuthContext);
    const [wishlist, setWishlist] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchWishlist = async () => {
        try {
            const response = await api.get('shop/wishlist/');
            setWishlist(response.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) fetchWishlist();
        else setLoading(false);
    }, [user]);

    const handleRemove = async (productId) => {
        try {
            await api.post('shop/wishlist/toggle_item/', { product_id: productId });
            fetchWishlist();
        } catch (err) {
            console.error(err);
        }
    };

    if (!user) return (
        <div className="max-w-7xl mx-auto py-32 px-4 text-center">
            <HeartOff className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Login Required</h2>
            <p className="text-gray-500 mb-6">Please login to view and manage your wishlist.</p>
            <Link to="/login" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition">Sign In</Link>
        </div>
    );
    
    if (loading) return <div className="text-center py-32 text-gray-500 font-medium">Loading your favorites...</div>;

    const isEmpty = !wishlist || !wishlist.items || wishlist.items.length === 0;

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            <div className="bg-white border-b border-gray-200 pt-10 pb-8 mb-8">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">My Wishlist</h1>
                    <p className="text-sm text-gray-500 mt-2">{!isEmpty ? `${wishlist.items.length} items saved` : '0 items'}</p>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                {isEmpty ? (
                    <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm max-w-2xl mx-auto">
                        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <HeartOff className="w-8 h-8 text-blue-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Your wishlist is empty</h3>
                        <p className="text-gray-500 mb-8">Save your favorite frames here by clicking the heart icon on any product.</p>
                        <Link to="/shop" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-sm">
                            Explore Collection
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
                        {wishlist.items.map(item => {
                            // Ensure the image URL is fully qualified if it's a relative path starting with /media/
                            let imageUrl = item.product.image;
                            if (imageUrl && imageUrl.startsWith('/media/')) {
                                imageUrl = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}${imageUrl}`;
                            }

                            return (
                                <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col relative group">
                                    <button 
                                        onClick={() => handleRemove(item.product.id)}
                                        className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow hover:text-red-600 transition z-10 opacity-0 group-hover:opacity-100"
                                        title="Remove from wishlist"
                                    >
                                        <Trash2 className="w-4 h-4 text-gray-500 hover:text-red-500" />
                                    </button>
                                    
                                    <Link to={`/product/${item.product.id}`} className="group flex-grow flex flex-col">
                                        <div className="h-60 bg-gray-50 p-6 flex items-center justify-center relative overflow-hidden">
                                            {imageUrl ? (
                                                <img src={imageUrl} alt={item.product.name} className="max-w-full h-auto object-contain mix-blend-multiply group-hover:scale-110 transition duration-500 drop-shadow-sm" />
                                            ) : (
                                                <span className="text-gray-400 text-sm font-medium">No image</span>
                                            )}
                                        </div>
                                        
                                        <div className="p-5 flex flex-col flex-grow bg-white z-10 relative">
                                            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
                                                {item.product.category?.name || 'Eyewear'}
                                            </span>
                                            <h3 className="text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                                                {item.product.name}
                                            </h3>
                                            
                                            <div className="mt-auto pt-4 flex items-center justify-between">
                                                <p className="text-xl font-extrabold text-gray-900">${item.product.price}</p>
                                                <span className="text-sm font-medium text-blue-600 hover:underline">View Product &rarr;</span>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Wishlist;
