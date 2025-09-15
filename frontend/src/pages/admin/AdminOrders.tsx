import React, { useState, useEffect } from 'react';
import { Search, Eye, Package, Truck, CheckCircle, Clock, Loader2 } from 'lucide-react';
import { apiClient, Order } from '../../services/api';

const AdminOrders: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0
  });

  const statusColors = {
    'pending': 'bg-yellow-100 text-yellow-800',
    'confirmed': 'bg-blue-100 text-blue-800',
    'processing': 'bg-blue-100 text-blue-800',
    'shipped': 'bg-purple-100 text-purple-800',
    'delivered': 'bg-green-100 text-green-800',
    'cancelled': 'bg-red-100 text-red-800',
    'returned': 'bg-gray-100 text-gray-800'
  };

  const statusIcons = {
    'pending': <Clock className="h-4 w-4" />,
    'confirmed': <Package className="h-4 w-4" />,
    'processing': <Package className="h-4 w-4" />,
    'shipped': <Truck className="h-4 w-4" />,
    'delivered': <CheckCircle className="h-4 w-4" />,
    'cancelled': <Clock className="h-4 w-4" />,
    'returned': <Clock className="h-4 w-4" />
  };

  // Fetch orders from API
  useEffect(() => {
    fetchOrders();
  }, [filterStatus, searchTerm]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const params: any = {
        page: 1,
        limit: 100,
      };
      
      if (filterStatus !== 'all') {
        params.status = filterStatus;
      }
      
      if (searchTerm.trim()) {
        params.search = searchTerm.trim();
      }

      const response = await apiClient.getAllOrders(params);
      setOrders(response.data);
      
      // Calculate stats
      const orderStats = {
        totalOrders: response.data.length,
        pending: response.data.filter((o: Order) => o.status === 'pending').length,
        processing: response.data.filter((o: Order) => o.status === 'processing').length,
        shipped: response.data.filter((o: Order) => o.status === 'shipped').length,
        delivered: response.data.filter((o: Order) => o.status === 'delivered').length
      };
      setStats(orderStats);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch orders');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      await apiClient.updateOrderStatus(orderId, {
        status: newStatus,
        notes: `Status updated to ${newStatus}`
      });
      
      // Refresh orders
      fetchOrders();
    } catch (err: any) {
      alert(err?.message || 'Failed to update order status');
    }
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
            <p className="text-2xl font-bold text-blue-600">{stats.totalOrders}</p>
            <p className="text-sm text-gray-600">Total Orders</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            <p className="text-sm text-gray-600">Pending</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{stats.processing}</p>
            <p className="text-sm text-gray-600">Processing</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">{stats.shipped}</p>
            <p className="text-sm text-gray-600">Shipped</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{stats.delivered}</p>
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
              <option value="confirmed">Confirmed</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Loading orders...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-12">
          <div className="text-red-500 text-lg mb-2">Error loading orders</div>
          <p className="text-gray-500 mb-4">{error}</p>
          <button
            onClick={fetchOrders}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Orders Table */}
      {!isLoading && !error && (
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
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <span className="font-medium text-blue-600">{order.orderNumber}</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">
                        {order.user.firstName} {order.user.lastName}
                      </p>
                      <p className="text-xs text-gray-500">{order.user.email}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {order.items.length} items
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      Rs. {order.totalPrice.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        order.paymentMethod === 'card' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'
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
                          <span className="ml-1 capitalize">{order.status}</span>
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Eye className="h-4 w-4" />
                        </button>
                        <select
                          onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                          className="text-xs border border-gray-300 rounded px-2 py-1"
                          defaultValue=""
                        >
                          <option value="" disabled>Update Status</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-6 py-10 text-center text-gray-500">
                      No orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;