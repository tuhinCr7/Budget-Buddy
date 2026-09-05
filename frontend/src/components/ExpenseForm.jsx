import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

const ExpenseForm = ({ expenseToEdit, onSave, onCancel }) => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const categories = ['Food', 'Transport', 'Rent', 'Entertainment', 'Utilities', 'Other'];

  useEffect(() => {
    if (expenseToEdit) {
      setAmount(expenseToEdit.amount);
      setCategory(expenseToEdit.category);
      setDescription(expenseToEdit.description || '');
      // Format date for the input type="date"
      const d = new Date(expenseToEdit.date);
      setDate(d.toISOString().split('T')[0]);
    } else {
      setDate(new Date().toISOString().split('T')[0]);
    }
  }, [expenseToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const expenseData = { amount: Number(amount), category, description, date };

    try {
      if (expenseToEdit) {
        await axiosClient.put(`/expenses/${expenseToEdit._id}`, expenseData);
      } else {
        await axiosClient.post('/expenses', expenseData);
      }
      onSave(); // Trigger a refresh in the parent component
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save expense.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <h2 className="text-2xl font-bold mb-4">{expenseToEdit ? 'Edit Expense' : 'Add Expense'}</h2>
        
        {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Amount</label>
            <input
              type="number"
              step="0.01"
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Category</label>
            <select
              required
              className="shadow border rounded w-full py-2 px-3 text-gray-700 bg-white"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="" disabled>Select category</option>
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Date</label>
            <input
              type="date"
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">Description (Optional)</label>
            <input
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpenseForm;

