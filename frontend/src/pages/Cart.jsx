import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { Trash2, CreditCard, Truck, CheckCircle, ChevronRight, Smartphone } from 'lucide-react';

const Cart = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [step, setStep] = useState(1); // 1: Cart, 2: Shipping, 3: Payment
    
    const [shippingDetails, setShippingDetails] = useState({
        fullName: '',
        address: '',
        city: '',
        zip: '',
        phone: ''
    });

    const [paymentMethod, setPaymentMethod] = useState('card');
    const [paymentDetails, setPaymentDetails] = useState({
        cardNumber: '',
        expiry: '',
        cvv: ''
    });

    const [checkoutMessage, setCheckoutMessage] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const fetchCart = async () => {
        try {
            const response = await api.get('shop/cart/');
            setCart(response.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) fetchCart();
        else setLoading(false);
    }, [user]);

    // Fetch user profile when entering shipping step to prepopulate
    useEffect(() => {
        if (step === 2 && user) {
            api.get('users/profile/').then(res => {
                const profile = res.data;
                setShippingDetails(prev => ({
                    ...prev,
                    fullName: `${profile.first_name} ${profile.last_name}`.trim(),
                    phone: profile.phone_number || '',
                    address: profile.address || '',
                    // We assume address might be a full string, user can edit it
                }));
            }).catch(console.error);
        }
    }, [step, user]);

    const handleRemoveItem = async (itemId) => {
        try {
            const res = await api.post('shop/cart/remove_item/', { item_id: itemId });
            setCart(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleCheckoutSubmit = async (e) => {
        e.preventDefault();
        setIsProcessing(true);
        try {
            const formattedAddress = `${shippingDetails.fullName}, ${shippingDetails.address}, ${shippingDetails.city}, ${shippingDetails.zip}, Phone: ${shippingDetails.phone}`;
            
            await api.post('orders/checkout/', { 
                shipping_address: formattedAddress, 
                simulate_payment: true 
            });
            
            setCheckoutMessage('Payment Successful! Order placed. Redirecting...');
            setTimeout(() => {
                navigate('/orders');
            }, 2000);
        } catch (err) {
            setCheckoutMessage(err.response?.data?.error || 'Checkout failed');
            setIsProcessing(false);
        }
    };

    if (!user) return <div className="text-center py-20 text-gray-500">Please <Link to="/login" className="text-blue-600 underline font-bold">login</Link> to view cart.</div>;
    if (loading) return <div className="text-center py-20 text-gray-400 font-medium">Loading checkout experience...</div>;

    const isEmpty = !cart || !cart.items || cart.items.length === 0;

    if (isEmpty) {
        return (
            <div className="max-w-[1400px] mx-auto py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen">
                <div className="bg-white rounded-3xl shadow-sm text-center py-32 border border-gray-100">
                    <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Truck className="w-12 h-12 text-gray-300" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h3>
                    <p className="text-gray-500 mb-8">Looks like you haven't added any glasses yet.</p>
                    <Link to="/shop" className="bg-blue-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-blue-700 transition">
                        Explore Shop
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-[1200px] mx-auto py-12 px-4 sm:px-6 lg:px-8 min-h-screen">
            
            {/* Steps Indicator */}
            <div className="flex items-center justify-center mb-12">
                <div className={`flex items-center gap-2 ${step >= 1 ? 'text-blue-600 font-bold' : 'text-gray-400 font-medium'}`}>
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>1</span>
                    Cart
                </div>
                <div className={`h-[2px] w-16 mx-4 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                <div className={`flex items-center gap-2 ${step >= 2 ? 'text-blue-600 font-bold' : 'text-gray-400 font-medium'}`}>
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>2</span>
                    Shipping
                </div>
                <div className={`h-[2px] w-16 mx-4 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                <div className={`flex items-center gap-2 ${step >= 3 ? 'text-blue-600 font-bold' : 'text-gray-400 font-medium'}`}>
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>3</span>
                    Payment
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Left Side: Dynamic Content based on Step */}
                <div className="w-full lg:w-[60%]">
                    
                    {/* STEP 1: CART ITEMS */}
                    {step === 1 && (
                        <div className="bg-white shadow-sm border border-gray-100 rounded-3xl p-8 mb-6 animate-in fade-in slide-in-from-bottom-4">
                            <h3 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Review Your Items</h3>
                            {cart.items.map(item => (
                                <div key={item.id} className="flex flex-col sm:flex-row items-center justify-between border-b pb-6 mb-6 last:border-0 last:pb-0 last:mb-0">
                                    <div className="flex items-center gap-6 w-full sm:w-auto">
                                        <div className="w-24 h-24 bg-gray-50 rounded-2xl flex items-center justify-center p-3 shrink-0">
                                            {item.product.image ? (
                                                <img src={item.product.image} alt={item.product.name} className="max-h-full object-contain mix-blend-multiply" />
                                            ) : (
                                                <span className="text-xs text-gray-400 font-medium">No Img</span>
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">{item.product.category?.name || 'Eyewear'}</p>
                                            <h3 className="text-lg font-bold text-gray-900">{item.product.name}</h3>
                                            <p className="text-sm text-gray-500 mt-1">Qty: {item.quantity} x ${item.product.price}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6 mt-4 sm:mt-0 w-full sm:w-auto justify-between sm:justify-end">
                                        <p className="text-xl font-bold text-gray-900">${(item.quantity * item.product.price).toFixed(2)}</p>
                                        <button 
                                            onClick={() => handleRemoveItem(item.id)} 
                                            className="w-10 h-10 bg-red-50 text-red-500 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition"
                                            title="Remove Item"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* STEP 2: SHIPPING */}
                    {step === 2 && (
                        <div className="bg-white shadow-sm border border-gray-100 rounded-3xl p-8 mb-6 animate-in fade-in slide-in-from-bottom-4">
                            <h3 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4 flex items-center gap-3">
                                <Truck className="w-6 h-6 text-blue-600" />
                                Shipping Information
                            </h3>
                            <div className="space-y-4">
                                <input type="text" placeholder="Full Name" required 
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition font-medium"
                                    value={shippingDetails.fullName} onChange={e => setShippingDetails({...shippingDetails, fullName: e.target.value})}
                                />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input type="tel" placeholder="Phone Number" required 
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition font-medium"
                                        value={shippingDetails.phone} onChange={e => setShippingDetails({...shippingDetails, phone: e.target.value})}
                                    />
                                    <input type="text" placeholder="ZIP Code" required 
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition font-medium"
                                        value={shippingDetails.zip} onChange={e => setShippingDetails({...shippingDetails, zip: e.target.value})}
                                    />
                                </div>
                                <input type="text" placeholder="Address (Street, Apt, etc. - Edit if needed)" required 
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition font-medium"
                                    value={shippingDetails.address} onChange={e => setShippingDetails({...shippingDetails, address: e.target.value})}
                                />
                                <input type="text" placeholder="City / State" required 
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition font-medium"
                                    value={shippingDetails.city} onChange={e => setShippingDetails({...shippingDetails, city: e.target.value})}
                                />
                            </div>
                        </div>
                    )}

                    {/* STEP 3: PAYMENT */}
                    {step === 3 && (
                        <div className="bg-white shadow-sm border border-gray-100 rounded-3xl p-8 mb-6 animate-in fade-in slide-in-from-bottom-4">
                            <h3 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4 flex items-center gap-3">
                                <CreditCard className="w-6 h-6 text-blue-600" />
                                Payment Method
                            </h3>
                            
                            <div className="flex gap-4 mb-6">
                                <button type="button" onClick={() => setPaymentMethod('card')} className={`flex-1 py-4 border rounded-xl font-bold flex items-center justify-center gap-2 transition ${paymentMethod === 'card' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
                                    <CreditCard className="w-5 h-5" /> Cards
                                </button>
                                <button type="button" onClick={() => setPaymentMethod('gpay')} className={`flex-1 py-4 border rounded-xl font-bold flex items-center justify-center gap-2 transition ${paymentMethod === 'gpay' ? 'border-green-600 bg-green-50 text-green-700' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
                                    <Smartphone className="w-5 h-5" /> GPay
                                </button>
                            </div>

                            {paymentMethod === 'card' && (
                                <div className="space-y-4 animate-in fade-in">
                                    <input type="text" placeholder="Card Number (Dummy)" required maxLength="16"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition font-mono tracking-widest text-lg"
                                        value={paymentDetails.cardNumber} onChange={e => setPaymentDetails({...paymentDetails, cardNumber: e.target.value})}
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        <input type="text" placeholder="MM/YY" required maxLength="5"
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-center font-mono text-lg"
                                            value={paymentDetails.expiry} onChange={e => setPaymentDetails({...paymentDetails, expiry: e.target.value})}
                                        />
                                        <input type="text" placeholder="CVV" required maxLength="4"
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-center font-mono text-lg"
                                            value={paymentDetails.cvv} onChange={e => setPaymentDetails({...paymentDetails, cvv: e.target.value})}
                                        />
                                    </div>
                                </div>
                            )}

                            {paymentMethod === 'gpay' && (
                                <div className="py-8 text-center bg-gray-50 border border-gray-200 rounded-xl animate-in fade-in">
                                    <Smartphone className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                    <p className="font-bold text-gray-900">Google Pay Simulation</p>
                                    <p className="text-gray-500 text-sm mt-1">Clicking Pay will simulate GPay authorization.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Right Side: Order Summary & Actions */}
                <div className="w-full lg:w-[40%]">
                    <div className="bg-white shadow-xl shadow-blue-900/5 rounded-3xl p-8 border border-gray-100 sticky top-32">
                        <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>
                        
                        <div className="space-y-3 mb-6 border-b border-gray-100 pb-6">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span>${cart.total_price.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Shipping</span>
                                <span className="text-green-600 font-bold">FREE</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Taxes</span>
                                <span>$0.00</span>
                            </div>
                        </div>

                        <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl mb-8">
                            <span className="font-bold text-gray-900">Total</span>
                            <span className="text-3xl font-extrabold text-blue-600">${cart.total_price.toFixed(2)}</span>
                        </div>
                        
                        {checkoutMessage && (
                            <div className={`p-4 rounded-xl mb-6 font-medium border flex items-center gap-2 ${checkoutMessage.includes('Successful') ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                                {checkoutMessage.includes('Successful') && <CheckCircle className="w-5 h-5" />}
                                {checkoutMessage}
                            </div>
                        )}

                        {step === 1 && (
                            <button 
                                onClick={() => setStep(2)}
                                className="w-full bg-blue-600 text-white font-bold text-lg py-4 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 active:scale-[0.98]"
                            >
                                Proceed to Shipping <ChevronRight className="w-5 h-5" />
                            </button>
                        )}

                        {step === 2 && (
                            <div className="flex gap-3">
                                <button onClick={() => setStep(1)} className="px-6 py-4 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition">Back</button>
                                <button 
                                    onClick={() => {
                                        if(!shippingDetails.fullName || !shippingDetails.address || !shippingDetails.phone) {
                                            alert("Please fill necessary shipping details"); return;
                                        }
                                        setStep(3);
                                    }}
                                    className="flex-1 bg-blue-600 text-white font-bold text-lg py-4 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 active:scale-[0.98]"
                                >
                                    Continue to Payment <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        )}

                        {step === 3 && (
                            <form onSubmit={handleCheckoutSubmit}>
                                <div className="flex gap-3">
                                    <button type="button" onClick={() => setStep(2)} className="px-6 py-4 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition">Back</button>
                                    <button 
                                        type="submit" disabled={isProcessing}
                                        className="flex-1 bg-gray-900 text-white font-bold text-lg py-4 rounded-xl hover:bg-gray-800 transition shadow-lg flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-70"
                                    >
                                        {isProcessing ? 'Processing...' : `Pay $${cart.total_price.toFixed(2)}`}
                                    </button>
                                </div>
                                <p className="text-xs text-gray-400 text-center font-medium mt-4">Safe & Secure End-to-End Encryption.</p>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
