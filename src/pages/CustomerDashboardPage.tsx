import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingBag, 
  Clock, 
  MapPin, 
  Truck, 
  CheckCircle2, 
  ArrowRight, 
  User, 
  Bot, 
  Store,
  CreditCard,
  Package
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';

export const CustomerDashboardPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { getCustomerOrders } = useOrders();
  const { totalItemsCount } = useCart();
  const { products } = useProducts();

  const myOrders = getCustomerOrders(currentUser?.id || 'user-customer-1');

  const pendingOrders = myOrders.filter(
    o => o.orderStatus === 'PLACED' || o.orderStatus === 'CONFIRMED' || o.orderStatus === 'PROCESSING' || o.orderStatus === 'SHIPPED'
  );

  const deliveredOrders = myOrders.filter(o => o.orderStatus === 'DELIVERED');

  const totalSpent = myOrders.reduce((sum, order) => {
    return order.orderStatus !== 'CANCELLED' ? sum + order.totalAmount : sum;
  }, 0);

  const recommendedItems = products.slice(0, 4);

  return (
    <div className="min-h-screen bg-stone-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Banner */}
        <div className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-8 mb-8 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-700 text-white font-bold text-xl flex items-center justify-center shadow-xs">
                {currentUser?.fullName.charAt(0) || 'C'}
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                  Buyer Account
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
                  Hello, {currentUser?.fullName}
                </h1>
                <p className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{currentUser?.address || 'India'}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/marketplace"
                className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Store className="w-4 h-4" />
                <span>Browse Marketplace</span>
              </Link>
              <Link
                to="/cart"
                className="px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Cart ({totalItemsCount})</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-stone-500">Active Shipments</span>
              <p className="text-2xl font-black text-stone-900 mt-1">{pendingOrders.length}</p>
              <span className="text-[11px] text-emerald-700">In transit & dispatch</span>
            </div>
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-stone-500">Delivered Orders</span>
              <p className="text-2xl font-black text-stone-900 mt-1">{deliveredOrders.length}</p>
              <span className="text-[11px] text-stone-400">Completed purchases</span>
            </div>
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-stone-500">Total Purchase Value</span>
              <p className="text-2xl font-black text-emerald-950 mt-1">₹{totalSpent.toLocaleString('en-IN')}</p>
              <span className="text-[11px] text-stone-400">Direct farm transactions</span>
            </div>
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Recent Orders Overview */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 mb-8 shadow-2xs">
          <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-6">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-stone-900">Your Recent Orders</h2>
              <p className="text-xs text-stone-500">Track and view dispatch details for recent purchases</p>
            </div>
            <Link
              to="/orders"
              className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
            >
              <span>View all orders</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {myOrders.length === 0 ? (
            <div className="text-center py-10">
              <Package className="w-10 h-10 text-stone-400 mx-auto mb-2" />
              <p className="text-xs font-bold text-stone-700">No orders placed yet.</p>
              <p className="text-[11px] text-stone-400 mt-0.5">Explore our marketplace to buy fresh vegetables, grains, or seeds.</p>
              <Link
                to="/marketplace"
                className="mt-4 inline-block px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {myOrders.slice(0, 3).map((order) => (
                <div
                  key={order.id}
                  className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-xs text-stone-900">{order.id}</span>
                      <span className="text-[11px] text-stone-400">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                    <div className="text-xs text-stone-600 space-y-0.5">
                      <p>
                        Items: {order.items.map(i => `${i.productNameSnapshot} (${i.quantity})`).join(', ')}
                      </p>
                      <p className="text-[11px] text-stone-400">
                        Method: {order.paymentMethod.replace(/_/g, ' ')} · Payment: {order.paymentStatus}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4">
                    <div className="text-right">
                      <span className="block font-black text-sm text-emerald-950">
                        ₹{order.totalAmount.toLocaleString('en-IN')}
                      </span>
                      <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        order.orderStatus === 'DELIVERED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : order.orderStatus === 'CANCELLED'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {order.orderStatus}
                      </span>
                    </div>

                    <Link
                      to={`/orders/${order.id}`}
                      className="px-3 py-1.5 bg-white border border-stone-200 text-stone-800 text-xs font-semibold rounded-xl hover:border-emerald-300 hover:text-emerald-800"
                    >
                      Track Order
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Hub Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Ask AI Assistant */}
          <div className="p-6 rounded-3xl bg-emerald-900 text-white flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-800 flex items-center justify-center mb-3">
                <Bot className="w-5 h-5 text-amber-300" />
              </div>
              <h3 className="text-base font-bold">Smart Agriculture Assistant</h3>
              <p className="text-xs text-emerald-200 mt-1 leading-relaxed">
                Have questions about organic produce authenticity, seasonal sowing times, or proper storage temperatures? Ask our AI assistant.
              </p>
            </div>
            <Link
              to="/ai-assistant"
              className="mt-6 inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 rounded-xl text-xs font-bold self-start transition-colors"
            >
              <span>Consult Agronomist</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Profile & Address info */}
          <div className="p-6 rounded-3xl bg-white border border-stone-200 flex flex-col justify-between shadow-2xs">
            <div>
              <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center mb-3">
                <User className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-stone-900">Delivery & Profile Settings</h3>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                Ensure your shipping address and phone number are accurate to facilitate direct delivery from regional farmers.
              </p>
            </div>
            <Link
              to="/profile"
              className="mt-6 inline-flex items-center gap-1.5 px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold self-start transition-colors"
            >
              <span>Manage Profile</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
