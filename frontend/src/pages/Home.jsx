import React, { useContext } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Wallet, TrendingUp, PieChart, ShieldCheck } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import ThemeToggle from '../components/ThemeToggle';

const Home = () => {
  const { user, loading } = useContext(AuthContext);

  if (!loading && user) {
    return <Navigate to="/dashboard" />;
  }
  return (
    <div className="min-h-screen bg-paper font-sans text-ink flex flex-col">
      {/* Navigation */}
      <nav className="w-full px-6 py-4 flex items-center justify-between border-b border-line bg-paper sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="bg-bottle-green text-paper p-1.5 rounded-lg">
            <Wallet className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-bottle-green">BudgetBuddy</span>
        </div>
        
        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8 font-semibold text-sm text-muted">
          <a href="#how-it-works" className="hover:text-ink transition-colors">How it Works</a>
          <a href="#features" className="hover:text-ink transition-colors">Features</a>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link to="/login" className="text-sm font-bold text-muted hover:text-ink transition-colors hidden sm:block">
            Login
          </Link>
          <Link to="/signup" className="text-sm font-bold bg-bottle-green text-paper px-4 py-2 rounded-full hover:bg-bottle-green-light transition-all active:scale-95 shadow-sm">
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20 lg:py-32 bg-gradient-to-b from-paper to-bottle-green-pale/30">
        <div className="max-w-3xl">
          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tighter text-ink mb-6 leading-tight">
            Master your money. <br/>
            <span className="text-bottle-green">Track every taka.</span>
          </h1>
          <p className="text-lg lg:text-xl text-muted font-medium mb-10 max-w-2xl mx-auto leading-relaxed">
            A tactile, precision-driven ledger for the modern age. Leave the spreadsheets behind without losing control of your financial future.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signup" className="w-full sm:w-auto bg-bottle-green text-paper px-8 py-4 rounded-full font-bold text-lg hover:bg-bottle-green-light transition-all shadow-md active:scale-95">
              Get Started for Free
            </Link>
            <Link to="/login" className="w-full sm:w-auto bg-transparent border-2 border-line text-ink px-8 py-4 rounded-full font-bold text-lg hover:bg-line/20 transition-all active:scale-95">
              Login to Account
            </Link>
          </div>
        </div>
      </header>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-24 px-6 bg-paper border-b border-line">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-ink mb-4">How it Works</h2>
            <p className="text-muted font-medium max-w-xl mx-auto">Get started in three simple steps.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full border-4 border-bottle-green flex items-center justify-center text-2xl font-bold text-bottle-green mb-6 bg-paper relative z-10">1</div>
              <h3 className="text-xl font-bold text-ink mb-3">Create an Account</h3>
              <p className="text-muted font-medium">Sign up in seconds and get instant access to your new digital ledger.</p>
            </div>
            {/* Step 2 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full border-4 border-bottle-green flex items-center justify-center text-2xl font-bold text-bottle-green mb-6 bg-paper relative z-10">2</div>
              <h3 className="text-xl font-bold text-ink mb-3">Set a Target</h3>
              <p className="text-muted font-medium">Define your monthly budget so you always know your remaining runway.</p>
            </div>
            {/* Step 3 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full border-4 border-bottle-green flex items-center justify-center text-2xl font-bold text-bottle-green mb-6 bg-paper relative z-10">3</div>
              <h3 className="text-xl font-bold text-ink mb-3">Log Expenses</h3>
              <p className="text-muted font-medium">Record every taka spent. We'll categorize and visualize it automatically.</p>
            </div>
            
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-8 left-[15%] right-[15%] h-[4px] bg-bottle-green-pale -z-0"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 bg-paper">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-ink mb-4">Powerful Features</h2>
            <p className="text-muted font-medium max-w-xl mx-auto">Everything you need to take control of your spending, packed into a blazing fast, intuitive interface.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Feature 1 */}
            <div className="bg-bottle-green-pale/50 p-8 rounded-[32px] border border-line hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-bottle-green text-paper rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                <Wallet className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-ink mb-3">Record Instantly</h3>
              <p className="text-muted font-medium leading-relaxed">
                Add expenses in seconds with our slide-over ledger. No page reloads, no waiting. Just type, hit enter, and you're done.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-bottle-green-pale/50 p-8 rounded-[32px] border border-line hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-bottle-green text-paper rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                <PieChart className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-ink mb-3">Visual Breakdowns</h3>
              <p className="text-muted font-medium leading-relaxed">
                Your data is automatically categorized and visualized. See exactly where your money goes with interactive, responsive charts.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-bottle-green-pale/50 p-8 rounded-[32px] border border-line hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-bottle-green text-paper rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-ink mb-3">Set Limits</h3>
              <p className="text-muted font-medium leading-relaxed">
                Define a monthly budget and track your remaining runway in real-time. We'll show you exactly how close you are to your limit.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-ink py-12 px-6 text-center border-t-8 border-bottle-green">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Wallet className="w-5 h-5 text-paper" />
          <span className="font-extrabold tracking-tight text-paper text-lg">BudgetBuddy</span>
        </div>
        <p className="text-paper/60 text-sm font-medium">
          © {new Date().getFullYear()} BudgetBuddy System. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Home;
