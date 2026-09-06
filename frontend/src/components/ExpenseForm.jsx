import React, { useState } from 'react';
import axiosClient from '../api/axiosClient';

const ExpenseForm = ({ onSave, onCancel }) => {
  const [displayAmount, setDisplayAmount] = useState('');
  const [rawAmount, setRawAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const categories = [
    { name: 'Food', color: 'bg-bottle-green text-paper', icon: '🍔' },
    { name: 'Transport', color: 'bg-bottle-green-light text-paper', icon: '🚆' },
    { name: 'Rent', color: 'bg-[#367A5E] text-paper', icon: '🏠' },
    { name: 'Entertainment', color: 'bg-[#4F9B78] text-paper', icon: '🎬' },
    { name: 'Utilities', color: 'bg-[#6FB593] text-paper', icon: '💡' },
    { name: 'Other', color: 'bg-bottle-green-pale text-bottle-green', icon: '📦' }
  ];

  // Currency auto-formatter
  const handleAmountChange = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (!val) {
      setDisplayAmount('');
      setRawAmount('');
      return;
    }
    const num = parseInt(val, 10) / 100;
    setRawAmount(num);
    setDisplayAmount(num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!category) {
      setError('Please select a category');
      return;
    }
    if (!rawAmount || isNaN(Number(rawAmount))) {
      setError('Please enter a valid amount');
      return;
    }
    
    setIsLoading(true);
    setError('');

    const expenseData = { amount: Number(rawAmount), category, description, date };

    try {
      await onSave(expenseData);
      
      // Reset form but stay open
      setRawAmount('');
      setDisplayAmount('');
      setDescription('');
      // Toast notification is assumed to be called here or in parent
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add expense.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      {error && <div className="text-overspend-rust text-sm font-medium mb-4 bg-overspend-rust/10 p-3 rounded-md">{error}</div>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        
        {/* Amount */}
        <div>
          <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">Amount</label>
          <div className="relative">
            <span className="absolute left-0 top-2 text-muted font-mono-numbers text-3xl">৳</span>
            <input
              type="text"
              required
              className="w-full py-2 pl-8 pr-0 border-b border-line bg-transparent font-mono-numbers text-4xl text-ink focus:outline-none focus:border-bottle-green transition-colors"
              value={displayAmount}
              onChange={handleAmountChange}
              placeholder="0.00"
            />
          </div>
        </div>

        {/* Category Picker (Icon Buttons) */}
        <div>
          <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-3">Select Category</label>
          <div className="grid grid-cols-2 gap-3">
            {categories.map(c => (
              <button
                key={c.name}
                type="button"
                onClick={() => setCategory(c.name)}
                className={`flex items-center justify-start gap-3 px-4 py-3 rounded-xl border transition-all ${
                  category === c.name 
                  ? `${c.color} border-transparent shadow-sm scale-[1.02]` 
                  : 'bg-paper border-line text-ink hover:border-ink/50'
                }`}
              >
                <span className="text-xl">{c.icon}</span>
                <span className="text-sm font-semibold">{c.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Date */}
        <div>
          <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">Date</label>
          <input
            type="date"
            required
            className="w-full py-3 px-4 border border-line rounded-lg bg-transparent text-sm text-ink focus:outline-none focus:border-bottle-green focus:ring-1 focus:ring-bottle-green transition-colors"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">Description (Optional)</label>
          <input
            type="text"
            className="w-full py-3 px-4 border border-line rounded-lg bg-transparent text-sm text-ink focus:outline-none focus:border-bottle-green focus:ring-1 focus:ring-bottle-green transition-colors"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Groceries at Trader Joe's"
          />
        </div>

        <div className="flex justify-end pt-4 pb-4">
          <button
            type="submit"
            disabled={isLoading || !category || !rawAmount}
            className="w-full bg-bottle-green text-paper hover:bg-bottle-green-light active:scale-[0.98] font-bold py-4 px-6 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center text-lg shadow-md"
          >
            {isLoading ? <span className="w-5 h-5 border-2 border-paper border-t-transparent rounded-full animate-spin"></span> : 'Record Expense'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExpenseForm;
