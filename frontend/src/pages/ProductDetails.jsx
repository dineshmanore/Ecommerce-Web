import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ShoppingCartIcon, 
  HeartIcon, 
  MapPinIcon,
  ShieldCheckIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { StarIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { productsAPI, reviewsAPI, ordersAPI } from '../services/api';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { useWishlistStore } from '../store/wishlistStore';
import toast from 'react-hot-toast';
import { getValidImageUrl } from '../utils/imageUtils';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, isLoading: cartLoading } = useCartStore();
  const { isAuthenticated, user } = useAuthStore();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();
  
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('description');
  const [isInWishlistState, setIsInWishlistState] = useState(false);
  
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '', title: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [canReview, setCanReview] = useState(false);
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);

  const loadReviews = async (currentUser) => {
    try {
      const reviewsRes = await reviewsAPI.getByProduct(id);
      const reviewList = reviewsRes.data.data?.content || reviewsRes.data.data || [];
      setReviews(reviewList);
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
      const ordersRes = await ordersAPI.getMyOrders({ size: 100 });
      const orders = ordersRes.data?.data?.content || ordersRes.data?.data || ordersRes.data?.content || ordersRes.data || [];
      const hasDeliveredOrder = orders.some(order => {
        const status = (order.status || order.orderStatus || '').toUpperCase();
        return status === 'DELIVERED' && 
          order.items?.some(item => 
            (item.productId === id) || (item.product?.id === id)
          );
      });
      setCanReview(hasDeliveredOrder);
    } catch (e) {
      console.error('checkCanReview error:', e);
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
    if (isAuthenticated) {
      loadReviews(user);
      checkCanReview();
    } else {
      loadReviews(null);
    }
  }, [id, navigate, isAuthenticated, user]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) { navigate('/login'); return; }
    setSubmittingReview(true);
    try {
      await reviewsAPI.create({ productId: id, rating: reviewForm.rating, title: reviewForm.title, comment: reviewForm.comment });
      toast.success('Review submitted successfully!');
      setReviewForm({ rating: 5, comment: '', title: '' });
      setAlreadyReviewed(true);
      loadReviews(user);
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
    toast.success('Added to Cart');
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    await addToCart(product.id, quantity);
    navigate('/checkout');
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
        stars.push(<StarIconSolid key={i} className="h-4 w-4 text-accent-500 inline" />);
      } else {
        stars.push(<StarIcon key={i} className="h-4 w-4 text-gray-300 inline" />);
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

  if (!product) return null;

  const discountPercentage = product.discountPrice 
    ? Math.round((1 - product.discountPrice / product.price) * 100)
    : 0;

  return (
    <div className="bg-white min-h-screen pb-16">
      {/* Breadcrumb */}
      <div className="px-4 py-2 text-sm text-gray-500 border-b">
         <div className="max-w-[1500px] mx-auto">
            <Link to="/" className="hover:underline">Home</Link> &rsaquo; 
            <Link to={`/products?category=${product.categoryId}`} className="hover:underline ml-1">{product.categoryName}</Link> &rsaquo; 
            <span className="text-gray-900 ml-1">{product.name}</span>
         </div>
      </div>

      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Column: Image Gallery (Takes up to 45% width on desktop) */}
          <div className="lg:w-[45%] flex flex-col md:flex-row gap-4 h-fit">
            {/* Thumbnails */}
            <div className="order-2 md:order-1 flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto w-full md:w-16 flex-shrink-0">
              {product.images?.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-14 h-14 border rounded-sm overflow-hidden flex-shrink-0 ${
                    selectedImage === index ? 'border-accent-500 shadow-[0_0_3px_rgba(245,158,11,0.5)]' : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <img src={getValidImageUrl(image, product.categoryName || product.name)} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
            {/* Main Image */}
            <div className="order-1 md:order-2 flex-grow aspect-square bg-gray-50 border border-gray-100 rounded-sm overflow-hidden flex justify-center items-center p-4">
              <img
                src={getValidImageUrl(product.images?.[selectedImage], product.categoryName || product.name)}
                alt={product.name}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          </div>

          {/* Middle Column: Product Details (Takes remaining space minus buy box) */}
          <div className="lg:w-[35%] flex flex-col">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight mb-2">
              {product.name}
            </h1>
            <div className="flex items-center gap-4 text-sm mb-2 border-b border-gray-200 pb-2">
              {product.brand && (
                <Link to={`/products?search=${product.brand}`} className="text-primary-700 hover:underline hover:text-accent-600">
                  Visit the {product.brand} Store
                </Link>
              )}
              <div className="flex items-center">
                <span className="mr-1">{product.averageRating?.toFixed(1) || '0.0'}</span>
                {renderStars(product.averageRating)}
                <button onClick={() => setActiveTab('reviews')} className="text-primary-700 hover:text-accent-600 hover:underline ml-2">
                  {product.reviewCount} ratings
                </button>
              </div>
            </div>

            {/* Price Segment */}
            <div className="mb-4 pt-2">
              {product.discountPrice ? (
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-medium text-gray-900">
                      <span className="text-base align-top mr-0.5">₹</span>
                      {product.discountPrice.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    M.R.P.: <span className="line-through px-1">₹{product.price.toLocaleString()}</span> 
                    <span className="text-gray-900 font-medium ml-1">({discountPercentage}% off)</span>
                  </div>
                </div>
              ) : (
                <div className="text-3xl font-medium text-gray-900">
                  <span className="text-base align-top mr-0.5">₹</span>
                  {product.price.toLocaleString()}
                </div>
              )}
              <p className="text-sm text-gray-700 mt-1 font-medium">Inclusive of all taxes</p>
            </div>
            
            <div className="flex items-center gap-2 mb-4 bg-gray-50 p-2 rounded-sm border border-gray-100">
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/Prime_logo.png" alt="Prime" className="h-5 object-contain opacity-80 mix-blend-multiply" />
                <span className="text-sm font-bold text-primary-800">Free One-Day</span>
            </div>

            {/* Specs Summary */}
            <div className="mt-4 border-t border-gray-200 pt-4">
               {product.specs && Object.keys(product.specs).length > 0 && (
                  <table className="text-sm w-full max-w-sm mb-4">
                    <tbody>
                      {Object.entries(product.specs).slice(0, 5).map(([key, value]) => value && (
                        <tr key={key}>
                          <td className="w-1/3 py-1 font-bold text-gray-900 capitalize">{key}</td>
                          <td className="w-2/3 py-1 text-gray-700">{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
               )}
            </div>

            <hr className="my-4 border-gray-200" />
            
            {/* About this item summary */}
            <div>
              <h2 className="text-base font-bold text-gray-900 mb-2">About this item</h2>
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-800">
                {product.description?.split('||').slice(0, 5).map((point, idx) => (
                  <li key={idx}>{(point.includes(' – ') || point.includes(': ')) ? point.substring(point.indexOf(' – ') !== -1 ? point.indexOf(' – ') + 3 : point.indexOf(': ') + 2) : point}</li>
                ))}
              </ul>
              <button onClick={() => setActiveTab('description')} className="text-sm text-primary-700 hover:text-accent-600 hover:underline flex items-center gap-1 mt-2">
                 See more product details
              </button>
            </div>
          </div>

          {/* Right Column: Buy Box */}
          <div className="lg:w-[20%]">
             <div className="border border-gray-300 rounded-lg p-4 sticky top-24 max-w-[300px]">
                <div className="text-2xl font-bold text-gray-900 mb-2">
                   <span className="text-sm align-top mr-0.5">₹</span>
                   {(product.discountPrice || product.price).toLocaleString()}
                </div>
                
                <div className="text-sm mb-4">
                  <div className="text-primary-700 font-bold flex items-center gap-1">
                     <span className="text-accent-500">✓</span> FREE Delivery <span className="text-gray-900 font-bold">Tomorrow</span>
                  </div>
                  <p className="text-gray-500 text-xs mt-1">Order within 5 hrs 30 mins.</p>
                </div>

                <div className="flex items-center gap-2 text-sm mb-4 text-primary-700 font-medium">
                   <MapPinIcon className="h-5 w-5 text-gray-900" />
                   <span className="hover:text-accent-600 hover:underline cursor-pointer">Deliver to India</span>
                </div>

                <div className="mb-4">
                  {product.stockQuantity > 0 ? (
                    <span className="text-green-700 text-lg font-bold">In stock</span>
                  ) : (
                    <span className="text-red-700 text-lg font-bold">Currently unavailable.</span>
                  )}
                </div>

                <div className="mb-4">
                  <label className="text-sm border border-gray-300 rounded-md bg-gray-100 shadow-sm px-3 py-1 cursor-pointer flex items-center gap-2 w-max">
                    <span className="text-xs">Quantity:</span>
                    <select 
                      value={quantity} 
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="bg-transparent focus:outline-none focus:ring-1 focus:ring-accent-500 text-sm font-medium"
                    >
                      {[...Array(Math.min(10, product.stockQuantity || 0)).keys()].map(x => (
                        <option key={x+1} value={x+1}>{x+1}</option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="flex flex-col gap-2 mb-4">
                  <button
                    onClick={handleAddToCart}
                    disabled={cartLoading || product.stockQuantity === 0}
                    className="w-full bg-accent-400 hover:bg-accent-500 border border-accent-600 text-gray-900 py-2.5 rounded-full font-medium shadow-sm transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={handleBuyNow}
                    disabled={cartLoading || product.stockQuantity === 0}
                    className="w-full bg-orange-500 hover:bg-orange-600 border border-orange-700 text-gray-900 py-2.5 rounded-full font-medium shadow-sm transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Buy Now
                  </button>
                </div>

                <div className="text-xs text-gray-500 flex flex-col gap-1 border-b border-gray-200 pb-4 mb-4">
                  <div className="flex justify-between"><span>Ships from</span><span>SmartCart</span></div>
                  <div className="flex justify-between"><span>Sold by</span><span className="text-primary-700">{product.brand || 'SmartCart'} Retail</span></div>
                </div>

                <button
                  onClick={handleWishlistToggle}
                  className="w-full text-left text-sm text-gray-700 hover:text-accent-600 hover:underline border border-gray-300 rounded-md py-1 px-3 bg-white hover:bg-gray-50 font-medium flex items-center gap-2"
                >
                  <HeartIcon className={`h-4 w-4 ${isInWishlistState ? 'fill-red-500 text-red-500' : ''}`} />
                  {isInWishlistState ? 'Remove from Wish List' : 'Add to Wish List'}
                </button>
             </div>
          </div>
        </div>
      </div>

      <hr className="my-8 border-gray-200" />

      {/* Tabs / Bottom Section */}
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-gray-200">
          <div className="flex gap-6 overflow-x-auto hide-scrollbar">
            {['description', 'specifications', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-2 font-bold capitalize transition-colors ${
                  activeTab === tab
                    ? 'text-primary-800 border-b-2 border-primary-800'
                    : 'text-primary-700 hover:text-accent-600 hover:underline'
                }`}
              >
                {tab === 'description' ? 'Product Description' : tab}
              </button>
            ))}
          </div>
        </div>

        <div className="py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="md:col-span-2">
            {activeTab === 'description' && (
              <div className="max-w-none text-gray-900">
                <h2 className="text-xl font-bold mb-4">Product Description</h2>
                {product.description ? (
                  <div className="space-y-4">
                     {product.description.split('||').map((item, i) => {
                          const dashIdx = item.indexOf(' – ');
                          const colonIdx = item.indexOf(': ');
                          let title = null, body = item;
                          if (dashIdx !== -1 && dashIdx < 40) {
                            title = item.substring(0, dashIdx);
                            body = item.substring(dashIdx + 3);
                          } else if (colonIdx !== -1 && colonIdx < 30) {
                            title = item.substring(0, colonIdx);
                            body = item.substring(colonIdx + 2);
                          }
                          return (
                             <p key={i} className="text-sm">
                                {title && <strong className="mr-1">{title}:</strong>}
                                {body}
                             </p>
                          )
                     })}
                  </div>
                ) : (
                  <p className="text-gray-500">No product description available.</p>
                )}
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="max-w-none text-gray-900">
                 <h2 className="text-xl font-bold mb-4">Product Information</h2>
                 <table className="w-full max-w-lg border border-gray-200 text-sm">
                   <tbody>
                      {product.specs && Object.entries(product.specs).map(([key, value]) => value && (
                         <tr key={key} className="border-b border-gray-200">
                           <td className="bg-gray-100 py-2 px-4 font-bold border-r border-gray-200 capitalize w-1/3">{key}</td>
                           <td className="py-2 px-4 w-2/3">{value}</td>
                         </tr>
                      ))}
                   </tbody>
                 </table>
                 {!product.specs && <p className="text-gray-500 mt-4">No technical details available.</p>}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="text-gray-900">
                 <h2 className="text-xl font-bold mb-4">Customer reviews</h2>
                 {reviews.length > 0 ? (
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div key={review.id} className="pb-4">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold text-xs shadow-inner">
                            {review.userName?.[0] || 'U'}
                          </div>
                          <span className="font-bold text-sm">{review.userName}</span>
                        </div>
                        <div className="flex items-center gap-2 mb-1">
                          <div className="flex">{renderStars(review.rating)}</div>
                          {review.title && <span className="font-bold text-sm hover:underline cursor-pointer">{review.title}</span>}
                        </div>
                        <span className="text-xs text-gray-500 mb-2 block">
                           Reviewed in India on {review.createdAt ? new Date(review.createdAt).toLocaleDateString('en-IN', {day:'numeric',month:'long',year:'numeric'}) : ''}
                        </span>
                        {review.verified && (
                          <span className="text-accent-600 font-bold text-xs mb-2 block">Verified Purchase</span>
                        )}
                        <p className="text-sm">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                 ) : (
                  <p className="text-sm text-gray-700">No customer reviews</p>
                 )}
              </div>
            )}
          </div>

          <div className="md:col-span-1 border-t md:border-t-0 md:border-l border-gray-200 pt-6 md:pt-0 md:pl-8">
            {activeTab === 'reviews' && (
               <div>
                  <h3 className="text-lg font-bold mb-2">Review this product</h3>
                  <p className="text-sm text-gray-600 mb-4">Share your thoughts with other customers</p>
                  
                  {isAuthenticated && canReview && !alreadyReviewed ? (
                     <form onSubmit={handleSubmitReview} className="space-y-4 border border-gray-200 p-4 rounded-sm shadow-sm bg-gray-50">
                       <div>
                         <label className="block text-sm font-bold mb-1">Overall rating</label>
                         <div className="flex gap-1 text-2xl">
                           {[1,2,3,4,5].map(star => (
                             <button key={star} type="button" onClick={() => setReviewForm(f => ({...f, rating: star}))}
                               className="focus:outline-none">
                               <span style={{color: star <= reviewForm.rating ? '#f59e0b' : '#d1d5db'}}>★</span>
                             </button>
                           ))}
                         </div>
                       </div>
                       <div>
                         <label className="block text-sm font-bold mb-1">Add a headline</label>
                         <input type="text" placeholder="What's most important to know?" value={reviewForm.title} onChange={e => setReviewForm(f => ({...f, title: e.target.value}))}
                           className="w-full border border-gray-400 rounded-sm px-2 py-1 focus:ring-1 focus:ring-accent-500 focus:outline-none shadow-sm text-sm" />
                       </div>
                       <div>
                         <label className="block text-sm font-bold mb-1">Details</label>
                         <textarea value={reviewForm.comment} onChange={e => setReviewForm(f => ({...f, comment: e.target.value}))}
                           placeholder="What did you like or dislike? What did you use this product for?" rows={4} className="w-full border border-gray-400 rounded-sm px-2 py-1 focus:ring-1 focus:ring-accent-500 focus:outline-none shadow-sm text-sm" required />
                       </div>
                       <button type="submit" disabled={submittingReview} className="bg-white hover:bg-gray-100 border border-gray-400 rounded-sm shadow-sm text-sm font-bold w-full py-1">
                         {submittingReview ? 'Submitting...' : 'Write a customer review'}
                       </button>
                     </form>
                  ) : (
                     <button onClick={() => !isAuthenticated ? navigate('/login') : {}} className="bg-white hover:bg-gray-100 border border-gray-400 rounded-sm shadow-sm text-sm py-1.5 px-4 font-bold w-full">
                        Write a customer review
                     </button>
                  )}
               </div>
            )}
            
            {activeTab !== 'reviews' && (
              <div className="flex flex-col gap-4 text-sm text-gray-700">
                <div className="flex items-start gap-3">
                  <ShieldCheckIcon className="h-6 w-6 text-gray-500" />
                  <div>
                    <strong className="block">Secure transaction</strong>
                    Your transaction is safe. We use professional encryption to protect your data.
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <ArrowPathIcon className="h-6 w-6 text-gray-500" />
                  <div>
                    <strong className="block">Return Policy</strong>
                    Eligible for Return, Refund or Replacement within 30 days of receipt
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
