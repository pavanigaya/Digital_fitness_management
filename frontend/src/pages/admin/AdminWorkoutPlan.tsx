import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, Dumbbell, Users, Clock, Star } from 'lucide-react';

const AdminWorkoutPlans: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [workoutPlans, setWorkoutPlans] = useState([
    {
      id: 'beginner-strength',
      name: 'Beginner Strength',
      description: 'Perfect for those new to strength training. Focus on form, basic movements, and building a foundation.',
      duration: '12 weeks',
      price: 9000,
      level: 'Beginner',
      trainer: 'Alex Johnson',
      rating: 4.8,
      activeMembers: 45,
      status: 'Active'
    },
    {
      id: 'intermediate-muscle',
      name: 'Intermediate Muscle Building',
      description: 'Advanced muscle-building techniques with progressive overload and periodization.',
      duration: '16 weeks',
      price: 15000,
      level: 'Intermediate',
      trainer: 'Sarah Williams',
      rating: 4.9,
      activeMembers: 32,
      status: 'Active'
    },
    {
      id: 'advanced-powerlifting',
      name: 'Advanced Powerlifting',
      description: 'Elite powerlifting program for competitive athletes and advanced lifters.',
      duration: '20 weeks',
      price: 25000,
      level: 'Advanced',
      trainer: 'Mike Thompson',
      rating: 5.0,
      activeMembers: 18,
      status: 'Active'
    },
    {
      id: 'fat-loss-intensive',
      name: 'Fat Loss Intensive',
      description: 'High-intensity program combining strength training and cardio for rapid fat loss.',
      duration: '12 weeks',
      price: 12000,
      level: 'Intermediate',
      trainer: 'Emma Davis',
      rating: 4.7,
      activeMembers: 28,
      status: 'Active'
    }
  ]);

  const [newPlan, setNewPlan] = useState({
    name: '',
    description: '',
    duration: '',
    price: '',
    level: 'Beginner',
    trainer: '',
    features: ''
  });

  const filteredPlans = workoutPlans.filter(plan => 
    plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.trainer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddPlan = (e: React.FormEvent) => {
    e.preventDefault();
    
    const planId = newPlan.name.toLowerCase().replace(/\s+/g, '-');
    const plan = {
      id: planId,
      name: newPlan.name,
      description: newPlan.description,
      duration: newPlan.duration,
      price: parseInt(newPlan.price),
      level: newPlan.level,
      trainer: newPlan.trainer,
      rating: 0,
      activeMembers: 0,
      status: 'Active' as const
    };

    setWorkoutPlans([...workoutPlans, plan]);
    setNewPlan({
      name: '',
      description: '',
      duration: '',
      price: '',
      level: 'Beginner',
      trainer: '',
      features: ''
    });
    setShowAddModal(false);
    alert('Workout plan added successfully!');
  };

  const handleDeletePlan = (planId: string) => {
    if (confirm('Are you sure you want to delete this workout plan?')) {
      setWorkoutPlans(workoutPlans.filter(plan => plan.id !== planId));
      alert('Workout plan deleted successfully!');
    }
  };

  const levelColors = {
    'Beginner': 'bg-green-100 text-green-800',
    'Intermediate': 'bg-blue-100 text-blue-800',
    'Advanced': 'bg-purple-100 text-purple-800'
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Workout Plans Management</h2>
          <p className="text-gray-600">Manage workout plans and track member enrollment</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Plan
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Plans</p>
              <p className="text-2xl font-bold text-gray-900">{workoutPlans.length}</p>
            </div>
            <Dumbbell className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Members</p>
              <p className="text-2xl font-bold text-green-600">
                {workoutPlans.reduce((sum, plan) => sum + plan.activeMembers, 0)}
              </p>
            </div>
            <Users className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Avg Rating</p>
              <p className="text-2xl font-bold text-yellow-600">
                {(workoutPlans.reduce((sum, plan) => sum + plan.rating, 0) / workoutPlans.length).toFixed(1)}
              </p>
            </div>
            <Star className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Revenue</p>
              <p className="text-2xl font-bold text-purple-600">Rs. 1.2M</p>
            </div>
            <Clock className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search workout plans..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Plans Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Plan Name</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Trainer</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Level</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Duration</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Price</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Active Members</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Rating</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPlans.map((plan) => (
                <tr key={plan.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{plan.name}</p>
                      <p className="text-sm text-gray-500 truncate max-w-xs">{plan.description}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {plan.trainer}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      levelColors[plan.level as keyof typeof levelColors]
                    }`}>
                      {plan.level}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {plan.duration}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    Rs. {plan.price.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {plan.activeMembers}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                      <span className="text-sm text-gray-600">{plan.rating}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDeletePlan(plan.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
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

      {/* Add Plan Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Add New Workout Plan</h3>
            
            <form onSubmit={handleAddPlan} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Plan Name
                  </label>
                  <input
                    type="text"
                    value={newPlan.name}
                    onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
                    required
                    className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Advanced Cardio"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Trainer
                  </label>
                  <input
                    type="text"
                    value={newPlan.trainer}
                    onChange={(e) => setNewPlan({ ...newPlan, trainer: e.target.value })}
                    required
                    className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., John Smith"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Level
                  </label>
                  <select
                    value={newPlan.level}
                    onChange={(e) => setNewPlan({ ...newPlan, level: e.target.value })}
                    className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={newPlan.duration}
                    onChange={(e) => setNewPlan({ ...newPlan, duration: e.target.value })}
                    required
                    className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 12 weeks"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price (Rs.)
                  </label>
                  <input
                    type="number"
                    value={newPlan.price}
                    onChange={(e) => setNewPlan({ ...newPlan, price: e.target.value })}
                    required
                    className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 15000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={newPlan.description}
                  onChange={(e) => setNewPlan({ ...newPlan, description: e.target.value })}
                  required
                  rows={4}
                  className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Describe the workout plan, its goals, and target audience..."
                />
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Add Plan
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminWorkoutPlans;