import React, { useState } from 'react';
import { 
  Package, 
  ShoppingBag, 
  TrendingUp, 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Check, 
  X, 
  AlertCircle,
  Truck,
  DollarSign
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductContext';
import { useOrders } from '../context/OrderContext';
import { ProductCategory, Product, OrderStatus } from '../types';

export const FarmerDashboardPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { products, addProduct, updateProduct, deleteProduct, toggleProductStatus } = useProducts();
  const { getFarmerOrders, updateOrderStatus } = useOrders();

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'add' | 'orders'>('overview');
  
  // Edit modal state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Add product form state
  const [formData, setFormData] = useState({
    name: '',
    category: 'Seeds' as ProductCategory,
    description: '',
    price: '',
    unit: 'kg',
    stockQuantity: '',
    location: currentUser?.address || 'Nashik, Maharashtra',
    imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80',
  });

  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Farmer's own products
  const myProducts = products.filter(p => p.farmerId === currentUser?.id || currentUser?.role === 'FARMER');
  
  // Farmer's orders
  const farmerOrderEntries = getFarmerOrders(currentUser?.id || 'user-farmer-1');

  // Stats calculation
  const totalProducts = myProducts.length;
  const activeListings = myProducts.filter(p => p.active).length;
  
  const pendingOrders = farmerOrderEntries.filter(
    ({ order }) => order.orderStatus === 'PLACED' || order.orderStatus === 'CONFIRMED' || order.orderStatus === 'PROCESSING'
  ).length;

  const completedOrders = farmerOrderEntries.filter(
    ({ order }) => order.orderStatus === 'DELIVERED'
  ).length;

  const totalSales = farmerOrderEntries.reduce((sum, { itemsForFarmer }) => {
    return sum + itemsForFarmer.reduce((acc, item) => acc + item.subtotal, 0);
  }, 0);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.stockQuantity) {
      setNotification({ type: 'error', message: 'Please complete all required fields.' });
      return;
    }

    addProduct({
      name: formData.name,
      category: formData.category,
      description: formData.description,
      price: parseFloat(formData.price),
      unit: formData.unit,
      stockQuantity: parseInt(formData.stockQuantity, 10),
      location: formData.location,
      imageUrl: formData.imageUrl || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
      farmerId: currentUser?.id || 'user-farmer-1',
      farmerName: currentUser?.fullName || 'Verified Farmer',
      active: true,
    });

    setNotification({ type: 'success', message: 'Product listed successfully on the marketplace!' });
    setFormData({
      name: '',
      category: 'Seeds',
      description: '',
      price: '',
      unit: 'kg',
      stockQuantity: '',
      location: currentUser?.address || '',
      imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80',
    });
    setActiveTab('products');
    setTimeout(() => setNotification(null), 3500);
  };

  const handleUpdateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    updateProduct(editingProduct.id, {
      name: editingProduct.name,
      price: editingProduct.price,
      stockQuantity: editingProduct.stockQuantity,
      description: editingProduct.description,
      unit: editingProduct.unit,
      location: editingProduct.location,
    });

    setEditingProduct(null);
    setNotification({ type: 'success', message: 'Product details updated successfully.' });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteProduct(id);
      setNotification({ type: 'success', message: `Removed "${name}" from inventory.` });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with greeting */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-200 mb-6 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
              <span>Farmer & Producer Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              Welcome back, {currentUser?.fullName}
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              Manage your agricultural inventory, direct harvest sales, and customer fulfillment.
            </p>
          </div>

          <button
            onClick={() => setActiveTab('add')}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-sm transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>List New Crop / Product</span>
          </button>
        </div>

        {notification && (
          <div className={`p-4 rounded-2xl mb-6 text-xs font-semibold flex items-center justify-between ${
            notification.type === 'success' ? 'bg-emerald-100 text-emerald-900 border border-emerald-200' : 'bg-red-100 text-red-900 border border-red-200'
          }`}>
            <div className="flex items-center gap-2">
              {notification.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-700" /> : <AlertCircle className="w-4 h-4 text-red-700" />}
              <span>{notification.message}</span>
            </div>
            <button onClick={() => setNotification(null)}><X className="w-4 h-4" /></button>
          </div>
        )}

        {/* Dashboard Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-stone-500">Total Products</span>
              <Package className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-black text-stone-900">{totalProducts}</p>
            <span className="text-[11px] text-stone-400">In your catalog</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-stone-500">Active Listings</span>
              <Check className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-black text-emerald-700">{activeListings}</p>
            <span className="text-[11px] text-stone-400">Live in marketplace</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-stone-500">Pending Orders</span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-2xl font-black text-amber-600">{pendingOrders}</p>
            <span className="text-[11px] text-stone-400">Requires dispatch</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-stone-500">Completed Orders</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-black text-emerald-800">{completedOrders}</p>
            <span className="text-[11px] text-stone-400">Delivered safely</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-stone-500">Total Revenue</span>
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-black text-emerald-950">₹{totalSales.toLocaleString('en-IN')}</p>
            <span className="text-[11px] text-emerald-700 font-semibold">Direct farmer payout</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-stone-200 mb-6 pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            Sales Overview
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
              activeTab === 'products'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            My Products ({myProducts.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
              activeTab === 'orders'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            Customer Orders ({farmerOrderEntries.length})
          </button>
          <button
            onClick={() => setActiveTab('add')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
              activeTab === 'add'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            + Add New Product
          </button>
        </div>

        {/* Tab 1: Sales Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Best Selling Products */}
              <div className="bg-white p-6 rounded-3xl border border-stone-200">
                <h3 className="text-base font-bold text-stone-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-700" />
                  <span>Catalog Performance</span>
                </h3>

                <div className="space-y-3">
                  {myProducts.slice(0, 5).map(prod => (
                    <div key={prod.id} className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-100">
                      <div className="flex items-center gap-3">
                        <img src={prod.imageUrl} alt={prod.name} className="w-10 h-10 rounded-lg object-cover" />
                        <div>
                          <h4 className="text-xs font-bold text-stone-900 line-clamp-1">{prod.name}</h4>
                          <span className="text-[11px] text-stone-500">₹{prod.price} / {prod.unit} · Stock: {prod.stockQuantity}</span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-emerald-800">
                        {prod.active ? 'Active' : 'Paused'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Guidance Card */}
              <div className="bg-gradient-to-br from-emerald-900 to-emerald-950 p-6 rounded-3xl text-white flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">Farmer Advisory</span>
                  <h3 className="text-lg font-bold mt-1">Direct Farm Trading Tips</h3>
                  <p className="text-xs text-emerald-100 mt-3 leading-relaxed">
                    Keep your stock quantities updated after daily harvests. Adding clear moisture percentages and germination certificates helps buyers place larger bulk orders with confidence.
                  </p>
                </div>

                <div className="pt-6 border-t border-emerald-800 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold">Need Advice on Pest or Soil?</div>
                    <div className="text-xs text-emerald-300">Ask the AI Agronomist 24/7</div>
                  </div>
                  <button
                    onClick={() => window.location.href = '/ai-assistant'}
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 text-xs font-bold transition-colors"
                  >
                    Open AI Assistant
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Manage Products */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-2xs">
            <div className="p-6 border-b border-stone-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-stone-900">Your Agricultural Listings</h3>
                <p className="text-xs text-stone-500 mt-0.5">Control pricing, stock quantities, and availability</p>
              </div>
              <button
                onClick={() => setActiveTab('add')}
                className="px-3 py-1.5 bg-emerald-700 text-white rounded-xl text-xs font-bold hover:bg-emerald-800"
              >
                + Add Item
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200 text-[11px] font-bold uppercase text-stone-500 tracking-wider">
                    <th className="py-3 px-4">Product</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Price / Unit</th>
                    <th className="py-3 px-4">Stock</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-xs">
                  {myProducts.map(product => (
                    <tr key={product.id} className="hover:bg-stone-50/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img src={product.imageUrl} alt={product.name} className="w-12 h-12 rounded-xl object-cover" />
                          <div>
                            <span className="font-bold text-stone-900 block max-w-xs truncate">{product.name}</span>
                            <span className="text-[11px] text-stone-400 flex items-center gap-1">
                              <MapPin className="w-3 h-3" /> {product.location}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-stone-600 font-medium">
                        {product.category}
                      </td>
                      <td className="py-3 px-4 font-bold text-emerald-950">
                        ₹{product.price} / {product.unit}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`font-semibold ${product.stockQuantity < 10 ? 'text-amber-600' : 'text-stone-700'}`}>
                          {product.stockQuantity} {product.unit}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => toggleProductStatus(product.id)}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors ${
                            product.active
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-stone-200 text-stone-600'
                          }`}
                        >
                          {product.active ? 'Active' : 'Paused'}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setEditingProduct(product)}
                            className="p-1.5 text-stone-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Edit details"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id, product.name)}
                            className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Customer Orders */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {farmerOrderEntries.length === 0 ? (
              <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center">
                <ShoppingBag className="w-10 h-10 text-stone-400 mx-auto mb-3" />
                <h3 className="text-sm font-bold text-stone-900">No Orders Yet</h3>
                <p className="text-xs text-stone-500 mt-1">When customers purchase your listed items, they will appear here.</p>
              </div>
            ) : (
              farmerOrderEntries.map(({ order, itemsForFarmer }) => (
                <div key={order.id} className="bg-white rounded-2xl border border-stone-200 p-5 shadow-2xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-stone-100 gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-stone-900">{order.id}</span>
                        <span className="text-[11px] font-semibold text-stone-400">
                          {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 mt-0.5">
                        Customer: <span className="font-bold text-stone-800">{order.customerName}</span> · Phone: {order.contactPhone}
                      </p>
                      <p className="text-xs text-stone-500">
                        Delivery Address: <span className="text-stone-700">{order.deliveryAddress}</span>
                      </p>
                    </div>

                    {/* Order Status Controller */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-stone-500">Status:</span>
                      <select
                        value={order.orderStatus}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                        className="text-xs font-bold py-1.5 px-3 rounded-xl border border-stone-300 bg-stone-50 text-stone-800 outline-hidden focus:border-emerald-600"
                      >
                        <option value="PLACED">PLACED</option>
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="PROCESSING">PROCESSING</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </div>
                  </div>

                  {/* Items for this farmer */}
                  <div className="space-y-2">
                    {itemsForFarmer.map(item => (
                      <div key={item.id} className="flex items-center justify-between text-xs py-1">
                        <div className="flex items-center gap-2">
                          {item.imageUrl && (
                            <img src={item.imageUrl} alt={item.productNameSnapshot} className="w-8 h-8 rounded-lg object-cover" />
                          )}
                          <span className="font-medium text-stone-800">{item.productNameSnapshot}</span>
                          <span className="text-stone-400">× {item.quantity}</span>
                        </div>
                        <span className="font-bold text-emerald-950">₹{item.subtotal.toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 4: Add New Product Form */}
        {activeTab === 'add' && (
          <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 max-w-2xl mx-auto shadow-2xs">
            <h3 className="text-lg font-bold text-stone-900 mb-1">List New Product on HarvestHub</h3>
            <p className="text-xs text-stone-500 mb-6">Enter accurate harvest information and pricing</p>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Certified Organic Sharbati Wheat"
                  className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:border-emerald-600 outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as ProductCategory })}
                    className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:border-emerald-600 outline-hidden font-medium"
                  >
                    <option value="Seeds">Seeds</option>
                    <option value="Fertilizers">Fertilizers</option>
                    <option value="Pesticides">Pesticides</option>
                    <option value="Farm Equipment">Farm Equipment</option>
                    <option value="Vegetables">Vegetables</option>
                    <option value="Fruits">Fruits</option>
                    <option value="Grains">Grains</option>
                    <option value="Organic Products">Organic Products</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Unit of Measure *</label>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:border-emerald-600 outline-hidden font-medium"
                  >
                    <option value="kg">kg (Kilogram)</option>
                    <option value="quintal">quintal (100 kg)</option>
                    <option value="liter">liter</option>
                    <option value="piece">piece</option>
                    <option value="kit">kit / set</option>
                    <option value="basket">basket</option>
                    <option value="dozen">dozen</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Price (₹ per unit) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="e.g. 45"
                    className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:border-emerald-600 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Available Quantity *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.stockQuantity}
                    onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                    placeholder="e.g. 500"
                    className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:border-emerald-600 outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Farm Location / Mandi</label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. Nashik, Maharashtra"
                  className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:border-emerald-600 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Product Photo URL</label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:border-emerald-600 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Description & Quality Details</label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Provide germination rate, organic certification, moisture content, or harvest date..."
                  className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:border-emerald-600 outline-hidden resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-md transition-colors"
              >
                Publish Listing
              </button>
            </form>
          </div>
        )}

        {/* Edit Modal */}
        {editingProduct && (
          <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-xl border border-stone-200">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
                <h3 className="text-sm font-bold text-stone-900">Edit Product: {editingProduct.name}</h3>
                <button onClick={() => setEditingProduct(null)} className="text-stone-400 hover:text-stone-600">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleUpdateProduct} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="w-full text-xs p-2 bg-stone-50 border border-stone-200 rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Price (₹)</label>
                    <input
                      type="number"
                      value={editingProduct.price}
                      onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) })}
                      className="w-full text-xs p-2 bg-stone-50 border border-stone-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Available Stock</label>
                    <input
                      type="number"
                      value={editingProduct.stockQuantity}
                      onChange={(e) => setEditingProduct({ ...editingProduct, stockQuantity: parseInt(e.target.value, 10) })}
                      className="w-full text-xs p-2 bg-stone-50 border border-stone-200 rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={editingProduct.description}
                    onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                    className="w-full text-xs p-2 bg-stone-50 border border-stone-200 rounded-lg resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    className="px-3 py-2 text-xs font-semibold text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
