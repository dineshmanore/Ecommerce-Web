import { useState, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { FunnelIcon, MagnifyingGlassIcon, AdjustmentsHorizontalIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import ProductCard from '../components/product/ProductCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { productsAPI, categoriesAPI } from '../services/api';
import api from '../services/api';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalElements, setTotalElements] = useState(0);

  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Filter states
  const searchQuery = searchParams.get('search') || searchParams.get('q') || '';
  const categoryId = searchParams.get('category') || '';
  const isFeatured = searchParams.get('featured') === 'true';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';

  const page = parseInt(searchParams.get('page') || '0', 10);
  const sortBy = searchParams.get('sortBy') || 'createdAt';
  const sortDir = searchParams.get('sortDir') || 'desc';
  const size = 24;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoriesAPI.getAll();
        setCategories(res.data.data || []);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        let res;
        const params = { page, size, sortBy, sortDir };

        if (isFeatured) {
          res = await productsAPI.getFeatured(params);
        } else if (searchQuery) {
          res = await productsAPI.search(searchQuery, params);
        } else if (minPrice || maxPrice) {
          const min = minPrice || 0;
          const max = maxPrice || 1000000;
          res = await productsAPI.filterByPrice(min, max, params);
        } else if (categoryId) {
          res = await productsAPI.getByCategory(categoryId, params);
        } else {
          res = await productsAPI.getAll(params);
        }

        setProducts(res.data?.data?.content || res.data?.data || []);
        setTotalElements(res.data?.data?.totalElements || res.data?.data?.length || 0);
      } catch (error) {
        console.error('Failed to fetch products:', error);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, [searchQuery, categoryId, isFeatured, minPrice, maxPrice, page, sortBy, sortDir]);

  const updateFilters = (updates) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '') {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }
    });
    if (!updates.hasOwnProperty('page')) {
      newParams.delete('page');
    }
    setSearchParams(newParams);
  };

  const handlePriceSubmit = (e) => {
    e.preventDefault();
    const min = e.target.min.value;
    const max = e.target.max.value;
    updateFilters({ minPrice: min, maxPrice: max });
  };

  const currentCategory = categories.find(c => c.id === categoryId);

  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">

        {/* Mobile filter toggle */}
        <div className="md:hidden flex items-center justify-between mb-6">
          <h1 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white">Results</h1>
          <button
            onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary-100 dark:bg-primary-900/30 text-primary-600 rounded-2xl font-black text-xs uppercase tracking-widest shadow-sm"
          >
            <FunnelIcon className="h-5 w-5" /> Filters
          </button>
        </div>

        {/* Sidebar Filters */}
        <aside className={`${isMobileFiltersOpen ? 'block' : 'hidden'} md:block w-full md:w-72 flex-shrink-0 space-y-8`}>
          <div className="glass-card p-6 sticky top-32">
            <div className="flex items-center gap-2 mb-8">
               <AdjustmentsHorizontalIcon className="h-5 w-5 text-primary-600" />
               <h3 className="text-sm font-black uppercase tracking-widest text-gray-900 dark:text-white">Filter Results</h3>
            </div>

            <div className="space-y-10">
              {/* Category Filter */}
              <div className="space-y-4">
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Departments</h4>
                <div className="space-y-1">
                  <button
                    onClick={() => updateFilters({ category: null })}
                    className={`flex items-center justify-between w-full px-3 py-2 rounded-xl text-sm font-bold transition-all ${!categoryId ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                  >
                    All Items {!categoryId && <div className="h-1.5 w-1.5 bg-white rounded-full" />}
                  </button>
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => updateFilters({ category: cat.id })}
                      className={`flex items-center justify-between w-full px-3 py-2 rounded-xl text-sm font-bold transition-all ${categoryId === cat.id ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                    >
                      {cat.name} {categoryId === cat.id && <div className="h-1.5 w-1.5 bg-white rounded-full" />}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Price Filter */}
              <div className="space-y-4">
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Price Range</h4>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {[
                    { label: '< ₹1k', min: null, max: 1000 },
                    { label: '₹1k-5k', min: 1000, max: 5000 },
                    { label: '₹5k-10k', min: 5000, max: 10000 },
                    { label: '> ₹10k', min: 10000, max: null },
                  ].map((range, i) => (
                    <button 
                      key={i}
                      onClick={() => updateFilters({ minPrice: range.min, maxPrice: range.max })}
                      className="px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl text-[10px] font-black text-gray-600 dark:text-gray-400 hover:border-primary-500 transition-all uppercase tracking-tighter"
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
                
                <form onSubmit={handlePriceSubmit} className="flex items-center gap-2">
                  <input 
                    name="min" 
                    type="number" 
                    placeholder="Min" 
                    defaultValue={minPrice}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl text-xs focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none" 
                  />
                  <input 
                    name="max" 
                    type="number" 
                    placeholder="Max" 
                    defaultValue={maxPrice}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl text-xs focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none" 
                  />
                  <button type="submit" className="p-2 bg-primary-600 text-white rounded-xl shadow-lg hover:bg-primary-700 transition-all">
                    <ArrowRightIcon className="h-4 w-4" />
                  </button>
                </form>
              </div>
              
              {/* Specialized Programs */}
              <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input 
                      type="checkbox" 
                      checked={isFeatured}
                      onChange={(e) => updateFilters({ featured: e.target.checked ? 'true' : null })}
                      className="sr-only"
                    />
                    <div className={`w-12 h-6 rounded-full transition-all duration-300 ${isFeatured ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'}`} />
                    <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${isFeatured ? 'translate-x-6' : 'translate-x-0'}`} />
                  </div>
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-300 group-hover:text-primary-600 transition-colors">Prime Essential Only</span>
                </label>
              </div>
            </div>
          </div>
        </aside >

        {/* Main Content */}
        <main className="flex-1">
          {/* Top Result Bar */}
          <div className="glass-panel p-4 mb-8 rounded-[1.5rem] flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-sm font-bold text-gray-500 dark:text-gray-400">
               <span className="text-gray-900 dark:text-white">{totalElements}</span> items found
               {searchQuery && <span> for <span className="text-primary-600">"{searchQuery}"</span></span>}
               {currentCategory && <span> in <span className="text-primary-600">{currentCategory.name}</span></span>}
            </div>
            <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800 px-4 py-2 rounded-xl border border-gray-100 dark:border-gray-700">
               <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Sort by</span>
               <select 
                 value={`${searchParams.get('sortBy') || 'createdAt'}-${searchParams.get('sortDir') || 'desc'}`}
                 onChange={(e) => {
                   const [sortBy, sortDir] = e.target.value.split('-');
                   updateFilters({ sortBy, sortDir });
                 }}
                 className="bg-transparent text-xs font-bold text-gray-900 dark:text-white outline-none cursor-pointer"
               >
                 <option value="createdAt-desc">Recommended</option>
                 <option value="price-asc">Price: Low to High</option>
                 <option value="price-desc">Price: High to Low</option>
                 <option value="createdAt-desc">Latest Arrivals</option>
               </select>
            </div>
          </div>

          {/* Products Grid */}
          {isLoading ? (
            <div className="flex justify-center items-center py-40">
              <LoadingSpinner size="lg" />
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <div key={product.id} className="animate-fade-in-up">
                   <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-card py-24 px-8 text-center border-none">
               <div className="h-24 w-24 bg-primary-50 dark:bg-primary-900/30 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FunnelIcon className="h-10 w-10" />
               </div>
               <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-4 leading-tight">Mismatched Vibes.</h2>
               <p className="text-gray-500 dark:text-gray-400 mb-10 max-w-sm mx-auto font-medium">We couldn't find anything matching your filters. Try shaking things up a bit.</p>
               <button
                 onClick={() => updateFilters({ category: null, search: null, minPrice: null, maxPrice: null, featured: null })}
                 className="btn-primary rounded-full px-10 py-4"
               >
                 Clear All Filters
               </button>
            </div>
          )}

          {/* Pagination */}
          {!isLoading && totalElements > size && (
            <div className="mt-16 flex justify-center items-center gap-6">
              <button
                onClick={() => updateFilters({ page: Math.max(0, page - 1).toString() })}
                disabled={page === 0}
                className="h-14 w-14 rounded-full bg-white dark:bg-gray-900 shadow-soft flex items-center justify-center text-gray-400 hover:text-primary-600 disabled:opacity-30 disabled:scale-95 transition-all"
              >
                <ChevronLeftIcon className="h-6 w-6" />
              </button>
              <span className="text-sm font-black text-gray-900 dark:text-white tracking-widest uppercase">Page {page + 1}</span>
              <button
                onClick={() => updateFilters({ page: (page + 1).toString() })}
                disabled={products.length < size}
                className="h-14 w-14 rounded-full bg-white dark:bg-gray-900 shadow-soft flex items-center justify-center text-gray-400 hover:text-primary-600 disabled:opacity-30 disabled:scale-95 transition-all"
              >
                <ChevronRightIcon className="h-6 w-6" />
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function ArrowRightIcon(props) {
  return (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
  );
}
