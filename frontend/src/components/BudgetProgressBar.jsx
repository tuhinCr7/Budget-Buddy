import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { useToast } from '../context/ToastContext';

const BudgetProgressBar = ({ currentSpend, userBudget, onBudgetUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newBudget, setNewBudget] = useState(userBudget || 0);
  const [isLoading, setIsLoading] = useState(false);
  const [animatedWidth, setAnimatedWidth] = useState(0);
  const { addToast } = useToast();

  const budget = userBudget || 0;
  const percentage = budget > 0 ? Math.min((currentSpend / budget) * 100, 100) : 0;
  
  let progressColor = 'bg-bottle-green';
  if (percentage >= 100) {
    progressColor = 'bg-overspend-rust';
  }

  // Animation on mount
  useEffect(() => {
    const timer = setTimeout(() => setAnimatedWidth(percentage), 100);
    return () => clearTimeout(timer);
  }, [percentage]);

  useEffect(() => {
    setNewBudget(userBudget || 0);
  }, [userBudget]);

  const handleSaveBudget = async () => {
    setIsLoading(true);
    try {
      const res = await axiosClient.put('/user/budget', { monthlyBudget: Number(newBudget) });
      onBudgetUpdate(res.data.monthlyBudget);
      addToast('Budget updated successfully');
      setIsEditing(false);
    } catch (err) {
      addToast('Failed to update budget', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full py-8 border-b border-line mb-8">
      <div className="flex justify-between items-end mb-2">
        <div>
          <h2 className="text-xl font-bold text-ink">Monthly Budget Status</h2>
          <div className="text-sm text-ink/60 flex items-center gap-2 mt-1">
            {isEditing ? (
              <div className="flex items-center gap-2">
                <span className="font-mono-numbers">$</span>
                <input 
                  type="number"
                  className="border-b border-line bg-transparent focus:outline-none focus:border-ink w-24 font-mono-numbers text-ink"
                  value={newBudget}
                  onChange={(e) => setNewBudget(e.target.value)}
                  autoFocus
                />
                <button onClick={handleSaveBudget} disabled={isLoading} className="text-bottle-green font-semibold hover:underline">
                  {isLoading ? '...' : 'Save'}
                </button>
                <button onClick={() => setIsEditing(false)} className="text-ink/60 hover:underline">Cancel</button>
              </div>
            ) : (
              <>
                Target: <span className="font-mono-numbers">${budget.toFixed(2)}</span>
                <button onClick={() => setIsEditing(true)} className="text-ink hover:text-bottle-green underline decoration-line underline-offset-4 ml-2">Edit</button>
              </>
            )}
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-4xl font-bold font-mono-numbers tracking-tight text-ink">
            ${currentSpend.toFixed(2)}
          </div>
          <div className="text-sm text-ink/60 mt-1 uppercase tracking-widest text-xs font-semibold">
            Spent
          </div>
        </div>
      </div>

      {budget > 0 && (
        <div className="w-full h-8 bg-line/20 mt-4 relative overflow-hidden group">
          <div 
            className={`h-full ${progressColor} transition-all duration-1000 ease-out`}
            style={{ width: `${animatedWidth}%` }}
          />
          {/* Exact marker */}
          <div className="absolute inset-0 flex items-center justify-between px-2 text-xs font-mono-numbers opacity-0 group-hover:opacity-100 transition-opacity mix-blend-difference text-paper pointer-events-none">
            <span>0%</span>
            <span>{percentage.toFixed(1)}% used</span>
          </div>
        </div>
      )}
      
      {budget === 0 && !isEditing && (
        <div className="w-full p-4 border border-line bg-line/10 mt-4 text-center text-sm font-medium text-ink/70">
          Set a monthly budget to unlock progress tracking.
        </div>
      )}
    </div>
  );
};

export default BudgetProgressBar;
