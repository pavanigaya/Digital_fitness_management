import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Dumbbell, 
  Calendar, 
  TrendingUp, 
  Award,
  Clock,
  Target,
  UserPlus,
  BarChart3,
  MessageSquare,
  Settings,
  BookOpen
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const TrainerDashboard: React.FC = () => {
  const { user } = useAuth();

  const trainerStats = [
    { 
      label: 'Active Clients', 
      value: '24', 
      change: '+3 this month',
      icon: <Users className="h-6 w-6 text-blue-600" />,
      color: 'bg-blue-50'
    },
    { 
      label: 'Workout Plans Created', 
      value: '12', 
      change: '+2 this week',
      icon: <Dumbbell className="h-6 w-6 text-green-600" />,
      color: 'bg-green-50'
    },
    { 
      label: 'Sessions This Month', 
      value: '48', 
      change: '+12% from last month',
      icon: <Calendar className="h-6 w-6 text-purple-600" />,
      color: 'bg-purple-50'
    },
    { 
      label: 'Client Satisfaction', 
      value: '4.8/5', 
      change: '+0.2 this month',
      icon: <Award className="h-6 w-6 text-orange-600" />,
      color: 'bg-orange-50'
    }
  ];

  const quickActions = [
    {
      title: 'Manage Clients',
      description: 'View and manage your client list',
      icon: <Users className="h-8 w-8 text-blue-600" />,
      link: '/trainer/clients',
      color: 'bg-blue-50 hover:bg-blue-100'
    },
    {
      title: 'Manage Workout Plans',
      description: 'Create and manage your workout plans',
      icon: <Dumbbell className="h-8 w-8 text-green-600" />,
      link: '/trainer/workout-plans',
      color: 'bg-green-50 hover:bg-green-100'
    },
    {
      title: 'Schedule Sessions',
      description: 'Manage your training sessions',
      icon: <Calendar className="h-8 w-8 text-purple-600" />,
      link: '/trainer/schedule',
      color: 'bg-purple-50 hover:bg-purple-100'
    },
    {
      title: 'View Analytics',
      description: 'Track your performance metrics',
      icon: <BarChart3 className="h-8 w-8 text-orange-600" />,
      link: '/trainer/analytics',
      color: 'bg-orange-50 hover:bg-orange-100'
    }
  ];

  const recentClients = [
    { name: 'John Silva', plan: 'Muscle Building', progress: '85%', lastSession: '2 days ago' },
    { name: 'Priya Fernando', plan: 'Weight Loss', progress: '72%', lastSession: '1 day ago' },
    { name: 'Mike Perera', plan: 'Strength Training', progress: '90%', lastSession: '3 days ago' },
    { name: 'Sarah Johnson', plan: 'Cardio Focus', progress: '68%', lastSession: '1 week ago' }
  ];

  const upcomingSessions = [
    { client: 'John Silva', time: '10:00 AM', type: 'Personal Training', status: 'confirmed' },
    { client: 'Priya Fernando', time: '2:00 PM', type: 'Group Class', status: 'confirmed' },
    { client: 'Mike Perera', time: '4:30 PM', type: 'Personal Training', status: 'pending' },
    { client: 'Sarah Johnson', time: '6:00 PM', type: 'Consultation', status: 'confirmed' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="text-gray-600 mt-2">
            Here's what's happening with your training business today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {trainerStats.map((stat, index) => (
            <div key={index} className={`${stat.color} rounded-xl p-6 hover:shadow-lg transition-shadow`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-green-600">{stat.change}</p>
                </div>
                <div className="p-3 bg-white rounded-lg">
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                {quickActions.map((action, index) => (
                  <Link
                    key={index}
                    to={action.link}
                    className={`${action.color} p-4 rounded-lg block transition-colors`}
                  >
                    <div className="flex items-center space-x-3">
                      {action.icon}
                      <div>
                        <p className="font-medium text-gray-900">{action.title}</p>
                        <p className="text-sm text-gray-600">{action.description}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Clients & Upcoming Sessions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Clients */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Recent Clients</h3>
                <Link to="/trainer/clients" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View All
                </Link>
              </div>
              
              <div className="space-y-3">
                {recentClients.map((client, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{client.name}</p>
                        <p className="text-sm text-gray-600">{client.plan}</p>
                        <p className="text-xs text-gray-500">Last session: {client.lastSession}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">{client.progress}</div>
                      <div className="w-16 bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: client.progress }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Sessions */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Upcoming Sessions</h3>
                <Link to="/trainer/schedule" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View Schedule
                </Link>
              </div>
              
              <div className="space-y-3">
                {upcomingSessions.map((session, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Clock className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">{session.client}</p>
                        <p className="text-sm text-gray-600">{session.type}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{session.time}</p>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        session.status === 'confirmed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {session.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Award className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-900">Client John Silva completed his 30-day challenge</p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Dumbbell className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-900">Created new "Advanced Strength" workout plan</p>
                <p className="text-xs text-gray-500">1 day ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <UserPlus className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-900">New client Sarah Johnson joined your program</p>
                <p className="text-xs text-gray-500">3 days ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerDashboard;
