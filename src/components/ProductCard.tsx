import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star, MapPin, Check, AlertCircle } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const res = addToCart(product, 1);
    if (res.success) {
      setAdded(true);
      setFeedbackMsg('Added to cart');
      setTimeout(() => {
        setAdded(false);
        setFeedbackMsg(null);
      }, 2000);
    } else {
      setFeedbackMsg(res.message);
      setTimeout(() => setFeedbackMsg(null), 3000);
    }
  };

  const isOutOfStock = product.stockQuantity <= 0;

  return (
    <div className="group bg-white rounded-2xl border border-stone-200/90 hover:border-emerald-500/40 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden">
      {/* Product Image Container */}
      <Link to={`/products/${product.id}`} className="relative block aspect-4/3 overflow-hidden bg-stone-100">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Category & Stock tag using clean minimal aesthetic */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-stone-900/80 text-white backdrop-blur-xs">
            {product.category}
          </span>
          {isOutOfStock ? (
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-red-600 text-white">
              Out of Stock
            </span>
          ) : product.stockQuantity < 20 ? (
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-amber-600 text-white">
              Only {product.stockQuantity} left
            </span>
          ) : null}
        </div>

        {/* Rating preview */}
        {product.rating && (
          <div className="absolute top-3 right-3 flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-white/90 text-stone-800 shadow-xs backdrop-blur-xs">
            <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
            <span>{product.rating.toFixed(1)}</span>
          </div>
        )}
      </Link>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Seller & Location unboxed metadata */}
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1.5">
            <span className="font-medium text-emerald-800 truncate max-w-[140px]">
              {product.farmerName}
            </span>
            <span className="flex items-center gap-1 text-stone-400 text-[11px] truncate">
              <MapPin className="w-3 h-3 shrink-0" />
              {product.location}
            </span>
          </div>

          {/* Product Name */}
          <Link to={`/products/${product.id}`}>
            <h3 className="font-semibold text-stone-900 group-hover:text-emerald-700 transition-colors line-clamp-2 text-sm leading-snug">
              {product.name}
            </h3>
          </Link>

          {/* Description Snippet */}
          <p className="text-xs text-stone-500 line-clamp-2 mt-1.5 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Pricing, Stock status, and Action */}
        <div className="mt-4 pt-3 border-t border-stone-100">
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <span className="text-lg font-bold text-emerald-950">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-stone-500 ml-1">
                / {product.unit}
              </span>
            </div>

            <span className="text-[11px] font-medium text-stone-500">
              {isOutOfStock ? (
                <span className="text-red-500 font-semibold">Unavailable</span>
              ) : (
                <span className="text-emerald-700">Stock: {product.stockQuantity} {product.unit}</span>
              )}
            </span>
          </div>

          {feedbackMsg && (
            <div className={`mb-2 text-xs py-1 px-2 rounded-lg flex items-center gap-1.5 ${
              added ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-700'
            }`}>
              {added ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <AlertCircle className="w-3.5 h-3.5 text-red-600" />}
              <span className="truncate">{feedbackMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            <Link
              to={`/products/${product.id}`}
              className="w-full text-center py-2 px-3 text-xs font-semibold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors"
            >
              View Details
            </Link>

            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`w-full py-2 px-3 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                isOutOfStock
                  ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                  : added
                  ? 'bg-emerald-800 text-white'
                  : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs'
              }`}
            >
              {added ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>Add to Cart</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
