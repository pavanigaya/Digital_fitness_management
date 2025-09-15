import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import CustomerDashboard from '../../pages/customer/DashboardPage';
import AdminDashboard from '../../pages/admin/AdminDashboard';
import TrainerDashboard from '../../pages/trainer/TrainerDashboard';

const RoleBasedDashboard: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Route users to appropriate dashboard based on their role
  switch (user.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'trainer':
      return <TrainerDashboard />;
    case 'customer':
    default:
      return <CustomerDashboard />;
  }
};

export default RoleBasedDashboard;
