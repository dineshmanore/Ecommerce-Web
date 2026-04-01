import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/product/ProductCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { productsAPI, categoriesAPI } from '../services/api';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { getValidImageUrl } from '../utils/imageUtils';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroSlides = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=2070",
      title: "Welcome to SmartCart",
      subtitle: "Millions of items at your fingertips.",
      cta: "Shop Now",
      link: "/products",
      gradient: "from-blue-900/80 via-blue-800/60"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?auto=format&fit=crop&q=80&w=2070",
      title: "Prime Day Deals",
      subtitle: "Exclusive offers for Prime members.",
      cta: "Join Prime",
      link: "/products?featured=true",
      gradient: "from-orange-900/80 via-orange-800/60"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=2070",
      title: "New Arrivals in Fashion",
      subtitle: "Upgrade your wardrobe today.",
      cta: "Discover Fashion",
      link: "/products",
      gradient: "from-pink-900/80 via-pink-800/60"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

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

  return (
    <div className="bg-gray-100 min-h-screen pb-10">
      
      {/* Hero Section - Real Carousel */}
      <div className="relative w-full h-[400px] sm:h-[500px] lg:h-[600px] overflow-hidden group">
        
        {heroSlides.map((slide, index) => (
          <div 
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          >
            <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
            <div className={`absolute inset-0 bg-gradient-to-b ${slide.gradient} to-transparent mix-blend-multiply`} />
            
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 -mt-20 z-20">
              <h1 className="text-4xl md:text-5xl md:text-6xl font-extrabold text-white mb-4 drop-shadow-lg tracking-tight transition-transform duration-700 transform translate-y-0">
                {slide.title}
              </h1>
              <p className="text-xl md:text-2xl text-gray-100 drop-shadow-md max-w-2xl mb-8 font-medium">
                {slide.subtitle}
              </p>
              <Link to={slide.link} className="bg-accent-400 hover:bg-accent-500 text-gray-900 font-bold py-3 px-8 rounded-full shadow-lg transition-transform hover:scale-105 text-lg">
                {slide.cta}
              </Link>
            </div>
          </div>
        ))}
        
        {/* Carousel Navigation */}
        <button 
          onClick={() => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-white/30 text-white hover:bg-white/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <ChevronLeftIcon className="h-8 w-8" />
        </button>
        <button 
          onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-white/30 text-white hover:bg-white/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <ChevronRightIcon className="h-8 w-8" />
        </button>

        {/* Carousel Indicators */}
        <div className="absolute bottom-56 left-1/2 -translate-x-1/2 z-30 flex gap-2">
          {heroSlides.map((_, index) => (
            <button 
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${index === currentSlide ? 'w-8 bg-white' : 'w-2 bg-white/50'}`}
            />
          ))}
        </div>

        {/* Fade to background color at the bottom */}
        <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-gray-100 to-transparent pointer-events-none z-20" />
      </div>

      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 -mt-64 md:-mt-80">
        {/* Overlapping Category Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {categories.slice(0, 4).map((category, idx) => (
            <div key={category.id || idx} className="bg-white p-5 shadow-sm rounded-sm flex flex-col h-full hover:shadow-md transition-shadow">
              <h2 className="text-xl font-bold text-gray-900 mb-4">{category.name}</h2>
              <div className="flex-grow bg-gray-50 flex items-center justify-center mb-4 min-h-[150px] md:min-h-[250px] overflow-hidden">
                <img 
                  src={getValidImageUrl(category.image, category.name)} 
                  alt={category.name} 
                  className="object-cover w-full h-full hover:scale-105 transition-transform duration-500"
                />
              </div>
              <Link to={`/products?category=${category.id}`} className="text-sm text-primary-700 hover:text-primary-800 hover:underline mt-auto">
                Shop now
              </Link>
            </div>
          ))}
          {/* Fill empty spots if less than 4 categories */}
          {categories.length < 4 && Array.from({ length: 4 - categories.length }).map((_, i) => (
            <div key={`placeholder-${i}`} className="bg-white p-5 shadow-sm rounded-sm flex flex-col h-full">
               <h2 className="text-xl font-bold text-gray-900 mb-4">More Deals</h2>
               <div className="flex-grow bg-gray-100 min-h-[150px] md:min-h-[250px] mb-4"></div>
               <Link to="/products" className="text-sm text-primary-700 hover:underline mt-auto">See all deals</Link>
            </div>
          ))}
        </div>

        {/* Featured Products Row */}
        <div className="bg-white p-5 shadow-sm rounded-sm mb-8">
          <div className="flex items-center gap-4 mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Featured items you might like</h2>
            <Link to="/products?featured=true" className="text-sm text-primary-700 hover:underline hover:text-primary-800">
              Explore more
            </Link>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="flex overflow-x-auto gap-4 pb-4 hide-scrollbar snap-x">
              {featuredProducts.map((product) => (
                <div key={product.id} className="min-w-[220px] max-w-[220px] snap-start flex-shrink-0">
                  <ProductCard product={product} showQuickView={false} />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 py-6">No featured products available at the moment.</p>
          )}
        </div>

        {/* Banner ad or another section */}
        <div className="w-full bg-white border border-gray-200 rounded-sm mb-8 p-6 flex flex-col md:flex-row items-center justify-between shadow-sm">
          <div className="mb-4 md:mb-0">
            <h3 className="text-2xl font-bold mb-2">Join SmartCart Prime today</h3>
            <p className="text-gray-600">Get free shipping, exclusive deals, and fast delivery.</p>
          </div>
          <button className="bg-accent-400 hover:bg-accent-500 px-6 py-2 rounded-full font-bold shadow-sm">
            Try Prime Free
          </button>
        </div>
        
      </div>
    </div>
  );
}
