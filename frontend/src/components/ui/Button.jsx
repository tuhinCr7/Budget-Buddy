import React from 'react';
import { Loader2 } from 'lucide-react';

export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  isLoading = false, 
  className = '', 
  disabled, 
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bottle-green disabled:opacity-50 disabled:pointer-events-none rounded-lg";
  
  const variants = {
    primary: "bg-bottle-green text-paper hover:bg-bottle-green-light active:scale-[0.98]",
    secondary: "bg-bottle-green-pale text-bottle-green hover:bg-bottle-green/10 active:scale-[0.98]",
    outline: "border border-line bg-transparent text-ink hover:bg-line/20 active:scale-[0.98]",
    danger: "bg-overspend-rust text-paper hover:bg-red-700 active:scale-[0.98]",
    ghost: "bg-transparent text-muted hover:text-ink hover:bg-line/10 active:scale-[0.98]"
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
};

