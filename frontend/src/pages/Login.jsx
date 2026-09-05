import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [emailError, setEmailError] = useState('');
  const [serverError, setServerError] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // Validate Email
  useEffect(() => {
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Invalid email format');
    } else {
      setEmailError('');
    }
  }, [email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (emailError) return;
    
    setServerError('');
    setIsLoading(true);
    
    try {
      await login(email, password);
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 600);
    } catch (err) {
      setServerError(err.response?.data?.message || 'Invalid credentials.');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-paper font-sans">
      
      {/* LEFT: Branding Split Screen */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-bottle-green p-12 text-paper relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-paper/5 rounded-full blur-3xl -mr-48 -mt-48 pointer-events-none"></div>
        
        <div className="relative z-10">
          <h1 className="text-3xl font-extrabold tracking-tighter">BudgetBuddy</h1>
        </div>
        
        <div className="max-w-md relative z-10">
          <h2 className="text-5xl font-bold leading-tight mb-6 tracking-tight">Access your<br/>financial ledger.</h2>
          <p className="text-paper/80 text-lg font-medium leading-relaxed">
            Welcome back. All your entries, charts, and budget limits are securely synced and ready.
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
          
          <h2 className="text-3xl font-bold text-ink mb-2 tracking-tight">Log In</h2>
          <p className="text-muted text-sm font-medium mb-8">Enter your credentials to continue.</p>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-5 animate-fade-in">
            

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
                'Verified'
              ) : (
                'Log In'
              )}
            </button>
          </form>
          
          <div className="mt-8 text-center pt-6">
            <p className="text-muted font-medium text-sm">
              New to BudgetBuddy?{' '}
              <Link to="/signup" className="text-bottle-green font-bold hover:underline underline-offset-2 transition-all">
                Start a ledger
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;
