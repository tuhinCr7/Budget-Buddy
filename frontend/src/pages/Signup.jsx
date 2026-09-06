import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { Wallet, Home as HomeIcon } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Signup = () => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [emailError, setEmailError] = useState('');
  const [serverError, setServerError] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const { signup, user } = useContext(AuthContext);
  const navigate = useNavigate();

  if (user) {
    return <Navigate to="/dashboard" />;
  }

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
      await signup(name, email, password);
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 600);
    } catch (err) {
      setServerError(err.response?.data?.message || 'Failed to sign up.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bottle-green flex items-center justify-center font-sans overflow-hidden p-4 sm:p-8">
      {/* Mobile-app style container */}
      <div className="w-full max-w-[400px] h-[800px] max-h-full bg-paper rounded-[40px] shadow-2xl relative flex flex-col overflow-hidden animate-fade-in border-4 border-ink/5">
        
        {/* Top Section - Image / Graphic */}
        <div className="relative h-[55%] w-full bg-gradient-to-br from-bottle-green-light to-bottle-green overflow-hidden flex flex-col items-center justify-center">
          
          {/* Back/Home Button */}
          <Link to="/" className="absolute top-6 left-6 z-40 w-10 h-10 rounded-full bg-paper/10 hover:bg-paper/20 flex items-center justify-center text-paper backdrop-blur transition-all active:scale-90">
            <HomeIcon className="w-5 h-5" />
          </Link>

          {/* Logo at the very top */}
          <div className="absolute top-8 left-0 w-full flex justify-center items-center gap-2 z-30 pointer-events-none">
            <Wallet className="w-6 h-6 text-paper" />
            <span className="text-paper font-extrabold text-xl tracking-tight">BudgetBuddy</span>
          </div>

          {/* Decorative shapes */}
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-paper/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-paper/10 rounded-full blur-3xl"></div>
          
          <div className="z-10 flex flex-col items-center mt-8">
             <div className="w-24 h-24 mb-4 rounded-2xl bg-paper/20 backdrop-blur flex items-center justify-center border border-paper/30 shadow-lg">
                <svg className="w-12 h-12 text-paper" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
             </div>
          </div>

          <button className="absolute top-6 right-6 text-paper/80 font-semibold text-sm hover:text-paper z-20">
            Skip
          </button>
        </div>

        {/* Bottom Section - Controls */}
        <div className="flex-1 bg-paper relative">
          
          {step === 1 ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center px-8 animate-fade-in">
              <h1 className="text-3xl font-extrabold text-ink mb-2">Sign Up</h1>
              <p className="text-muted text-sm font-medium mb-10">The start to a better budget</p>
              
              <button 
                className="w-full bg-bottle-green text-paper py-4 rounded-full font-bold shadow-md hover:bg-bottle-green-light transition-all active:scale-95 flex justify-center items-center gap-2 mb-4"
              >
                Welcome in with Google
              </button>
              
              <button 
                onClick={() => setStep(2)}
                className="w-full bg-transparent border-2 border-line text-ink py-4 rounded-full font-bold hover:bg-line/20 transition-all active:scale-95 mb-8"
              >
                Start with email
              </button>

              <p className="text-muted font-medium text-sm">
                Joined us before?{' '}
                <Link to="/login" className="text-bottle-green font-bold hover:underline">
                  Login
                </Link>
              </p>
            </div>
          ) : (
            <div className="absolute inset-0 flex flex-col px-8 pt-8 animate-fade-in overflow-y-auto pb-8">
              <button 
                onClick={() => setStep(1)}
                className="self-start text-muted hover:text-ink mb-4 font-semibold text-sm flex items-center gap-1"
              >
                ← Back
              </button>

              <h2 className="text-2xl font-extrabold text-ink mb-6">Email Sign Up</h2>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full py-4 px-5 bg-bottle-green-pale rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-bottle-green text-ink placeholder:text-muted"
                    placeholder="Full Name"
                    required
                  />
                </div>
                <div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full py-4 px-5 bg-bottle-green-pale rounded-xl border-none focus:outline-none focus:ring-2 text-ink placeholder:text-muted ${emailError ? 'focus:ring-overspend-rust' : 'focus:ring-bottle-green'}`}
                    placeholder="Email Address"
                    required
                  />
                </div>
                <div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full py-4 px-5 bg-bottle-green-pale rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-bottle-green text-ink placeholder:text-muted"
                    placeholder="Password"
                    required
                  />
                  {serverError && (
                    <div className="mt-2 text-overspend-rust text-xs font-bold px-1">
                      {serverError}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading || isSuccess}
                  className={`mt-6 w-full py-4 rounded-full font-bold transition-all flex justify-center items-center shadow-md
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signup;
