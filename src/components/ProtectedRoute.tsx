import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { ShieldAlert } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles 
}) => {
  const { currentUser, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-amber-200 p-8 max-w-md w-full text-center shadow-sm">
          <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h2 className="text-lg font-bold text-stone-900 mb-2">Access Restricted</h2>
          <p className="text-xs text-stone-600 mb-6 leading-relaxed">
            This module requires <span className="font-bold text-amber-800">{allowedRoles.join(' or ')}</span> authorization. You are currently logged in with the <span className="font-bold">{currentUser.role}</span> role.
          </p>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => window.history.back()}
              className="w-full py-2 px-4 rounded-xl text-xs font-semibold bg-stone-100 text-stone-700 hover:bg-stone-200 transition-colors"
            >
              Go Back
            </button>
            <Navigate to="/" />
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
