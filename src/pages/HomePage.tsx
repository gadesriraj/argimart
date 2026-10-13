import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sprout, 
  ArrowRight, 
  CheckCircle2, 
  TrendingUp, 
  Users, 
  Bot, 
  ShieldCheck, 
  Truck, 
  Sparkles,
  ShoppingBag,
  Award,
  ChevronRight,
  ExternalLink,
  Cpu
} from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { CATEGORIES_LIST } from '../data/sampleData';
import { ProductCard } from '../components/ProductCard';

export const HomePage: React.FC = () => {
  const { products, setFilterOptions } = useProducts();
  const navigate = useNavigate();

  // Featured top products
  const featuredProducts = products.filter(p => p.active).slice(0, 8);

  const handleCategoryClick = (categoryName: string) => {
    setFilterOptions(prev => ({ ...prev, category: categoryName as any }));
    navigate('/marketplace');
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-950 text-white py-16 sm:py-24 lg:py-28">
        {/* Subtle patterned overlay */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#22c55e_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Heading & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-800/80 border border-emerald-700/60 text-emerald-200 text-xs font-semibold backdrop-blur-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Next-Gen Smart Agri Marketplace</span>
              </div>

              <div>
                <p className="text-sm sm:text-base font-bold tracking-widest text-emerald-400 uppercase mb-2">
                  Grow • Trade • Empower
                </p>
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                  Connecting Farmers <br className="hidden sm:inline" />
                  to the <span className="text-emerald-400 underline decoration-emerald-500/40 decoration-wavy">Future</span>
                </h1>
              </div>

              <p className="text-base sm:text-lg text-emerald-100/90 max-w-2xl leading-relaxed">
                A smart digital marketplace connecting farmers and customers to create a transparent, efficient, and sustainable agricultural ecosystem.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/marketplace"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-sm shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Explore Marketplace</span>
                </Link>

                <Link
                  to="/register"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 backdrop-blur-xs flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Sprout className="w-4 h-4 text-emerald-300" />
                  <span>Become a Seller</span>
                </Link>
              </div>

              {/* Metrics bar */}
              <div className="pt-6 border-t border-emerald-800/80 grid grid-cols-3 gap-4 text-left max-w-lg mx-auto lg:mx-0">
                <div>
                  <div className="text-2xl font-bold text-white">100%</div>
                  <div className="text-xs text-emerald-300">Verified Seeds & Inputs</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">0%</div>
                  <div className="text-xs text-emerald-300">Middleman Cuts</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">24/7</div>
                  <div className="text-xs text-emerald-300">AI Agronomist Advisory</div>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Highlight Card */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Hero Featured Card with real photography */}
                <div className="rounded-3xl overflow-hidden bg-white/10 p-2 backdrop-blur-md border border-white/15 shadow-2xl">
                  <div className="relative rounded-2xl overflow-hidden aspect-4/3">
                    <img
                      src="https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=1000&q=80"
                      alt="Modern agriculture farm field"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500 text-stone-900 text-xs font-bold mb-1.5">
                        <Award className="w-3.5 h-3.5" /> High Germination Certified
                      </div>
                      <h3 className="text-lg font-bold">Smart Precision Farming</h3>
                      <p className="text-xs text-emerald-200 mt-0.5">
                        Direct connection between Indian farming communities & direct buyers
                      </p>
                    </div>
                  </div>

                  {/* AI Quick Prompt Widget in Hero */}
                  <div className="p-4 bg-emerald-900/80 rounded-2xl mt-2 flex items-center justify-between border border-emerald-800">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-700 flex items-center justify-center text-emerald-200">
                        <Bot className="w-5 h-5 text-amber-300" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">Need Crop Guidance?</h4>
                        <p className="text-[11px] text-emerald-300">Ask soil prep, fertilizers & pest control</p>
                      </div>
                    </div>
                    <Link
                      to="/ai-assistant"
                      className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs flex items-center gap-1 transition-colors"
                    >
                      <span>Ask AI</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Categories Section */}
      <section className="py-16 bg-white border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1">
                Explore The Marketplace
              </p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
                Product Categories
              </h2>
            </div>
            <Link
              to="/marketplace"
              className="mt-3 md:mt-0 inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-emerald-700 hover:text-emerald-800 group"
            >
              <span>View all categories</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {CATEGORIES_LIST.map((cat) => (
              <button
                key={cat.name}
                onClick={() => handleCategoryClick(cat.name)}
                className="group p-5 rounded-2xl border border-stone-200/80 hover:border-emerald-500 bg-stone-50/50 hover:bg-emerald-50/40 text-left transition-all duration-300 hover:shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-white border border-stone-200 group-hover:border-emerald-300 group-hover:bg-emerald-700 group-hover:text-white text-emerald-700 flex items-center justify-center transition-colors shadow-2xs mb-4">
                    <Sprout className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-stone-900 group-hover:text-emerald-900 text-sm">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-stone-500 mt-1 line-clamp-2">
                    {cat.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-200/60 flex items-center justify-between text-xs font-semibold text-emerald-700">
                  <span>{cat.count}+ items</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-stone-400 group-hover:text-emerald-700" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-[#F0FDF4]/50 border-b border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <div className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-emerald-800 mb-1">
                <span>Direct From Farmers & Certified Suppliers</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
                Featured Agricultural Products
              </h2>
            </div>
            <Link
              to="/marketplace"
              className="mt-3 md:mt-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-800 text-white text-xs sm:text-sm font-semibold hover:bg-emerald-900 transition-colors shadow-xs"
            >
              <span>Explore All Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white border-b border-stone-100 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Simple 4-Step Process
            </span>
            <h2 className="text-3xl font-extrabold text-stone-900 mt-1 tracking-tight">
              How HarvestHub Works
            </h2>
            <p className="text-sm text-stone-600 mt-3 leading-relaxed">
              Transparent technology bringing growers and consumers into a friction-free marketplace.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Step 1 */}
            <div className="bg-stone-50/70 rounded-2xl p-6 border border-stone-200/70 text-center relative hover:shadow-sm transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white font-black text-lg flex items-center justify-center mx-auto mb-4 shadow-sm">
                1
              </div>
              <h3 className="text-base font-bold text-stone-900 mb-2">Register</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Create your verified profile in 60 seconds as either a Farmer, Seller, or Customer.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-stone-50/70 rounded-2xl p-6 border border-stone-200/70 text-center relative hover:shadow-sm transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white font-black text-lg flex items-center justify-center mx-auto mb-4 shadow-sm">
                2
              </div>
              <h3 className="text-base font-bold text-stone-900 mb-2">Browse Products</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Filter certified seeds, fertilizers, fresh harvests, and smart farm machinery by location and price.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-stone-50/70 rounded-2xl p-6 border border-stone-200/70 text-center relative hover:shadow-sm transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white font-black text-lg flex items-center justify-center mx-auto mb-4 shadow-sm">
                3
              </div>
              <h3 className="text-base font-bold text-stone-900 mb-2">Place Orders</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Seamless cart checkout with Cash on Delivery or digital payment simulation with live inventory validation.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-stone-50/70 rounded-2xl p-6 border border-stone-200/70 text-center relative hover:shadow-sm transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white font-black text-lg flex items-center justify-center mx-auto mb-4 shadow-sm">
                4
              </div>
              <h3 className="text-base font-bold text-stone-900 mb-2">Track Delivery</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Follow real-time status progression from PLACED to SHIPPED and DELIVERED right to your doorstep.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 bg-stone-50 border-b border-stone-200/80 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Transforming Rural Commerce
            </span>
            <h2 className="text-3xl font-extrabold text-stone-900 mt-1 tracking-tight">
              Why Choose HarvestHub
            </h2>
            <p className="text-sm text-stone-600 mt-3 leading-relaxed">
              Designed specifically to solve real supply-chain bottlenecks faced by Indian farmers and urban consumers alike.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Benefit 1 */}
            <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs hover:border-emerald-500/50 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-stone-900 mb-2">
                Direct Farmer-to-Customer Sales
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Growers sell directly without commission agent cartels, maximizing farm income and lowering consumer costs.
              </p>
            </div>

            {/* Benefit 2 */}
            <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs hover:border-emerald-500/50 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-stone-900 mb-2">
                Transparent Pricing
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Open market rate visibility and guaranteed fair pricing without hidden broker fees or unexpected deductions.
              </p>
            </div>

            {/* Benefit 3 */}
            <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs hover:border-emerald-500/50 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-stone-900 mb-2">
                Easy Product Discovery
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Precise search by category, seed variety, packaging size, location, and verified farmer accreditation.
              </p>
            </div>

            {/* Benefit 4 */}
            <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs hover:border-emerald-500/50 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-stone-900 mb-2">
                Agriculture Assistance
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Built-in AI Agronomist for immediate agronomic advice on fertilizer ratios, drip irrigation, and pest management.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to action banner */}
      <section className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-green-900 py-16 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-4">
            Ready to Transform Your Agricultural Commerce?
          </h2>
          <p className="text-sm sm:text-base text-emerald-100 max-w-xl mx-auto mb-8 leading-relaxed">
            Join thousands of cultivators, agronomists, and retail customers building a sustainable farm-to-table digital economy.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/register"
              className="px-8 py-3.5 rounded-xl bg-white text-emerald-900 font-bold text-sm shadow-md hover:bg-emerald-50 transition-all hover:scale-105"
            >
              Register Your Account Today
            </Link>
            <Link
              to="/ai-assistant"
              className="px-8 py-3.5 rounded-xl bg-emerald-700/80 border border-emerald-500/60 text-white font-semibold text-sm hover:bg-emerald-600 transition-all"
            >
              Try AI Agronomist Demo
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
