import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export const Drawer = ({ isOpen, onClose, title, children }) => {
  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-ink/30 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Slide-over panel */}
      <div className="absolute inset-y-0 right-0 max-w-md w-full flex">
        <div className="w-full h-full flex flex-col bg-paper shadow-2xl animate-slide-left border-l border-line">
          {/* Header */}
          <div className="px-6 py-5 border-b border-line flex items-center justify-between">
            <h2 className="text-xl font-bold text-ink">{title}</h2>
            <button 
              onClick={onClose}
              className="p-2 rounded-full text-muted hover:text-ink hover:bg-line/20 transition-colors focus:outline-none focus:ring-2 focus:ring-bottle-green"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

