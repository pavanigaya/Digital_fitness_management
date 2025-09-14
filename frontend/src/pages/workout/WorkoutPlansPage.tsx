import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Dumbbell, Clock, Users, Star, Download, Calendar, CheckCircle, User } from 'lucide-react'; 
import { useAuth } from '../../contexts/AuthContext';

const WorkoutPlansPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const workoutPlans = [
    {
      id: 'beginner-strength',
      name: 'Beginner Strength',
      description: 'Perfect for those new to strength training. Focus on form, basic movements, and building a foundation.',
      duration: '12 weeks',
      price: 9000,
      level: 'Beginner',
      features: [
        '3 workouts per week',
        'Video demonstrations',
        'Progress tracking',
        'Basic nutrition guide',
        'Email support'
      ],
      trainer: 'Alex Johnson',
      rating: 4.8,
      students: 1250,
      color: 'from-green-500 to-green-600'
    },
    {
      id: 'intermediate-muscle',
      name: 'Intermediate Muscle Building',
      description: 'Advanced muscle-building techniques with progressive overload and periodization.',
      duration: '16 weeks',
      price: 15000,
      level: 'Intermediate',
      features: [
        '4 workouts per week',
        'Video demonstrations',
        'Meal planning guide',
        'Supplement recommendations',
        'Weekly check-ins',
        'Form correction videos'
      ],
      trainer: 'Sarah Williams',
      rating: 4.9,
      students: 850,
      color: 'from-blue-500 to-blue-600',
      popular: true
    },
    {
      id: 'advanced-powerlifting',
      name: 'Advanced Powerlifting',
      description: 'Elite powerlifting program for competitive athletes and advanced lifters.',
      duration: '20 weeks',
      price: 25000,
      level: 'Advanced',
      features: [
        '5 workouts per week',
        '1-on-1 coaching sessions',
        'Competition preparation',
        'Advanced periodization',
        'Custom meal plans',
        'Supplement protocols',
        'Mental performance coaching'
      ],
      trainer: 'Mike Thompson',
      rating: 5.0,
      students: 320,
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 'fat-loss-intensive',
      name: 'Fat Loss Intensive',
      description: 'High-intensity program combining strength training and cardio for rapid fat loss.',
      duration: '12 weeks',
      price: 12000,
      level: 'Intermediate',
      features: [
        '5 workouts per week',
        'HIIT protocols',
        'Cardio optimization',
        'Fat loss meal plans',
        'Body composition tracking',
        'Metabolic assessments'
      ],
      trainer: 'Emma Davis',
      rating: 4.7,
      students: 680,
      color: 'from-orange-500 to-orange-600'
    }
  ];

  const handleSelectPlan = (planId: string) => {
    if (!user) {
      navigate('/login');
      return;
    }
    setSelectedPlan(planId);
    alert('Plan selected! In a real implementation, this would process the subscription.');
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
          <button className="px-6 py-2 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors">
            All Plans
          </button>
          <button className="px-6 py-2 bg-gray-200 text-gray-700 rounded-full font-medium hover:bg-gray-300 transition-colors">
            Beginner
          </button>
          <button className="px-6 py-2 bg-gray-200 text-gray-700 rounded-full font-medium hover:bg-gray-300 transition-colors">
            Intermediate
          </button>
          <button className="px-6 py-2 bg-gray-200 text-gray-700 rounded-full font-medium hover:bg-gray-300 transition-colors">
            Advanced
          </button>
        </div>

        {/* Workout Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {workoutPlans.map((plan) => (
            <div
              key={plan.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 relative"
            >
              {plan.popular && (
                <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-semibold z-10">
                  Most Popular
                </div>
              )}

              {/* Plan Header */}
              <div className={`bg-gradient-to-r ${plan.color} text-white p-8`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Dumbbell className="h-6 w-6" />
                    <span className="bg-white bg-opacity-20 px-2 py-1 rounded text-sm">
                      {plan.level}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold">Rs. {plan.price.toLocaleString()}</div>
                    <div className="text-sm opacity-90">for {plan.duration}</div>
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-blue-100 mb-4">{plan.description}</p>
                
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{plan.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{plan.students} students</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-current" />
                    <span>{plan.rating}</span>
                  </div>
                </div>
              </div>

              {/* Plan Content */}
              <div className="p-8">
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">What's Included:</h4>
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-gray-600">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{plan.trainer}</div>
                      <div className="text-sm text-gray-500">Certified Trainer</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => handleSelectPlan(plan.id)}
                    className={`w-full bg-gradient-to-r ${plan.color} text-white py-3 px-6 rounded-lg font-semibold hover:opacity-90 transition-all duration-200 transform hover:scale-105`}
                  >
                    Select This Plan
                  </button>
                  
                  <button className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center">
                    <Download className="h-4 w-4 mr-2" />
                    Download Sample
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

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
