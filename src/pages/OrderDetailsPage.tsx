import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Phone, 
  XCircle, 
  AlertCircle,
  FileText
} from 'lucide-react';
import { useOrders } from '../context/OrderContext';
import { OrderStatus } from '../types';

const STATUS_STEPS: OrderStatus[] = ['PLACED', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'];

export const OrderDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getOrderById, cancelOrder } = useOrders();

  const order = getOrderById(id || '');
  const [cancelMessage, setCancelMessage] = useState<string | null>(null);

  if (!order) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
        <h2 className="text-xl font-bold text-stone-900 mb-2">Order Not Found</h2>
        <p className="text-xs text-stone-500 mb-6">Could not find order #{id}.</p>
        <Link to="/orders" className="px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-semibold">
          View All Orders
        </Link>
      </div>
    );
  }

  const currentStepIndex = STATUS_STEPS.indexOf(order.orderStatus);
  const isCancelled = order.orderStatus === 'CANCELLED';

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      const res = cancelOrder(order.id);
      setCancelMessage(res.message);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <button
          onClick={() => navigate('/orders')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 hover:text-emerald-950 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to all orders</span>
        </button>

        {cancelMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{cancelMessage}</span>
          </div>
        )}

        {/* Order Header Card */}
        <div className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-8 shadow-2xs mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-100 gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl sm:text-2xl font-black text-stone-900">Order #{order.id}</h1>
                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                  order.orderStatus === 'DELIVERED' ? 'bg-emerald-100 text-emerald-800' :
                  order.orderStatus === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                  'bg-amber-100 text-amber-800'
                }`}>
                  {order.orderStatus}
                </span>
              </div>
              <p className="text-xs text-stone-400 mt-1">
                Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>

            {(order.orderStatus === 'PLACED' || order.orderStatus === 'CONFIRMED') && (
              <button
                onClick={handleCancel}
                className="px-4 py-2 border border-red-200 text-red-700 hover:bg-red-50 rounded-xl text-xs font-bold transition-colors self-start sm:self-auto"
              >
                Cancel Order
              </button>
            )}
          </div>

          {/* Stepper Tracking Visualizer */}
          {!isCancelled ? (
            <div className="py-8">
              <div className="grid grid-cols-5 gap-2 relative">
                {STATUS_STEPS.map((step, index) => {
                  const isDone = currentStepIndex >= index;
                  const isCurrent = currentStepIndex === index;

                  return (
                    <div key={step} className="flex flex-col items-center text-center relative z-10">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-colors shadow-2xs ${
                        isDone
                          ? 'bg-emerald-700 text-white'
                          : 'bg-stone-100 text-stone-400 border border-stone-200'
                      } ${isCurrent ? 'ring-4 ring-emerald-100 scale-110' : ''}`}>
                        {isDone ? <CheckCircle2 className="w-4 h-4" /> : index + 1}
                      </div>
                      <span className={`text-[11px] font-bold mt-2 ${isDone ? 'text-emerald-900' : 'text-stone-400'}`}>
                        {step}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="my-6 p-4 rounded-2xl bg-red-50 border border-red-200 flex items-center gap-3 text-red-900">
              <XCircle className="w-5 h-5 text-red-600 shrink-0" />
              <div className="text-xs">
                <span className="font-bold">This order was cancelled.</span>
                <p className="text-red-700 mt-0.5">Inventory has been returned to the seller catalog and payment status set to {order.paymentStatus}.</p>
              </div>
            </div>
          )}

          {/* Itemized Order Details */}
          <div className="space-y-4 pt-4 border-t border-stone-100">
            <h3 className="text-sm font-bold text-stone-900">Ordered Agricultural Products</h3>
            <div className="divide-y divide-stone-100">
              {order.items.map((item) => (
                <div key={item.id} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    {item.imageUrl && (
                      <img src={item.imageUrl} alt={item.productNameSnapshot} className="w-12 h-12 rounded-xl object-cover" />
                    )}
                    <div>
                      <h4 className="font-bold text-stone-900">{item.productNameSnapshot}</h4>
                      <p className="text-stone-400 text-[11px]">
                        Seller: {item.farmerName || 'Direct Farm'} · Qty: {item.quantity} × ₹{item.unitPrice}
                      </p>
                    </div>
                  </div>
                  <span className="font-black text-stone-900 text-sm">
                    ₹{item.subtotal.toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Logistics & Payment breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-stone-100 text-xs">
            {/* Delivery address */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100 space-y-2">
              <h4 className="font-bold text-stone-900 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-700" />
                <span>Delivery Address</span>
              </h4>
              <p className="text-stone-700 leading-relaxed">{order.deliveryAddress}</p>
              <p className="text-stone-500 flex items-center gap-1 pt-1">
                <Phone className="w-3.5 h-3.5 text-stone-400" />
                <span>Contact: {order.contactPhone}</span>
              </p>
            </div>

            {/* Payment Summary */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100 space-y-2">
              <h4 className="font-bold text-stone-900 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-emerald-700" />
                <span>Payment & Invoicing</span>
              </h4>
              <div className="flex justify-between text-stone-600">
                <span>Method:</span>
                <span className="font-semibold text-stone-800">{order.paymentMethod.replace(/_/g, ' ')}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Payment Status:</span>
                <span className="font-bold text-emerald-800">{order.paymentStatus}</span>
              </div>
              <div className="flex justify-between text-stone-900 font-black text-sm pt-2 border-t border-stone-200">
                <span>Total Paid:</span>
                <span className="text-emerald-950">₹{order.totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
