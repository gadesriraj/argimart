import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = 'Loading agricultural data...', 
  className = 'py-12' 
}) => {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mb-3" />
      {message && <p className="text-xs font-medium text-stone-500">{message}</p>}
    </div>
  );
};
