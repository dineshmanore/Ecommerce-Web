import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ShoppingCartIcon, 
  HeartIcon, 
  MinusIcon, 
  PlusIcon,
  StarIcon,
  TruckIcon,
  ShieldCheckIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { productsAPI, reviewsAPI } from '../services/api';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { useWishlistStore } from '../store/wishlistStore';
import toast from 'react-hot-toast';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, isLoading: cartLoading } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();
  
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('description');
  const [isInWishlistState, setIsInWishlistState] = useState(false);
  
  useEffect(() =>{
        console.log("PRODUCT:",product);
      },[product]);
      
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '', title: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [canReview, setCanReview] = useState(false);
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);

  const loadReviews = async (currentUser) => {
    try {
      const reviewsRes = await reviewsAPI.getByProduct(id);
      const reviewList = reviewsRes.data.data?.content || reviewsRes.data.data || [];
      setReviews(reviewList);
      // Check if current user already reviewed
      if (currentUser) {
        const already = reviewList.some(r => r.userId === currentUser.id);
        setAlreadyReviewed(already);
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    }
  };

  const checkCanReview = async () => {
    if (!isAuthenticated) return;
    try {
      const ordersRes = await import('../services/api').then(m => m.ordersAPI.getMyOrders());
      const orders = ordersRes.data?.content || ordersRes.data || [];
      const hasDeliveredOrder = orders.some(order =>
        order.status === 'DELIVERED' &&
        order.items?.some(item => item.productId === id)
      );
      setCanReview(hasDeliveredOrder);
    } catch {
      setCanReview(false);
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const productRes = await productsAPI.getById(id);
        const productData = productRes.data.data;
        setProduct(productData);
        setIsInWishlistState(isInWishlist(productData.id));
      } catch (error) {
        console.error('Failed to fetch product:', error);
        toast.error('Product not found');
        navigate('/products');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
    loadReviews();
    checkCanReview();
  }, [id, navigate, isAuthenticated]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) { navigate('/login'); return; }
    setSubmittingReview(true);
    try {
      await reviewsAPI.create({ productId: id, rating: reviewForm.rating, title: reviewForm.title, comment: reviewForm.comment });
      toast.success('Review submitted successfully!');
      setReviewForm({ rating: 5, comment: '', title: '' });
      setAlreadyReviewed(true);
      loadReviews();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    await addToCart(product.id, quantity);
  };

  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (isInWishlistState) {
      await removeFromWishlist(product.id);
      setIsInWishlistState(false);
    } else {
      await addToWishlist(product);
      setIsInWishlistState(true);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<StarIconSolid key={i} className="h-5 w-5 text-yellow-400" />);
      } else {
        stars.push(<StarIcon key={i} className="h-5 w-5 text-gray-300" />);
      }
    }
    return stars;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const discountPercentage = product.discountPrice 
    ? Math.round((1 - product.discountPrice / product.price) * 100)
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Image Gallery */}
        <div>
          <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-2xl overflow-hidden mb-4">
            <img
              src={product.images?.[selectedImage] || 'https://via.placeholder.com/600'}
              alt={product.name}
              className="w-full h-full object-contain p-2"
            />
          </div>
          {product.images?.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className="aspect-square rounded-lg overflow-hidden border-2" 
                >
                  <img src={image} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <p className="text-primary-600 font-medium mb-2">{product.categoryName}</p>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {product.name}
          </h1>
          
          {/* Rating */}
          <div className="flex items-center gap-2 mb-6">
            <div className="flex">{renderStars(product.averageRating)}</div>
            <span className="text-gray-500">
              ({product.reviewCount} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-4 mb-6">
            {product.discountPrice ? (
              <>
                <span className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  ₹{product.discountPrice.toLocaleString()}
                </span>
                <span className="text-xl text-gray-500 line-through">
                  ₹{product.price.toLocaleString()}
                </span>
                <span className="bg-red-100 text-red-800 text-sm font-medium px-3 py-1 rounded-full">
                  {discountPercentage}% OFF
                </span>
              </>
            ) : (
              <span className="text-xl  font-bold text-gray-900 dark:text-white">
                ₹{product.price.toLocaleString()}
              </span>
            )}
          </div>

          {/* Brand */}
          {product.brand && (
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Brand: <span className="font-medium">{product.brand}</span>
            </p>
          )}

          {/* Stock Status */}
          <div className="mb-6">
            {product.stockQuantity > 0 ? (
              <span className="badge-success">
                In Stock ({product.stockQuantity} available)
              </span>
            ) : (
              <span className="badge-error">Out of Stock</span>
            )}
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-gray-700 dark:text-gray-300">Quantity:</span>
            <div className="flex items-center border rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <MinusIcon className="h-5 w-5" />
              </button>
              <span className="px-4 font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <PlusIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <button
              onClick={handleAddToCart}
              disabled={cartLoading || product.stockQuantity === 0}
              className="flex-1 btn-primary flex items-center justify-center gap-2"
            >
              <ShoppingCartIcon className="h-5 w-5" />
              Add to Cart
            </button>
            <button
              onClick={handleWishlistToggle}
              className="p-3 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title={isInWishlistState ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              {isInWishlistState ? (
                <HeartIcon className="h-6 w-6 text-red-500 fill-red-500" />
              ) : (
                <HeartIcon className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-2 text-xs sm:text-sm p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
            <div className="text-center">
              <TruckIcon className="h-6 w-6 mx-auto mb-2 text-primary-600" />
              <p className="text-sm text-gray-600 dark:text-gray-400">Free Delivery</p>
            </div>
            <div className="text-center">
              <ShieldCheckIcon className="h-6 w-6 mx-auto mb-2 text-primary-600" />
              <p className="text-sm text-gray-600 dark:text-gray-400">Warranty</p>
            </div>
            <div className="text-center">
              <ArrowPathIcon className="h-6 w-6 mx-auto mb-2 text-primary-600" />
              <p className="text-sm text-gray-600 dark:text-gray-400">Easy Returns</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-16">
        <div className="border-b dark:border-gray-700">
          <div className="flex gap-4 overflow-x-auto">
            {['description', 'specifications', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 font-medium capitalize transition-colors ${
                  activeTab === tab
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="py-8">
          {activeTab === 'description' && (
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {product.description ? (
                 <ul className="list-disc pl-5 space-y-2">
                 {product.description.split('||').map((item, i) => (
                 <li key={i}>{item.trim()}</li>
                ))}
               </ul>
              ) : (
               <p>No description available</p>
              )}
              </p>
            </div>
          )}

          {activeTab === 'specifications' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {product.specs && Object.entries(product.specs).map(([key, value]) => (
                value && (
                  <div key={key} className="flex border-b dark:border-gray-700 pb-2">
                    <span className="text-gray-500 w-32 capitalize">{key}:</span>
                    <span className="text-gray-900 dark:text-white">{value}</span>
                  </div>
                )
              ))}
              {!product.specs && (
                <p className="text-gray-500">No specifications available.</p>
              )}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div>
              {/* Write a Review - only if user has a DELIVERED order containing this product */}
              {!isAuthenticated && (
                <div className="text-center py-6 mb-6 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <p className="text-gray-500 mb-2">🔒 Login to write a review</p>
                  <p className="text-xs text-gray-400 mb-3">Only customers who purchased this product can review it</p>
                  <button onClick={() => navigate('/login')} className="btn-primary">Login</button>
                </div>
              )}
              {isAuthenticated && alreadyReviewed && (
                <div className="text-center py-6 mb-6 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-700">
                  <p className="text-green-600 dark:text-green-400 font-medium">✓ You have already reviewed this product</p>
                </div>
              )}
              {isAuthenticated && !canReview && !alreadyReviewed && (
                <div className="text-center py-6 mb-6 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-700">
                  <p className="text-yellow-700 dark:text-yellow-400 font-medium">📦 Purchase Required</p>
                  <p className="text-sm text-yellow-600 dark:text-yellow-500 mt-1">Only customers who have received this product (order marked as Delivered) can write a review.</p>
                </div>
              )}
              {isAuthenticated && canReview && !alreadyReviewed && (
                <div className="card mb-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <h3 className="text-lg font-semibold mb-1">Write a Review</h3>
                  <p className="text-xs text-green-600 dark:text-green-400 mb-4">✓ Verified Purchase</p>
                  <form onSubmit={handleSubmitReview} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Rating</label>
                      <div className="flex gap-2">
                        {[1,2,3,4,5].map(star => (
                          <button key={star} type="button" onClick={() => setReviewForm(f => ({...f, rating: star}))}
                            className="text-2xl focus:outline-none transition-transform hover:scale-110">
                            <span style={{color: star <= reviewForm.rating ? '#f59e0b' : '#d1d5db'}}>★</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Title (optional)</label>
                      <input type="text" value={reviewForm.title} onChange={e => setReviewForm(f => ({...f, title: e.target.value}))}
                        placeholder="Summary of your review" className="input-field" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Comment</label>
                      <textarea value={reviewForm.comment} onChange={e => setReviewForm(f => ({...f, comment: e.target.value}))}
                        placeholder="Share your experience with this product..." rows={4} className="input-field" required />
                    </div>
                    <button type="submit" disabled={submittingReview} className="btn-primary">
                      {submittingReview ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </form>
                </div>
              )}
              {/* Reviews List */}
              {reviews.length > 0 ? (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b dark:border-gray-700 pb-6">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex">{renderStars(review.rating)}</div>
                        <span className="font-medium">{review.userName}</span>
                        {review.verified && (
                          <span className="badge-success text-xs">Verified Purchase</span>
                        )}
                      </div>
                      {review.title && (
                        <h4 className="font-medium mb-2">{review.title}</h4>
                      )}
                      <p className="text-gray-600 dark:text-gray-400">{review.comment}</p>
                      <p className="text-xs text-gray-400 mt-2">{review.createdAt ? new Date(review.createdAt).toLocaleDateString('en-IN', {day:'numeric',month:'long',year:'numeric'}) : ''}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No reviews yet. Be the first to review this product!
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
