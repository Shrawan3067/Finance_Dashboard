import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, LogIn, Eye, EyeOff, Sparkles } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Header */}
        <div className="text-center transform transition-all duration-500 hover:scale-105">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-6 transition-transform">
            <LogIn className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to access your finance dashboard
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-5">
            {/* Email Field */}
            <div className="transform transition-all duration-300 hover:translate-x-1">
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
                  <Mail className={`h-5 w-5 transition-colors duration-300 ${focusedField === 'email' ? 'text-indigo-600' : 'text-gray-400'}`} />
                </div>
                <input
                  type="email"
                  required
                  className="w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300 bg-white/80 backdrop-blur-sm"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="transform transition-all duration-300 hover:translate-x-1">
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
                  <Lock className={`h-5 w-5 transition-colors duration-300 ${focusedField === 'password' ? 'text-indigo-600' : 'text-gray-400'}`} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full pl-10 pr-12 py-3 border-2 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300 bg-white/80 backdrop-blur-sm"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-indigo-600 transition-colors z-10"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Login Button */}
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <Sparkles className="h-5 w-5 text-indigo-300 group-hover:animate-spin" />
              </span>
              Sign In
            </button>
          </div>

          {/* Register Link */}
          <div className="text-center">
            <Link
              to="/register"
              className="text-sm text-gray-600 hover:text-indigo-600 transition-colors duration-300 inline-flex items-center space-x-1 group"
            >
              <span>Don't have an account?</span>
              <span className="font-medium group-hover:translate-x-1 transition-transform">Create one →</span>
            </Link>
          </div>
        </form>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-indigo-100">
          <p className="text-xs text-center text-gray-600 mb-2">Demo Credentials:</p>
          <div className="text-xs text-center text-gray-500 space-y-1">
            <p>📧 viewer@example.com / viewer123</p>
            <p>📧 analyst@example.com / analyst123</p>
            <p>📧 admin@example.com / admin123</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default Login;