import React, { useState } from 'react';
import axiosClient from '../api/axiosClient';

const BudgetProgressBar = ({ currentSpend, userBudget, onBudgetUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newBudget, setNewBudget] = useState(userBudget || 0);
  const [isLoading, setIsLoading] = useState(false);

  const budget = userBudget || 0;
  const percentage = budget > 0 ? Math.min((currentSpend / budget) * 100, 100) : 0;
  
  let progressColor = 'bg-green-500';
  if (percentage >= 90) {
    progressColor = 'bg-red-500';
  } else if (percentage >= 75) {
    progressColor = 'bg-yellow-400';
  }

  const handleSaveBudget = async () => {
    setIsLoading(true);
    try {
      const res = await axiosClient.put('/user/budget', { monthlyBudget: Number(newBudget) });
      onBudgetUpdate(res.data.monthlyBudget);
      setIsEditing(false);
    } catch (error) {
      alert('Failed to update budget');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow mt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-800">Monthly Budget Goal</h3>
        {!isEditing ? (
          <button 
            onClick={() => setIsEditing(true)}
            className="text-blue-600 hover:underline text-sm font-semibold"
          >
            {budget === 0 ? 'Set Budget' : 'Edit Budget'}
          </button>
        ) : null}
      </div>

      {isEditing ? (
        <div className="flex gap-2 items-center mb-4">
          <input 
            type="number"
            className="border rounded px-3 py-1 w-32"
            value={newBudget}
            onChange={(e) => setNewBudget(e.target.value)}
          />
          <button 
            onClick={handleSaveBudget}
            disabled={isLoading}
            className="bg-blue-600 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : 'Save'}
          </button>
          <button 
            onClick={() => setIsEditing(false)}
            className="text-gray-500 text-sm"
          >
            Cancel
          </button>
        </div>
      ) : (
        <div className="mb-2 flex justify-between text-sm text-gray-600">
          <span>Spent: <strong className="text-gray-900">${currentSpend.toFixed(2)}</strong></span>
          <span>Budget: <strong className="text-gray-900">${budget.toFixed(2)}</strong></span>
        </div>
      )}

      {budget > 0 && !isEditing && (
        <div className="w-full bg-gray-200 rounded-full h-4 mb-1">
          <div 
            className={`h-4 rounded-full ${progressColor} transition-all duration-500`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      )}
      
      {budget > 0 && !isEditing && (
        <p className="text-right text-xs text-gray-500 mt-1">
          {percentage.toFixed(1)}% used
        </p>
      )}
    </div>
  );
};

export default BudgetProgressBar;

