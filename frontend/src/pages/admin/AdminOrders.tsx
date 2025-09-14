import React, { useState } from 'react';
import { Search, Eye, Package, Truck, CheckCircle, Clock } from 'lucide-react';

const AdminOrders: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const orders = [
    {
      id: '#12345',
      customer: 'John Silva',
      items: 3,
      total: 18500,
      status: 'Delivered',
      paymentMethod: 'Card',
      orderDate: '2025-01-15',
      deliveryDate: '2025-01-17'
    },
    {
      id: '#12344',
      customer: 'Priya Fernando',
      items: 1,
      total: 3200,
      status: 'Processing',
      paymentMethod: 'COD',
      orderDate: '2025-01-14',
      deliveryDate: '2025-01-16'
    },
    {
      id: '#12343',
      customer: 'Mike Perera',
      items: 2,
      total: 15600,
      status: 'Pending',
      paymentMethod: 'Card',
      orderDate: '2025-01-13',
      deliveryDate: '2025-01-15'
    },
    {
      id: '#12342',
      customer: 'Sarah Wijesinghe',
      items: 4,
      total: 12800,
      status: 'Shipped',
      paymentMethod: 'Card',
      orderDate: '2025-01-12',
      deliveryDate: '2025-01-14'
    }
  ];

  const statusColors = {
    'Pending': 'bg-yellow-100 text-yellow-800',
    'Processing': 'bg-blue-100 text-blue-800',
    'Shipped': 'bg-purple-100 text-purple-800',
    'Delivered': 'bg-green-100 text-green-800',
    'Cancelled': 'bg-red-100 text-red-800'
  };

  const statusIcons = {
    'Pending': <Clock className="h-4 w-4" />,
    'Processing': <Package className="h-4 w-4" />,
    'Shipped': <Truck className="h-4 w-4" />,
    'Delivered': <CheckCircle className="h-4 w-4" />,
    'Cancelled': <Clock className="h-4 w-4" />
  };

  const filteredOrders = orders.filter(order => 
    (filterStatus === 'all' || order.status.toLowerCase() === filterStatus) &&
    (order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
     order.customer.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleStatusUpdate = (orderId: string, newStatus: string) => {
    alert(`Order ${orderId} status updated to ${newStatus}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Order Management</h2>
          <p className="text-gray-600">Track and manage customer orders</p>
        </div>
      </div>

      {/* Order Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">345</p>
            <p className="text-sm text-gray-600">Total Orders</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-600">23</p>
            <p className="text-sm text-gray-600">Pending</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">45</p>
            <p className="text-sm text-gray-600">Processing</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">67</p>
            <p className="text-sm text-gray-600">Shipped</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">210</p>
            <p className="text-sm text-gray-600">Delivered</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center space-x-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Order ID</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Customer</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Items</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Total</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Payment</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Status</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Order Date</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <span className="font-medium text-blue-600">{order.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-900">{order.customer}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {order.items} items
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    Rs. {order.total.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      order.paymentMethod === 'Card' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'
                    }`}>
                      {order.paymentMethod}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        statusColors[order.status as keyof typeof statusColors]
                      }`}>
                        {statusIcons[order.status as keyof typeof statusIcons]}
                        <span className="ml-1">{order.status}</span>
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(order.orderDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Eye className="h-4 w-4" />
                      </button>
                      <select
                        onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                        className="text-xs border border-gray-300 rounded px-2 py-1"
                        defaultValue=""
                      >
                        <option value="" disabled>Update Status</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;