import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/customer/DashboardPage';
import ProfilePage from './pages/customer/ProfilePage';
import WorkoutPlansPage from './pages/workout/WorkoutPlansPage';
import ShopPage from './pages/shop/ShopPage';
import ProductDetailsPage from './pages/shop/ProductDetailsPage';
import CartPage from './pages/shop/CartPage';
import CheckoutPage from './pages/shop/CheckoutPage';
import ContactPage from './pages/ContactPage';
import MembershipPage from './pages/MembershipPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import TrainerDashboard from './pages/trainer/TrainerDashboard';
import TrainerWorkoutPlans from './pages/trainer/TrainerWorkoutPlans';
import RoleBasedDashboard from './components/dashboard/RoleBasedDashboard';
import FeedbackPage from './pages/customer/FeedbackPage';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/membership" element={<MembershipPage />} />
                <Route path="/workout-plans" element={<WorkoutPlansPage />} />
                <Route path="/shop" element={<ShopPage />} />
                <Route path="/product/:id" element={<ProductDetailsPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route 
                  path="/checkout" 
                  element={
                    <ProtectedRoute>
                      <CheckoutPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <RoleBasedDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/feedback" 
                  element={
                    <ProtectedRoute>
                      <FeedbackPage />
                    </ProtectedRoute>
                  } 
                />
                {/* Role-specific dashboard routes */}
                <Route 
                  path="/admin/*" 
                  element={
                    <ProtectedRoute adminOnly>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/trainer" 
                  element={
                    <ProtectedRoute trainerOnly>
                      <TrainerDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/trainer/workout-plans" 
                  element={
                    <ProtectedRoute trainerOnly>
                      <TrainerWorkoutPlans />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/customer/*" 
                  element={
                    <ProtectedRoute customerOnly>
                      <DashboardPage />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;