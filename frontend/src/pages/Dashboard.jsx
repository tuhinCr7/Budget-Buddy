import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axiosClient from '../api/axiosClient';
import CategoryPieChart from '../components/CategoryPieChart';
import TrendChart from '../components/TrendChart';
import BudgetProgressBar from '../components/BudgetProgressBar';

const Dashboard = () => {
  const { user, setUser, logout } = useContext(AuthContext);
  const [summaryData, setSummaryData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await axiosClient.get('/expenses/summary');
        setSummaryData(res.data);
      } catch (error) {
        console.error('Failed to load summary', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSummary();
  }, []);

  const handleBudgetUpdate = (newBudget) => {
    setUser({ ...user, monthlyBudget: newBudget });
  };

  // Calculate current month's spending
  const currentMonthSpend = summaryData?.monthlySummary?.length > 0 
    ? summaryData.monthlySummary[summaryData.monthlySummary.length - 1].total 
    : 0;

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 bg-white p-6 rounded-lg shadow">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Hello, {user?.name}!</h1>
            <p className="text-gray-600 mt-1">Here is your financial overview.</p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-4">
            <Link to="/expenses" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow">
              Manage Expenses
            </Link>
            <button 
              onClick={logout}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
            >
              Logout
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {/* Top Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Total Spending Card */}
              <div className="bg-white p-6 rounded-lg shadow flex flex-col justify-center items-center">
                <h3 className="text-xl font-bold text-gray-700 mb-2">This Month's Spending</h3>
                <p className="text-5xl font-bold text-blue-600">${currentMonthSpend.toFixed(2)}</p>
              </div>

              {/* Budget Progress Card */}
              <div className="flex flex-col justify-center">
                <BudgetProgressBar 
                  currentSpend={currentMonthSpend} 
                  userBudget={user?.monthlyBudget} 
                  onBudgetUpdate={handleBudgetUpdate} 
                />
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">Spending by Category</h3>
                <CategoryPieChart data={summaryData?.categorySummary} />
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">6-Month Trend</h3>
                <TrendChart data={summaryData?.monthlySummary} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

