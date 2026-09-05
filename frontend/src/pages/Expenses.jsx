import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import ExpenseList from '../components/ExpenseList';
import ExpenseForm from '../components/ExpenseForm';
import { Link } from 'react-router-dom';

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modal state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState(null);

  // Filters state
  const [categoryFilter, setCategoryFilter] = useState('');
  const [startDateFilter, setStartDateFilter] = useState('');
  const [endDateFilter, setEndDateFilter] = useState('');

  const categories = ['Food', 'Transport', 'Rent', 'Entertainment', 'Utilities', 'Other'];

  const fetchExpenses = async () => {
    setIsLoading(true);
    try {
      // Build query string
      const params = new URLSearchParams();
      if (categoryFilter) params.append('category', categoryFilter);
      if (startDateFilter) params.append('startDate', startDateFilter);
      if (endDateFilter) params.append('endDate', endDateFilter);

      const res = await axiosClient.get(`/expenses?${params.toString()}`);
      setExpenses(res.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch expenses');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [categoryFilter, startDateFilter, endDateFilter]);

  const handleOpenForm = (expense = null) => {
    setExpenseToEdit(expense);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setExpenseToEdit(null);
  };

  const handleSave = () => {
    handleCloseForm();
    fetchExpenses();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Expenses</h1>
            <Link to="/" className="text-blue-600 hover:underline text-sm">&larr; Back to Dashboard</Link>
          </div>
          <button
            onClick={() => handleOpenForm()}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded shadow"
          >
            + Add Expense
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow mb-6 flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Category</label>
            <select
              className="border rounded py-2 px-3 text-gray-700"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Start Date</label>
            <input
              type="date"
              className="border rounded py-2 px-3 text-gray-700"
              value={startDateFilter}
              onChange={(e) => setStartDateFilter(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">End Date</label>
            <input
              type="date"
              className="border rounded py-2 px-3 text-gray-700"
              value={endDateFilter}
              onChange={(e) => setEndDateFilter(e.target.value)}
            />
          </div>
          <div className="ml-auto">
            <button 
              onClick={() => {
                setCategoryFilter('');
                setStartDateFilter('');
                setEndDateFilter('');
              }}
              className="text-gray-500 hover:text-gray-800 underline text-sm"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {error && <div className="bg-red-100 text-red-700 p-4 rounded mb-4">{error}</div>}

        {isLoading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <ExpenseList 
            expenses={expenses} 
            onEdit={handleOpenForm} 
            onRefresh={fetchExpenses} 
          />
        )}
      </div>

      {isFormOpen && (
        <ExpenseForm 
          expenseToEdit={expenseToEdit} 
          onSave={handleSave} 
          onCancel={handleCloseForm} 
        />
      )}
    </div>
  );
};

export default Expenses;

