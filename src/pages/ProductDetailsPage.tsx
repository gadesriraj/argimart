import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ShoppingCart, 
  Star, 
  MapPin, 
  Truck, 
  ShieldCheck, 
  Sprout, 
  Plus, 
  Minus, 
  Check, 
  MessageSquare,
  AlertCircle
} from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { useFeedback } from '../context/FeedbackContext';
import { useAuth } from '../context/AuthContext';
import { ProductCard } from '../components/ProductCard';

export const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getProductById, products } = useProducts();
  const { addToCart } = useCart();
  const { getProductFeedbacks, addFeedback } = useFeedback();
  const { currentUser, isAuthenticated } = useAuth();

  const product = getProductById(id || '');
  const feedbacks = id ? getProductFeedbacks(id) : [];

  const [quantity, setQuantity] = useState(1);
  const [addedNotice, setAddedNotice] = useState<string | null>(null);
  
  // Feedback form state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
        <h2 className="text-xl font-bold text-stone-900 mb-2">Product Not Found</h2>
        <p className="text-xs text-stone-500 mb-6">The product listing you requested does not exist or has been removed.</p>
        <Link
          to="/marketplace"
          className="px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-semibold hover:bg-emerald-800"
        >
          Return to Marketplace
        </Link>
      </div>
    );
  }

  const isOutOfStock = product.stockQuantity <= 0;

  const handleQuantityChange = (newQty: number) => {
    if (newQty < 1) return;
    if (newQty > product.stockQuantity) return;
    setQuantity(newQty);
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    const res = addToCart(product, quantity);
    if (res.success) {
      setAddedNotice(`Successfully added ${quantity} ${product.unit} to your cart!`);
      setTimeout(() => setAddedNotice(null), 3500);
    } else {
      setAddedNotice(res.message);
      setTimeout(() => setAddedNotice(null), 4000);
    }
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    addFeedback(
      product.id,
      rating,
      comment.trim(),
      currentUser?.fullName || 'Verified Farmer/Buyer',
      currentUser?.id || 'guest-user'
    );

    setComment('');
    setFeedbackSuccess(true);
    setTimeout(() => setFeedbackSuccess(false), 3000);
  };

  // Related products in the same category
  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-stone-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-stone-500 mb-6">
          <Link to="/" className="hover:text-emerald-700">Home</Link>
          <span>/</span>
          <Link to="/marketplace" className="hover:text-emerald-700">Marketplace</Link>
          <span>/</span>
          <span className="text-stone-400">{product.category}</span>
          <span>/</span>
          <span className="font-semibold text-stone-900 truncate max-w-xs">{product.name}</span>
        </div>

        {/* Back Link */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 hover:text-emerald-950 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to products</span>
        </button>

        {/* Product Details Hero Card */}
        <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xs overflow-hidden mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-10">
            {/* Product Image Gallery */}
            <div className="lg:col-span-6 space-y-4">
              <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-stone-100 border border-stone-200">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-4 left-4 text-xs font-semibold px-2.5 py-1 rounded-md bg-stone-900/80 text-white backdrop-blur-xs">
                  {product.category}
                </span>
                {isOutOfStock && (
                  <div className="absolute inset-0 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center">
                    <span className="bg-red-600 text-white font-bold px-4 py-2 rounded-xl text-sm shadow-md">
                      Currently Out of Stock
                    </span>
                  </div>
                )}
              </div>

              {/* Seller details badge */}
              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-sm">
                    {product.farmerName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-900">{product.farmerName}</h4>
                    <p className="text-[11px] text-stone-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-emerald-700" />
                      {product.location}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
                    Verified Seller
                  </span>
                  <span className="text-[11px] text-stone-500">Direct Farmer</span>
                </div>
              </div>
            </div>

            {/* Product Meta & Purchase Actions */}
            <div className="lg:col-span-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-4 mb-2">
                  <span className="text-xs font-bold text-emerald-700 tracking-wide uppercase">
                    {product.category}
                  </span>
                  {product.rating && (
                    <div className="flex items-center gap-1 text-xs font-bold text-stone-800 bg-amber-50 px-2 py-1 rounded-md border border-amber-200">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                      <span>{product.rating.toFixed(1)}</span>
                      <span className="text-stone-400 font-normal">({product.reviewsCount || feedbacks.length} reviews)</span>
                    </div>
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 leading-snug mb-3">
                  {product.name}
                </h1>

                {/* Pricing Box */}
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-emerald-950">
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-sm font-semibold text-stone-500">
                      per {product.unit}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 mt-1">
                    Inclusive of all local agricultural cess and platform handling.
                  </p>
                </div>

                {/* Description */}
                <div className="space-y-2 mb-6">
                  <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider">Product Description</h3>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed whitespace-pre-line">
                    {product.description}
                  </p>
                </div>

                {/* Inventory Stock Indicator */}
                <div className="mb-6 pb-6 border-b border-stone-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-stone-700">Availability:</span>
                  {isOutOfStock ? (
                    <span className="text-xs font-bold text-red-600">Out of Stock</span>
                  ) : (
                    <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      In Stock ({product.stockQuantity} {product.unit} available)
                    </span>
                  )}
                </div>
              </div>

              {/* Order Controls */}
              <div className="space-y-4">
                {addedNotice && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-medium flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{addedNotice}</span>
                  </div>
                )}

                {!isOutOfStock && (
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-bold text-stone-700">Quantity:</span>
                    <div className="flex items-center border border-stone-200 rounded-xl bg-stone-50 overflow-hidden">
                      <button
                        onClick={() => handleQuantityChange(quantity - 1)}
                        disabled={quantity <= 1}
                        className="p-2 text-stone-600 hover:text-emerald-700 hover:bg-stone-100 disabled:opacity-40"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-4 text-xs font-bold text-stone-900 min-w-[36px] text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(quantity + 1)}
                        disabled={quantity >= product.stockQuantity}
                        className="p-2 text-stone-600 hover:text-emerald-700 hover:bg-stone-100 disabled:opacity-40"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className="text-xs text-stone-500">
                      Total: ₹{(product.price * quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    className={`w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                      isOutOfStock
                        ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                        : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-md'
                    }`}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>{isOutOfStock ? 'Out of Stock' : 'Add to Cart'}</span>
                  </button>

                  <Link
                    to="/cart"
                    onClick={handleAddToCart}
                    className={`w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 border border-emerald-700 text-emerald-800 hover:bg-emerald-50 transition-colors ${
                      isOutOfStock ? 'pointer-events-none opacity-50' : ''
                    }`}
                  >
                    <span>Buy Now</span>
                  </Link>
                </div>

                {/* Delivery reassurance points */}
                <div className="pt-4 grid grid-cols-2 gap-3 text-[11px] text-stone-500">
                  <div className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Safe agri handling</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Direct farmer sourcing</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Feedback & Ratings Section */}
        <section className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-10 mb-12 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-stone-100 mb-8">
            <div>
              <h2 className="text-xl font-bold text-stone-900">Customer Reviews & Feedback</h2>
              <p className="text-xs text-stone-500 mt-1">
                Real feedback from verified purchasers and fellow cultivators.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Reviews list */}
            <div className="lg:col-span-7 space-y-4">
              {feedbacks.length === 0 ? (
                <div className="p-8 text-center bg-stone-50 rounded-2xl border border-dashed border-stone-200">
                  <MessageSquare className="w-8 h-8 text-stone-400 mx-auto mb-2" />
                  <p className="text-xs text-stone-600 font-medium">No reviews yet for this product.</p>
                  <p className="text-[11px] text-stone-400 mt-0.5">Be the first to share your experience with other growers!</p>
                </div>
              ) : (
                feedbacks.map((fb) => (
                  <div key={fb.id} className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs font-bold">
                          {fb.customerName.charAt(0)}
                        </div>
                        <span className="text-xs font-bold text-stone-900">{fb.customerName}</span>
                      </div>
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < fb.rating ? 'fill-amber-400 text-amber-500' : 'text-stone-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-stone-600 leading-relaxed">{fb.comment}</p>
                    <span className="text-[10px] text-stone-400 block mt-2">
                      {new Date(fb.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* Submit feedback form */}
            <div className="lg:col-span-5 bg-stone-50/70 p-6 rounded-2xl border border-stone-200">
              <h3 className="text-sm font-bold text-stone-900 mb-1">Leave Your Feedback</h3>
              <p className="text-[11px] text-stone-500 mb-4">Rate the seed quality, harvest freshness, or tool performance.</p>

              {feedbackSuccess && (
                <div className="mb-4 p-3 rounded-xl bg-emerald-100 text-emerald-900 text-xs font-semibold flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-700" />
                  <span>Thank you! Your feedback has been published.</span>
                </div>
              )}

              <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">Rating</label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= rating ? 'fill-amber-400 text-amber-500' : 'text-stone-300'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-stone-700 ml-2">{rating} Stars</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">Your Feedback & Experience</label>
                  <textarea
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                    placeholder="Describe germination, yield, packaging, or product efficiency..."
                    className="w-full text-xs p-3 bg-white border border-stone-200 rounded-xl focus:border-emerald-600 focus:ring-1 focus:ring-emerald-200 outline-hidden resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
                >
                  Submit Review
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-bold text-stone-900 mb-6">
              More in {product.category}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
