import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, Mail, Phone, MapPin, Heart, ShieldCheck, Truck, Headphones } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800">
      {/* Value pillars banner */}
      <div className="border-b border-stone-800 bg-stone-950/60 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-900/50 text-emerald-400 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Direct Farm Logistics</h4>
              <p className="text-xs text-stone-400">Straight from fields to your doorstep</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-900/50 text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Certified Genuine Quality</h4>
              <p className="text-xs text-stone-400">Seeds & fertilizers batch-tested</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-900/50 text-emerald-400 flex items-center justify-center shrink-0">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Fair Farmer Pricing</h4>
              <p className="text-xs text-stone-400">Zero middleman exploitation</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-900/50 text-emerald-400 flex items-center justify-center shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">AI Crop Agronomy Help</h4>
              <p className="text-xs text-stone-400">24/7 crop and pest advisory</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                <Sprout className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                Harvest<span className="text-emerald-500">Hub</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed text-stone-400 max-w-sm">
              HarvestHub is an integrated smart digital agriculture marketplace connecting farmers, customers, and farm input sellers. We empower cultivators with fair prices, transparent trading, certified agri inputs, and intelligent crop guidance.
            </p>
            <div className="pt-2 text-xs text-stone-400 space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>AgriTech Innovation Center, Sector 4, Hyderabad 500081</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>+91 1800-419-AGRI (24x7 Farmer Helpline)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>support@harvesthub.agri</span>
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Quick Links</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="hover:text-emerald-400 transition-colors">Home Page</Link>
              </li>
              <li>
                <Link to="/marketplace" className="hover:text-emerald-400 transition-colors">Agri Marketplace</Link>
              </li>
              <li>
                <Link to="/ai-assistant" className="hover:text-emerald-400 transition-colors">AI Crop Assistant</Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-emerald-400 transition-colors">View Cart</Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-emerald-400 transition-colors">Register as Seller</Link>
              </li>
            </ul>
          </div>

          {/* Farmer services */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Farmer Services</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/farmer/dashboard" className="hover:text-emerald-400 transition-colors">Seller Dashboard</Link>
              </li>
              <li>
                <Link to="/marketplace?category=Seeds" className="hover:text-emerald-400 transition-colors">Certified Seeds</Link>
              </li>
              <li>
                <Link to="/marketplace?category=Fertilizers" className="hover:text-emerald-400 transition-colors">Organic Fertilizers</Link>
              </li>
              <li>
                <Link to="/marketplace?category=Farm Equipment" className="hover:text-emerald-400 transition-colors">Drip & Spray Tools</Link>
              </li>
              <li>
                <Link to="/ai-assistant" className="hover:text-emerald-400 transition-colors">Soil & Pest Advisory</Link>
              </li>
            </ul>
          </div>

          {/* Customer support */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Customer Support</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/orders" className="hover:text-emerald-400 transition-colors">Order Tracking</Link>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-emerald-400 transition-colors">How It Works</a>
              </li>
              <li>
                <a href="#benefits" className="hover:text-emerald-400 transition-colors">Ecosystem Benefits</a>
              </li>
              <li>
                <span className="text-stone-500">Terms of Trading & Fair MSP</span>
              </li>
              <li>
                <span className="text-stone-500">Privacy & Data Policy</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-stone-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500">
          <p>© {new Date().getFullYear()} HarvestHub Agricultural Technologies Ltd. All rights reserved.</p>
          <p className="flex items-center gap-1 mt-2 sm:mt-0">
            Engineered for Sustainable Agriculture <Heart className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500" />
          </p>
        </div>
      </div>
    </footer>
  );
};
