import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Sprout, 
  ShoppingCart, 
  User as UserIcon, 
  Bot, 
  LogOut, 
  LayoutDashboard, 
  Menu, 
  X, 
  ChevronDown,
  ShieldCheck,
  Tractor,
  ShoppingBag
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { UserRole } from '../types';

export const Navbar: React.FC = () => {
  const { currentUser, isAuthenticated, logout, switchRoleQuickly } = useAuth();
  const { totalItemsCount } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [roleSwitcherOpen, setRoleSwitcherOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const handleRoleSwitch = (role: UserRole) => {
    switchRoleQuickly(role);
    setRoleSwitcherOpen(false);
    if (role === 'FARMER') navigate('/farmer/dashboard');
    else if (role === 'ADMIN') navigate('/admin/dashboard');
    else navigate('/customer/dashboard');
  };

  const getDashboardPath = () => {
    if (!currentUser) return '/login';
    switch (currentUser.role) {
      case 'FARMER': return '/farmer/dashboard';
      case 'ADMIN': return '/admin/dashboard';
      case 'CUSTOMER': return '/customer/dashboard';
      default: return '/';
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-xs">
      {/* Top micro bar for quick demo role switcher & announcement */}
      <div className="bg-emerald-900 text-emerald-100 text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-medium text-emerald-100 hidden sm:inline">HarvestHub Platform</span>
            <span className="text-emerald-400 font-normal">Direct Farm-to-Table & Precision Agriculture</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-emerald-300 text-[11px] hidden md:inline">Demo Switcher:</span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleRoleSwitch('FARMER')}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                  currentUser?.role === 'FARMER'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-emerald-800/80 hover:bg-emerald-700 text-emerald-200'
                }`}
                title="Switch to Farmer view"
              >
                Farmer
              </button>
              <button
                onClick={() => handleRoleSwitch('CUSTOMER')}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                  currentUser?.role === 'CUSTOMER'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-emerald-800/80 hover:bg-emerald-700 text-emerald-200'
                }`}
                title="Switch to Customer view"
              >
                Customer
              </button>
              <button
                onClick={() => handleRoleSwitch('ADMIN')}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                  currentUser?.role === 'ADMIN'
                    ? 'bg-amber-500 text-stone-900 font-bold'
                    : 'bg-emerald-800/80 hover:bg-emerald-700 text-emerald-200'
                }`}
                title="Switch to Admin view"
              >
                Admin
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-green-700 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
              <Sprout className="w-6 h-6 text-emerald-100" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-emerald-950 flex items-center gap-1">
                Harvest<span className="text-emerald-600">Hub</span>
              </span>
              <span className="block text-[10px] uppercase tracking-wider font-semibold text-emerald-700 -mt-1">
                Smart Agri Marketplace
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/') 
                  ? 'text-emerald-700 bg-emerald-50 font-semibold' 
                  : 'text-stone-700 hover:text-emerald-700 hover:bg-stone-50'
              }`}
            >
              Home
            </Link>
            <Link
              to="/marketplace"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/marketplace') 
                  ? 'text-emerald-700 bg-emerald-50 font-semibold' 
                  : 'text-stone-700 hover:text-emerald-700 hover:bg-stone-50'
              }`}
            >
              Marketplace
            </Link>
            <Link
              to="/ai-assistant"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                isActive('/ai-assistant') 
                  ? 'text-emerald-700 bg-emerald-50 font-semibold' 
                  : 'text-stone-700 hover:text-emerald-700 hover:bg-stone-50'
              }`}
            >
              <Bot className="w-4 h-4 text-emerald-600" />
              <span>AI Agronomist</span>
              <span className="text-[10px] px-1.5 py-0.2 bg-amber-100 text-amber-800 font-semibold rounded">
                Smart
              </span>
            </Link>
            <a
              href="#how-it-works"
              onClick={(e) => {
                if (location.pathname !== '/') {
                  e.preventDefault();
                  navigate('/#how-it-works');
                }
              }}
              className="px-3 py-2 rounded-lg text-sm font-medium text-stone-700 hover:text-emerald-700 hover:bg-stone-50 transition-colors"
            >
              How It Works
            </a>
            <a
              href="#benefits"
              onClick={(e) => {
                if (location.pathname !== '/') {
                  e.preventDefault();
                  navigate('/#benefits');
                }
              }}
              className="px-3 py-2 rounded-lg text-sm font-medium text-stone-700 hover:text-emerald-700 hover:bg-stone-50 transition-colors"
            >
              Benefits
            </a>
          </nav>

          {/* Right Actions: Cart, User Profile, Buttons */}
          <div className="flex items-center gap-3">
            {/* Shopping Cart button */}
            <Link
              to="/cart"
              className="relative p-2 rounded-xl text-stone-700 hover:text-emerald-700 hover:bg-emerald-50 transition-colors focus-visible:outline-hidden"
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-600 text-white text-[11px] font-bold rounded-full flex items-center justify-center shadow-xs animate-scale">
                  {totalItemsCount}
                </span>
              )}
            </Link>

            {/* Authenticated User Pill / Menu */}
            {isAuthenticated && currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-stone-200 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all text-left"
                >
                  <div className="w-7 h-7 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs font-bold">
                    {currentUser.fullName.charAt(0)}
                  </div>
                  <div className="hidden lg:block">
                    <span className="block text-xs font-semibold text-stone-900 truncate max-w-[110px]">
                      {currentUser.fullName.split(' ')[0]}
                    </span>
                    <span className="block text-[10px] text-emerald-700 font-medium uppercase tracking-wider">
                      {currentUser.role}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-stone-500" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-stone-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-1"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-stone-100">
                      <p className="text-xs font-semibold text-stone-900 truncate">{currentUser.fullName}</p>
                      <p className="text-[11px] text-stone-500 truncate">{currentUser.email}</p>
                      <div className="mt-1 flex items-center gap-1.5">
                        <span className="text-[10px] font-medium text-emerald-800">
                          Role: {currentUser.role}
                        </span>
                      </div>
                    </div>

                    <Link
                      to={getDashboardPath()}
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-stone-700 hover:bg-emerald-50 hover:text-emerald-800"
                    >
                      <LayoutDashboard className="w-4 h-4 text-emerald-600" />
                      <span>{currentUser.role === 'FARMER' ? 'Farmer Dashboard' : currentUser.role === 'ADMIN' ? 'Admin Dashboard' : 'Customer Dashboard'}</span>
                    </Link>

                    {currentUser.role === 'CUSTOMER' && (
                      <Link
                        to="/orders"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-stone-700 hover:bg-emerald-50 hover:text-emerald-800"
                      >
                        <ShoppingBag className="w-4 h-4 text-emerald-600" />
                        <span>My Order History</span>
                      </Link>
                    )}

                    <Link
                      to="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-stone-700 hover:bg-emerald-50 hover:text-emerald-800"
                    >
                      <UserIcon className="w-4 h-4 text-stone-500" />
                      <span>My Profile & Address</span>
                    </Link>

                    <div className="border-t border-stone-100 my-1"></div>

                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                        navigate('/login');
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 text-left"
                    >
                      <LogOut className="w-4 h-4 text-red-500" />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-xs sm:text-sm font-semibold text-emerald-800 hover:text-emerald-950 hover:bg-emerald-50 rounded-lg transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs transition-colors"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile hamburger button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 md:hidden text-stone-600 hover:text-stone-900 rounded-lg"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-emerald-100 bg-white px-4 pt-3 pb-6 space-y-2">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-stone-800 hover:bg-emerald-50"
          >
            Home
          </Link>
          <Link
            to="/marketplace"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-stone-800 hover:bg-emerald-50"
          >
            Marketplace
          </Link>
          <Link
            to="/ai-assistant"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-stone-800 hover:bg-emerald-50 flex items-center justify-between"
          >
            <span className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-emerald-600" /> AI Agronomist
            </span>
            <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold">Smart</span>
          </Link>
          {isAuthenticated && (
            <Link
              to={getDashboardPath()}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-emerald-700 bg-emerald-50"
            >
              Go to {currentUser?.role} Dashboard
            </Link>
          )}
          {!isAuthenticated && (
            <div className="pt-2 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 text-sm font-semibold text-emerald-800 border border-emerald-300 rounded-lg"
              >
                Log In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 text-sm font-semibold text-white bg-emerald-700 rounded-lg"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
