import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  Users, 
  Package, 
  ShoppingCart, 
  BarChart3, 
  Settings,
  Dumbbell,
  TrendingUp,
  AlertCircle,
  Calendar,
  UserPlus,
  DollarSign
} from 'lucide-react';
import AdminCustomers from './AdminCustomers';
import AdminProducts from './AdminProducts';
import AdminOrders from './AdminOrders';
import AdminReports from './AdminReports';
import AdminWorkoutPlans from './AdminWorkoutPlan';

const AdminDashboard: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const sidebarItems = [
    { path: '/admin', label: 'Dashboard', icon: <BarChart3 className="h-5 w-5" /> },
    { path: '/admin/customers', label: 'Customers', icon: <Users className="h-5 w-5" /> },
    { path: '/admin/products', label: 'Products', icon: <Package className="h-5 w-5" /> },
    { path: '/admin/orders', label: 'Orders', icon: <ShoppingCart className="h-5 w-5" /> },
    { path: '/admin/workout-plans', label: 'Workout Plans', icon: <Dumbbell className="h-5 w-5" /> },
    { path: '/admin/reports', label: 'Reports', icon: <TrendingUp className="h-5 w-5" /> },
    { path: '/admin/settings', label: 'Settings', icon: <Settings className="h-5 w-5" /> }
  ];

  const stats = [
    { 
      label: 'Total Members', 
      value: '1,247', 
      change: '+12%', 
      positive: true,
      icon: <Users className="h-6 w-6 text-blue-600" />
    },
    { 
      label: 'Monthly Revenue', 
      value: 'Rs. 2,45,000', 
      change: '+8%', 
      positive: true,
      icon: <DollarSign className="h-6 w-6 text-green-600" />
    },
    { 
      label: 'Active Plans', 
      value: '856', 
      change: '+15%', 
      positive: true,
      icon: <Calendar className="h-6 w-6 text-purple-600" />
    },
    { 
      label: 'New Signups', 
      value: '34', 
      change: '-5%', 
      positive: false,
      icon: <UserPlus className="h-6 w-6 text-orange-600" />
    }
  ];

  const recentOrders = [
    { id: '#12345', customer: 'John Silva', amount: 'Rs. 8,500', status: 'Delivered', time: '2 hours ago' },
    { id: '#12344', customer: 'Priya Fernando', amount: 'Rs. 3,200', status: 'Processing', time: '5 hours ago' },
    { id: '#12343', customer: 'Mike Perera', amount: 'Rs. 15,600', status: 'Pending', time: '1 day ago' }
  ];

  const lowStockAlerts = [
    { product: 'Whey Protein Isolate', stock: 5, category: 'Protein' },
    { product: 'Creatine Monohydrate', stock: 8, category: 'Supplements' },
    { product: 'Yoga Mat Premium', stock: 3, category: 'Accessories' }
  ];

  // Dashboard Overview Content
  const DashboardOverview = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className={`text-sm ${stat.positive ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change} from last month
                </p>
              </div>
              <div>{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
            <Link to="/admin/orders" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View All
            </Link>
          </div>
          
          <div className="space-y-3">
            {recentOrders.map((order, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{order.id}</p>
                  <p className="text-sm text-gray-600">{order.customer}</p>
                  <p className="text-xs text-gray-500">{order.time}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{order.amount}</p>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                    order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              Low Stock Alerts
            </h3>
            <Link to="/admin/products" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Manage Stock
            </Link>
          </div>
          
          <div className="space-y-3">
            {lowStockAlerts.map((alert, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{alert.product}</p>
                  <p className="text-sm text-gray-600">{alert.category}</p>
                </div>
                <div className="text-right">
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                    {alert.stock} left
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-gray-900">Admin Panel</h2>
            <p className="text-sm text-gray-600">GainsHub Management</p>
          </div>
          
          <nav className="p-4">
            <ul className="space-y-2">
              {sidebarItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      currentPath === item.path
                        ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {item.icon}
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <Routes>
            <Route index element={<DashboardOverview />} />
            <Route path="customers" element={<AdminCustomers />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="workout-plans" element={<AdminWorkoutPlans />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="settings" element={
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Settings</h2>
                <p className="text-gray-600">System settings and configuration options.</p>
              </div>
            } />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;