import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ShieldCheck, Lock, User, AlertCircle } from 'lucide-react';

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login, user, loading } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    // If already logged in as staff, redirect to admin dashboard
    useEffect(() => {
        if (!loading && user && user.is_staff) {
            navigate('/admin');
        }
    }, [user, loading, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            await login(username, password);
            // After login, we need to check if they are staff
            // The AuthContext update will trigger the useEffect above
        } catch (err) {
            setError('Invalid credentials or system error.');
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Special check for non-staff redirection
    useEffect(() => {
        if (!loading && user && !user.is_staff) {
            setError('Restricted Access: This area is reserved for staff members only.');
        }
    }, [user, loading]);

    return (
        <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4 font-sans">
            <div className="w-full max-w-md">
                {/* Branding */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-[2rem] shadow-2xl shadow-blue-500/20 mb-6">
                        <ShieldCheck className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-tight uppercase italic mb-2">
                        Branded<span className="text-blue-500">Panel</span>
                    </h1>
                    <p className="text-gray-400 text-sm font-bold tracking-widest uppercase">Administrative Gateway</p>
                </div>

                {/* Login Card */}
                <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10 shadow-3xl shadow-black/50 overflow-hidden relative group">
                    {/* Subtle Glow Effect */}
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-600/10 blur-[100px] rounded-full group-hover:bg-blue-600/20 transition-all duration-700"></div>
                    
                    <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                                <p className="text-xs font-bold text-red-400 leading-relaxed">{error}</p>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Authorized Username</label>
                            <div className="relative">
                                <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input
                                    type="text"
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full bg-slate-950 border-slate-800 border-2 rounded-2xl py-4 pl-14 pr-6 text-white text-sm font-bold focus:border-blue-500 focus:ring-0 transition-all outline-none placeholder:text-slate-700"
                                    placeholder="Enter system ID..."
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Security Credential</label>
                            <div className="relative">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-slate-950 border-slate-800 border-2 rounded-2xl py-4 pl-14 pr-6 text-white text-sm font-bold focus:border-blue-500 focus:ring-0 transition-all outline-none placeholder:text-slate-700"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-black text-xs uppercase tracking-widest py-5 rounded-2xl transition-all shadow-xl shadow-blue-900/40 active:scale-[0.98] mt-4"
                        >
                            {isSubmitting ? 'Authenticating...' : 'Access Command Center'}
                        </button>
                    </form>
                </div>

                {/* Footer Links */}
                <div className="mt-8 text-center flex items-center justify-center gap-6">
                    <button 
                        onClick={() => navigate('/')}
                        className="text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-widest transition-colors"
                    >
                        &larr; Return to Storefront
                    </button>
                    <span className="w-1 h-1 bg-slate-800 rounded-full"></span>
                    <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">v4.2.0 Secure Path</span>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
