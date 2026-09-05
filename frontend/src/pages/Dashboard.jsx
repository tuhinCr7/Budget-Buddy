import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import axiosClient from '../api/axiosClient';

import Layout from '../components/layout/Layout';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Drawer } from '../components/ui/Drawer';

import CategoryPieChart from '../components/CategoryPieChart';
import TrendChart from '../components/TrendChart';
import BudgetProgressBar from '../components/BudgetProgressBar';
import ExpenseList from '../components/ExpenseList';
import ExpenseForm from '../components/ExpenseForm';

import { Plus } from 'lucide-react';

const Dashboard = () => {
  const { user, setUser } = useContext(AuthContext);
  const { addToast } = useToast();
  
  const [summaryData, setSummaryData] = useState(null);
  const [allExpenses, setAllExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filteredExpenses, setFilteredExpenses] = useState([]);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [summaryRes, expensesRes] = await Promise.all([
        axiosClient.get('/expenses/summary'),
        axiosClient.get('/expenses')
      ]);
      setSummaryData(summaryRes.data);
      setAllExpenses(expensesRes.data);
    } catch (error) {
      console.error('Failed to load data', error);
      addToast('Failed to load dashboard data', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      setFilteredExpenses(allExpenses.filter(e => e.category === selectedCategory));
    } else {
      setFilteredExpenses(allExpenses);
    }
  }, [allExpenses, selectedCategory]);

  const handleBudgetUpdate = (newBudget) => {
    setUser({ ...user, monthlyBudget: newBudget });
  };

  const handleSaveExpense = async (expenseData) => {
    const tempId = Date.now().toString();
    const optimisticExpense = { ...expenseData, _id: tempId };
    
    setAllExpenses([optimisticExpense, ...allExpenses]);
    setIsDrawerOpen(false);

    try {
      const res = await axiosClient.post('/expenses', expenseData);
      setAllExpenses(prev => prev.map(e => e._id === tempId ? res.data : e));
      addToast('Expense recorded successfully');
      axiosClient.get('/expenses/summary').then(res => setSummaryData(res.data));
    } catch (err) {
      setAllExpenses(prev => prev.filter(e => e._id !== tempId));
      addToast('Failed to record expense', 'error');
      throw err; 
    }
  };

  const handleOptimisticUpdate = (updatedExpense) => {
    setAllExpenses(prev => prev.map(e => e._id === updatedExpense._id ? updatedExpense : e));
    axiosClient.get('/expenses/summary').then(res => setSummaryData(res.data)); // Background refresh for charts
  };

  const handleOptimisticDelete = (idToDelete) => {
    setAllExpenses(prev => prev.filter(e => e._id !== idToDelete));
    axiosClient.get('/expenses/summary').then(res => setSummaryData(res.data)); // Background refresh for charts
  };

  const currentMonthSpend = summaryData?.monthlySummary?.length > 0 
    ? summaryData.monthlySummary[summaryData.monthlySummary.length - 1].total 
    : 0;
  
  const budget = user?.monthlyBudget || 0;
  const remaining = budget - currentMonthSpend;

  if (isLoading && !summaryData) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="w-8 h-8 border-4 border-bottle-green border-t-transparent rounded-full animate-spin"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-ink">Dashboard</h1>
          <p className="text-muted mt-1">Track your spending and manage your budget.</p>
        </div>
        <Button onClick={() => setIsDrawerOpen(true)} className="w-full md:w-auto shrink-0 shadow-sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Expense
        </Button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="py-5">
            <p className="text-sm font-semibold text-muted uppercase tracking-wider mb-1">Total Spent</p>
            <p className="text-3xl font-bold text-ink font-mono-numbers">${currentMonthSpend.toFixed(2)}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="py-5 flex justify-between items-start">
            <div>
              <p className="text-sm font-semibold text-muted uppercase tracking-wider mb-1">Monthly Budget</p>
              <p className="text-3xl font-bold text-ink font-mono-numbers">${budget.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>

        <Card className={remaining < 0 ? 'bg-overspend-rust/10 border-overspend-rust/30' : ''}>
          <CardContent className="py-5">
            <p className="text-sm font-semibold text-muted uppercase tracking-wider mb-1">Remaining</p>
            <p className={`text-3xl font-bold font-mono-numbers ${remaining < 0 ? 'text-overspend-rust' : 'text-bottle-green'}`}>
              ${Math.abs(remaining).toFixed(2)} {remaining < 0 && 'Over'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bar (Hero element) */}
      <div className="mb-8">
        <BudgetProgressBar 
          currentSpend={currentMonthSpend} 
          userBudget={budget} 
          onBudgetUpdate={handleBudgetUpdate} 
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        <Card className="lg:col-span-8">
          <CardHeader title="Spending Trends" subtitle="Your expense history over time." />
          <CardContent>
            <TrendChart data={summaryData?.monthlySummary} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-4">
          <CardHeader title="By Category" subtitle="Breakdown of this month's spending." />
          <CardContent>
            <CategoryPieChart 
              data={summaryData?.categorySummary} 
              selectedCategory={selectedCategory}
              onCategoryClick={setSelectedCategory}
            />
          </CardContent>
        </Card>
      </div>

      {/* Ledger */}
      <Card className="mb-12">
        <CardHeader 
          title="Recent Transactions" 
          subtitle={selectedCategory ? `Showing ${selectedCategory} expenses` : "All your latest entries"}
        />
        <div className="p-0 sm:p-6 sm:pt-0">
          <ExpenseList 
            expenses={filteredExpenses} 
            onOptimisticUpdate={handleOptimisticUpdate}
            onOptimisticDelete={handleOptimisticDelete}
          />
        </div>
      </Card>

      {/* Slide-over Drawer for Add Expense */}
      <Drawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)}
        title="Record Expense"
      >
        <ExpenseForm 
          onSave={handleSaveExpense} 
          onCancel={() => setIsDrawerOpen(false)} 
        />
      </Drawer>

    </Layout>
  );
};

export default Dashboard;
