import React, { useState } from 'react';
import axiosClient from '../api/axiosClient';
import { useToast } from '../context/ToastContext';

const ExpenseList = ({ expenses, onRefresh, onOptimisticUpdate, onOptimisticDelete }) => {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [deletedIds, setDeletedIds] = useState([]);
  const undoTimers = React.useRef({});
  const { addToast } = useToast();

  const categories = ['Food', 'Transport', 'Rent', 'Entertainment', 'Utilities', 'Other'];

  const handleEditStart = (expense) => {
    setEditingId(expense._id);
    setEditForm({
      amount: expense.amount,
      category: expense.category,
      description: expense.description || '',
      date: new Date(expense.date).toISOString().split('T')[0]
    });
  };

  const handleEditSave = async () => {
    const prevExpense = expenses.find(e => e._id === editingId);
    const updatedExpense = {
      ...prevExpense,
      ...editForm,
      amount: Number(editForm.amount)
    };
    
    // Optimistic Update
    onOptimisticUpdate(updatedExpense);
    setEditingId(null);

    try {
      await axiosClient.put(`/expenses/${updatedExpense._id}`, updatedExpense);
      addToast('Expense updated');
    } catch (err) {
      addToast('Failed to save edits', 'error');
      onOptimisticUpdate(prevExpense); // Rollback
    }
  };

  const handleDeleteInitiate = (id) => {
    setDeletedIds(prev => [...prev, id]);

    const timer = setTimeout(async () => {
      // Optimistic Delete
      onOptimisticDelete(id);
      
      try {
        await axiosClient.delete(`/expenses/${id}`);
      } catch (err) {
        addToast('Failed to delete expense', 'error');
        // Rollback is trickier without saving the whole item, but for now we just remove from deletedIds
        // A full rollback would pass the item back to the parent.
        setDeletedIds(prev => prev.filter(dId => dId !== id));
      }
    }, 5000);

    undoTimers.current[id] = timer;
  };

  const handleUndoDelete = (id) => {
    clearTimeout(undoTimers.current[id]);
    delete undoTimers.current[id];
    setDeletedIds(prev => prev.filter(dId => dId !== id));
  };

  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });

  // Sorting Logic
  const sortedExpenses = [...expenses].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  if (!expenses || expenses.length === 0) {
    return (
      <div className="w-full h-48 flex flex-col items-center justify-center bg-line/5 border border-line border-dashed rounded-sm p-6 text-center animate-fade-in">
        <div className="w-12 h-12 mb-4 rounded-full bg-bottle-green-pale flex items-center justify-center text-bottle-green">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <h3 className="text-ink font-bold mb-1">Your ledger is empty</h3>
        <p className="text-ink/60 text-sm max-w-[250px]">
          No entries found matching this view. Record a new expense to start tracking.
        </p>
      </div>
    );
  }

  const renderSortIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? ' ↑' : ' ↓';
  };

  return (
    <div className="w-full">
      {/* Desktop Header Row */}
      <div className="hidden md:grid grid-cols-12 gap-4 pb-3 border-b border-line text-xs font-semibold uppercase tracking-widest text-ink/50 select-none">
        <div className="col-span-3 cursor-pointer hover:text-bottle-green" onClick={() => handleSort('date')}>
          Date{renderSortIndicator('date')}
        </div>
        <div className="col-span-3 cursor-pointer hover:text-bottle-green" onClick={() => handleSort('category')}>
          Category{renderSortIndicator('category')}
        </div>
        <div className="col-span-4">Description</div>
        <div className="col-span-2 text-right cursor-pointer hover:text-bottle-green" onClick={() => handleSort('amount')}>
          Amount{renderSortIndicator('amount')}
        </div>
      </div>

      {/* Mobile Sort Controls */}
      <div className="md:hidden flex gap-2 pb-4 mb-2 border-b border-line overflow-x-auto">
        <span className="text-xs font-semibold text-muted py-1">Sort:</span>
        <button onClick={() => handleSort('date')} className={`text-xs px-2 py-1 rounded-full ${sortConfig.key === 'date' ? 'bg-bottle-green text-paper' : 'bg-line/20'}`}>Date{renderSortIndicator('date')}</button>
        <button onClick={() => handleSort('amount')} className={`text-xs px-2 py-1 rounded-full ${sortConfig.key === 'amount' ? 'bg-bottle-green text-paper' : 'bg-line/20'}`}>Amount{renderSortIndicator('amount')}</button>
      </div>

      <div className="flex flex-col relative divide-y divide-line/50">
        {sortedExpenses.map((expense) => {
          const isDeleted = deletedIds.includes(expense._id);
          const isEditing = editingId === expense._id;

          if (isDeleted) {
            return (
              <div key={expense._id} className="flex md:grid md:grid-cols-12 justify-between md:gap-4 py-4 md:py-3 animate-fade-in bg-overspend-rust/10 items-center px-4 md:px-0">
                <div className="md:col-span-9 text-sm text-ink/70 italic">
                  Entry marked for deletion...
                </div>
                <div className="md:col-span-3 text-right">
                  <button onClick={() => handleUndoDelete(expense._id)} className="text-xs font-bold text-overspend-rust hover:underline">
                    Undo
                  </button>
                </div>
              </div>
            );
          }

          if (isEditing) {
            return (
              <div key={expense._id} className="flex flex-col md:grid md:grid-cols-12 gap-3 py-4 md:py-3 bg-bottle-green-pale -mx-2 px-4 md:px-2 items-center rounded-lg md:rounded-none my-2 md:my-0">
                <div className="w-full md:col-span-3">
                  <input type="date" className="w-full text-sm bg-transparent border-b border-line focus:border-bottle-green focus:bg-bottle-green-pale outline-none py-1" value={editForm.date} onChange={e => setEditForm({...editForm, date: e.target.value})} />
                </div>
                <div className="w-full md:col-span-3 flex items-center">
                  <select className="w-full text-sm bg-transparent border-b border-line focus:border-bottle-green focus:bg-bottle-green-pale outline-none py-1" value={editForm.category} onChange={e => setEditForm({...editForm, category: e.target.value})}>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="w-full md:col-span-4">
                  <input type="text" className="w-full text-sm bg-transparent border-b border-line focus:border-bottle-green focus:bg-bottle-green-pale outline-none py-1" value={editForm.description} onChange={e => setEditForm({...editForm, description: e.target.value})} placeholder="Description" />
                </div>
                <div className="w-full md:col-span-2 text-right">
                  <input type="number" step="0.01" className="w-full text-sm text-right font-mono-numbers bg-transparent border-b border-line focus:border-bottle-green focus:bg-bottle-green-pale outline-none py-1" value={editForm.amount} onChange={e => setEditForm({...editForm, amount: e.target.value})} />
                </div>
                <div className="w-full md:col-span-12 flex justify-end gap-3 mt-2 md:mt-0">
                  <button onClick={() => setEditingId(null)} className="text-xs font-semibold text-ink/60 hover:text-ink px-2 py-1">Cancel</button>
                  <button onClick={handleEditSave} className="text-xs font-semibold text-paper bg-ink px-4 py-1.5 rounded hover:bg-ink/80 transition-colors">Save</button>
                </div>
              </div>
            );
          }

          const categoryColors = {
            Food: 'bg-bottle-green text-paper',
            Transport: 'bg-bottle-green-light text-paper',
            Rent: 'bg-[#367A5E] text-paper',
            Entertainment: 'bg-[#4F9B78] text-paper',
            Utilities: 'bg-[#6FB593] text-paper',
            Other: 'bg-bottle-green-pale text-bottle-green'
          };

          // Normal Row
          return (
            <div 
              key={expense._id} 
              className="flex flex-col md:grid md:grid-cols-12 gap-2 md:gap-4 py-4 md:py-4 hover:bg-bottle-green-pale transition-colors group relative cursor-pointer animate-fade-in px-4 md:px-2 -mx-4 md:mx-0 rounded-lg md:rounded-none"
              onClick={() => handleEditStart(expense)}
            >
              {/* Mobile top row: Category & Amount */}
              <div className="flex justify-between items-start md:hidden w-full mb-1">
                <span className={`text-[10px] uppercase tracking-wide font-bold px-2 py-0.5 rounded-sm ${categoryColors[expense.category] || categoryColors.Other}`}>
                  {expense.category}
                </span>
                <span className="text-base font-bold font-mono-numbers">
                  ৳{expense.amount.toFixed(2)}
                </span>
              </div>

              {/* Desktop columns / Mobile bottom row */}
              <div className="md:col-span-3 text-sm text-muted hidden md:block">
                {new Date(expense.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
              
              <div className="md:col-span-3 hidden md:flex items-center">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-sm ${categoryColors[expense.category] || categoryColors.Other}`}>
                  {expense.category}
                </span>
              </div>
              
              <div className="md:col-span-4 text-sm text-ink truncate w-full flex justify-between md:block">
                <span>{expense.description || '—'}</span>
                <span className="text-xs text-muted md:hidden">
                  {new Date(expense.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>

              <div className="md:col-span-2 text-sm text-right font-mono-numbers font-semibold hidden md:block">
                ৳{expense.amount.toFixed(2)}
              </div>

              {/* Hover Actions (Delete) */}
              <div className="absolute right-4 md:right-0 top-1/2 -translate-y-1/2 flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={(e) => { e.stopPropagation(); handleDeleteInitiate(expense._id); }}
                  className="bg-paper border border-line text-overspend-rust text-xs font-bold px-3 py-1.5 shadow-md hover:bg-overspend-rust hover:text-paper transition-all rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ExpenseList;
