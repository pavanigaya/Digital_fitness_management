import React, { useState } from 'react';
import { Download, Calendar, TrendingUp, Users, ShoppingCart, DollarSign } from 'lucide-react';

const AdminReports: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedReport, setSelectedReport] = useState('sales');

  const reportTypes = [
    { id: 'sales', name: 'Sales Report', icon: <DollarSign className="h-5 w-5" /> },
    { id: 'membership', name: 'Membership Growth', icon: <Users className="h-5 w-5" /> },
    { id: 'products', name: 'Product Performance', icon: <ShoppingCart className="h-5 w-5" /> },
    { id: 'revenue', name: 'Revenue Analysis', icon: <TrendingUp className="h-5 w-5" /> }
  ];

  const salesData = [
    { month: 'Jan 2025', revenue: 245000, orders: 156, members: 1247 },
    { month: 'Dec 2024', revenue: 230000, orders: 143, members: 1205 },
    { month: 'Nov 2024', revenue: 215000, orders: 134, members: 1180 },
    { month: 'Oct 2024', revenue: 208000, orders: 128, members: 1156 }
  ];

  const topProducts = [
    { name: 'Whey Protein Isolate', sales: 234, revenue: 85000 },
    { name: 'Creatine Monohydrate', sales: 189, revenue: 42000 },
    { name: 'Pre-Workout Formula', sales: 156, revenue: 38000 },
    { name: 'BCAA Recovery Drink', sales: 145, revenue: 28000 }
  ];

  const handleExportReport = () => {
    alert('Report exported successfully! In a real app, this would download a PDF/Excel file.');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Reports & Analytics</h2>
          <p className="text-gray-600">Generate insights and export business reports</p>
        </div>
        <button
          onClick={handleExportReport}
          className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center"
        >
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </button>
      </div>

      {/* Report Controls */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
            <select
              value={selectedReport}
              onChange={(e) => setSelectedReport(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {reportTypes.map(type => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Time Period</label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
            <select className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="pdf">PDF</option>
              <option value="excel">Excel</option>
              <option value="csv">CSV</option>
            </select>
          </div>
        </div>
      </div>

      {/* Sales Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Revenue Trend</h3>
          <div className="space-y-4">
            {salesData.map((data, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{data.month}</p>
                  <p className="text-sm text-gray-600">{data.orders} orders</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">Rs. {data.revenue.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">{data.members} members</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Selling Products</h3>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{product.name}</p>
                  <p className="text-sm text-gray-600">{product.sales} units sold</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-blue-600">Rs. {product.revenue.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Key Performance Indicators</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-blue-50 rounded-lg">
            <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-600">Rs. 2.45M</p>
            <p className="text-sm text-gray-600">Monthly Revenue</p>
            <p className="text-xs text-green-600 mt-1">+8% from last month</p>
          </div>
          
          <div className="text-center p-6 bg-green-50 rounded-lg">
            <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">1,247</p>
            <p className="text-sm text-gray-600">Active Members</p>
            <p className="text-xs text-green-600 mt-1">+12% growth</p>
          </div>
          
          <div className="text-center p-6 bg-purple-50 rounded-lg">
            <ShoppingCart className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-600">345</p>
            <p className="text-sm text-gray-600">Orders This Month</p>
            <p className="text-xs text-green-600 mt-1">+15% increase</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;