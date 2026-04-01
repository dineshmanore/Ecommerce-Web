import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingCartIcon, 
  HeartIcon, 
  StarIcon,
  EyeIcon,
  CheckIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid, StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { getValidImageUrl } from '../../utils/imageUtils';

export default function ProductCard({ product, showQuickView = true }) {
  const { addToCart, isLoading } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    const result = await addToCart(product.id, 1);
    if (result.success) {
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    }
  };

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating || 0);
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<StarIconSolid key={i} className="h-3 w-3 text-amber-400" />);
      } else {
        stars.push(<StarIcon key={i} className="h-3 w-3 text-gray-200 dark:text-gray-700" />);
      }
    }
    return stars;
  };

  const discountPercentage = product.discountPrice 
    ? Math.round((1 - product.discountPrice / product.price) * 100)
    : 0;

  const isOutOfStock = product.stockQuantity === 0;

  return (
    <Link 
      to={`/products/${product.id}`} 
      className="group block relative"
    >
      <div className="relative glass-card p-4 h-full flex flex-col transition-all duration-500 hover:shadow-soft-lg hover:-translate-y-2">
        
        {/* Floating Image Container */}
        <div className="relative w-full mb-6 group-hover:scale-105 transition-transform duration-500 ease-out" style={{aspectRatio:"1/1"}}>
          {/* Subtle Glow Background */}
          <div className="absolute inset-0 bg-primary-500/5 rounded-3xl blur-2xl group-hover:bg-primary-500/10 transition-colors" />
          
          <img
            src={getValidImageUrl(product.images?.[0], product.categoryName || product.name)}
            alt={product.name}
            className={`w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal transition-all duration-700
                       ${imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
            onLoad={() => setImageLoaded(true)}
            loading="lazy"
          />
          
          {!imageLoaded && (
            <div className="absolute inset-0 skeleton rounded-3xl" />
          )}

          {/* Top Badges */}
          <div className="absolute top-0 left-0 flex flex-col gap-2">
            {product.featured && (
              <span className="bg-primary-600 text-white text-[10px] font-black px-3 py-1.5 rounded-xl shadow-lg border border-white/20 flex items-center gap-1 uppercase tracking-wider">
                <SparklesIcon className="h-3 w-3" /> Essential
              </span>
            )}
            {discountPercentage > 0 && (
              <span className="bg-accent-500 text-white text-[10px] font-black px-3 py-1.5 rounded-xl shadow-lg border border-white/20 uppercase tracking-widest">
                -{discountPercentage}%
              </span>
            )}
          </div>

          {/* Quick Action Overlay */}
          <div className="absolute top-0 right-0 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
            <button 
              onClick={handleWishlistClick}
              className={`p-3 rounded-2xl shadow-xl backdrop-blur-md border border-white/10 transition-all duration-300 
                         ${inWishlist 
                           ? 'bg-red-500 text-white' 
                           : 'bg-white/80 dark:bg-gray-800/80 text-gray-500 hover:bg-red-50 hover:text-red-500'}`}
            >
              {inWishlist ? <HeartIconSolid className="h-5 w-5" /> : <HeartIcon className="h-5 w-5" />}
            </button>
            <button className="p-3 bg-white/80 dark:bg-gray-800/80 rounded-2xl shadow-xl backdrop-blur-md border border-white/10 text-gray-500 hover:bg-primary-50 hover:text-primary-600 transition-all duration-300">
               <EyeIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Product Details Section */}
        <div className="flex flex-col flex-1 text-center">
          <p className="text-[10px] font-black text-primary-500 uppercase tracking-[0.2em] mb-2 px-4 py-1 rounded-full bg-primary-50 dark:bg-primary-900/20 self-center">
            {product.categoryName || 'Select'}
          </p>

          <h3 className="text-base font-black text-gray-900 dark:text-gray-100 line-clamp-2 mb-2 group-hover:text-primary-600 transition-colors px-2 leading-tight">
            {product.name}
          </h3>

          <div className="flex items-center justify-center gap-1 mb-4">
             {renderStars(product.averageRating)}
             <span className="text-[10px] text-gray-400 font-bold ml-1">({product.reviewCount || 0})</span>
          </div>

          <div className="mt-auto pt-4 flex flex-col gap-4">
             <div className="flex items-center justify-center gap-3">
                {product.discountPrice ? (
                  <>
                    <span className="text-xl font-black text-gray-950 dark:text-white">
                      ₹{product.discountPrice.toLocaleString()}
                    </span>
                    <span className="text-xs text-gray-400 line-through font-bold">
                      ₹{product.price.toLocaleString()}
                    </span>
                  </>
                ) : (
                  <span className="text-xl font-black text-gray-950 dark:text-white">
                    ₹{product.price?.toLocaleString() || '0'}
                  </span>
                )}
             </div>

             <button
                onClick={handleAddToCart}
                disabled={isLoading || isOutOfStock}
                className={`w-full group/btn relative py-4 rounded-[1.25rem] font-black text-xs uppercase tracking-widest overflow-hidden transition-all duration-500
                  ${addedToCart 
                    ? 'bg-green-500 text-white shadow-green-500/30' 
                    : 'bg-gray-950 dark:bg-white text-white dark:text-gray-950 hover:bg-primary-600 dark:hover:bg-primary-600 hover:text-white shadow-xl hover:shadow-primary-500/30'}`}
              >
                <div className="relative z-10 flex items-center justify-center gap-2">
                   {addedToCart ? (
                      <><CheckIcon className="h-4 w-4" /> SECURED</>
                   ) : isOutOfStock ? (
                      'OUT OF STOCK'
                   ) : (
                      <><ShoppingCartIcon className="h-4 w-4" /> ADD TO CART</>
                   )}
                </div>
                {!addedToCart && !isOutOfStock && (
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-accent-500 translate-x-full group-hover/btn:translate-x-0 transition-transform duration-500" />
                )}
             </button>
          </div>
        </div>

        {/* Stock Badge Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-4 bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-[2rem] flex items-center justify-center z-20">
             <span className="text-xs font-black text-gray-900 dark:text-white border-2 border-gray-900 dark:border-white px-4 py-2 rounded-full transform -rotate-12">SOLD OUT</span>
          </div>
        )}
      </div>
    </Link>
  );
}
