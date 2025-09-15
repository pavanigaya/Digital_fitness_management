import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Dumbbell, Users, Star, Calendar, Eye, Loader2 } from 'lucide-react';
import { apiClient, WorkoutPlan } from '../../services/api';

const CATEGORIES = ["all", "strength", "cardio", "flexibility", "weight-loss", "muscle-gain", "endurance", "sports-specific", "rehabilitation", "general-fitness"] as const;
const LEVELS = ["beginner", "intermediate", "advanced", "expert"] as const;

const emptyForm: Partial<WorkoutPlan> = {
  name: "",
  description: "",
  shortDescription: "",
  category: "strength",
  level: "beginner",
  price: 0,
  duration: {
    value: 4,
    unit: "weeks"
  },
  goals: [],
  features: [],
  isAvailable: true,
  isFeatured: false,
  isOnSale: false
};

const TrainerWorkoutPlans: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<(typeof CATEGORIES)[number]>("all");
  const [filterLevel, setFilterLevel] = useState<string>("all");
  const [plans, setPlans] = useState<WorkoutPlan[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Modal/edit state
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<Partial<WorkoutPlan>>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Load workout plans
  const loadPlans = async () => {
    try {
      setLoading(true);
      setError(null);
      const params: any = {
        page: 1,
        limit: 100,
      };
      if (searchTerm.trim()) params.search = searchTerm.trim();
      if (filterCategory !== "all") params.category = filterCategory;
      if (filterLevel !== "all") params.level = filterLevel;

      const response = await apiClient.getWorkoutPlans(params);
      setPlans(response.data || []);
    } catch (err: any) {
      setError(err?.message || "Failed to load workout plans");
    } finally {
      setLoading(false);
    }
  };

  const createPlan = async (payload: Partial<WorkoutPlan>) => {
    const response = await apiClient.createWorkoutPlan(payload);
    return response;
  };

  const updatePlan = async (id: string, payload: Partial<WorkoutPlan>) => {
    const response = await apiClient.updateWorkoutPlan(id, payload);
    return response;
  };

  const deletePlan = async (id: string) => {
    await apiClient.deleteWorkoutPlan(id);
  };

  useEffect(() => {
    loadPlans();
  }, [searchTerm, filterCategory, filterLevel]);

  const handleEdit = (plan: WorkoutPlan) => {
    setForm({
      ...plan,
      duration: plan.duration || { value: 4, unit: "weeks" },
      goals: plan.goals || [],
      features: plan.features || []
    });
    setEditingId(plan._id);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this workout plan?")) return;
    
    try {
      await deletePlan(id);
      setPlans(prev => prev.filter(p => p._id !== id));
    } catch (err: any) {
      alert(err?.message || "Failed to delete workout plan");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload: Partial<WorkoutPlan> = {
        name: form.name?.trim(),
        description: form.description?.trim(),
        shortDescription: form.shortDescription?.trim(),
        category: form.category || "strength",
        level: form.level || "beginner",
        price: Number(form.price) || 0,
        duration: form.duration || { value: 4, unit: "weeks" },
        goals: form.goals || [],
        features: form.features || [],
        isAvailable: form.isAvailable !== false,
        isFeatured: form.isFeatured || false,
        isOnSale: form.isOnSale || false
      };

      if (editingId) {
        const updated = await updatePlan(editingId, payload);
        setPlans(prev => prev.map(p => (p._id === editingId ? updated : p)));
      } else {
        const created = await createPlan(payload);
        setPlans(prev => [created, ...prev]);
      }

      setShowModal(false);
      setEditingId(null);
      setForm(emptyForm);
    } catch (err: any) {
      alert(err?.message || "Failed to save workout plan");
    } finally {
      setSaving(false);
    }
  };

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-blue-100 text-blue-800';
      case 'advanced': return 'bg-purple-100 text-purple-800';
      case 'expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredPlans = plans.filter(plan => {
    const matchesSearch = !searchTerm || 
      plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || plan.category === filterCategory;
    const matchesLevel = filterLevel === "all" || plan.level === filterLevel;
    return matchesSearch && matchesCategory && matchesLevel;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Workout Plans</h2>
          <p className="text-gray-600">Create and manage your workout plans</p>
        </div>
        <button
          onClick={() => {
            setForm(emptyForm);
            setEditingId(null);
            setShowModal(true);
          }}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Add Workout Plan</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center">
            <Dumbbell className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Plans</p>
              <p className="text-2xl font-bold text-gray-900">{plans.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Members</p>
              <p className="text-2xl font-bold text-gray-900">
                {plans.reduce((sum, plan) => sum + (plan.activeMembers || 0), 0)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center">
            <Star className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Avg Rating</p>
              <p className="text-2xl font-bold text-gray-900">
                {plans.length > 0 
                  ? (plans.reduce((sum, plan) => sum + (plan.averageRating || 0), 0) / plans.length).toFixed(1)
                  : '0.0'
                }
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Active Plans</p>
              <p className="text-2xl font-bold text-gray-900">
                {plans.filter(plan => plan.isAvailable).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search plans..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value as typeof CATEGORIES[number])}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {CATEGORIES.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Levels</option>
              {LEVELS.map(level => (
                <option key={level} value={level}>
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Loading workout plans...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-12">
          <div className="text-red-500 text-lg mb-2">Error loading workout plans</div>
          <p className="text-gray-500 mb-4">{error}</p>
          <button
            onClick={loadPlans}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Plans Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlans.map((plan) => (
            <div key={plan._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{plan.name}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{plan.shortDescription || plan.description}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(plan)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(plan._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(plan.level)}`}>
                      {plan.level.charAt(0).toUpperCase() + plan.level.slice(1)}
                    </span>
                    <span className="text-sm text-gray-600 capitalize">{plan.category.replace('-', ' ')}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-gray-900">Rs. {plan.price.toLocaleString()}</span>
                    <span className="text-sm text-gray-600">
                      {plan.duration?.value} {plan.duration?.unit}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{plan.activeMembers || 0} members</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4" />
                      <span>{plan.averageRating?.toFixed(1) || '0.0'}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      plan.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {plan.isAvailable ? 'Available' : 'Unavailable'}
                    </span>
                    {plan.isFeatured && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Featured
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredPlans.length === 0 && (
            <div className="col-span-full text-center py-12">
              <Dumbbell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No workout plans found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || filterCategory !== "all" || filterLevel !== "all"
                  ? "Try adjusting your search criteria"
                  : "Create your first workout plan to get started"
                }
              </p>
              {!searchTerm && filterCategory === "all" && filterLevel === "all" && (
                <button
                  onClick={() => {
                    setForm(emptyForm);
                    setEditingId(null);
                    setShowModal(true);
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Workout Plan
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingId ? 'Edit Workout Plan' : 'Add New Workout Plan'}
              </h3>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Plan Name</label>
                  <input
                    type="text"
                    value={form.name ?? ""}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter plan name"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
                  <input
                    type="text"
                    value={form.shortDescription ?? ""}
                    onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Brief description (optional)"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={form.description ?? ""}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Detailed plan description"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={form.category ?? "strength"}
                    onChange={(e) => setForm({ ...form, category: e.target.value as any })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {CATEGORIES.filter(c => c !== "all").map(category => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
                  <select
                    value={form.level ?? "beginner"}
                    onChange={(e) => setForm({ ...form, level: e.target.value as any })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {LEVELS.map(level => (
                      <option key={level} value={level}>
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (Rs.)</label>
                  <input
                    type="number"
                    value={form.price ?? 0}
                    onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      value={form.duration?.value ?? 4}
                      onChange={(e) => setForm({ 
                        ...form, 
                        duration: { 
                          ...form.duration, 
                          value: Number(e.target.value) 
                        } 
                      })}
                      className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      min="1"
                      required
                    />
                    <select
                      value={form.duration?.unit ?? "weeks"}
                      onChange={(e) => setForm({ 
                        ...form, 
                        duration: { 
                          ...form.duration, 
                          unit: e.target.value as any 
                        } 
                      })}
                      className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="days">Days</option>
                      <option value="weeks">Weeks</option>
                      <option value="months">Months</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={form.isAvailable ? "available" : "unavailable"}
                    onChange={(e) => setForm({ ...form, isAvailable: e.target.value === "available" })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="available">Available</option>
                    <option value="unavailable">Unavailable</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Featured</label>
                  <select
                    value={form.isFeatured ? "true" : "false"}
                    onChange={(e) => setForm({ ...form, isFeatured: e.target.value === "true" })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg border hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving ? "Saving..." : editingId ? "Update Plan" : "Create Plan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainerWorkoutPlans;
