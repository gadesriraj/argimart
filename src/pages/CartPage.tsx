import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ShoppingBag, 
  ShieldCheck, 
  Truck, 
  CheckCircle2, 
  AlertCircle,
  IndianRupee,
  MapPin,
  CreditCard
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';

export const CartPage: React.FC = () => {
  const { items, removeFromCart, updateQuantity, subtotal, shippingFee, taxAmount, totalAmount } = useCart();
  const { placeOrder } = useOrders();
  const { currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [deliveryAddress, setDeliveryAddress] = useState(currentUser?.address || 'Flat 304, Palm Meadows, Whitefield, Bengaluru');
  const [contactPhone, setContactPhone] = useState(currentUser?.phone || '+91 97654 32109');
  const [customerName, setCustomerName] = useState(currentUser?.fullName || 'Priya Sundaram');
  const [paymentMethod, setPaymentMethod] = useState<'CASH_ON_DELIVERY' | 'SIMULATED_UPI' | 'SIMULATED_CARD'>('CASH_ON_DELIVERY');
  const [checkoutNotes, setCheckoutNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);
  const [orderCompletedId, setOrderCompletedId] = useState<string | null>(null);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorNotice(null);

    if (!deliveryAddress.trim()) {
      setErrorNotice('Please provide a delivery address.');
      return;
    }
    if (!contactPhone.trim()) {
      setErrorNotice('Please provide a valid contact phone number.');
      return;
    }

    setLoading(true);

    try {
      const res = await placeOrder({
        customerName,
        deliveryAddress,
        contactPhone,
        paymentMethod,
        notes: checkoutNotes,
      });

      if (res.success && res.orderId) {
        setOrderCompletedId(res.orderId);
      } else {
        setErrorNotice(res.message || 'Checkout failed. Please inspect your cart items.');
      }
    } catch (err: any) {
      setErrorNotice(err.message || 'An error occurred during order processing.');
    } finally {
      setLoading(false);
    }
  };

  if (orderCompletedId) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-4 bg-stone-50">
        <div className="bg-white rounded-3xl border border-stone-200/90 p-8 sm:p-10 max-w-md w-full text-center shadow-md">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
            Order Confirmed!
          </span>
          <h2 className="text-2xl font-black text-stone-900 mt-1 mb-2">
            Order #{orderCompletedId} Placed
          </h2>
          <p className="text-xs text-stone-500 mb-6 leading-relaxed">
            Thank you! Your agricultural products have been reserved. The farmers have received your dispatch request.
          </p>

          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 text-left text-xs mb-6 space-y-1">
            <div className="flex justify-between">
              <span className="text-stone-500">Payment:</span>
              <span className="font-bold text-stone-800">{paymentMethod.replace(/_/g, ' ')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Total Charged:</span>
              <span className="font-bold text-emerald-950">₹{totalAmount.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="space-y-2">
            <Link
              to={`/orders/${orderCompletedId}`}
              className="w-full py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              <span>Track Live Order Status</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/marketplace"
              className="w-full py-2.5 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs block transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 bg-stone-50">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-stone-900 mb-1">Your Cart is Empty</h2>
        <p className="text-xs text-stone-500 mb-6 max-w-sm text-center">
          Explore our certified seeds, bio-fertilizers, organic harvests, and farm equipment directly from cultivators.
        </p>
        <Link
          to="/marketplace"
          className="px-6 py-3 bg-emerald-700 text-white rounded-xl text-xs font-bold hover:bg-emerald-800 shadow-xs transition-all"
        >
          Explore Agricultural Marketplace
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Shopping Cart & Checkout
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Review selected items and enter delivery information
          </p>
        </div>

        {errorNotice && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-900 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorNotice}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white rounded-3xl border border-stone-200/90 p-6 shadow-2xs">
              <h2 className="text-base font-bold text-stone-900 mb-4 pb-3 border-b border-stone-100 flex items-center justify-between">
                <span>Items in Cart ({items.length})</span>
                <span className="text-xs text-emerald-800 font-semibold">Inventory Reserved</span>
              </h2>

              <div className="divide-y divide-stone-100">
                {items.map((item) => (
                  <div key={item.id} className="py-4 flex gap-4 items-center">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-16 h-16 rounded-xl object-cover border border-stone-200 shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <Link to={`/products/${item.product.id}`}>
                        <h3 className="text-xs font-bold text-stone-900 hover:text-emerald-700 truncate">
                          {item.product.name}
                        </h3>
                      </Link>
                      <p className="text-[11px] text-stone-400 mt-0.5">
                        Sold by {item.product.farmerName} · ₹{item.product.price} / {item.product.unit}
                      </p>

                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center border border-stone-200 rounded-lg bg-stone-50 overflow-hidden">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            className="p-1 text-stone-500 hover:text-emerald-700"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2.5 text-xs font-bold text-stone-900">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            disabled={item.quantity >= item.product.stockQuantity}
                            className="p-1 text-stone-500 hover:text-emerald-700 disabled:opacity-40"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="text-xs text-stone-400">
                          Max: {item.product.stockQuantity} {item.product.unit}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="block font-bold text-xs sm:text-sm text-emerald-950">
                        ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="text-stone-400 hover:text-red-600 p-1 mt-1 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reassurance notes */}
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-xs text-emerald-900 space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>HarvestHub Direct Farm Guarantee</span>
              </div>
              <p className="text-[11px] text-emerald-800">
                All seeds and farm consumables undergo direct lot verification. Produce is harvested only upon confirmed order placement to ensure maximum nutritional freshness.
              </p>
            </div>
          </div>

          {/* Delivery & Checkout Form */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-7 shadow-2xs space-y-6 sticky top-24">
              <h2 className="text-base font-bold text-stone-900 pb-3 border-b border-stone-100">
                Delivery & Payment
              </h2>

              <form onSubmit={handleCheckout} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Customer Name</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:border-emerald-600 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Phone Number for Dispatch</label>
                  <input
                    type="tel"
                    required
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:border-emerald-600 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Delivery Address</label>
                  <textarea
                    rows={2}
                    required
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:border-emerald-600 outline-hidden resize-none"
                  />
                </div>

                {/* Payment Selection */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">Payment Method</label>
                  <div className="space-y-2">
                    <label className="flex items-center justify-between p-3 rounded-xl border border-stone-200 hover:border-emerald-500 cursor-pointer bg-stone-50/50">
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={paymentMethod === 'CASH_ON_DELIVERY'}
                          onChange={() => setPaymentMethod('CASH_ON_DELIVERY')}
                          className="text-emerald-700 focus:ring-emerald-500"
                        />
                        <span className="text-xs font-bold text-stone-800">Cash on Delivery (COD)</span>
                      </div>
                      <span className="text-[10px] text-stone-500">Pay on arrival</span>
                    </label>

                    <label className="flex items-center justify-between p-3 rounded-xl border border-stone-200 hover:border-emerald-500 cursor-pointer bg-stone-50/50">
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={paymentMethod === 'SIMULATED_UPI'}
                          onChange={() => setPaymentMethod('SIMULATED_UPI')}
                          className="text-emerald-700 focus:ring-emerald-500"
                        />
                        <span className="text-xs font-bold text-stone-800">Simulated UPI (GPay/PhonePe)</span>
                      </div>
                      <span className="text-[10px] font-semibold text-emerald-700">Instant</span>
                    </label>

                    <label className="flex items-center justify-between p-3 rounded-xl border border-stone-200 hover:border-emerald-500 cursor-pointer bg-stone-50/50">
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={paymentMethod === 'SIMULATED_CARD'}
                          onChange={() => setPaymentMethod('SIMULATED_CARD')}
                          className="text-emerald-700 focus:ring-emerald-500"
                        />
                        <span className="text-xs font-bold text-stone-800">Simulated Net Banking / Card</span>
                      </div>
                      <span className="text-[10px] text-stone-500">Online test</span>
                    </label>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="pt-4 border-t border-stone-100 space-y-2 text-xs">
                  <div className="flex justify-between text-stone-600">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>Agricultural Handling & Delivery</span>
                    <span>{shippingFee === 0 ? <span className="text-emerald-700 font-semibold">FREE (Above ₹1000)</span> : `₹${shippingFee}`}</span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>Packaging & Taxes (5%)</span>
                    <span>₹{taxAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-base font-extrabold text-stone-900 pt-2 border-t border-stone-200">
                    <span>Total Amount</span>
                    <span className="text-emerald-950 font-black">₹{totalAmount.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 mt-4"
                >
                  {loading ? 'Validating Stock & Placing Order...' : `Place Order (₹${totalAmount.toLocaleString('en-IN')})`}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
