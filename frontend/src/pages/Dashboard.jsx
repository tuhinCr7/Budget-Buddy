import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <button 
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
          >
            Logout
          </button>
        </div>
        <p>Welcome, {user?.name}!</p>
        <p className="mt-4 text-gray-600">The full dashboard will be implemented in Phase 5.</p>
      </div>
    </div>
  );
};

export default Dashboard;

