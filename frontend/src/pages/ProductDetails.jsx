import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { ShoppingCart, Heart, Camera, ShieldCheck, Truck, RotateCcw, Star, CheckCircle } from 'lucide-react';

const ProductDetails = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await api.get(`products/products/${id}/`);
                setProduct(response.data);
            } catch (err) {
                console.error("Failed to fetch product", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleAddToCart = async () => {
        if (!user) {
            setMessage('Please login to add to cart');
            setTimeout(() => setMessage(''), 3000);
            return;
        }
        try {
            await api.post('shop/cart/add_item/', { product_id: product.id, quantity: 1 });
            setMessage('Added to cart successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            setMessage('Failed to add to cart');
            setTimeout(() => setMessage(''), 3000);
        }
    };

    const handleAddToWishlist = async () => {
        if (!user) {
            setMessage('Please login to add to wishlist');
            setTimeout(() => setMessage(''), 3000);
            return;
        }
        try {
            const res = await api.post('shop/wishlist/toggle_item/', { product_id: product.id });
            setMessage(res.data.status === 'added' ? 'Added to wishlist!' : 'Removed from wishlist!');
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            setMessage('Failed to update wishlist');
            setTimeout(() => setMessage(''), 3000);
        }
    };

    if (loading) return <div className="text-center py-32 text-gray-500 font-medium text-lg">Loading product...</div>;
    if (!product) return <div className="text-center py-32 text-gray-500 font-medium text-lg">Product not found.</div>;

    const dummyReviews = [
        { id: 1, author: "Sarah M.", rating: 5, date: "October 12, 2025", text: "Absolutely love these frames! The virtual try-on was spot on, they fit exactly how I expected. The build quality feels very premium." },
        { id: 2, author: "David K.", rating: 4, date: "September 28, 2025", text: "Great glasses, very stylish. Deducted one star because shipping took a day longer than expected, but the product itself is flawless." },
        { id: 3, author: "Emily R.", rating: 5, date: "August 15, 2025", text: "I get compliments on these every single day. The hinges feel very sturdy and the lenses are crystal clear." }
    ];

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            {message && (
                <div className="fixed top-24 right-8 bg-gray-900 border border-gray-700 text-white px-6 py-4 rounded-xl shadow-2xl z-50 flex items-center gap-3 animate-bounce">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="font-medium">{message}</span>
                </div>
            )}
            
            {/* Top Section: Breadcrumb */}
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
                <p className="text-sm text-gray-500">
                    <Link to="/" className="hover:text-blue-600 transition">Home</Link> <span className="mx-2">›</span> 
                    <Link to="/shop" className="hover:text-blue-600 transition">Shop</Link> <span className="mx-2">›</span> 
                    <span className="text-gray-900 font-medium">{product.name}</span>
                </p>
            </div>

            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Main Product Card */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col lg:flex-row mb-12">
                    {/* Image Section */}
                    <div className="w-full lg:w-[55%] bg-gray-50/50 p-8 lg:p-16 flex flex-col items-center justify-center relative min-h-[500px]">
                        
                        {/* Try On Button Overlay */}
                        {product.model_3d && (
                            <Link 
                                to={`/try-on/${product.id}`}
                                className="absolute top-8 right-8 bg-white/90 backdrop-blur-md border border-gray-200 text-blue-600 px-6 py-3 rounded-full font-bold flex items-center gap-2 shadow-sm hover:shadow-md hover:scale-105 transition z-10"
                            >
                                <Camera className="w-5 h-5" />
                                Try On in 3D
                            </Link>
                        )}

                        {product.image ? (
                            <img src={product.image} alt={product.name} className="max-w-full h-auto max-h-[400px] object-contain mix-blend-multiply drop-shadow-2xl hover:scale-110 transition duration-700" />
                        ) : (
                            <div className="text-gray-400 font-medium">No Image Available</div>
                        )}
                    </div>

                    {/* Details Section */}
                    <div className="w-full lg:w-[45%] p-8 lg:p-12 xl:p-16 flex flex-col">
                        <div className="mb-2 flex items-center justify-between">
                            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">
                                {product.category?.name || 'Eyewear'}
                            </span>
                            <div className="flex text-yellow-400">
                                <Star className="w-4 h-4 fill-current" />
                                <Star className="w-4 h-4 fill-current" />
                                <Star className="w-4 h-4 fill-current" />
                                <Star className="w-4 h-4 fill-current" />
                                <Star className="w-4 h-4 fill-current text-gray-200" />
                                <span className="text-gray-400 text-sm ml-2">(42)</span>
                            </div>
                        </div>

                        <h1 className="text-4xl font-extrabold text-gray-900 mt-2 mb-4 leading-tight">{product.name}</h1>
                        <p className="text-3xl font-bold text-gray-900 mb-8">${product.price}</p>

                        <div className="mb-8">
                            <p className="text-gray-600 leading-relaxed">
                                {product.description || "Designed with premium materials to offer unmatched durability and style. These frames feature a modern profile that complements a wide variety of face shapes while ensuring all-day comfort."}
                            </p>
                        </div>

                        {/* Dimensions */}
                        <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-100">
                            <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                                Frame Dimensions
                            </h3>
                            <div className="grid grid-cols-3 gap-4 text-center">
                                <div>
                                    <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Frame</span>
                                    <span className="block font-medium text-gray-900">{product.frame_width}mm</span>
                                </div>
                                <div className="border-l border-r border-gray-200">
                                    <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Bridge</span>
                                    <span className="block font-medium text-gray-900">{product.bridge_width}mm</span>
                                </div>
                                <div>
                                    <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Temple</span>
                                    <span className="block font-medium text-gray-900">{product.temple_length}mm</span>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-auto flex flex-col sm:flex-row gap-4">
                            <button 
                                onClick={handleAddToCart}
                                className="flex-1 flex items-center justify-center gap-3 py-4 px-8 bg-blue-600 text-white rounded-xl text-lg font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-600/30 active:scale-[0.98]"
                            >
                                <ShoppingCart className="w-6 h-6" />
                                Add to Cart
                            </button>
                            <button 
                                onClick={handleAddToWishlist}
                                className="flex items-center justify-center py-4 px-6 border border-gray-200 bg-white rounded-xl text-gray-700 font-bold hover:bg-gray-50 hover:border-gray-300 hover:text-red-500 transition shadow-sm active:scale-[0.98]"
                                title="Add to Wishlist"
                            >
                                <Heart className="w-6 h-6" />
                                <span className="sm:hidden ml-2">Add to Wishlist</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Additional Details Section Below Fold */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Features & Materials */}
                    <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 p-8 lg:p-12">
                        <h2 className="text-2xl font-extrabold text-gray-900 mb-8">Product Specifications</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                            <div className="flex border-b border-gray-100 pb-4">
                                <span className="font-medium text-gray-500 w-1/3">Material</span>
                                <span className="font-bold text-gray-900 w-2/3 text-right md:text-left">Premium Acetate</span>
                            </div>
                            <div className="flex border-b border-gray-100 pb-4">
                                <span className="font-medium text-gray-500 w-1/3">Weight</span>
                                <span className="font-bold text-gray-900 w-2/3 text-right md:text-left">24g (Lightweight)</span>
                            </div>
                            <div className="flex border-b border-gray-100 pb-4">
                                <span className="font-medium text-gray-500 w-1/3">Hinges</span>
                                <span className="font-bold text-gray-900 w-2/3 text-right md:text-left">5-barrel stainless steel</span>
                            </div>
                            <div className="flex border-b border-gray-100 pb-4">
                                <span className="font-medium text-gray-500 w-1/3">Nose Pads</span>
                                <span className="font-bold text-gray-900 w-2/3 text-right md:text-left">Built-in molded</span>
                            </div>
                            <div className="flex border-b border-gray-100 pb-4">
                                <span className="font-medium text-gray-500 w-1/3">Prescription</span>
                                <span className="font-bold text-gray-900 w-2/3 text-right md:text-left">Available via custom order</span>
                            </div>
                        </div>

                        {/* Reviews Dummy Data */}
                        <div className="mt-16">
                            <h2 className="text-2xl font-extrabold text-gray-900 mb-8 flex items-center justify-between">
                                Customer Reviews
                                <span className="text-sm font-medium text-blue-600 hover:underline cursor-pointer">Write a Review</span>
                            </h2>
                            <div className="space-y-6">
                                {dummyReviews.map(review => (
                                    <div key={review.id} className="bg-gray-50 rounded-2xl p-6">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="font-bold text-gray-900">{review.author}</span>
                                            <span className="text-sm text-gray-500">{review.date}</span>
                                        </div>
                                        <div className="flex text-yellow-400 mb-3">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-200 fill-current'}`} />
                                            ))}
                                        </div>
                                        <p className="text-gray-600">{review.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Guarantees Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 text-center flex flex-col items-center">
                            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
                                <ShieldCheck className="w-8 h-8" />
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2">1-Year Warranty</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">We stand behind our quality. If your frames have a manufacturing defect, we'll replace them for free.</p>
                        </div>
                        
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 text-center flex flex-col items-center">
                            <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-4">
                                <Truck className="w-8 h-8" />
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2">Free Shipping</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">Enjoy free standard shipping on all orders over $50. Upgrades available at checkout.</p>
                        </div>
                        
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 text-center flex flex-col items-center">
                            <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mb-4">
                                <RotateCcw className="w-8 h-8" />
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2">14-Day Returns</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">Not the perfect fit? Return them within 14 days for a full refund or exchange—no questions asked.</p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
