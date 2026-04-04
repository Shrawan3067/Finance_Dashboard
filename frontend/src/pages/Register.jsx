import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, Briefcase, Sparkles, Eye, EyeOff } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('viewer');
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await register(name, email, password, role);
    if (success) {
      navigate('/dashboard');
    }
  };

  const getRoleIcon = () => {
    switch(role) {
      case 'admin': return '👑';
      case 'analyst': return '📊';
      default: return '👁️';
    }
  };

  const getRoleDescription = () => {
    switch(role) {
      case 'admin': return 'Full system access and user management';
      case 'analyst': return 'Create and manage financial records';
      default: return 'View-only access to dashboard';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Header with Animation */}
        <div className="text-center transform transition-all duration-500 hover:scale-105">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-6 transition-transform">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Create Account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Join us and start managing your finances
          </p>
        </div>

        {/* Form with Modern Design */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-5">
            {/* Name Field */}
            <div className="transform transition-all duration-300 hover:translate-x-1">
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
                  <User className={`h-5 w-5 transition-colors duration-300 ${focusedField === 'name' ? 'text-indigo-600' : 'text-gray-400'}`} />
                </div>
                <input
                  type="text"
                  required
                  className="w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300 bg-white/80 backdrop-blur-sm"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                />
              </div>
            </div>

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

            {/* Password Field with Show/Hide */}
            <div className="transform transition-all duration-300 hover:translate-x-1">
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
                  <Lock className={`h-5 w-5 transition-colors duration-300 ${focusedField === 'password' ? 'text-indigo-600' : 'text-gray-400'}`} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full pl-10 pr-12 py-3 border-2 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300 bg-white/80 backdrop-blur-sm"
                  placeholder="Password (min 6 characters)"
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

            {/* Role Selection with Cards */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Role
              </label>
              <div className="grid grid-cols-3 gap-3">
                {['viewer', 'analyst', 'admin'].map((roleOption) => (
                  <button
                    key={roleOption}
                    type="button"
                    onClick={() => setRole(roleOption)}
                    className={`relative group p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                      role === roleOption
                        ? 'border-indigo-500 bg-gradient-to-br from-indigo-50 to-purple-50 shadow-lg'
                        : 'border-gray-200 bg-white/50 hover:border-indigo-300'
                    }`}
                  >
                    <div className="text-2xl mb-2">
                      {roleOption === 'admin' && '👑'}
                      {roleOption === 'analyst' && '📊'}
                      {roleOption === 'viewer' && '👁️'}
                    </div>
                    <div className={`text-sm font-semibold capitalize ${
                      role === roleOption ? 'text-indigo-700' : 'text-gray-700'
                    }`}>
                      {roleOption}
                    </div>
                    <div className={`text-xs mt-1 transition-opacity duration-300 ${
                      role === roleOption ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}>
                      {roleOption === 'admin' && 'Full Access'}
                      {roleOption === 'analyst' && 'Create & Edit'}
                      {roleOption === 'viewer' && 'View Only'}
                    </div>
                  </button>
                ))}
              </div>
              
              {/* Role Description */}
              <div className="mt-3 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-100">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{getRoleIcon()}</span>
                  <div>
                    <p className="text-sm font-medium text-indigo-900 capitalize">{role} Access</p>
                    <p className="text-xs text-indigo-700">{getRoleDescription()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Register Button with Animation */}
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <Sparkles className="h-5 w-5 text-indigo-300 group-hover:animate-spin" />
              </span>
              Create Account
            </button>
          </div>

          {/* Login Link */}
          <div className="text-center">
            <Link
              to="/login"
              className="text-sm text-gray-600 hover:text-indigo-600 transition-colors duration-300 inline-flex items-center space-x-1 group"
            >
              <span>Already have an account?</span>
              <span className="font-medium group-hover:translate-x-1 transition-transform">Sign in →</span>
            </Link>
          </div>
        </form>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500 mt-8">
          By signing up, you agree to our Terms of Service and Privacy Policy
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

export default Register;