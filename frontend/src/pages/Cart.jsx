import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { getValidImageUrl } from '../utils/imageUtils';

export default function Cart() {
  const navigate = useNavigate();
  const { 
    cart, 
    isLoading, 
    fetchCart, 
    updateItemQuantity, 
    removeFromCart, 
    clearCart 
  } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handleQuantityChange = async (productId, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity >= 1) {
      await updateItemQuantity(productId, newQuantity);
    }
  };

  const handleRemoveItem = async (productId) => {
    await removeFromCart(productId);
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      await clearCart();
    }
  };

  if (isLoading && !cart) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const items = cart?.items || [];
  const subtotal = cart?.totalPrice || 0;
  const shipping = subtotal > 500 ? 0 : 50;
  const total = subtotal + (items.length > 0 ? shipping : 0);

  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {items.length === 0 ? (
          <div className="bg-white p-8 mb-8 text-center flex flex-col items-center border border-gray-200 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your SmartCart is empty</h2>
            <Link to="/products" className="text-primary-700 hover:text-accent-600 hover:underline mb-8">
              Shop today's deals
            </Link>
            <div className="flex gap-4">
               {isAuthenticated ? (
                 <Link to="/products" className="bg-accent-400 hover:bg-accent-500 text-gray-900 px-6 py-2 rounded-md font-medium shadow-sm border border-accent-600">
                   Start Shopping
                 </Link>
               ) : (
                 <>
                   <Link to="/login" className="bg-accent-400 hover:bg-accent-500 text-gray-900 px-6 py-2 rounded-md font-medium shadow-sm border border-accent-600">Sign in to your account</Link>
                   <Link to="/register" className="bg-white hover:bg-gray-50 text-gray-900 px-6 py-2 rounded-md font-medium shadow-sm border border-gray-300">Sign up now</Link>
                 </>
               )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            
            {/* Main Cart Items Area */}
            <div className="lg:col-span-3 bg-white p-6 shadow-sm border border-gray-200">
              <div className="flex justify-between items-end border-b border-gray-200 pb-2 mb-4">
                 <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
                 <span className="text-sm text-gray-500">Price</span>
              </div>
              
              <div className="space-y-6">
                {items.map((item) => (
                  <div key={item.productId} className="flex flex-col sm:flex-row gap-4 border-b border-gray-200 pb-6 relative">
                    {/* Product Image */}
                    <div className="w-full sm:w-48 h-48 sm:h-auto object-contain flex-shrink-0 flex items-center justify-center p-2 mb-4 sm:mb-0 cursor-pointer" onClick={() => navigate(`/products/${item.productId}`)}>
                      <img src={getValidImageUrl(item.productImage, item.productName)} alt={item.productName} className="max-h-full max-w-full" />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between">
                          <Link to={`/products/${item.productId}`} className="text-lg font-medium text-primary-800 hover:text-accent-600 hover:underline line-clamp-2 pr-4 w-3/4">
                            {item.productName}
                          </Link>
                          <p className="text-lg font-bold text-gray-900 text-right w-1/4">
                            ₹{(item.price).toLocaleString()}
                          </p>
                        </div>
                        <p className="text-sm text-green-700 font-medium mt-1">In stock</p>
                        {shipping === 0 && <p className="text-sm text-gray-600 mt-1">Eligible for FREE Shipping</p>}
                        <div className="flex items-center gap-1 mt-1">
                           <input type="checkbox" className="rounded-sm text-accent-500 focus:ring-accent-500" />
                           <span className="text-xs text-gray-600">This will be a gift</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 mt-4">
                        <label className="text-sm border border-gray-300 rounded-md bg-gray-100 shadow-sm px-2 py-1 cursor-pointer flex items-center gap-2 w-max">
                           <span className="text-xs">Qty:</span>
                           <select 
                             value={item.quantity} 
                             onChange={(e) => handleQuantityChange(item.productId, item.quantity, Number(e.target.value) - item.quantity)}
                             className="bg-transparent focus:outline-none focus:ring-1 focus:ring-accent-500 text-sm font-medium"
                           >
                             {[...Array(10).keys()].map(x => (
                               <option key={x+1} value={x+1}>{x+1}</option>
                             ))}
                           </select>
                        </label>
                        <span className="text-gray-300">|</span>
                        <button onClick={() => handleRemoveItem(item.productId)} className="text-sm text-primary-700 hover:underline hover:text-accent-600">
                          Delete
                        </button>
                        <span className="text-gray-300">|</span>
                        <button className="text-sm text-primary-700 hover:underline hover:text-accent-600">
                          Save for later
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-4">
                <p className="text-lg">Subtotal ({items.length} items): <span className="font-bold text-gray-900">₹{subtotal.toLocaleString()}</span></p>
              </div>
            </div>

            {/* Sidebar / Buy Box */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 shadow-sm border border-gray-200 sticky top-24">
                
                {shipping === 0 ? (
                   <div className="mb-4 text-sm text-green-700 font-medium flex items-start gap-2">
                      <span className="text-white bg-green-700 rounded-full w-5 h-5 flex items-center justify-center font-bold flex-shrink-0">✓</span>
                      <span>Your order is eligible for FREE Delivery. Select this option at checkout.</span>
                   </div>
                ) : (
                   <div className="mb-4 text-sm text-gray-900 border-b border-gray-200 pb-4">
                      Add <span className="text-red-700 font-bold">₹{(500 - subtotal).toLocaleString()}</span> of eligible items to your order to qualify for FREE Delivery.
                   </div>
                )}

                <div className="flex flex-col gap-4 mb-6">
                  <div className="text-lg">
                     Subtotal ({items.length} items): <span className="font-bold text-gray-900 text-xl">₹{total.toLocaleString()}</span>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer text-sm">
                    <input type="checkbox" className="rounded-sm border-gray-400 text-accent-500 focus:ring-accent-500" />
                    <span>This order contains a gift</span>
                  </label>
                </div>

                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full bg-accent-400 hover:bg-accent-500 border border-accent-600 text-gray-900 py-2 rounded-full font-medium shadow-sm transition-all focus:ring-2 focus:ring-accent-400 outline-none"
                >
                  Proceed to Buy
                </button>
              </div>
              
              <div className="bg-white p-6 shadow-sm border border-gray-200 mt-4 hidden lg:block">
                 <h3 className="font-bold text-sm mb-2">Customers who bought items in your cart also bought</h3>
                 <p className="text-gray-500 text-sm">No recommendations available at this time.</p>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
