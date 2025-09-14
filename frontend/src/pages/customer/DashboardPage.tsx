import React from 'react';
import { Link } from 'react-router-dom';
import { 
  User, 
  Dumbbell, 
  ShoppingBag, 
  Calendar, 
  TrendingUp, 
  Award,
  Clock,
  Target
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  const quickStats = [
    { label: 'Active Plan', value: 'Intermediate Muscle', icon: <Dumbbell className="h-6 w-6" /> },
    { label: 'Days Completed', value: '45/112', icon: <Calendar className="h-6 w-6" /> },
    { label: 'Total Orders', value: '8', icon: <ShoppingBag className="h-6 w-6" /> },
    { label: 'Achievements', value: '12', icon: <Award className="h-6 w-6" /> }
  ];

  const quickActions = [
    {
      title: 'View Workout Plan',
      description: 'Access your current workout routine',
      icon: <Dumbbell className="h-8 w-8 text-blue-600" />,
      link: '/workout-plans',
      color: 'bg-blue-50 hover:bg-blue-100'
    },
    {
      title: 'Shop Products',
      description: 'Browse supplements and equipment',
      icon: <ShoppingBag className="h-8 w-8 text-green-600" />,
      link: '/shop',
      color: 'bg-green-50 hover:bg-green-100'
    },
    {
      title: 'Update Profile',
      description: 'Manage your account settings',
      icon: <User className="h-8 w-8 text-purple-600" />,
      link: '/profile',
      color: 'bg-purple-50 hover:bg-purple-100'
    },
    {
      title: 'Give Feedback',
      description: 'Rate trainers and services',
      icon: <Target className="h-8 w-8 text-orange-600" />,
      link: '/feedback',
      color: 'bg-orange-50 hover:bg-orange-100'
    }
  ];

  const recentActivity = [
    { action: 'Completed leg workout', time: '2 hours ago', type: 'workout' },
    { action: 'Ordered Whey Protein', time: '1 day ago', type: 'order' },
    { action: 'Updated fitness goals', time: '3 days ago', type: 'profile' },
    { action: 'Completed chest workout', time: '5 days ago', type: 'workout' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="text-gray-600">
            Ready to continue your fitness journey? Here's your progress overview.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className="text-blue-600">
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  to={action.link}
                  className={`${action.color} p-6 rounded-xl transition-all duration-300 transform hover:scale-105 block`}
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      {action.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {action.title}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {action.description}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3 pb-4 border-b border-gray-100 last:border-b-0">
                    <div className={`p-2 rounded-lg ${
                      activity.type === 'workout' ? 'bg-blue-100 text-blue-600' :
                      activity.type === 'order' ? 'bg-green-100 text-green-600' :
                      'bg-purple-100 text-purple-600'
                    }`}>
                      {activity.type === 'workout' ? <Dumbbell className="h-4 w-4" /> :
                       activity.type === 'order' ? <ShoppingBag className="h-4 w-4" /> :
                       <User className="h-4 w-4" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{activity.action}</p>
                      <p className="text-xs text-gray-500 flex items-center mt-1">
                        <Clock className="h-3 w-3 mr-1" />
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Progress Card */}
            <div className="mt-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-2">Fitness Progress</h3>
              <p className="text-blue-100 text-sm mb-4">
                You're 40% through your current workout plan!
              </p>
              <div className="bg-blue-500 rounded-full h-3 mb-3">
                <div className="bg-yellow-400 h-3 rounded-full w-2/5"></div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-blue-100">Keep going!</span>
                <span className="text-blue-100">45/112 days</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;