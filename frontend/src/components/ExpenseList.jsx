import React from 'react';
import axiosClient from '../api/axiosClient';

const ExpenseList = ({ expenses, onEdit, onRefresh }) => {
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await axiosClient.delete(`/expenses/${id}`);
        onRefresh();
      } catch (error) {
        alert('Failed to delete expense.');
      }
    }
  };

  if (!expenses || expenses.length === 0) {
    return <div className="text-center p-6 text-gray-500">No expenses found for this period/category.</div>;
  }

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full leading-normal">
        <thead>
          <tr>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Date
            </th>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Category
            </th>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Description
            </th>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Amount
            </th>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => (
            <tr key={expense._id} className="hover:bg-gray-50">
              <td className="px-5 py-5 border-b border-gray-200 text-sm">
                {new Date(expense.date).toLocaleDateString()}
              </td>
              <td className="px-5 py-5 border-b border-gray-200 text-sm">
                <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                  <span aria-hidden className="absolute inset-0 bg-green-200 opacity-50 rounded-full"></span>
                  <span className="relative">{expense.category}</span>
                </span>
              </td>
              <td className="px-5 py-5 border-b border-gray-200 text-sm text-gray-900">
                {expense.description || '-'}
              </td>
              <td className="px-5 py-5 border-b border-gray-200 text-sm font-bold text-gray-900">
                ${expense.amount.toFixed(2)}
              </td>
              <td className="px-5 py-5 border-b border-gray-200 text-sm text-center">
                <button
                  onClick={() => onEdit(expense)}
                  className="text-blue-600 hover:text-blue-900 mx-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(expense._id)}
                  className="text-red-600 hover:text-red-900 mx-2"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExpenseList;

