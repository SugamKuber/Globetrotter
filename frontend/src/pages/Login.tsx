import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FiUser, FiLock, FiAlertCircle } from 'react-icons/fi';

const Login: React.FC = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};
        if (!formData.username.trim()) newErrors.username = 'Username is required';
        if (!formData.password) newErrors.password = 'Password is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setTouched({ username: true, password: true });

        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                const { accessToken, refreshToken } = await response.json();
                login({ accessToken, refreshToken });
                navigate('/');
            } else {
                const errorData = await response.json();
                setErrors({ form: errorData.message || 'Login failed' });
            }
        } catch (err) {
            setErrors({ form: 'An error occurred during login' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="text-white min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-gray-700">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                        Welcome Back
                    </h2>
                    <p className="text-gray-400 mt-2">Please sign in to continue</p>
                </div>

                {errors.form && (
                    <div className="mb-6 p-3 bg-red-500/20 text-red-300 rounded-lg flex items-center gap-2">
                        <FiAlertCircle className="flex-shrink-0" />
                        {errors.form}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-gray-300 mb-2">Username</label>
                        <div className="relative">
                            <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                            <input
                                type="text"
                                className={`w-full pl-10 pr-4 py-3 bg-gray-700/30 border ${errors.username ? 'border-red-500' : 'border-gray-600'
                                    } rounded-lg focus:outline-none focus:border-blue-500 transition-colors`}
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                onBlur={() => setTouched({ ...touched, username: true })}
                            />
                        </div>
                        {touched.username && errors.username && (
                            <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                                <FiAlertCircle /> {errors.username}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-gray-300 mb-2">Password</label>
                        <div className="relative">
                            <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                            <input
                                type="password"
                                className={`w-full pl-10 pr-4 py-3 bg-gray-700/30 border ${errors.password ? 'border-red-500' : 'border-gray-600'
                                    } rounded-lg focus:outline-none focus:border-blue-500 transition-colors`}
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                onBlur={() => setTouched({ ...touched, password: true })}
                            />
                        </div>
                        {touched.password && errors.password && (
                            <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                                <FiAlertCircle /> {errors.password}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg font-medium 
                                  hover:from-blue-600 hover:to-purple-700 transition-all duration-300 relative cursor-pointer"
                    >
                        {isSubmitting ? (
                            <div className="flex items-center justify-center gap-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin cursor-progress" />
                                Signing In...
                            </div>
                        ) : (
                            'Sign In'
                        )}
                    </button>

                </form>
                <div className="mt-4 text-center">
                    <button
                        type="button"
                        onClick={() => navigate('/signup')}
                        className="text-blue-400 hover:text-blue-300 font-medium transition-colors pointer-touched cursor-pointer">
                        <p className="text-gray-400">
                            Don't have an account?{' '}Sign Up
                        </p>
                    </button>
                </div>

            </div>
        </div >
    );
};

export default Login;