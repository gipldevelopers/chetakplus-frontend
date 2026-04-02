import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const AdminLogin = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        email: 'admin@chetakplus.com',
        password: 'password123'
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (error) setError('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        // Mock authentication
        setTimeout(() => {
            if (formData.email === 'admin@chetakplus.com' && formData.password === 'password123') {
                navigate('/admin');
            } else {
                setError('Invalid email or password');
                setIsLoading(false);
            }
        }, 1500);
    };

    return (
        <div className="admin-panel min-h-screen flex items-center justify-center bg-gray-50/50 p-4 relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[100px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-[100px]" />

            <div className="w-full max-w-md bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8 sm:p-10 relative z-10 animate-fade-up">

                <div className="text-center mb-8">
                    <h1 className="text-3xl font-display font-bold text-foreground mb-2">Welcome Back</h1>
                    <p className="text-muted-foreground text-sm">Please sign in to access the admin portal</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium">Email address</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="admin@chetakplus.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="h-12 rounded-xl bg-gray-50/50 border-gray-200 focus-visible:ring-primary/20 transition-all duration-300"
                            />
                        </div>

                        <div className="space-y-2 relative">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                                <button type="button" className="text-xs text-primary hover:underline font-medium transition-colors">
                                    Forgot Password?
                                </button>
                            </div>
                            <div className="relative">
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className={`h-12 rounded-xl bg-gray-50/50 border-gray-200 focus-visible:ring-primary/20 transition-all duration-300 pr-10 ${error ? 'border-destructive focus-visible:ring-destructive/20' : ''}`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {error && (
                                <p className="text-destructive text-sm mt-1 animate-fade-in">{error}</p>
                            )}
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-12 rounded-xl text-base font-medium transition-all duration-300 shadow-lg shadow-primary/25 hover:shadow-primary/40 group relative overflow-hidden"
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Authenticating...
                                </>
                            ) : (
                                <>
                                    Sign In
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </span>
                    </Button>
                </form>

                <div className="mt-8 text-center text-xs text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} Chetak Plus. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
