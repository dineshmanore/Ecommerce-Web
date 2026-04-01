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
  ChevronDownIcon,
  ShoppingBagIcon,
  Squares2X2Icon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
  const { isAuthenticated, user, logout, isAdmin } = useAuthStore();
  const { getItemCount, fetchCart } = useCartStore();
  const { getItemCount: getWishlistCount, fetchWishlist } = useWishlistStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
      fetchWishlist();
    }
  }, [isAuthenticated, fetchCart, fetchWishlist]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setIsSearchFocused(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const cartCount = getItemCount();

  const navLinks = [
    { name: 'All Products', path: '/products' },
    { name: 'Today\'s Deals', path: '/products?featured=true' },
    { name: 'Customer Service', path: '/faq' },
    { name: 'Registry', path: '#' },
    { name: 'Gift Cards', path: '#' },
    { name: 'Sell', path: '#' },
  ];
  const isActive = (path) => {
    if (path === '#') return false;
    if (path.includes('featured=true')) {
      return location.search.includes('featured=true');
    }
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-50 flex flex-col w-full text-white">
      {/* Top Main Nav */}
      <div className="bg-primary-950 px-4 py-2 flex items-center justify-between lg:h-16 gap-4">
        
        {/* Logo & Mobile Menu */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-1 hover:border hover:border-white rounded-sm transition-all"
          >
            {isMenuOpen ? <XMarkIcon className="h-7 w-7" /> : <Bars3Icon className="h-7 w-7" />}
          </button>
          
          <Link to="/" className="flex items-center gap-1 border border-transparent hover:border-white p-1 rounded-sm mt-1">
            <span className="text-2xl font-bold tracking-tight">SMART<span className="text-accent-500">CART</span></span>
          </Link>
        </div>

        {/* Deliver to - Desktop Only */}
        <div className="hidden lg:flex items-center border border-transparent hover:border-white p-1 rounded-sm cursor-pointer mt-1">
          <div className="flex flex-col">
            <span className="text-xs text-gray-300 ml-5">Deliver to</span>
            <span className="text-sm font-bold flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              India
            </span>
          </div>
        </div>

        {/* Search Bar - Desktop */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-3xl h-10 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-accent-500">
          <select className="hidden lg:block bg-gray-100 text-gray-700 text-sm px-3 focus:outline-none border-r border-gray-300 hover:bg-gray-200 cursor-pointer">
            <option>All</option>
            <option>Electronics</option>
            <option>Fashion</option>
          </select>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            placeholder="Search SmartCart"
            className="flex-1 px-4 py-2 text-gray-900 placeholder-gray-500 focus:outline-none"
          />
          <button type="submit" className="bg-accent-400 hover:bg-accent-500 px-4 flex items-center justify-center transition-colors">
            <MagnifyingGlassIcon className="h-6 w-6 text-gray-900" />
          </button>
        </form>

        {/* Right Side Actions */}
        <div className="flex items-center gap-1 sm:gap-2">

          {/* User Account / Sign In */}
          {isAuthenticated ? (
            <Menu as="div" className="relative hidden md:block border border-transparent hover:border-white p-1 rounded-sm mt-1">
              <Menu.Button className="flex flex-col items-start px-2 py-1 text-white">
                <span className="text-xs text-gray-300">Hello, {user?.firstName}</span>
                <span className="text-sm font-bold flex items-center">
                  Account & Lists <ChevronDownIcon className="h-4 w-4 text-gray-400 ml-1" />
                </span>
              </Menu.Button>
              <Transition
                  as={Fragment}
                  enter="transition ease-out duration-200"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="transition ease-in duration-150"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-56 bg-white text-gray-900 rounded-sm shadow-xl border border-gray-200 py-2 focus:outline-none">
                  <Menu.Item>
                    {({ active }) => (
                      <Link to="/profile" className={`flex items-center px-4 py-2 text-sm ${active ? 'bg-gray-100' : ''}`}>
                        Your Profile
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <Link to="/orders" className={`flex items-center px-4 py-2 text-sm ${active ? 'bg-gray-100' : ''}`}>
                        Your Orders
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <Link to="/wishlist" className={`flex items-center px-4 py-2 text-sm ${active ? 'bg-gray-100' : ''}`}>
                        Your Wishlist
                      </Link>
                    )}
                  </Menu.Item>
                  {isAdmin() && (
                    <Menu.Item>
                      {({ active }) => (
                        <Link to="/admin" className={`flex items-center px-4 py-2 text-sm ${active ? 'bg-gray-100' : ''}`}>
                          Admin Dashboard
                        </Link>
                      )}
                    </Menu.Item>
                  )}
                  <Menu.Item>
                    {({ active }) => (
                      <button onClick={handleLogout} className={`flex w-full items-center px-4 py-2 text-sm text-red-600 ${active ? 'bg-red-50' : ''}`}>
                        Sign Out
                      </button>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          ) : (
            <Link to="/login" className="hidden md:flex flex-col items-start px-2 py-1 border border-transparent hover:border-white rounded-sm mt-1">
              <span className="text-xs text-white">Hello, sign in</span>
              <span className="text-sm font-bold flex items-center text-white">
                Account & Lists <ChevronDownIcon className="h-4 w-4 ml-1 text-gray-400" />
              </span>
            </Link>
          )}

          {/* Returns & Orders */}
          <Link to={isAuthenticated ? "/orders" : "/login"} className="hidden lg:flex flex-col items-start px-2 py-1 border border-transparent hover:border-white rounded-sm mt-1">
            <span className="text-xs text-white">Returns</span>
            <span className="text-sm font-bold text-white">& Orders</span>
          </Link>

          {/* Cart */}
          <Link to="/cart" className="flex items-center p-2 border border-transparent hover:border-white rounded-sm cursor-pointer relative mt-1">
            <div className="relative flex items-center">
              <ShoppingCartIcon className="h-9 w-9 text-white" />
              <span className="absolute top-0 right-1 left-3 font-bold text-accent-500 text-sm">{cartCount}</span>
            </div>
            <span className="text-sm font-bold mt-3 hidden md:block">Cart</span>
          </Link>
        </div>
      </div>

      {/* Sub Nav (Amazon Darker Blue Bar) */}
      <div className="bg-primary-900 px-4 py-1.5 flex items-center space-x-4 text-sm font-medium overflow-x-auto whitespace-nowrap hide-scrollbar">
        <button onClick={() => setIsMenuOpen(true)} className="flex items-center gap-1 border border-transparent hover:border-white p-1 rounded-sm cursor-pointer">
          <Bars3Icon className="w-5 h-5"/> All
        </button>
        {navLinks.map((link) => (
          <Link
            key={link.name}
            to={link.path}
            className="border border-transparent hover:border-white p-1 rounded-sm text-gray-200 hover:text-white"
          >
            {link.name}
          </Link>
        ))}
      </div>

      {/* Mobile Search - Rendered below nav on small screens */}
      <div className="md:hidden bg-primary-950 px-4 pb-3">
        <form onSubmit={handleSearch} className="flex flex-1 h-10 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-accent-500">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search SmartCart"
            className="flex-1 px-4 py-2 text-gray-900 placeholder-gray-500 focus:outline-none"
          />
          <button type="submit" className="bg-accent-400 hover:bg-accent-500 px-4 flex items-center justify-center transition-colors">
            <MagnifyingGlassIcon className="h-6 w-6 text-gray-900" />
          </button>
        </form>
      </div>

      {/* Mobile Sidebar overlay */}
      <Transition
        show={isMenuOpen}
        enter="transition-opacity ease-linear duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity ease-linear duration-300"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="fixed inset-0 z-50 bg-black bg-opacity-80" onClick={() => setIsMenuOpen(false)} />
      </Transition>

      <Transition
        show={isMenuOpen}
        enter="transition ease-in-out duration-300 transform"
        enterFrom="-translate-x-full"
        enterTo="translate-x-0"
        leave="transition ease-in-out duration-300 transform"
        leaveFrom="translate-x-0"
        leaveTo="-translate-x-full"
        className="fixed inset-y-0 left-0 z-50 w-4/5 max-w-sm bg-white text-gray-900 shadow-xl overflow-y-auto"
      >
        <div className="flex flex-col pb-6">
          <div className="bg-primary-950 text-white p-4 flex items-center gap-3">
            <UserIcon className="h-8 w-8 bg-white text-primary-950 rounded-full p-1" />
            <span className="text-xl font-bold">{isAuthenticated ? `Hello, ${user?.firstName || 'User'}` : 'Hello, sign in'}</span>
            <button className="ml-auto" onClick={() => setIsMenuOpen(false)}>
              <XMarkIcon className="h-8 w-8 text-white"/>
            </button>
          </div>
          
          <div className="py-4">
            <h3 className="px-6 font-bold text-lg mb-2">Trending</h3>
            <Link to="/products?featured=true" className="block px-6 py-3 hover:bg-gray-100 text-gray-700">Best Sellers</Link>
            <Link to="/products" className="block px-6 py-3 hover:bg-gray-100 text-gray-700">New Releases</Link>
          </div>
          <div className="border-t border-gray-200 py-4">
            <h3 className="px-6 font-bold text-lg mb-2">Help & Settings</h3>
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="block px-6 py-3 hover:bg-gray-100 text-gray-700">Your Account</Link>
                <Link to="/orders" className="block px-6 py-3 hover:bg-gray-100 text-gray-700">Your Orders</Link>
                {isAdmin() && <Link to="/admin" className="block px-6 py-3 hover:bg-gray-100 text-primary-600 font-medium">Admin Dashboard</Link>}
                <button onClick={handleLogout} className="w-full text-left px-6 py-3 hover:bg-gray-100 text-red-600">Sign Out</button>
              </>
            ) : (
              <Link to="/login" className="block px-6 py-3 hover:bg-gray-100 text-gray-700">Sign In</Link>
            )}
          </div>
        </div>
      </Transition>
    </header>
  );
}
