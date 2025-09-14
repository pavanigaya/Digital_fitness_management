import React from 'react';
import { Link } from 'react-router-dom';
import { Dumbbell, Facebook, Instagram, Youtube, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About & Links */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Dumbbell className="h-6 w-6 text-blue-400" />
              <span className="text-lg font-bold">GainsHub</span>
            </div>
            <p className="text-gray-400 text-sm">
              Your Digital Fitness Partner for achieving your health and wellness goals.
            </p>
            <div className="space-y-2">
              <Link to="/about" className="block text-gray-400 hover:text-white text-sm transition-colors">
                About GainsHub
              </Link>
              <Link to="/mission" className="block text-gray-400 hover:text-white text-sm transition-colors">
                Mission & Vision
              </Link>
              <Link to="/terms" className="block text-gray-400 hover:text-white text-sm transition-colors">
                Terms & Conditions
              </Link>
              <Link to="/privacy" className="block text-gray-400 hover:text-white text-sm transition-colors">
                Privacy Policy
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <div className="space-y-2">
              <Link to="/membership" className="block text-gray-400 hover:text-white text-sm transition-colors">
                Membership Packages
              </Link>
              <Link to="/shop" className="block text-gray-400 hover:text-white text-sm transition-colors">
                Shop Products
              </Link>
              <Link to="/workout-plans" className="block text-gray-400 hover:text-white text-sm transition-colors">
                Workout Plans
              </Link>
              <Link to="/trainers" className="block text-gray-400 hover:text-white text-sm transition-colors">
                Trainers
              </Link>
              <Link to="/contact" className="block text-gray-400 hover:text-white text-sm transition-colors">
                Contact Us / Support
              </Link>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Services</h3>
            <div className="space-y-2">
              <span className="block text-gray-400 text-sm">Personal Training</span>
              <span className="block text-gray-400 text-sm">Nutrition Planning</span>
              <span className="block text-gray-400 text-sm">Group Classes</span>
              <span className="block text-gray-400 text-sm">Online Coaching</span>
              <span className="block text-gray-400 text-sm">Supplement Store</span>
            </div>
          </div>

          {/* Contact & Socials */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-400 text-sm">
                  GainsHub Fitness Center<br />
                  Colombo, Sri Lanka
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-blue-400" />
                <span className="text-gray-400 text-sm">+94 11-7693510</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-blue-400" />
                <span className="text-gray-400 text-sm">support@gainshub.com</span>
              </div>
            </div>

            {/* Social Media */}
            <div className="pt-4">
              <h4 className="text-sm font-semibold mb-3">Follow Us</h4>
              <div className="flex space-x-3">
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                  <Youtube className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            Copyright © 2025 GainsHub | All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;