import React, { useState } from 'react';
import { Check, Star, Crown, Zap, Users, Calendar } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const MembershipPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const membershipPlans = [
    {
      id: 'basic',
      name: 'Basic',
      price: 3500,
      duration: 'per month',
      description: 'Perfect for getting started with your fitness journey',
      features: [
        'Access to gym equipment',
        'Basic workout plans',
        'Locker access',
        'Free fitness assessment',
        'Mobile app access'
      ],
      icon: <Users className="h-8 w-8 text-green-600" />,
      color: 'border-green-500',
      buttonColor: 'bg-green-600 hover:bg-green-700',
      popular: false
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 7500,
      duration: 'per month',
      description: 'Our most popular plan with comprehensive fitness support',
      features: [
        'All Basic features',
        'Personalized workout plans',
        'Nutrition consultation',
        'Group fitness classes',
        'Supplement discounts (10%)',
        'Progress tracking',
        'Email support'
      ],
      icon: <Star className="h-8 w-8 text-blue-600" />,
      color: 'border-blue-500 ring-2 ring-blue-200',
      buttonColor: 'bg-blue-600 hover:bg-blue-700',
      popular: true
    },
    {
      id: 'elite',
      name: 'Elite',
      price: 15000,
      duration: 'per month',
      description: 'Ultimate fitness experience with premium perks',
      features: [
        'All Premium features',
        '1-on-1 personal training',
        'Custom meal planning',
        'Priority booking',
        'Supplement discounts (20%)',
        'Advanced body composition analysis',
        'Dedicated support line',
        'Guest passes (2 per month)',
        'Recovery and wellness services'
      ],
      icon: <Crown className="h-8 w-8 text-purple-600" />,
      color: 'border-purple-500',
      buttonColor: 'bg-purple-600 hover:bg-purple-700',
      popular: false
    }
  ];

  const handleSelectPlan = (planId: string) => {
    if (!user) {
      navigate('/login');
      return;
    }
    setSelectedPlan(planId);
    alert('Membership upgrade initiated! In a real implementation, this would process the payment.');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Membership Packages</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the perfect membership plan that fits your fitness goals and lifestyle. 
            All plans include access to our premium facilities and expert guidance.
          </p>
        </div>

        {/* Current Membership */}
        {user && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-12">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Your Current Membership</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-medium text-gray-900">
                  {user.membershipStatus} Plan
                </p>
                <p className="text-gray-600">Active since January 15, 2025</p>
                <p className="text-sm text-gray-500">Next renewal: January 15, 2026</p>
              </div>
              <div className="text-right">
                <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  Active
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Membership Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {membershipPlans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white rounded-2xl shadow-lg overflow-visible transition-all duration-300 transform hover:scale-105 border-2 ${plan.color} relative`}
            >
              {/* Most Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-20">
                  <div className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                    Most Popular
                  </div>
                </div>
              )}

              <div className="p-8">
                <div className="text-center mb-6">
                  <div className="flex justify-center mb-4">{plan.icon}</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-gray-900">
                      Rs. {plan.price.toLocaleString()}
                    </div>
                    <div className="text-gray-500">{plan.duration}</div>
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSelectPlan(plan.id)}
                  className={`w-full ${plan.buttonColor} text-white py-3 px-6 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105`}
                >
                  {user?.membershipStatus === plan.name ? 'Current Plan' : 'Choose Plan'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Plan Comparison Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-12">
          <div className="px-8 py-6 bg-gray-50 border-b">
            <h2 className="text-2xl font-bold text-gray-900">Plan Comparison</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Features</th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-gray-900">Basic</th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-gray-900">Premium</th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-gray-900">Elite</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {[
                  ['Gym Equipment Access', true, true, true],
                  ['Workout Plans', 'Basic', 'Personalized', 'Custom'],
                  ['Personal Training', false, false, true],
                  ['Nutrition Consultation', false, true, true],
                  ['Group Classes', false, true, true],
                  ['Supplement Discounts', false, '10%', '20%'],
                  ['Priority Booking', false, false, true],
                  ['Guest Passes', false, false, '2/month']
                ].map((row, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{row[0]}</td>
                    {row.slice(1).map((cell, idx) => (
                      <td key={idx} className="px-6 py-4 text-center text-sm text-gray-600">
                        {typeof cell === 'boolean' ? (
                          cell ? <Check className="h-5 w-5 text-green-500 mx-auto" /> : '—'
                        ) : cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Why Choose GainsHub Membership?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <div>
              <Zap className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Expert Guidance</h3>
              <p className="text-blue-100">
                Work with certified trainers and nutritionists who understand your goals.
              </p>
            </div>
            <div>
              <Calendar className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Flexible Scheduling</h3>
              <p className="text-blue-100">
                Book classes and training sessions that fit your busy lifestyle.
              </p>
            </div>
            <div>
              <Star className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Proven Results</h3>
              <p className="text-blue-100">
                Join thousands of members who have achieved their fitness goals with us.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MembershipPage;
