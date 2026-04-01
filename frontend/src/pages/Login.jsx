import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { EnvelopeIcon, LockClosedIcon, EyeIcon, EyeSlashIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import { useAuthStore } from '../store/authStore';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, error } = useAuthStore();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(formData);
    if (success) {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-32 relative overflow-hidden bg-white dark:bg-gray-950">
      {/* Decorative Blobs */}
      <div className="absolute top-0 left-0 -translate-x-1/4 -translate-y-1/4 w-[500px] h-[500px] bg-primary-500/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 w-[400px] h-[400px] bg-accent-500/10 rounded-full blur-[100px]" />

      <div className="max-w-md w-full relative z-10 animate-fade-in-up">
        {/* Brand Header */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-2 mb-6 group justify-center">
            <div className="bg-gradient-to-tr from-primary-600 to-accent-500 p-2 rounded-xl text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
              <ShoppingBagIcon className="h-8 w-8" />
            </div>
            <span className="text-3xl font-black tracking-tighter text-gray-900 dark:text-white">
              SMART<span className="text-primary-600">CART</span>
            </span>
          </Link>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
            Welcome Back
          </h1>
          <p className="text-gray-500 font-medium mt-2">
            The future of shopping awaits you.
          </p>
        </div>

        <div className="glass-card p-8 md:p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-2xl text-xs font-bold border border-red-100 dark:border-red-900/30 animate-shake">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Email Identity</label>
              <div className="relative group">
                <EnvelopeIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-gray-50/50 dark:bg-gray-800/50 border border-transparent focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/5 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold text-gray-900 dark:text-white outline-none transition-all placeholder:text-gray-400"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Security Key</label>
              <div className="relative group">
                <LockClosedIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-gray-50/50 dark:bg-gray-800/50 border border-transparent focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/5 rounded-2xl pl-12 pr-12 py-4 text-sm font-bold text-gray-900 dark:text-white outline-none transition-all placeholder:text-gray-400"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between px-1">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                   <input type="checkbox" className="sr-only peer" />
                   <div className="w-5 h-5 border-2 border-gray-200 dark:border-gray-700 rounded-lg peer-checked:bg-primary-600 peer-checked:border-primary-600 transition-all" />
                   <CheckIcon className="absolute inset-0 h-5 w-5 text-white scale-0 peer-checked:scale-100 transition-transform" />
                </div>
                <span className="text-xs font-bold text-gray-500 group-hover:text-gray-700 transition-colors">Keep me signed in</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-xs font-black text-primary-600 hover:text-primary-700 uppercase tracking-widest"
              >
                Reset Pin?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary py-4 rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-primary-500/30 flex items-center justify-center translate-y-0 active:translate-y-1 transition-all"
            >
              {isLoading ? <LoadingSpinner size="sm" /> : 'Authenticate'}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-sm font-bold text-gray-500">
              New to the platform?{' '}
              <Link
                to="/register"
                className="text-accent-500 hover:text-accent-600 font-black uppercase tracking-widest ml-1"
              >
                Initialize Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function CheckIcon(props) {
  return (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
    </svg>
  );
}
