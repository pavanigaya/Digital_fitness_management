import React, { useState } from 'react';
import { Star, Send, CheckCircle, User, MessageSquare } from 'lucide-react';

const FeedbackPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('trainer');
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const categories = [
    { id: 'trainer', label: 'Trainer', icon: <User className="h-5 w-5" /> },
    { id: 'nutritionist', label: 'Nutritionist', icon: <User className="h-5 w-5" /> },
    { id: 'service', label: 'Gym Service', icon: <MessageSquare className="h-5 w-5" /> }
  ];

  const services = {
    trainer: [
      'Alex Johnson (Beginner Strength)',
      'Sarah Williams (Muscle Building)',
      'Mike Thompson (Powerlifting)',
      'Emma Davis (Fat Loss)'
    ],
    nutritionist: [
      'Dr. Lisa Chen',
      'James Rodriguez',
      'Maria Gonzalez'
    ],
    service: [
      'Equipment Quality',
      'Facility Cleanliness',
      'Customer Support',
      'Online Platform',
      'Booking System'
    ]
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      alert('Please provide a rating!');
      return;
    }
    if (!selectedService) {
      alert('Please select a service/trainer!');
      return;
    }
    if (!feedback.trim()) {
      alert('Please provide your feedback!');
      return;
    }

    // In a real app, this would submit to the backend
    setIsSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setRating(0);
      setFeedback('');
      setSelectedService('');
    }, 3000);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md mx-4">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h2>
          <p className="text-gray-600 mb-6">
            Your feedback has been submitted successfully. We appreciate your input and will use it to improve our services.
          </p>
          <div className="animate-pulse text-sm text-gray-500">
            Redirecting to dashboard...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Share Your Feedback</h1>
          <p className="text-gray-600">
            Help us improve by sharing your experience with our trainers, nutritionists, and services.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Category Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                What would you like to provide feedback on?
              </label>
              <div className="grid grid-cols-3 gap-4">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(category.id);
                      setSelectedService('');
                    }}
                    className={`p-4 border rounded-lg text-center transition-all duration-200 ${
                      selectedCategory === category.id
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      {category.icon}
                      <span className="text-sm font-medium">{category.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Service/Trainer Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select {selectedCategory === 'trainer' ? 'Trainer' : selectedCategory === 'nutritionist' ? 'Nutritionist' : 'Service'}
              </label>
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Choose...</option>
                {services[selectedCategory as keyof typeof services].map((service, index) => (
                  <option key={index} value={service}>
                    {service}
                  </option>
                ))}
              </select>
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Overall Rating
              </label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="p-1 transition-transform duration-200 transform hover:scale-110"
                  >
                    <Star
                      className={`h-8 w-8 ${
                        star <= (hoveredRating || rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {rating === 0 ? 'Click to rate' : 
                 rating === 1 ? 'Poor' :
                 rating === 2 ? 'Fair' :
                 rating === 3 ? 'Good' :
                 rating === 4 ? 'Very Good' : 'Excellent'}
              </p>
            </div>

            {/* Feedback Text */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Feedback
              </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={5}
                className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Share your thoughts, suggestions, or experiences..."
                required
              />
              <p className="text-sm text-gray-500 mt-2">
                {feedback.length}/500 characters
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              <Send className="h-4 w-4 mr-2" />
              Submit Feedback
            </button>
          </form>
        </div>

        {/* Previous Feedback */}
        <div className="mt-8 bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Recent Feedback</h3>
          <div className="space-y-4">
            {[
              {
                service: 'Sarah Williams (Muscle Building)',
                rating: 5,
                feedback: 'Excellent trainer! Very knowledgeable and supportive.',
                date: '2 weeks ago'
              },
              {
                service: 'Equipment Quality',
                rating: 4,
                feedback: 'Great equipment, but could use more variety in cardio machines.',
                date: '1 month ago'
              }
            ].map((item, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{item.service}</h4>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < item.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-2">{item.feedback}</p>
                <p className="text-xs text-gray-500">{item.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;