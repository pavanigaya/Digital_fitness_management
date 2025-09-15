import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Dumbbell, Clock, Users, Star, Download, Calendar, CheckCircle, User, Loader2 } from 'lucide-react'; 
import { useAuth } from '../../contexts/AuthContext';
import { apiClient, WorkoutPlan } from '../../services/api';

const WorkoutPlansPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [plans, setPlans] = useState<WorkoutPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterLevel, setFilterLevel] = useState('all');

  // Fetch workout plans from API
  useEffect(() => {
    fetchPlans();
  }, [filterLevel]);

  const fetchPlans = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const params: any = {
        page: 1,
        limit: 20,
      };
      
      if (filterLevel !== 'all') {
        params.level = filterLevel;
      }

      console.log('Fetching workout plans with params:', params);
      const response = await apiClient.getWorkoutPlans(params);
      console.log('Workout plans response:', response);
      
      // Ensure we have an array
      const plansData = response?.data || [];
      setPlans(plansData);
    } catch (err: any) {
      console.error('Error fetching workout plans:', err);
      setError(err?.message || 'Failed to fetch workout plans');
      setPlans([]); // Set empty array on error
    } finally {
      setIsLoading(false);
    }
  };

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner':
        return 'from-green-500 to-green-600';
      case 'intermediate':
        return 'from-blue-500 to-blue-600';
      case 'advanced':
        return 'from-purple-500 to-purple-600';
      case 'expert':
        return 'from-red-500 to-red-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const handleSelectPlan = async (planId: string) => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    try {
      await apiClient.joinWorkoutPlan(planId);
      setSelectedPlan(planId);
      alert('Successfully joined the workout plan!');
      // Refresh plans to update member count
      fetchPlans();
    } catch (err: any) {
      alert(err?.message || 'Failed to join workout plan');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Professional Workout Plans
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose from our expertly designed workout plans created by certified trainers. 
            Each plan includes detailed exercises, progress tracking, and ongoing support.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <button 
            onClick={() => setFilterLevel('all')}
            className={`px-6 py-2 rounded-full font-medium transition-colors ${
              filterLevel === 'all' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All Plans
          </button>
          <button 
            onClick={() => setFilterLevel('beginner')}
            className={`px-6 py-2 rounded-full font-medium transition-colors ${
              filterLevel === 'beginner' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Beginner
          </button>
          <button 
            onClick={() => setFilterLevel('intermediate')}
            className={`px-6 py-2 rounded-full font-medium transition-colors ${
              filterLevel === 'intermediate' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Intermediate
          </button>
          <button 
            onClick={() => setFilterLevel('advanced')}
            className={`px-6 py-2 rounded-full font-medium transition-colors ${
              filterLevel === 'advanced' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Advanced
          </button>
        </div>

        {/* Loading State */}
        {isLoading && (
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
              onClick={fetchPlans}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Workout Plans Grid */}
        {!isLoading && !error && plans && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {plans.map((plan) => (
              <div
                key={plan._id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 relative"
              >
                {plan.isFeatured && (
                  <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-semibold z-10">
                    Featured
                  </div>
                )}

                {/* Plan Header */}
                <div className={`bg-gradient-to-r ${getLevelColor(plan.level)} text-white p-8`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Dumbbell className="h-6 w-6" />
                      <span className="bg-white bg-opacity-20 px-2 py-1 rounded text-sm">
                        {plan.level}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold">Rs. {plan.price.toLocaleString()}</div>
                      <div className="text-sm opacity-90">
                        for {plan.duration.value} {plan.duration.unit}
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-blue-100 mb-4">{plan.shortDescription || plan.description}</p>
                  
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{plan.duration.value} {plan.duration.unit}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{plan.activeMembers} members</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-current" />
                      <span>{plan.averageRating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>

                {/* Plan Content */}
                <div className="p-8">
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">What's Included:</h4>
                    <ul className="space-y-2">
                      {plan.features?.slice(0, 5).map((feature, index) => (
                        <li key={index} className="flex items-center text-gray-600">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                          {feature.name}
                        </li>
                      )) || (
                        <li className="flex items-center text-gray-600">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                          Professional workout sessions
                        </li>
                      )}
                    </ul>
                  </div>

                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{plan.trainerInfo.name}</div>
                        <div className="text-sm text-gray-500">Certified Trainer</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={() => handleSelectPlan(plan._id)}
                      disabled={!plan.isAvailable}
                      className={`w-full bg-gradient-to-r ${getLevelColor(plan.level)} text-white py-3 px-6 rounded-lg font-semibold hover:opacity-90 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {plan.isAvailable ? 'Join This Plan' : 'Plan Full'}
                    </button>
                    
                    <button className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center">
                      <Download className="h-4 w-4 mr-2" />
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {plans && plans.length === 0 && (
              <div className="col-span-2 text-center py-12">
                <div className="text-gray-400 text-lg mb-2">No workout plans found</div>
                <p className="text-gray-500">Try adjusting your filter criteria.</p>
              </div>
            )}
          </div>
        )}

        {/* Current Plan Section */}
        {user && (
          <div className="mt-16 bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Current Plan</h2>
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold">Intermediate Muscle Building</h3>
                  <p className="text-blue-100">Started: January 15, 2025</p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-blue-100">Progress</div>
                  <div className="text-2xl font-bold">40%</div>
                </div>
              </div>
              
              <div className="bg-blue-500 rounded-full h-3 mb-4">
                <div className="bg-yellow-400 h-3 rounded-full w-2/5"></div>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-blue-100">Week 6 of 16</span>
                <Link 
                  to="/dashboard"
                  className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                >
                  View Dashboard
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Call to Action */}
        {!user && (
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4">Ready to Transform Your Fitness?</h2>
              <p className="text-green-100 mb-6">
                Join thousands of satisfied members and start your fitness journey today.
              </p>
              <Link
                to="/register"
                className="inline-block bg-white text-green-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Join GainsHub Now
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkoutPlansPage;
