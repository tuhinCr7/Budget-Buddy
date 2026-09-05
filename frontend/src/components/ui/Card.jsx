import React from 'react';

export const Card = ({ children, className = '' }) => (
  <div className={`bg-paper border border-line rounded-2xl shadow-sm overflow-hidden ${className}`}>
    {children}
  </div>
);

export const CardHeader = ({ title, subtitle, action, className = '' }) => (
  <div className={`px-6 py-5 border-b border-line flex justify-between items-center ${className}`}>
    <div>
      <h3 className="text-lg font-semibold text-ink leading-tight">{title}</h3>
      {subtitle && <p className="text-sm text-muted mt-1">{subtitle}</p>}
    </div>
    {action && <div>{action}</div>}
  </div>
);

export const CardContent = ({ children, className = '' }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);

