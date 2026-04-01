import { useState, useEffect, Fragment } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, Transition } from '@headlessui/react';
import { 
  ShoppingCartIcon, 
  UserIcon, 
  Bars3Icon, 
  XMarkIcon,
  MagnifyingGlassIcon,
  HeartIcon,
  Squares2X2Icon,
  ArrowRightOnRectangleIcon,
  SparklesIcon,
  ShoppingBagIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  
  const { isAuthenticated, user, logout, isAdmin } = useAuthStore();
  const { getItemCount, fetchCart } = useCartStore();
  const { getItemCount: getWishlistCount, fetchWishlist } = useWishlistStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
      fetchWishlist();
    }
  }, [isAuthenticated, fetchCart, fetchWishlist]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const cartCount = getItemCount();
  const wishlistCount = getWishlistCount();

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-4 py-3 ${isScrolled ? 'mt-0' : 'mt-2'}`}>
      <div className={`max-w-7xl mx-auto glass-panel rounded-2xl shadow-soft transition-all duration-500 flex items-center justify-between px-4 lg:px-8 h-16 lg:h-20 ${isScrolled ? 'bg-white/80 dark:bg-gray-900/80' : 'bg-white/40 dark:bg-gray-900/40'}`}>
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-gradient-to-tr from-primary-600 to-accent-500 p-2 rounded-xl text-white shadow-lg shadow-primary-500/20 group-hover:scale-110 transition-transform duration-300">
            <ShoppingBagIcon className="h-6 w-6" />
          </div>
          <span className="text-xl lg:text-2xl font-black tracking-tighter text-gray-900 dark:text-white">
            SMART<span className="text-primary-600">CART</span>
          </span>
        </Link>

        {/* Search Bar - Desktop Only */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8 relative group">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full bg-gray-100/50 dark:bg-gray-800/50 border-none rounded-2xl px-5 py-2.5 focus:ring-2 focus:ring-primary-500/50 dark:text-white placeholder-gray-400 backdrop-blur-sm transition-all"
          />
          <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors shadow-sm">
            <MagnifyingGlassIcon className="h-5 w-5" />
          </button>
        </form>

        {/* Right Actions */}
        <div className="flex items-center gap-1 lg:gap-4">
          {/* Wishlist Icon */}
          <Link to="/wishlist" className="p-2.5 text-gray-500 hover:text-primary-600 hover:bg-primary-50 dark:text-gray-400 dark:hover:bg-primary-900/20 rounded-xl transition-all relative">
            <HeartIcon className="h-6 w-6" />
            {wishlistCount > 0 && (
              <span className="absolute top-1 right-1 h-4 w-4 bg-accent-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white dark:border-gray-900 shadow-sm animate-pulse-slow">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart Icon */}
          <Link to="/cart" className="p-2.5 text-gray-500 hover:text-primary-600 hover:bg-primary-50 dark:text-gray-400 dark:hover:bg-primary-900/20 rounded-xl transition-all relative">
            <ShoppingCartIcon className="h-6 w-6" />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 h-5 w-5 bg-primary-600 text-white text-xs font-bold flex items-center justify-center rounded-full border-2 border-white dark:border-gray-900 shadow-lg">
                {cartCount}
              </span>
            )}
          </Link>

          {/* User Profile / Menu */}
          {isAuthenticated ? (
            <Menu as="div" className="relative group ml-1">
              <Menu.Button className="flex items-center gap-2 p-1.5 rounded-2xl border-2 border-transparent hover:border-primary-100 dark:hover:border-primary-900/30 transition-all">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-primary-500 to-accent-400 p-[2px]">
                   <div className="w-full h-full bg-white dark:bg-gray-900 rounded-[10px] flex items-center justify-center">
                     <span className="text-primary-600 font-black text-sm uppercase">{user?.firstName?.[0]}</span>
                   </div>
                </div>
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 scale-95 translate-y-2"
                enterTo="opacity-100 scale-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 scale-100 translate-y-0"
                leaveTo="opacity-0 scale-95 translate-y-2"
              >
                <Menu.Items className="absolute right-0 mt-3 w-56 glass-panel rounded-2xl shadow-xl overflow-hidden py-2 focus:outline-none">
                  <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                    <p className="text-sm font-bold truncate dark:text-white">{user?.firstName} {user?.lastName}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                  </div>
                  <Menu.Item>
                    {({ active }) => (
                      <Link to="/profile" className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium ${active ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/30' : 'text-gray-600 dark:text-gray-400'}`}>
                        <UserIcon className="h-5 w-5" /> Your Profile
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <Link to="/orders" className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium ${active ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/30' : 'text-gray-600 dark:text-gray-400'}`}>
                        <SparklesIcon className="h-5 w-5" /> Your Orders
                      </Link>
                    )}
                  </Menu.Item>
                  {isAdmin() && (
                    <Menu.Item>
                      {({ active }) => (
                        <Link to="/admin" className={`flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-accent-600 ${active ? 'bg-accent-50 dark:bg-accent-900/20' : ''}`}>
                          <Squares2X2Icon className="h-5 w-5" /> Admin Panel
                        </Link>
                      )}
                    </Menu.Item>
                  )}
                  <div className="border-t border-gray-100 dark:border-gray-800 mt-2 pt-2">
                    <Menu.Item>
                      {({ active }) => (
                        <button onClick={logout} className={`flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-500 ${active ? 'bg-red-50 dark:bg-red-900/20' : ''}`}>
                          <ArrowRightOnRectangleIcon className="h-5 w-5" /> Sign Out
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          ) : (
            <Link to="/login" className="btn-primary btn-sm ml-2">
              Sign In
            </Link>
          )}

          {/* Simple Toggle - Tablet/Mobile */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2.5 text-gray-500 hover:text-primary-600 rounded-xl"
          >
            {isMenuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Mesh Overlay */}
      <Transition
        show={isMenuOpen}
        enter="transition-all duration-500 ease-out"
        enterFrom="opacity-0 translate-y-4 filter blur-xl scale-95"
        enterTo="opacity-100 translate-y-0 filter blur-none scale-100"
        leave="transition-all duration-300 ease-in"
        leaveFrom="opacity-100 translate-y-0 filter blur-none scale-100"
        leaveTo="opacity-0 translate-y-4 filter blur-xl scale-95"
        className="fixed inset-0 top-[88px] z-40 md:hidden overflow-hidden"
      >
        <div className="absolute inset-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-3xl p-6 overflow-y-auto">
          <div className="grid grid-cols-1 gap-4">
            {/* Quick Links with Icons */}
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Explore Shop</h3>
            <Link to="/products" className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-3xl group">
               <span className="font-bold text-lg text-gray-900 dark:text-white">All Products</span>
               <div className="h-10 w-10 bg-primary-100 dark:bg-primary-900/30 text-primary-600 flex items-center justify-center rounded-2xl group-hover:bg-primary-600 group-hover:text-white transition-all">
                  <ShoppingBagIcon className="h-5 w-5" />
               </div>
            </Link>
            <Link to="/products?featured=true" className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-3xl group">
               <span className="font-bold text-lg text-gray-900 dark:text-white">Today's Deals</span>
               <div className="h-10 w-10 bg-accent-100 dark:bg-accent-900/30 text-accent-600 flex items-center justify-center rounded-2xl group-hover:bg-accent-500 group-hover:text-white transition-all">
                  <SparklesIcon className="h-5 w-5" />
               </div>
            </Link>

            <div className="mt-8">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-4">Support & More</h3>
              <div className="grid grid-cols-2 gap-4">
                <Link to="/faq" className="p-4 border border-gray-100 dark:border-gray-800 rounded-3xl text-center font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-50">FAQ</Link>
                <Link to="/contact" className="p-4 border border-gray-100 dark:border-gray-800 rounded-3xl text-center font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-50">Contact</Link>
              </div>
            </div>
            
            {!isAuthenticated && (
              <div className="mt-8 flex flex-col gap-3">
                <Link to="/login" className="btn-primary py-4 rounded-[2rem]">Sign In</Link>
                <Link to="/register" className="btn-secondary py-4 rounded-[2rem]">Create Account</Link>
              </div>
            )}
          </div>
        </div>
      </Transition>
    </header>
  );
}
