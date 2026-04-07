import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { useCartStore } from '../store/cartStore';
import { ordersAPI, paymentAPI } from '../services/api';
import toast from 'react-hot-toast';
import { getValidImageUrl } from '../utils/imageUtils';

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, fetchCart, clearCart } = useCartStore();
  const [isLoading, setIsLoading] = useState(false);
  
  // 1: Address, 2: Payment, 3: Review
  const [activeStep, setActiveStep] = useState(1);
  const [highestStep, setHighestStep] = useState(1);
  
  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    country: 'India',
    zipCode: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('COD');

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  useEffect(() => {
    if (cart && cart.items?.length === 0) {
      navigate('/cart');
    }
  }, [cart, navigate]);

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({ ...prev, [name]: value }));
  };

  const validateAddress = () => {
    const required = ['fullName', 'phone', 'street', 'city', 'state', 'zipCode'];
    for (const field of required) {
      if (!shippingAddress[field].trim()) {
        toast.error(`Please enter ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }
    return true;
  };

  const handleUseAddress = () => {
    if (validateAddress()) {
      setActiveStep(2);
      if (highestStep < 2) setHighestStep(2);
    }
  };

  const handleUsePayment = () => {
    setActiveStep(3);
    if (highestStep < 3) setHighestStep(3);
  };

  const handlePlaceOrder = async () => {
    if (!validateAddress()) return;

    const subtotal = cart.totalPrice || 0;
    const shipping = subtotal > 500 ? 0 : 50;
    const total = subtotal + shipping;

    try {
      // ✅ COD FLOW (no payment)
      if (paymentMethod === "COD") {
        setIsLoading(true);

        const orderData = {
          shippingAddress,
          paymentMethod,
        };

        const response = await ordersAPI.create(orderData);
        await clearCart();
        toast.success("Order placed successfully!");
        navigate(`/orders/${response.data.data.id}`);
        return;
      }

      // ✅ ONLINE PAYMENT (Razorpay)
      const paymentRes = await paymentAPI.createOrder({ amount: total });
      const order = paymentRes.data; 

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY || "rzp_test_SV1Di4AUXyJL8e",
        amount: order.amount,
        currency: "INR",
        name: "SmartCart",
        description: "Order Payment",
        order_id: order.id,

        handler: async function (paymentResponse) {
          try {
            setIsLoading(true);
            const orderData = {
              shippingAddress,
              paymentMethod: paymentMethod === 'CREDIT_CARD' ? 'CREDIT_CARD' : 'UPI',
              notes: "Paid via Razorpay ID: " + paymentResponse.razorpay_payment_id
            };

            const response = await ordersAPI.create(orderData);
            
            // Success! Clear locally and redirect
            await clearCart();
            toast.success("Order placed successfully!");
            
            // Redirect to the order details page
            navigate(`/orders/${response.data.data.id}`);
          } catch (err) {
            console.error("Order creation failed after payment:", err);
            toast.error("Payment was successful but we couldn't create your order. Please contact support.");
            setIsLoading(false);
          }
        },
        modal: {
          ondismiss: function() {
            setIsLoading(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error(err);
      toast.error("Payment failed");
      setIsLoading(false);
    }
  };

  if (!cart) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const items = cart.items || [];
  const subtotal = cart.totalPrice || 0;
  const shipping = subtotal > 500 ? 0 : 50;
  const total = subtotal + shipping;

  return (
    <div className="bg-gray-100 min-h-screen py-6">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex justify-between items-center mb-6">
           <h1 className="text-3xl text-gray-900 font-medium">Checkout</h1>
           <LockIcon />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-4">
            
            {/* Step 1: Delivery Address */}
            <div className={`bg-white rounded-sm border ${activeStep === 1 ? 'border-primary-500 shadow-md' : 'border-gray-300'}`}>
              <div className="flex items-center justify-between p-4 cursor-pointer" onClick={() => setActiveStep(1)}>
                <h2 className={`text-lg font-bold ${activeStep === 1 ? 'text-primary-800' : 'text-gray-800'}`}>
                  <span className={`mr-3 ${activeStep === 1 ? 'text-primary-600' : 'text-gray-500'}`}>1</span> 
                  Delivery address
                </h2>
                {activeStep !== 1 && highestStep >= 1 && (
                  <span className="text-sm text-primary-700 hover:text-accent-600 hover:underline">Change</span>
                )}
              </div>
              
              {activeStep === 1 ? (
                <div className="p-4 pt-0 border-t border-gray-100 mt-2">
                  <div className="max-w-xl">
                    <h3 className="font-bold mb-4">Add a new address</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="col-span-2">
                          <label className="block text-sm font-bold mb-1">Full name</label>
                          <input type="text" name="fullName" value={shippingAddress.fullName} onChange={handleAddressChange} className="w-full border border-gray-400 rounded-sm px-3 py-1.5 focus:border-accent-500 focus:ring-1 focus:ring-accent-500 outline-none shadow-sm" />
                        </div>
                        <div>
                          <label className="block text-sm font-bold mb-1">Mobile number</label>
                          <input type="tel" name="phone" value={shippingAddress.phone} onChange={handleAddressChange} className="w-full border border-gray-400 rounded-sm px-3 py-1.5 focus:border-accent-500 focus:ring-1 focus:ring-accent-500 outline-none shadow-sm" />
                        </div>
                        <div>
                          <label className="block text-sm font-bold mb-1">Pincode</label>
                          <input type="text" name="zipCode" value={shippingAddress.zipCode} onChange={handleAddressChange} className="w-full border border-gray-400 rounded-sm px-3 py-1.5 focus:border-accent-500 focus:ring-1 focus:ring-accent-500 outline-none shadow-sm" />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-sm font-bold mb-1">Flat, House no., Building, Company, Apartment</label>
                          <input type="text" name="street" value={shippingAddress.street} onChange={handleAddressChange} className="w-full border border-gray-400 rounded-sm px-3 py-1.5 focus:border-accent-500 focus:ring-1 focus:ring-accent-500 outline-none shadow-sm" />
                        </div>
                        <div>
                          <label className="block text-sm font-bold mb-1">Town/City</label>
                          <input type="text" name="city" value={shippingAddress.city} onChange={handleAddressChange} className="w-full border border-gray-400 rounded-sm px-3 py-1.5 focus:border-accent-500 focus:ring-1 focus:ring-accent-500 outline-none shadow-sm" />
                        </div>
                        <div>
                          <label className="block text-sm font-bold mb-1">State</label>
                          <input type="text" name="state" value={shippingAddress.state} onChange={handleAddressChange} className="w-full border border-gray-400 rounded-sm px-3 py-1.5 focus:border-accent-500 focus:ring-1 focus:ring-accent-500 outline-none shadow-sm" />
                        </div>
                      </div>
                      <div className="pt-4 border-t border-gray-200 mt-4 bg-gray-50 -mx-4 p-4 rounded-b-sm">
                        <button onClick={handleUseAddress} className="bg-accent-400 hover:bg-accent-500 text-gray-900 border border-accent-600 px-4 py-2 rounded-lg font-medium shadow-sm w-full sm:w-auto">
                          Use this address
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="px-4 pb-4 pl-10">
                  <p className="text-sm text-gray-800">
                    <span className="font-bold">{shippingAddress.fullName}</span> {shippingAddress.street}, {shippingAddress.city}, {shippingAddress.state}, {shippingAddress.zipCode}
                  </p>
                </div>
              )}
            </div>

            {/* Step 2: Payment Method */}
            <div className={`bg-white rounded-sm border ${activeStep === 2 ? 'border-primary-500 shadow-md' : 'border-gray-300'}`}>
              <div className={`flex items-center justify-between p-4 ${highestStep >= 2 ? 'cursor-pointer' : 'opacity-50'}`} onClick={() => highestStep >= 2 && setActiveStep(2)}>
                <h2 className={`text-lg font-bold ${activeStep === 2 ? 'text-primary-800' : 'text-gray-800'}`}>
                  <span className={`mr-3 ${activeStep === 2 ? 'text-primary-600' : 'text-gray-500'}`}>2</span> 
                  Select a payment method
                </h2>
                {activeStep !== 2 && highestStep >= 2 && (
                  <span className="text-sm text-primary-700 hover:text-accent-600 hover:underline">Change</span>
                )}
              </div>
              
              {activeStep === 2 ? (
                <div className="p-4 pt-0 border-t border-gray-100 mt-2">
                  <div className="space-y-0 rounded-sm border border-gray-200 overflow-hidden">
                    <label className={`flex items-start p-4 cursor-pointer hover:bg-gray-50 border-b border-gray-200 ${paymentMethod === 'CREDIT_CARD' ? 'bg-primary-50/30' : ''}`}>
                      <input type="radio" name="paymentMethod" value="CREDIT_CARD" checked={paymentMethod === 'CREDIT_CARD'} onChange={(e) => setPaymentMethod(e.target.value)} className="mt-1 h-4 w-4 text-accent-500 focus:ring-accent-500 border-gray-300" />
                      <div className="ml-3">
                        <span className="font-bold text-gray-900 block mb-1">Credit or debit card</span>
                        <div className="flex gap-1 mb-2">
                          <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg" alt="Visa" className="h-5" />
                          <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-5" />
                        </div>
                      </div>
                    </label>

                    <label className={`flex items-center p-4 cursor-pointer hover:bg-gray-50 border-b border-gray-200 ${paymentMethod === 'UPI' ? 'bg-primary-50/30' : ''}`}>
                      <input type="radio" name="paymentMethod" value="UPI" checked={paymentMethod === 'UPI'} onChange={(e) => setPaymentMethod(e.target.value)} className="h-4 w-4 text-accent-500 focus:ring-accent-500 border-gray-300" />
                      <span className="ml-3 font-bold text-gray-900">Other UPI Apps</span>
                    </label>

                    <label className={`flex items-start p-4 cursor-pointer hover:bg-gray-50 ${paymentMethod === 'COD' ? 'bg-primary-50/30' : ''}`}>
                      <input type="radio" name="paymentMethod" value="COD" checked={paymentMethod === 'COD'} onChange={(e) => setPaymentMethod(e.target.value)} className="mt-1 h-4 w-4 text-accent-500 focus:ring-accent-500 border-gray-300" />
                      <div className="ml-3">
                        <span className="font-bold text-gray-900 block mb-1">Cash on Delivery</span>
                        <p className="text-sm text-gray-600">Scan & Pay at delivery available.</p>
                      </div>
                    </label>
                  </div>

                  <div className="pt-4 border-t border-gray-200 mt-4 bg-gray-50 -mx-4 p-4 rounded-b-sm">
                    <button onClick={handleUsePayment} className="bg-accent-400 hover:bg-accent-500 text-gray-900 border border-accent-600 px-4 py-2 rounded-lg font-medium shadow-sm w-full sm:w-auto">
                      Use this payment method
                    </button>
                  </div>
                </div>
              ) : (
                highestStep >= 2 && (
                  <div className="px-4 pb-4 pl-10">
                    <p className="text-sm text-gray-800 font-bold">
                      {paymentMethod === 'COD' && 'Cash on Delivery'}
                      {paymentMethod === 'CREDIT_CARD' && 'Credit or debit card'}
                      {paymentMethod === 'UPI' && 'UPI'}
                    </p>
                  </div>
                )
              )}
            </div>

            {/* Step 3: Review Items */}
            <div className={`bg-white rounded-sm border ${activeStep === 3 ? 'border-primary-500 shadow-md' : 'border-gray-300'}`}>
              <div className={`flex items-center p-4 ${highestStep >= 3 ? 'cursor-pointer' : 'opacity-50'}`} onClick={() => highestStep >= 3 && setActiveStep(3)}>
                <h2 className={`text-lg font-bold ${activeStep === 3 ? 'text-primary-800' : 'text-gray-800'}`}>
                  <span className={`mr-3 ${activeStep === 3 ? 'text-primary-600' : 'text-gray-500'}`}>3</span> 
                  Items and delivery
                </h2>
              </div>
              
              {activeStep === 3 && (
                <div className="p-4 pt-0 mt-2">
                  <div className="border border-gray-200 rounded-sm p-4 text-sm mb-4">
                     <p className="font-bold mb-4">Guaranteed delivery: <span className="text-green-700">Tomorrow</span></p>
                     
                     <div className="space-y-4">
                       {items.map((item) => (
                         <div key={item.productId} className="flex gap-4">
                           <img src={getValidImageUrl(item.productImage, item.productName)} alt={item.productName} className="w-16 h-16 object-contain border border-gray-200 p-1" />
                           <div>
                              <p className="font-bold text-gray-900 mb-1">{item.productName}</p>
                              <p className="text-red-700 font-bold">₹{item.price.toLocaleString()}</p>
                              <p className="text-xs text-gray-500 mt-1">Quantity: {item.quantity}</p>
                              <p className="text-xs text-gray-500 mt-1">Sold by: SmartCart Retail</p>
                           </div>
                         </div>
                       ))}
                     </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200 mt-4 bg-gray-50 -mx-4 p-4 rounded-b-sm flex items-center justify-between">
                    <div>
                        <button onClick={handlePlaceOrder} disabled={isLoading} className="bg-accent-400 hover:bg-accent-500 text-gray-900 border border-accent-600 px-6 py-2 rounded-full font-bold shadow-sm disabled:opacity-50">
                          {isLoading ? 'Processing...' : 'Place your order'}
                        </button>
                    </div>
                    <div className="text-right">
                        <p className="text-lg font-bold text-red-700">Order total: ₹{total.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">By placing your order, you agree to SmartCart's privacy notice and conditions of use.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Order Summary (Amazon style) */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-300 rounded-sm p-4 sticky top-6 shadow-sm">
              <button 
                onClick={handlePlaceOrder}
                disabled={activeStep !== 3 || isLoading}
                className="w-full bg-accent-400 hover:bg-accent-500 border border-accent-600 text-gray-900 py-2 rounded-full font-bold shadow-sm text-sm mb-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Processing...' : 'Place your order'}
              </button>
              <p className="text-xs text-center text-gray-500 mb-4 pb-4 border-b border-gray-200">
                By placing your order, you agree to SmartCart's privacy notice and conditions of use.
              </p>
              
              <h3 className="font-bold text-base mb-2">Order Summary</h3>
              <table className="w-full text-sm mb-2">
                <tbody>
                  <tr><td className="py-1">Items:</td><td className="text-right">₹{subtotal.toLocaleString()}</td></tr>
                  <tr><td className="py-1">Delivery:</td><td className="text-right">₹{shipping.toLocaleString()}</td></tr>
                  {shipping === 0 && (
                    <tr><td className="py-1">Free Delivery:</td><td className="text-right text-gray-500">-₹50</td></tr>
                  )}
                  <tr><td colSpan="2" className="border-t border-gray-200 my-2"></td></tr>
                  <tr>
                     <td className="py-2 font-bold text-lg text-red-700">Order Total:</td>
                     <td className="py-2 font-bold text-lg text-red-700 text-right">₹{total.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
              <div className="bg-gray-50 border border-gray-200 p-2 rounded-sm mt-4 text-xs text-primary-800 cursor-pointer hidden">
                How are delivery costs calculated?
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function LockIcon() {
  return (
    <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  );
}
