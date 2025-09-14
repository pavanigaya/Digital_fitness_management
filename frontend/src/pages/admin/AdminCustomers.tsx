import React, { useState } from 'react';
import { Search, UserPlus, Edit, Trash2, Eye, Mail, Phone, Filter } from 'lucide-react';

const AdminCustomers: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  const customers = [
    {
      id: '1',
      name: 'John Silva',
      email: 'john.silva@email.com',
      phone: '+94771234567',
      membership: 'Premium',
      status: 'Active',
      joinDate: '2024-01-15',
      lastActivity: '2 hours ago',
      address: '123 Main St, Colombo',
      workoutPlan: 'Intermediate Muscle Building'
    },
    {
      id: '2',
      name: 'Priya Fernando',
      email: 'priya.fernando@email.com',
      phone: '+94776543210',
      membership: 'Basic',
      status: 'Active',
      joinDate: '2024-02-20',
      lastActivity: '1 day ago',
      address: '456 Galle Road, Mount Lavinia',
      workoutPlan: 'Beginner Strength'
    },
    {
      id: '3',
      name: 'Mike Perera',
      email: 'mike.perera@email.com',
      phone: '+94779876543',
      membership: 'Elite',
      status: 'Inactive',
      joinDate: '2023-11-10',
      lastActivity: '2 weeks ago',
      address: '789 Kandy Road, Kaduwela',
      workoutPlan: 'Advanced Powerlifting'
    }
  ];

  const filteredCustomers = customers.filter(customer => 
    (filterStatus === 'all' || customer.status.toLowerCase() === filterStatus) &&
    (customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     customer.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Customer Management</h2>
          <p className="text-gray-600">Manage member accounts and memberships</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Add Customer
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search customers..."
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
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </button>
          </div>
        </div>
      </div>

      {/* Customer Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">1,247</p>
            <p className="text-sm text-gray-600">Total Customers</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">1,189</p>
            <p className="text-sm text-gray-600">Active Members</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">34</p>
            <p className="text-sm text-gray-600">New This Month</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">58</p>
            <p className="text-sm text-gray-600">Inactive</p>
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Customer</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Contact</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Membership</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Workout Plan</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Status</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Join Date</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-medium">
                          {customer.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{customer.name}</p>
                        <p className="text-sm text-gray-500">ID: {customer.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="h-3 w-3 mr-1" />
                        {customer.email}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="h-3 w-3 mr-1" />
                        {customer.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      customer.membership === 'Elite' ? 'bg-purple-100 text-purple-800' :
                      customer.membership === 'Premium' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {customer.membership}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {customer.workoutPlan}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      customer.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {customer.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(customer.joinDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
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

export default AdminCustomers;