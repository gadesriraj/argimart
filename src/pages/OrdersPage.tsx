import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Package, Clock, Truck, CheckCircle2, XCircle } from 'lucide-react';
import { useOrders } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';
import { OrderStatus } from '../types';

export const OrdersPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { getCustomerOrders } = useOrders();

  const myOrders = getCustomerOrders(currentUser?.id || 'user-customer-1');

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'DELIVERED':
        return <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800"><CheckCircle2 className="w-3 h-3" /> Delivered</span>;
      case 'CANCELLED':
        return <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-red-100 text-red-800"><XCircle className="w-3 h-3" /> Cancelled</span>;
      case 'SHIPPED':
        return <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800"><Truck className="w-3 h-3" /> Shipped</span>;
      default:
        return <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800"><Clock className="w-3 h-3" /> {status}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            My Orders & Tracking
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Track status progression and view invoices for all purchases
          </p>
        </div>

        {myOrders.length === 0 ? (
          <div className="bg-white rounded-3xl border border-stone-200/90 p-12 text-center max-w-md mx-auto my-12">
            <ShoppingBag className="w-12 h-12 text-stone-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-stone-900 mb-1">No Orders Found</h3>
            <p className="text-xs text-stone-500 mb-6">You haven't placed any orders on HarvestHub yet.</p>
            <Link
              to="/marketplace"
              className="px-6 py-2.5 bg-emerald-700 text-white rounded-xl text-xs font-bold hover:bg-emerald-800"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {myOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-3xl border border-stone-200/90 p-6 shadow-2xs hover:shadow-sm transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-100 gap-2 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs">
                      <Package className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-stone-900">Order #{order.id}</span>
                        {getStatusBadge(order.orderStatus)}
                      </div>
                      <span className="text-[11px] text-stone-400">
                        Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 self-end sm:self-auto">
                    <div className="text-right">
                      <span className="text-xs text-stone-400 block">Total</span>
                      <span className="text-base font-black text-emerald-950">
                        ₹{order.totalAmount.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <Link
                      to={`/orders/${order.id}`}
                      className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
                    >
                      <span>Track Order</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Items preview */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="p-3 rounded-2xl bg-stone-50 border border-stone-200/60 flex items-center gap-3">
                      {item.imageUrl && (
                        <img src={item.imageUrl} alt={item.productNameSnapshot} className="w-12 h-12 rounded-xl object-cover" />
                      )}
                      <div className="min-w-0 flex-1">
                        <span className="text-xs font-bold text-stone-900 block truncate">{item.productNameSnapshot}</span>
                        <span className="text-[11px] text-stone-500">Qty: {item.quantity} · ₹{item.unitPrice} each</span>
                        <span className="text-[11px] font-bold text-emerald-900 block mt-0.5">₹{item.subtotal}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
