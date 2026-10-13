import React, { useState } from 'react';
import { 
  User as UserIcon, 
  Mail, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  Save, 
  CheckCircle2, 
  Calendar,
  Tractor,
  ShoppingBag
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const ProfilePage: React.FC = () => {
  const { currentUser, updateProfile } = useAuth();

  const [formData, setFormData] = useState({
    fullName: currentUser?.fullName || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    address: currentUser?.address || '',
  });

  const [savedNotice, setSavedNotice] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      fullName: formData.fullName,
      phone: formData.phone,
      address: formData.address,
    });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className="min-h-screen bg-stone-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Account Profile & Delivery Address
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Manage your personal credentials, contact phone, and dispatch location.
          </p>
        </div>

        {savedNotice && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-100 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span>Profile details updated successfully!</span>
          </div>
        )}

        <div className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-8 shadow-2xs space-y-6">
          {/* Top user summary pill */}
          <div className="flex items-center gap-4 pb-6 border-b border-stone-100">
            <div className="w-16 h-16 rounded-2xl bg-emerald-700 text-white font-extrabold text-2xl flex items-center justify-center shadow-xs">
              {currentUser?.fullName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-stone-900">{currentUser?.fullName}</h2>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {currentUser?.role}
                </span>
              </div>
              <p className="text-xs text-stone-400 mt-0.5 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>Member since {new Date(currentUser?.createdAt || '').toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</span>
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Full Name</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:border-emerald-600 outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Email (Registered ID)</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="email"
                  disabled
                  value={formData.email}
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-stone-100 border border-stone-200 rounded-xl text-stone-500 cursor-not-allowed outline-hidden"
                />
              </div>
              <span className="text-[10px] text-stone-400 mt-1 block">Email address cannot be modified once verified.</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Phone Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:border-emerald-600 outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                {currentUser?.role === 'FARMER' ? 'Farm / Dispatch Address' : 'Shipping & Delivery Address'}
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <textarea
                  rows={3}
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:border-emerald-600 outline-hidden resize-none"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Profile Changes</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
