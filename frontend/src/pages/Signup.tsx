import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiLock, FiAlertCircle, FiMail } from 'react-icons/fi';

const Signup: React.FC = () => {
  const [formData, setFormData] = useState({
    fullname: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.fullname.trim()) newErrors.fullname = 'Full name is required';
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getPasswordStrength = () => {
    if (formData.password.length === 0) return 0;
    let strength = 0;
    if (formData.password.length >= 8) strength++;
    if (formData.password.match(/[A-Z]/)) strength++;
    if (formData.password.match(/[0-9]/)) strength++;
    if (formData.password.match(/[^A-Za-z0-9]/)) strength++;
    return strength;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({
      fullname: true,
      username: true,
      password: true,
      confirmPassword: true
    });

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        navigate('/login');
      } else {
        const errorData = await response.json();
        setErrors({ form: errorData.message || 'Signup failed' });
      }
    } catch (err) {
      setErrors({ form: 'An error occurred during signup' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="text-white min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-gray-700">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            Create Account
          </h2>
        </div>

        {errors.form && (
          <div className="mb-6 p-3 bg-red-500/20 text-red-300 rounded-lg flex items-center gap-2">
            <FiAlertCircle className="flex-shrink-0" />
            {errors.form}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-300 mb-2">Full Name</label>
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                className={`w-full pl-10 pr-4 py-3 bg-gray-700/30 border ${errors.fullname ? 'border-red-500' : 'border-gray-600'
                  } rounded-lg focus:outline-none focus:border-blue-500 transition-colors`}
                value={formData.fullname}
                onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                onBlur={() => setTouched({ ...touched, fullname: true })}
              />
            </div>
            {touched.fullname && errors.fullname && (
              <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                <FiAlertCircle /> {errors.fullname}
              </p>
            )}
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Username</label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
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
            <div className="mt-2 flex gap-1">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full ${getPasswordStrength() > i
                    ? i < 2 ? 'bg-red-500' : i < 3 ? 'bg-yellow-500' : 'bg-green-500'
                    : 'bg-gray-600'
                    }`}
                />
              ))}
            </div>
            {touched.password && errors.password && (
              <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                <FiAlertCircle /> {errors.password}
              </p>
            )}
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Confirm Password</label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type="password"
                className={`w-full pl-10 pr-4 py-3 bg-gray-700/30 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-600'
                  } rounded-lg focus:outline-none focus:border-blue-500 transition-colors`}
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                onBlur={() => setTouched({ ...touched, confirmPassword: true })}
              />
            </div>
            {touched.confirmPassword && errors.confirmPassword && (
              <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                <FiAlertCircle /> {errors.confirmPassword}
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
                <div className="w-4 cursor-progress h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Creating Account...
              </div>
            ) : (
              'Sign Up'
            )}
          </button>
        </form>
        <div className="mt-4 text-center">

          <button
            type="button"
            onClick={() => navigate('/login')}
            className="text-blue-400 hover:text-blue-300 font-medium transition-colors cursor-pointer"
          >
            <p className="text-gray-400">
              Already have an account?{' '}Login
            </p>
          </button>
        </div>

      </div>
    </div >
  );
};

export default Signup;