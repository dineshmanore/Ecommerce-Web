import { useState, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { FunnelIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import ProductCard from '../components/product/ProductCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { productsAPI, categoriesAPI } from '../services/api';

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
  const size = 12;

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
        if (isFeatured) {
          res = await productsAPI.getFeatured({ page, size });
        } else if (searchQuery) {
          res = await productsAPI.search(searchQuery, { page, size, categoryId, minPrice, maxPrice });
        } else {
          res = await productsAPI.getAll({ page, size, categoryId, minPrice, maxPrice });
        }

        setProducts(res.data.data.content || res.data.data || []);
        setTotalElements(res.data.data.totalElements || res.data.data.length || 0);
      } catch (error) {
        console.error('Failed to fetch products:', error);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, [searchQuery, categoryId, isFeatured, minPrice, maxPrice, page]);

  const updateFilters = (updates) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '') {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }
    });
    // Reset page on filter change
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
    <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row gap-6">

      {/* Mobile filter toggle */}
      <div className="md:hidden flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Results</h1>
        <button
          onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-md font-medium shadow-sm hover:bg-gray-200"
        >
          <FunnelIcon className="h-5 w-5" /> Filters
        </button>
      </div>

      {/* Sidebar Filters */}
      <aside className={`${isMobileFiltersOpen ? 'block' : 'hidden'} md:block w-full md:w-64 flex-shrink-0 space-y-6 pt-2`}>
      <div>
        <h3 className="text-sm font-bold text-gray-900 mb-3 border-b pb-2">Category</h3>
        <ul className="space-y-2 text-sm">
          <li>
            <button
              onClick={() => updateFilters({ category: null })}
              className={`text-left w-full hover:text-accent-600 ${!categoryId ? 'font-bold text-gray-900' : 'text-gray-700'}`}
              >
            All Departments
          </button>
        </li>
        {categories.map(cat => (
          <li key={cat.id} className="pl-2 border-l-2 border-transparent">
            <button
              onClick={() => updateFilters({ category: cat.id })}
              className={`text-left w-full hover:text-accent-600 ${categoryId === cat.id ? 'font-bold text-gray-900' : 'text-gray-700'}`}
                >
            {cat.name}
          </button>
              </li>
            ))}
    </ul>
        </div >
        
        <div>
          <h3 className="text-sm font-bold text-gray-900 mb-3 border-b pb-2">Price</h3>
          <ul className="space-y-2 text-sm mb-3 text-gray-700">
            <li><button onClick={() => updateFilters({ minPrice: null, maxPrice: 1000 })} className="hover:text-accent-600">Under ₹1,000</button></li>
            <li><button onClick={() => updateFilters({ minPrice: 1000, maxPrice: 5000 })} className="hover:text-accent-600">₹1,000 - ₹5,000</button></li>
            <li><button onClick={() => updateFilters({ minPrice: 5000, maxPrice: 10000 })} className="hover:text-accent-600">₹5,000 - ₹10,000</button></li>
            <li><button onClick={() => updateFilters({ minPrice: 10000, maxPrice: null })} className="hover:text-accent-600">Over ₹10,000</button></li>
          </ul>
          
          <form onSubmit={handlePriceSubmit} className="flex items-center gap-2 text-sm">
            <input 
              name="min" 
              type="number" 
              placeholder="Min" 
              defaultValue={minPrice}
              className="w-16 px-2 py-1 border border-gray-400 rounded-sm focus:outline-none focus:border-accent-500" 
            />
            <span>-</span>
            <input 
              name="max" 
              type="number" 
              placeholder="Max" 
              defaultValue={maxPrice}
              className="w-16 px-2 py-1 border border-gray-400 rounded-sm focus:outline-none focus:border-accent-500" 
            />
            <button type="submit" className="px-3 py-1 bg-white border border-gray-400 rounded-sm shadow-sm hover:bg-gray-50 font-medium">
              Go
            </button>
          </form>
        </div>
        
        <div>
          <h3 className="text-sm font-bold text-gray-900 mb-3 border-b pb-2">SmartCart Programs</h3>
          <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 hover:text-accent-600">
            <input 
              type="checkbox" 
              checked={isFeatured}
              onChange={(e) => updateFilters({ featured: e.target.checked ? 'true' : null })}
              className="rounded border-gray-400 text-accent-500 focus:ring-accent-500"
            />
            <span>Prime Eligible</span>
          </label>
        </div>
      </aside >

    {/* Main Content */ }
    < main className = "flex-1" >
      {/* Top Result Bar */ }
      < div className = "bg-white p-3 mb-4 shadow-sm border border-gray-200 rounded-sm flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600" >
          <div>
            1-{products.length} of over {totalElements} results
            {searchQuery && <span> for <span className="text-accent-600 font-bold">"{searchQuery}"</span></span>}
            {currentCategory && <span> in <span className="font-bold">{currentCategory.name}</span></span>}
          </div>
          <div className="mt-2 sm:mt-0 flex items-center gap-2">
            <label htmlFor="sort" className="font-medium text-gray-700 shadow-none">Sort by:</label>
            <select id="sort" className="bg-gray-100 border border-gray-300 rounded px-2 py-1 shadow-sm focus:outline-none focus:ring-1 focus:ring-accent-500 cursor-pointer">
              <option>Featured</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Customer Review</option>
            </select>
          </div>
        </div >

    {/* Products Grid */ }
  {
    isLoading ? (
      <div className="flex justify-center items-center py-32">
        <LoadingSpinner size="lg" />
      </div>
    ) : products.length > 0 ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    ) : (
      <div className="bg-white py-16 px-4 text-center border border-gray-200 rounded-sm">
        <p className="text-xl font-bold mb-4 text-gray-900">No results found.</p>
        <p className="text-gray-600 mb-6">Try adjusting your filters or search query to find what you're looking for.</p>
        <button
          onClick={() => updateFilters({ category: null, search: null, minPrice: null, maxPrice: null, featured: null })}
          className="px-6 py-2 bg-accent-400 hover:bg-accent-500 text-gray-900 font-bold rounded-sm shadow-sm"
        >
          Clear All Filters
        </button>
      </div>
    )
  }

  {/* Pagination placeholder (if total > size) */ }
  {
    !isLoading && totalElements > size && (
      <div className="mt-8 flex justify-center py-4 border-t border-gray-200 gap-2">
        <button
          onClick={() => updateFilters({ page: Math.max(0, page - 1).toString() })}
          disabled={page === 0}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white disabled:opacity-50 disabled:bg-gray-100 hover:bg-gray-50"
        >
          Previous
        </button>
        <button
          onClick={() => updateFilters({ page: (page + 1).toString() })}
          disabled={products.length < size}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    )
  }
      </main >
    </div >
  );
}
