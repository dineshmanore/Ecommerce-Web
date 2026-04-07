import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import ProductCard from '../components/product/ProductCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { productsAPI, categoriesAPI } from '../services/api';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  ShoppingBagIcon, 
  SparklesIcon,
  TicketIcon,
  DevicePhoneMobileIcon,
  HomeModernIcon,
  UserCircleIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { getValidImageUrl } from '../utils/imageUtils';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          productsAPI.getFeatured({ size: 8 }),
          categoriesAPI.getAll(),
        ]);
        setFeaturedProducts(productsRes.data.data.content || productsRes.data.data || []);
        setCategories(categoriesRes.data.data || []);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const categoryIcons = {
    'electronics': <DevicePhoneMobileIcon className="w-8 h-8" />,
    'fashion': <TicketIcon className="w-8 h-8" />,
    'home': <HomeModernIcon className="w-8 h-8" />,
    'default': <ShoppingBagIcon className="w-8 h-8" />
  };

  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen pb-20 overflow-x-hidden">
      
      {/* Modern Mesh Gradient Hero */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-4 overflow-hidden">
        {/* Dynamic Background Blobs */}
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[600px] h-[600px] bg-primary-500/20 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[500px] h-[500px] bg-accent-500/20 rounded-full blur-[100px]" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 text-center lg:text-left space-y-8 animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-black text-xs uppercase tracking-[0.2em] shadow-sm">
                <SparklesIcon className="h-4 w-4" />
                Next Gen Shopping
              </div>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-gray-900 dark:text-white leading-[0.9]">
                CRAFTED FOR <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-500">YOU.</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 max-w-xl font-medium leading-relaxed">
                Discover a world of premium products curated with precision. Seamlessly elegant, uniquely yours.
              </p>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                <Link to="/products" className="btn-primary py-4 px-10 rounded-full text-lg shadow-2xl shadow-primary-500/40">
                  Explore Now
                </Link>
                <Link to="/products?featured=true" className="btn-secondary py-4 px-10 rounded-full text-lg border-2 border-gray-100">
                  Top Deals
                </Link>
              </div>
            </div>
            
            {/* Hero Feature Card */}
            <div className="flex-1 w-full max-w-lg lg:max-w-none animate-fade-in-down delay-300">
               <div className="relative group">
                  <div className="absolute -inset-4 bg-gradient-to-tr from-primary-500 to-accent-400 rounded-[3rem] blur-2xl opacity-20 group-hover:opacity-30 transition-opacity" />
                  <div className="relative glass-card p-1 overflow-hidden transition-all duration-500 hover:rotate-1">
                    <img 
                      src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=1200" 
                      alt="Hero Showcase" 
                      className="w-full h-[400px] lg:h-[500px] object-cover rounded-[2.5rem]"
                    />
                    <div className="absolute bottom-8 left-8 right-8 glass-panel p-6 rounded-3xl flex items-center justify-between">
                       <div>
                          <p className="text-xs font-bold text-primary-600 uppercase tracking-widest mb-1">Weekly Special</p>
                          <h3 className="text-2xl font-black text-gray-900 dark:text-white">Signature Series</h3>
                       </div>
                       <div className="h-14 w-14 rounded-2xl bg-primary-600 text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                          <ArrowRightIcon className="h-6 w-6" />
                       </div>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stylized Category Icons Section */}
      <section className="py-24 px-4 bg-gray-50/50 dark:bg-gray-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-end justify-between gap-6 mb-16">
            <div className="space-y-2">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-primary-500">Categories</h3>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900 dark:text-white">Browse by Genre</h2>
            </div>
            <Link to="/products" className="group flex items-center gap-2 text-primary-600 font-bold hover:gap-4 transition-all">
               View All Collections <ArrowRightIcon className="h-5 w-5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
            {categories.map((category) => {
              const iconKey = category.name.toLowerCase();
              return (
                <Link 
                  key={category.id} 
                  to={`/products?category=${category.id}`}
                  className="group flex flex-col items-center gap-4 text-center"
                >
                  <div className="relative">
                    <div className="absolute -inset-2 bg-gradient-to-tr from-primary-500 to-accent-500 rounded-full opacity-0 group-hover:opacity-100 blur-md transition-opacity" />
                    <div className="relative h-24 w-24 md:h-32 md:w-32 rounded-full glass-panel flex items-center justify-center shadow-soft group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                      <img 
                        src={getValidImageUrl(category.image, category.name)} 
                        alt={category.name}
                        className="h-full w-full object-cover rounded-full p-1 opacity-80 group-hover:opacity-100 transition-opacity"
                      />
                      <div className="absolute inset-0 bg-primary-600/10 dark:bg-primary-600/20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                         <SearchIcon className="h-8 w-8 text-white scale-90 group-hover:scale-100 transition-transform" />
                      </div>
                    </div>
                  </div>
                  <span className="font-bold text-gray-700 dark:text-gray-300 group-hover:text-primary-600 transition-colors uppercase tracking-widest text-xs">
                    {category.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Premium Featured Section */}
      <section className="py-24 px-4 overflow-hidden relative">
         <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-accent-500/5 rounded-full blur-[80px]" />
         
         <div className="max-w-7xl mx-auto relative z-10">
            <div className="flex items-center justify-between mb-16">
               <h2 className="text-4xl font-black tracking-tight text-gray-900 dark:text-white">Curated Selection</h2>
               <div className="flex gap-2">
                  <button className="h-12 w-12 rounded-full border border-gray-200 dark:border-gray-800 flex items-center justify-center text-gray-400 hover:bg-white hover:text-primary-600 transition-all">
                     <ChevronLeftIcon className="h-6 w-6" />
                  </button>
                  <button className="h-12 w-12 rounded-full border border-gray-200 dark:border-gray-800 flex items-center justify-center text-gray-400 hover:bg-white hover:text-primary-600 transition-all">
                     <ChevronRightIcon className="h-6 w-6" />
                  </button>
               </div>
            </div>

            {isLoading ? (
               <div className="flex justify-center py-20">
                  <LoadingSpinner size="lg" />
               </div>
            ) : (
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {featuredProducts.slice(0, 4).map((product) => (
                     <ProductCard key={product.id} product={product} />
                  ))}
               </div>
            )}
         </div>
      </section>

      {/* Ultra Modern Call to Action */}
      <section className="px-4 py-12">
        <div className="max-w-7xl mx-auto">
           <div className="relative rounded-[3rem] overflow-hidden bg-gray-900 group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-900 to-black opacity-80" />
              <img 
                src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=2070" 
                alt="Call to Action"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2000ms]"
              />
              <div className="relative z-10 px-8 py-20 md:p-24 flex flex-col items-center text-center">
                 <h2 className="text-4xl md:text-6xl font-black text-white leading-tight mb-8">
                   JOIN THE ULTIMATE <br/> SHOPPING CIRCLE.
                 </h2>
                 <p className="text-xl text-gray-300 max-w-2xl mb-12">
                   Get exclusive access to drops, member-only pricing, and lightning-fast worldwide priority shipping.
                 </p>
                  <Link 
                    to={isAuthenticated ? "/orders" : "/register"} 
                    className="btn-accent px-12 py-5 rounded-full text-xl shadow-glow transition-all"
                  >
                     {isAuthenticated ? "Check Your Status — It's Free" : "Register Now — It's Free"}
                  </Link>
              </div>
           </div>
        </div>
      </section>
      
    </div>
  );
}

// Add missing icon for the category hover
function SearchIcon(props) {
  return (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}
