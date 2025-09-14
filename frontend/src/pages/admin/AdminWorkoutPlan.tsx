import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Search, Plus, Edit, Trash2, Dumbbell, Users, Clock, Star, X } from 'lucide-react';

type PlanLevel = 'Beginner' | 'Intermediate' | 'Advanced';
type PlanStatus = 'Active' | 'Inactive';

interface WorkoutPlan {
  _id: string;
  name: string;
  description: string;
  duration: string;         // e.g. "12 weeks"
  price: number;
  level: PlanLevel;
  trainer: string;
  rating: number;
  activeMembers: number;
  status: PlanStatus;
  features?: string[];
  createdAt?: string;
  updatedAt?: string;
}

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:5000',
  withCredentials: false,
});

const AdminWorkoutPlans: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>('');
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);

  // ===== Add / Edit Form State =====
  const [newPlan, setNewPlan] = useState({
    name: '',
    description: '',
    duration: '',
    price: '',
    level: 'Beginner' as PlanLevel,
    trainer: '',
    features: '' // comma separated
  });

  const [editPlan, setEditPlan] = useState<{
    _id: string;
    name: string;
    description: string;
    duration: string;
    price: string;
    level: PlanLevel;
    trainer: string;
    features: string;
    status: PlanStatus;
  } | null>(null);

  // ===== Helpers =====
  const levelColors: Record<PlanLevel, string> = {
    Beginner: 'bg-green-100 text-green-800',
    Intermediate: 'bg-blue-100 text-blue-800',
    Advanced: 'bg-purple-100 text-purple-800'
  };

  const fetchPlans = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await API.get('/api/workout-plans', {
        params: { search: searchTerm.trim() || undefined, limit: 100 }
      });
      const list: WorkoutPlan[] = data?.data || data; // supports both paginated and array responses
      setWorkoutPlans(Array.isArray(list) ? list : []);
    } catch (e: any) {
      setError(e?.response?.data?.message || e.message || 'Failed to load plans');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // initial load

  const filteredPlans = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return workoutPlans.filter((p) =>
      p.name.toLowerCase().includes(q) || p.trainer.toLowerCase().includes(q)
    );
  }, [workoutPlans, searchTerm]);

  const totalMembers = useMemo(
    () => workoutPlans.reduce((sum, p) => sum + (p.activeMembers || 0), 0),
    [workoutPlans]
  );
  const avgRating = useMemo(
    () => (workoutPlans.length
      ? (workoutPlans.reduce((s, p) => s + (p.rating || 0), 0) / workoutPlans.length).toFixed(1)
      : '0.0'),
    [workoutPlans]
  );

  // ===== Create =====
  const handleAddPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const payload = {
        name: newPlan.name.trim(),
        description: newPlan.description.trim(),
        duration: newPlan.duration.trim(),
        price: Number(newPlan.price),
        level: newPlan.level,
        trainer: newPlan.trainer.trim(),
        features: newPlan.features
          ? newPlan.features.split(',').map(f => f.trim()).filter(Boolean)
          : [],
        rating: 0,
        activeMembers: 0,
        status: 'Active' as PlanStatus
      };

      const { data } = await API.post('/api/workout-plans', payload);
      setWorkoutPlans((prev) => [data, ...prev]);
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
    } catch (e: any) {
      setError(e?.response?.data?.message || e.message || 'Failed to add plan');
    } finally {
      setSubmitting(false);
    }
  };

  // ===== Delete =====
  const handleDeletePlan = async (id: string) => {
    if (!confirm('Are you sure you want to delete this workout plan?')) return;
    setSubmitting(true);
    setError('');
    try {
      await API.delete(`/api/workout-plans/${id}`);
      setWorkoutPlans((prev) => prev.filter((p) => p._id !== id));
      alert('Workout plan deleted successfully!');
    } catch (e: any) {
      setError(e?.response?.data?.message || e.message || 'Failed to delete plan');
    } finally {
      setSubmitting(false);
    }
  };

  // ===== Open Edit Modal =====
  const openEdit = (plan: WorkoutPlan) => {
    setEditPlan({
      _id: plan._id,
      name: plan.name,
      description: plan.description,
      duration: plan.duration,
      price: String(plan.price),
      level: plan.level,
      trainer: plan.trainer,
      features: (plan.features || []).join(', '),
      status: plan.status
    });
    setShowEditModal(true);
  };

  // ===== Update =====
  const handleUpdatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editPlan?._id) return;

    setSubmitting(true);
    setError('');

    try {
      const payload = {
        name: editPlan.name.trim(),
        description: editPlan.description.trim(),
        duration: editPlan.duration.trim(),
        price: Number(editPlan.price),
        level: editPlan.level,
        trainer: editPlan.trainer.trim(),
        status: editPlan.status,
        features: editPlan.features
          ? editPlan.features.split(',').map(f => f.trim()).filter(Boolean)
          : []
      };

      const { data } = await API.put(`/api/workout-plans/${editPlan._id}`, payload);
      setWorkoutPlans((prev) => prev.map((p) => (p._id === data._id ? data : p)));
      setShowEditModal(false);
      setEditPlan(null);
      alert('Workout plan updated!');
    } catch (e: any) {
      setError(e?.response?.data?.message || e.message || 'Failed to update plan');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
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

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

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
              <p className="text-2xl font-bold text-green-600">{totalMembers}</p>
            </div>
            <Users className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Avg Rating</p>
              <p className="text-2xl font-bold text-yellow-600">{avgRating}</p>
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

      {/* Search / Refresh */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center gap-3">
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search workout plans..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={fetchPlans}
            className="px-4 py-2 rounded-lg border bg-gray-50 hover:bg-gray-100"
            disabled={loading}
          >
            {loading ? 'Refreshing…' : 'Refresh'}
          </button>
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
                <tr key={plan._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{plan.name}</p>
                      <p className="text-sm text-gray-500 truncate max-w-xs">{plan.description}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{plan.trainer}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${levelColors[plan.level]}`}>
                      {plan.level}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{plan.duration}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">Rs. {plan.price.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{plan.activeMembers}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                      <span className="text-sm text-gray-600">{plan.rating}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => openEdit(plan)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeletePlan(plan._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                        disabled={submitting}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {!loading && filteredPlans.length === 0 && (
                <tr>
                  <td className="px-6 py-10 text-center text-gray-500" colSpan={8}>
                    No plans found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {loading && (
            <div className="p-6 text-center text-gray-500">Loading plans…</div>
          )}
        </div>
      </div>

      {/* Add Plan Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Add New Workout Plan</h3>
              <button onClick={() => setShowAddModal(false)}><X className="h-6 w-6 text-gray-500" /></button>
            </div>

            <form onSubmit={handleAddPlan} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Plan Name</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Trainer</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
                  <select
                    value={newPlan.level}
                    onChange={(e) => setNewPlan({ ...newPlan, level: e.target.value as PlanLevel })}
                    className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price (Rs.)</label>
                  <input
                    type="number"
                    value={newPlan.price}
                    onChange={(e) => setNewPlan({ ...newPlan, price: e.target.value })}
                    required
                    className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 15000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Features (comma separated)</label>
                  <input
                    type="text"
                    value={newPlan.features}
                    onChange={(e) => setNewPlan({ ...newPlan, features: e.target.value })}
                    className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Progression, HIIT, Mobility"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={newPlan.description}
                  onChange={(e) => setNewPlan({ ...newPlan, description: e.target.value })}
                  required
                  rows={4}
                  className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Describe the workout plan, its goals, and target audience..."
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Adding…' : 'Add Plan'}
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

      {/* Edit Plan Modal */}
      {showEditModal && editPlan && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Edit Workout Plan</h3>
              <button onClick={() => { setShowEditModal(false); setEditPlan(null); }}>
                <X className="h-6 w-6 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleUpdatePlan} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Plan Name</label>
                  <input
                    type="text"
                    value={editPlan.name}
                    onChange={(e) => setEditPlan({ ...editPlan, name: e.target.value })}
                    required
                    className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Trainer</label>
                  <input
                    type="text"
                    value={editPlan.trainer}
                    onChange={(e) => setEditPlan({ ...editPlan, trainer: e.target.value })}
                    required
                    className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
                  <select
                    value={editPlan.level}
                    onChange={(e) => setEditPlan({ ...editPlan, level: e.target.value as PlanLevel })}
                    className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                  <input
                    type="text"
                    value={editPlan.duration}
                    onChange={(e) => setEditPlan({ ...editPlan, duration: e.target.value })}
                    required
                    className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price (Rs.)</label>
                  <input
                    type="number"
                    value={editPlan.price}
                    onChange={(e) => setEditPlan({ ...editPlan, price: e.target.value })}
                    required
                    className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={editPlan.status}
                    onChange={(e) => setEditPlan({ ...editPlan, status: e.target.value as PlanStatus })}
                    className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Features (comma separated)</label>
                  <input
                    type="text"
                    value={editPlan.features}
                    onChange={(e) => setEditPlan({ ...editPlan, features: e.target.value })}
                    className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={editPlan.description}
                  onChange={(e) => setEditPlan({ ...editPlan, description: e.target.value })}
                  required
                  rows={4}
                  className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Saving…' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowEditModal(false); setEditPlan(null); }}
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
