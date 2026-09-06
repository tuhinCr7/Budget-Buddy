import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { LogOut, Wallet } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  if (!user) return null;

  return (
    <nav className="sticky top-0 z-40 w-full bg-paper border-b border-line">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-bottle-green rounded-lg flex items-center justify-center text-paper group-hover:scale-105 transition-transform">
              <Wallet className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl text-ink tracking-tight group-hover:text-bottle-green transition-colors">BudgetBuddy</span>
          </Link>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3 pr-4 border-r border-line">
              <div className="w-8 h-8 rounded-full bg-bottle-green-pale flex items-center justify-center text-bottle-green font-bold text-sm">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <span className="text-sm font-semibold text-ink">{user.name}</span>
            </div>
            <button 
              onClick={logout}
              className="flex items-center gap-2 text-sm font-semibold text-muted hover:text-overspend-rust transition-colors focus:outline-none"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
