import React, { useState } from 'react';
import { 
  Users, 
  Package, 
  ShoppingBag, 
  TrendingUp, 
  ShieldAlert, 
  Check, 
  X, 
  Trash2, 
  Search, 
  ShieldCheck, 
  DollarSign, 
  AlertCircle,
  Eye,
  Filter
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductContext';
import { useOrders } from '../context/OrderContext';
import { useFeedback } from '../context/FeedbackContext';
import { OrderStatus } from '../types';

export const AdminDashboardPage: React.FC = () => {
  const { usersList, toggleUserStatus } = useAuth();
  const { products, deleteProduct, toggleProductStatus } = useProducts();
  const { orders, updateOrderStatus } = useOrders();
  const { feedbacks, deleteFeedback } = useFeedback();

  const [activeTab, setActiveTab] = useState<'users' | 'products' | 'orders' | 'reports' | 'feedback'>('users');
  const [userRoleFilter, setUserRoleFilter] = useState<'ALL' | 'FARMER' | 'CUSTOMER' | 'ADMIN'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Stats calculation
  const totalUsers = usersList.length;
  const totalFarmers = usersList.filter(u => u.role === 'FARMER').length;
  const totalCustomers = usersList.filter(u => u.role === 'CUSTOMER').length;
  const totalProducts = products.length;
  const totalOrders = orders.length;
  const totalSales = orders.reduce((sum, o) => o.orderStatus !== 'CANCELLED' ? sum + o.totalAmount : sum, 0);

  const filteredUsers = usersList.filter(u => {
    if (userRoleFilter !== 'ALL' && u.role !== userRoleFilter) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return u.fullName.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.phone.includes(q);
    }
    return true;
  });

  const showNotice = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3000);
  };

  return (
    <div className="min-h-screen bg-stone-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-200 mb-6 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-100 text-amber-900 text-xs font-bold mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
              <span>Administrator Oversight Console</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              Platform Administration
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              Verify cultivators, monitor order fulfillment, moderate listings, and review platform volume.
            </p>
          </div>
        </div>

        {actionNotice && (
          <div className="mb-6 p-3 rounded-2xl bg-emerald-100 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center justify-between">
            <span>{actionNotice}</span>
            <button onClick={() => setActionNotice(null)}><X className="w-4 h-4" /></button>
          </div>
        )}

        {/* Global Key Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
            <span className="text-[11px] font-semibold text-stone-500">Total Users</span>
            <p className="text-xl font-black text-stone-900 mt-0.5">{totalUsers}</p>
            <span className="text-[10px] text-stone-400">All registered</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
            <span className="text-[11px] font-semibold text-stone-500">Farmers</span>
            <p className="text-xl font-black text-emerald-700 mt-0.5">{totalFarmers}</p>
            <span className="text-[10px] text-stone-400">Active producers</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
            <span className="text-[11px] font-semibold text-stone-500">Customers</span>
            <p className="text-xl font-black text-emerald-800 mt-0.5">{totalCustomers}</p>
            <span className="text-[10px] text-stone-400">Retail & bulk</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
            <span className="text-[11px] font-semibold text-stone-500">Total Products</span>
            <p className="text-xl font-black text-stone-900 mt-0.5">{totalProducts}</p>
            <span className="text-[10px] text-stone-400">In catalog</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
            <span className="text-[11px] font-semibold text-stone-500">Total Orders</span>
            <p className="text-xl font-black text-stone-900 mt-0.5">{totalOrders}</p>
            <span className="text-[10px] text-stone-400">Transactions</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
            <span className="text-[11px] font-semibold text-stone-500">Platform GMV</span>
            <p className="text-xl font-black text-emerald-950 mt-0.5">₹{totalSales.toLocaleString('en-IN')}</p>
            <span className="text-[10px] text-emerald-700 font-semibold">Total revenue</span>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-stone-200 mb-6 pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
              activeTab === 'users'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            User Management ({usersList.length})
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
              activeTab === 'products'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            Product Moderation ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
              activeTab === 'orders'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            All Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
              activeTab === 'reports'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            Sales & Agronomy Reports
          </button>
          <button
            onClick={() => setActiveTab('feedback')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
              activeTab === 'feedback'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            Customer Reviews ({feedbacks.length})
          </button>
        </div>

        {/* Tab 1: User Management */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-2xs">
            <div className="p-5 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setUserRoleFilter('ALL')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold ${userRoleFilter === 'ALL' ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-600'}`}
                >
                  All
                </button>
                <button
                  onClick={() => setUserRoleFilter('FARMER')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold ${userRoleFilter === 'FARMER' ? 'bg-emerald-800 text-white' : 'bg-stone-100 text-stone-600'}`}
                >
                  Farmers
                </button>
                <button
                  onClick={() => setUserRoleFilter('CUSTOMER')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold ${userRoleFilter === 'CUSTOMER' ? 'bg-emerald-800 text-white' : 'bg-stone-100 text-stone-600'}`}
                >
                  Customers
                </button>
                <button
                  onClick={() => setUserRoleFilter('ADMIN')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold ${userRoleFilter === 'ADMIN' ? 'bg-amber-600 text-white' : 'bg-stone-100 text-stone-600'}`}
                >
                  Admins
                </button>
              </div>

              <div className="relative">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search user by name, email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-xl outline-hidden focus:border-emerald-600"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200 text-[11px] font-bold uppercase text-stone-500 tracking-wider">
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Contact</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Address</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Moderation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-xs">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-stone-50/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
                            {user.fullName.charAt(0)}
                          </div>
                          <div>
                            <span className="font-bold text-stone-900 block">{user.fullName}</span>
                            <span className="text-[10px] text-stone-400">ID: {user.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-stone-700 block">{user.email}</span>
                        <span className="text-stone-400 text-[11px]">{user.phone}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          user.role === 'ADMIN' ? 'bg-amber-100 text-amber-900' :
                          user.role === 'FARMER' ? 'bg-emerald-100 text-emerald-900' :
                          'bg-stone-100 text-stone-800'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 max-w-xs truncate text-stone-600 text-[11px]">
                        {user.address}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-[11px] font-bold ${user.active ? 'text-emerald-700' : 'text-red-600'}`}>
                          {user.active ? 'Active' : 'Suspended'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => {
                            toggleUserStatus(user.id);
                            showNotice(`Updated account status for ${user.fullName}`);
                          }}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                            user.active
                              ? 'bg-red-50 text-red-700 hover:bg-red-100'
                              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          }`}
                        >
                          {user.active ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Product Moderation */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-2xs">
            <div className="p-5 border-b border-stone-100">
              <h3 className="text-sm font-bold text-stone-900">Marketplace Listings Moderation</h3>
              <p className="text-xs text-stone-500">Remove inappropriate listings or verify organic certifications</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200 text-[11px] font-bold uppercase text-stone-500 tracking-wider">
                    <th className="py-3 px-4">Product</th>
                    <th className="py-3 px-4">Seller</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4">Stock</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-xs">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-stone-50/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img src={p.imageUrl} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
                          <div>
                            <span className="font-bold text-stone-900 block max-w-xs truncate">{p.name}</span>
                            <span className="text-[11px] text-stone-400">{p.category}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-stone-700 font-medium">
                        {p.farmerName}
                      </td>
                      <td className="py-3 px-4 font-bold text-emerald-950">
                        ₹{p.price} / {p.unit}
                      </td>
                      <td className="py-3 px-4 text-stone-600">
                        {p.stockQuantity} {p.unit}
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => {
                            toggleProductStatus(p.id);
                            showNotice(`Toggled status for ${p.name}`);
                          }}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            p.active ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'
                          }`}
                        >
                          {p.active ? 'Live' : 'Hidden'}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete listing "${p.name}"?`)) {
                              deleteProduct(p.id);
                              showNotice(`Deleted product: ${p.name}`);
                            }
                          }}
                          className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Remove listing"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: All Orders */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-2xs">
            <div className="p-5 border-b border-stone-100">
              <h3 className="text-sm font-bold text-stone-900">All Marketplace Orders</h3>
              <p className="text-xs text-stone-500">Monitor order lifecycle across all farmers and buyers</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200 text-[11px] font-bold uppercase text-stone-500 tracking-wider">
                    <th className="py-3 px-4">Order ID</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Items</th>
                    <th className="py-3 px-4">Total Amount</th>
                    <th className="py-3 px-4">Payment</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Update Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-xs">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-stone-50/50">
                      <td className="py-3 px-4 font-bold text-stone-900">{o.id}</td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-stone-800 block">{o.customerName}</span>
                        <span className="text-[10px] text-stone-400">{o.contactPhone}</span>
                      </td>
                      <td className="py-3 px-4 text-stone-600 text-[11px]">
                        {o.items.map(i => `${i.productNameSnapshot} (${i.quantity})`).join(', ')}
                      </td>
                      <td className="py-3 px-4 font-black text-emerald-950">
                        ₹{o.totalAmount.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          o.paymentStatus === 'PAID' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {o.paymentStatus} ({o.paymentMethod})
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          o.orderStatus === 'DELIVERED' ? 'bg-emerald-100 text-emerald-800' :
                          o.orderStatus === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {o.orderStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <select
                          value={o.orderStatus}
                          onChange={(e) => {
                            updateOrderStatus(o.id, e.target.value as OrderStatus);
                            showNotice(`Updated ${o.id} to ${e.target.value}`);
                          }}
                          className="text-xs p-1 rounded-lg border border-stone-200 bg-stone-50 outline-hidden font-medium"
                        >
                          <option value="PLACED">PLACED</option>
                          <option value="CONFIRMED">CONFIRMED</option>
                          <option value="PROCESSING">PROCESSING</option>
                          <option value="SHIPPED">SHIPPED</option>
                          <option value="DELIVERED">DELIVERED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: Sales & Agronomy Reports */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-stone-200">
                <h3 className="text-base font-bold text-stone-900 mb-4">Category Distribution</h3>
                <div className="space-y-3">
                  {['Seeds', 'Fertilizers', 'Farm Equipment', 'Vegetables', 'Grains'].map(cat => {
                    const count = products.filter(p => p.category === cat).length;
                    const pct = Math.round((count / (products.length || 1)) * 100);
                    return (
                      <div key={cat} className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold text-stone-700">
                          <span>{cat}</span>
                          <span>{count} listings ({pct}%)</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
                          <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${pct}%` }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-stone-200">
                <h3 className="text-base font-bold text-stone-900 mb-2">Platform Sustainability Impact</h3>
                <p className="text-xs text-stone-500 mb-4">Metric estimates from direct farmer-to-consumer delivery</p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                    <span className="text-xs text-emerald-800 font-bold">Estimated Savings</span>
                    <p className="text-xl font-black text-emerald-950 mt-1">₹48,200</p>
                    <span className="text-[10px] text-emerald-700">Middleman commission saved</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                    <span className="text-xs text-emerald-800 font-bold">Direct Harvest Dispatched</span>
                    <p className="text-xl font-black text-emerald-950 mt-1">4.2 Tons</p>
                    <span className="text-[10px] text-emerald-700">Clean agri commerce</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Customer Reviews Moderation */}
        {activeTab === 'feedback' && (
          <div className="bg-white rounded-3xl border border-stone-200 p-6">
            <h3 className="text-sm font-bold text-stone-900 mb-4">Customer Reviews Moderation</h3>
            <div className="space-y-3">
              {feedbacks.map(fb => (
                <div key={fb.id} className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-stone-900">{fb.customerName}</span>
                      <span className="text-[11px] text-amber-600 font-bold">★ {fb.rating}/5</span>
                      <span className="text-[10px] text-stone-400">Product ID: {fb.productId}</span>
                    </div>
                    <p className="text-xs text-stone-600 mt-1">{fb.comment}</p>
                  </div>
                  <button
                    onClick={() => {
                      deleteFeedback(fb.id);
                      showNotice('Feedback entry removed.');
                    }}
                    className="p-2 text-stone-400 hover:text-red-600"
                    title="Remove inappropriate review"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
