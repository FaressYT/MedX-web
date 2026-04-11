import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, Eye, Users, Zap, Building } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { login, user } = useAuth();
    const navigate = useNavigate();

    // Redirect to dashboard as soon as user is authenticated
    useEffect(() => {
        if (user) {
            navigate('/dashboard', { replace: true });
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login({ email, password });
            // Navigation will happen via the useEffect above when user state updates
        } catch (err) {
            console.error('Login failed', err);
            setError('Invalid credentials. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen w-full bg-primary text-on-surface m-0 p-0 overflow-hidden font-sans">

            {/* TopAppBar for consistent branding (Transparent overlay) */}
            <header className="fixed top-0 w-full z-50 flex justify-between items-center px-8 py-6 bg-transparent pointer-events-none">
                <div className="text-2xl font-bold tracking-tight text-white mix-blend-difference font-display">MedX Core</div>
            </header>

            {/* Left Panel: Cinematic Brand Section (60%) */}
            <section className="hidden lg:flex lg:w-[60%] relative flex-col justify-center items-center overflow-hidden tonal-gradient p-16">
                {/* Background Texture Placeholder (pure CSS fallback) */}
                <div className="absolute inset-0 opacity-20">
                    <div className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary-fixed/20 via-transparent to-transparent"></div>
                </div>

                <div className="relative z-10 max-w-xl">
                    <div className="mb-12">
                        <h1 className="text-5xl font-extrabold tracking-tight text-white mb-4 font-display">MedX Core</h1>
                        <p className="text-primary-fixed text-xl font-medium tracking-wide">Clinical intelligence, elevated.</p>
                    </div>

                    {/* Floating Stats Cards */}
                    <div className="flex flex-col gap-6 w-full max-w-sm">
                        {/* Stat Card 1 */}
                        <div className="bg-white/10 backdrop-blur-[24px] p-6 rounded-xl border border-white/10 flex items-center gap-4 transform">
                            <div className="w-12 h-12 rounded-lg bg-primary-fixed/20 flex items-center justify-center">
                                <Users className="w-6 h-6 text-primary-fixed" />
                            </div>
                            <div>
                                <p className="text-white/60 text-xs uppercase tracking-widest font-bold">Total Patients</p>
                                <p className="text-white text-2xl font-bold font-display mt-0.5">2,847</p>
                            </div>
                        </div>

                        {/* Stat Card 2 */}
                        <div className="bg-white/10 backdrop-blur-[24px] p-6 rounded-xl border border-white/10 flex items-center gap-4 transform">
                            <div className="w-12 h-12 rounded-lg bg-tertiary-fixed/20 flex items-center justify-center">
                                <Zap className="w-6 h-6 text-tertiary-fixed" />
                            </div>
                            <div>
                                <p className="text-white/60 text-xs uppercase tracking-widest font-bold">System Uptime</p>
                                <p className="text-white text-2xl font-bold font-display mt-0.5">99.9%</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Subtle Decorative Element */}
                <div className="absolute bottom-12 left-16">
                    <div className="flex items-center gap-3 text-white/40 text-xs uppercase tracking-widest font-bold">
                        <span className="w-8 h-px bg-white/40"></span>
                        <span>The Clinical Atrium</span>
                    </div>
                </div>
            </section>

            {/* Right Panel: Login Form (40%) */}
            <section className="w-full lg:w-[40%] bg-surface flex flex-col justify-center items-center p-8 lg:p-24 relative">
                <div className="w-full max-w-md">
                    <div className="mb-10">
                        <h2 className="text-3xl font-bold text-on-surface font-display mb-2">Welcome back</h2>
                        <p className="text-on-surface-variant text-sm font-medium">Enter your credentials to access your clinician workspace.</p>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {/* Email Field */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-on-surface-variant">Email Address</label>
                            <div className="relative flex items-center bg-surface-container-lowest rounded-lg ghost-border transition-all duration-200">
                                <Mail className="w-5 h-5 absolute left-4 text-outline" />
                                <input
                                    className="w-full py-4 pl-12 pr-4 bg-transparent border-none focus:ring-0 outline-none text-on-surface placeholder:text-outline-variant"
                                    placeholder="dr.smith@medxcore.com"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="block text-sm font-semibold text-on-surface-variant">Password</label>
                                <button type="button" className="text-xs font-semibold text-primary hover:opacity-80 transition-opacity">Forgot password?</button>
                            </div>
                            <div className="relative flex items-center bg-surface-container-lowest rounded-lg ghost-border transition-all duration-200">
                                <Lock className="w-5 h-5 absolute left-4 text-outline" />
                                <input
                                    className="w-full py-4 pl-12 pr-12 bg-transparent border-none focus:ring-0 outline-none text-on-surface placeholder:text-outline-variant"
                                    placeholder="••••••••"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <Eye className="w-5 h-5 absolute right-4 text-outline cursor-pointer hover:text-primary transition-colors" />
                            </div>
                        </div>

                        {/* Remember Me */}
                        <div className="flex items-center">
                            <input className="w-4 h-4 text-primary bg-surface-container-lowest border-outline-variant rounded focus:ring-primary cursor-pointer accent-primary" id="remember" type="checkbox" />
                            <label className="ml-2 text-sm font-medium text-on-surface-variant cursor-pointer" htmlFor="remember">Remember me for 30 days</label>
                        </div>

                        {/* Primary Action */}
                        <button disabled={loading} className="w-full py-4 rounded-lg text-white font-semibold text-base hover:opacity-90 active:scale-[0.98] transition-all duration-200 shadow-md bg-gradient-to-br from-primary to-primary-container disabled:opacity-50" type="submit">
                            {loading ? 'Authenticating...' : 'Sign In'}
                        </button>

                        {/* Divider */}
                        <div className="relative flex py-4 items-center">
                            <div className="flex-grow border-t border-outline-variant opacity-20"></div>
                            <span className="flex-shrink mx-4 text-outline-variant text-[10px] font-bold tracking-widest uppercase">OR</span>
                            <div className="flex-grow border-t border-outline-variant opacity-20"></div>
                        </div>

                        {/* SSO Option */}
                        <button className="w-full py-4 rounded-lg bg-surface-container-high text-on-surface text-sm font-semibold flex items-center justify-center gap-3 hover:bg-surface-variant active:scale-[0.98] transition-all duration-200" type="button">
                            <Building className="w-5 h-5 text-primary" />
                            Log in as a Goverment Account
                        </button>
                    </form>

                    <p className="mt-12 text-center text-xs font-medium text-on-surface-variant">
                        By signing in, you agree to our{' '}
                        <button className="text-primary font-semibold hover:underline">Terms of Service</button> and{' '}
                        <button className="text-primary font-semibold hover:underline">Privacy Policy</button>.
                    </p>
                </div>
            </section>
        </div>
    );
};
