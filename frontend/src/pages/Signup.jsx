import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [emailError, setEmailError] = useState('');
  const [serverError, setServerError] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();

  // Validate Email
  useEffect(() => {
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Invalid email format');
    } else {
      setEmailError('');
    }
  }, [email]);

  // Password Strength Logic
  const getPasswordStrength = (pw) => {
    if (!pw) return 0;
    let score = 0;
    if (pw.length >= 6) score += 1;
    if (pw.length >= 10) score += 1;
    if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score += 1;
    if (/[0-9]/.test(pw)) score += 1;
    if (/[^a-zA-Z0-9]/.test(pw)) score += 1;
    return Math.min(score, 4); // Max 4
  };

  const strength = getPasswordStrength(password);
  
  const getStrengthColor = () => {
    if (strength === 0) return 'bg-line';
    if (strength <= 1) return 'bg-overspend-rust'; // Weak
    if (strength <= 2) return 'bg-bottle-green-light';    // Medium
    return 'bg-bottle-green';                      // Strong
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (emailError) return;
    
    setServerError('');
    setIsLoading(true);
    
    try {
      await signup(name, email, password);
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 600);
    } catch (err) {
      setServerError(err.response?.data?.message || 'Failed to sign up.');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-paper font-sans">
      
      {/* LEFT: Branding Split Screen */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-bottle-green p-12 text-paper relative overflow-hidden">
        {/* Subtle decorative background element */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-paper/5 rounded-full blur-3xl -mr-48 -mt-48 pointer-events-none"></div>
        
        <div className="relative z-10">
          <h1 className="text-3xl font-extrabold tracking-tighter">BudgetBuddy</h1>
        </div>
        
        <div className="max-w-md relative z-10">
          <h2 className="text-5xl font-bold leading-tight mb-6 tracking-tight">Master your money.<br/>Track every dollar.</h2>
          <p className="text-paper/80 text-lg font-medium leading-relaxed">
            A tactile, precision-driven ledger for the modern age. Leave the spreadsheets behind without losing control.
          </p>
        </div>
        
        <div className="text-paper/60 font-mono-numbers text-sm relative z-10">
          © {new Date().getFullYear()} BudgetBuddy System
        </div>
      </div>

      {/* RIGHT: Form Container */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md bg-paper border border-line shadow-md p-8 sm:p-10 rounded-2xl relative">
          
          {/* Mobile Heading */}
          <div className="mb-8 lg:hidden text-center">
            <h1 className="text-4xl font-extrabold tracking-tighter text-bottle-green">BudgetBuddy</h1>
          </div>
          
          <h2 className="text-3xl font-bold text-ink mb-2 tracking-tight">Create Account</h2>
          <p className="text-muted text-sm font-medium mb-8">Start tracking your ledger today.</p>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-5 animate-fade-in">
            

            {/* NAME */}
            <div>
              <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1.5" htmlFor="name">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full py-2.5 px-3 border border-line bg-transparent focus:outline-none focus:border-bottle-green focus:bg-bottle-green-pale focus:ring-1 focus:ring-bottle-green transition-colors text-ink placeholder:text-ink/30"
                placeholder="Jane Doe"
                required
              />
            </div>

            {/* EMAIL */}
            <div>
              <div className="flex justify-between items-baseline mb-1.5">
                <label className="block text-xs font-bold text-muted uppercase tracking-wider" htmlFor="email">
                  Email
                </label>
                {emailError && <span className="text-overspend-rust text-xs font-bold">{emailError}</span>}
              </div>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full py-2.5 px-3 border bg-transparent focus:outline-none focus:ring-1 transition-colors text-ink placeholder:text-ink/30 
                  ${emailError ? 'border-overspend-rust focus:border-overspend-rust focus:ring-overspend-rust' : 'border-line focus:border-bottle-green focus:bg-bottle-green-pale focus:ring-bottle-green'}`}
                placeholder="jane@example.com"
                required
              />
            </div>
            
            {/* PASSWORD */}
            <div>
              <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1.5" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full py-2.5 px-3 border border-line bg-transparent focus:outline-none focus:border-bottle-green focus:bg-bottle-green-pale focus:ring-1 focus:ring-bottle-green transition-colors text-ink placeholder:text-ink/30"
                placeholder="••••••••"
                required
              />
              
              {/* Password Strength Meter */}
              <div className="mt-2 h-1.5 w-full bg-line/40 overflow-hidden flex">
                <div 
                  className={`h-full transition-all duration-300 ease-out ${getStrengthColor()}`} 
                  style={{ width: `${(strength / 4) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted/60">Strength</p>
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted/60">
                  {strength === 0 && ''}
                  {strength === 1 && 'Weak'}
                  {strength === 2 && 'Fair'}
                  {strength === 3 && 'Good'}
                  {strength === 4 && 'Strong'}
                </p>
              </div>

              {serverError && (
                <div className="mt-2 text-overspend-rust text-xs font-bold animate-fade-in">
                  {serverError}
                </div>
              )}
            </div>
            
            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={isLoading || isSuccess}
              className={`mt-4 w-full py-3.5 px-4 font-bold transition-all flex justify-center items-center shadow-sm
                ${isSuccess ? 'animate-success-pop bg-bottle-green text-paper' : 'bg-bottle-green text-paper hover:bg-bottle-green-light active:scale-[0.98]'} 
                disabled:opacity-70 disabled:cursor-not-allowed`}
            >
              {isLoading ? (
                <span className="w-5 h-5 border-2 border-paper border-t-transparent rounded-full animate-spin"></span>
              ) : isSuccess ? (
                'Account Created'
              ) : (
                'Create Account'
              )}
            </button>
          </form>
          
          <div className="mt-8 text-center pt-6">
            <p className="text-muted font-medium text-sm">
              Returning to the ledger?{' '}
              <Link to="/login" className="text-bottle-green font-bold hover:underline underline-offset-2 transition-all">
                Log in
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Signup;
