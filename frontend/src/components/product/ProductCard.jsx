import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingCartIcon, 
  HeartIcon, 
  StarIcon,
  EyeIcon,
  CheckIcon
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
        stars.push(<StarIconSolid key={i} className="h-3 w-3 text-yellow-400" />);
      } else {
        stars.push(<StarIcon key={i} className="h-3 w-3 text-gray-300 dark:text-gray-600" />);
      }
    }
    return stars;
  };

  const discountPercentage = product.discountPrice 
    ? Math.round((1 - product.discountPrice / product.price) * 100)
    : 0;

  const isOutOfStock = product.stockQuantity === 0;
  const isLowStock = product.stockQuantity > 0 && product.stockQuantity <= 5;

  return (
    <Link 
      to={`/products/${product.id}`} 
      className="group block"
    >
      <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm">
        {/* Image Container */}
        <div className="relative w-full bg-gray-100 dark:bg-gray-800 overflow-hidden" style={{aspectRatio:"1/1"}}>
          {/* Skeleton while loading */}
          {!imageLoaded && (
            <div className="absolute inset-0 skeleton" />
          )}
          
          <img
            src={getValidImageUrl(product.images?.[0], product.categoryName || product.name)}
            alt={product.name}
            className={`w-full h-full object-contain transition-all duration-300
                       group-hover:scale-105
                       ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
            loading="lazy"
          />
          
          {/* Overlay on out of stock */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-white text-gray-900 px-4 py-2 rounded-full font-semibold text-sm">
                Out of Stock
              </span>
            </div>
          )}
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.featured && (
              <span className="bg-primary-900 text-white text-xs font-bold px-2.5 py-1 rounded-sm shadow-sm flex items-center gap-1 border border-primary-700">
                <CheckIcon className="h-3 w-3 text-accent-500 font-bold" /> Prime
              </span>
            )}
            {discountPercentage > 0 && (
              <span className="bg-gradient-to-r from-red-600 to-red-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-lg">
                -{discountPercentage}%
              </span>
            )}
            {isLowStock && !isOutOfStock && (
              <span className="bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-lg">
                Only {product.stockQuantity} left
              </span>
            )}
          </div>

          {/* Quick Action Buttons */}
          <div className={`absolute top-3 right-3 flex flex-col gap-2 transition-all duration-300 opacity-100 sm:opacity-0 sm:group-hover:opacity-100`}>
            <button 
              onClick={handleWishlistClick}
              className={`p-2.5 rounded-xl shadow-lg backdrop-blur-sm transition-all duration-200 
                         ${inWishlist 
                           ? 'bg-red-500 text-white' 
                           : 'bg-white/90 dark:bg-gray-800/90 text-gray-600 dark:text-gray-300 hover:bg-red-500 hover:text-white'}`}
            >
              {inWishlist ? (
                <HeartIconSolid className="h-4 w-4" />
              ) : (
                <HeartIcon className="h-4 w-4" />
              )}
            </button>
            
            {showQuickView && (
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  // Could open quick view modal
                }}
                className="p-2.5 bg-white/90 dark:bg-gray-800/90 rounded-xl shadow-lg backdrop-blur-sm 
                          text-gray-600 dark:text-gray-300 hover:bg-primary-500 hover:text-white transition-all duration-200"
              >
                <EyeIcon className="h-5 w-5" />
              </button>
            )}
          </div>

         </div> {/* close image container*/}
          
        

        {/* Content */}
       <div className="p-3 flex flex-col gap-1.5">
        
          {/* Category */}
          <p className="text-xs text-primary-600 dark:text-primary-400 font-semibold uppercase tracking-wide mb-1.5">
            {product.categoryName || 'Uncategorized'}
          </p>

          {/* Name */}
          <h3 className="text-sm font-medium hover:text-accent-600 cursor-pointer line-clamp-2 transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            <div className="flex">
              {renderStars(product.averageRating)}
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              ({product.reviewCount || 0})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2 flex-wrap">
            {product.discountPrice ? (
              <>
                <span className="text-base font-bold text-gray-900 dark:text-white">
                  ₹{product.discountPrice.toLocaleString()}
                </span>
                <span className="text-sm text-gray-400 line-through">
                  ₹{product.price.toLocaleString()}
                </span>
              </>
            ) : (
              <span className="text-base font-bold text-gray-900 dark:text-white">
                ₹{product.price?.toLocaleString() || '0'}
              </span>
            )}
          </div>

          {/* Brand */}
          {product.brand && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              by <span className="font-medium">{product.brand}</span>
            </p>
          )}
           <button
  onClick={handleAddToCart}
  disabled={isLoading || isOutOfStock}
  className={`w-full mt-2 py-2 text-xs rounded-full font-bold flex items-center justify-center gap-2 
    transition-all duration-300 disabled:opacity-50
    ${addedToCart 
      ? 'bg-green-500 text-white' 
      : 'bg-accent-400 hover:bg-accent-500 text-gray-900 border border-accent-600 shadow-sm'}`}
>
  {addedToCart ? (
    <>
      <CheckIcon className="h-5 w-5" />
      Added!
    </>
  ) : (
    <>
      <ShoppingCartIcon className="h-5 w-5" />
      Add to Cart
    </>
  )}
</button>

          
        </div>
      </div>
    </Link>
  );
}
