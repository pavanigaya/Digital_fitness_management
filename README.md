# Digital Fitness Management System

A comprehensive full-stack fitness management platform that allows customers to buy fitness items, join workout plans, and enables admins to manage products, orders, and users.

## 🚀 Features

### Customer Features
- **User Authentication**: Secure registration and login with JWT tokens
- **Product Shopping**: Browse, search, and filter fitness products
- **Shopping Cart**: Add/remove items with real-time stock validation
- **Order Management**: Place orders with multiple payment methods
- **Workout Plans**: Join and participate in professional workout programs
- **User Dashboard**: Track orders, workout progress, and account settings
- **Product Reviews**: Rate and review products

### Admin Features
- **Product Management**: Create, update, delete, and manage inventory
- **Order Processing**: View, update status, and manage customer orders
- **User Management**: Manage customer accounts and roles
- **Workout Plan Management**: Create and manage workout programs
- **Analytics Dashboard**: View sales statistics and system metrics
- **Stock Management**: Monitor low stock and bulk update inventory

### Trainer Features
- **Workout Plan Creation**: Design and publish workout programs
- **Member Management**: Track plan participants and progress
- **Content Management**: Upload videos, images, and exercise guides

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Bcryptjs** for password hashing
- **Express-validator** for input validation
- **CORS** for cross-origin requests
- **Morgan** for request logging

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Axios** for API calls

## 📁 Project Structure

```
Digital_fitness_management/
├── backend/
│   ├── config/
│   │   └── db.js                 # Database configuration
│   ├── controllers/
│   │   ├── authController.js     # Authentication logic
│   │   ├── orderController.js    # Order management
│   │   ├── productController.js  # Product management
│   │   └── workoutPlanController.js # Workout plan management
│   ├── middleware/
│   │   ├── auth.js              # Authentication middleware
│   │   ├── validation.js        # Input validation
│   │   ├── orderValidation.js   # Order-specific validation
│   │   └── productValidation.js # Product-specific validation
│   ├── models/
│   │   ├── User.js              # User schema
│   │   ├── Product.js           # Product schema
│   │   ├── Order.js             # Order schema
│   │   ├── WorkoutPlan.js       # Workout plan schema
│   │   ├── Feedback.js          # Feedback schema
│   │   └── Membership.js        # Membership schema
│   ├── routes/
│   │   ├── authRoutes.js        # Authentication routes
│   │   ├── orderRoutes.js       # Order routes
│   │   ├── productRoutes.js     # Product routes
│   │   ├── userRoutes.js        # User routes
│   │   └── workoutPlanRoutes.js # Workout plan routes
│   ├── utils/
│   │   └── auth.js              # Authentication utilities
│   ├── server.js                # Main server file
│   ├── package.json             # Backend dependencies
│   └── .env.example             # Environment variables template
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   └── ProtectedRoute.tsx
│   │   │   └── layout/
│   │   │       ├── Header.tsx
│   │   │       └── Footer.tsx
│   │   ├── contexts/
│   │   │   ├── AuthContext.tsx  # Authentication context
│   │   │   └── CartContext.tsx  # Shopping cart context
│   │   ├── pages/
│   │   │   ├── admin/           # Admin pages
│   │   │   ├── auth/            # Authentication pages
│   │   │   ├── customer/        # Customer pages
│   │   │   ├── shop/            # Shopping pages
│   │   │   └── workout/         # Workout plan pages
│   │   ├── services/
│   │   │   └── api.ts           # API service layer
│   │   ├── App.tsx              # Main app component
│   │   └── main.tsx             # App entry point
│   ├── package.json             # Frontend dependencies
│   └── .env.example             # Environment variables template
└── README.md                    # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables**
   ```env
   MONGODB_URI=mongodb://localhost:27017/fitness_management
   JWT_SECRET=your_jwt_secret_key
   JWT_REFRESH_SECRET=your_refresh_secret_key
   JWT_EXPIRE=7d
   JWT_REFRESH_EXPIRE=30d
   FRONTEND_URL=http://localhost:3000
   NODE_ENV=development
   ```

5. **Start the server**
   ```bash
   npm start
   ```

   The backend will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables**
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_APP_NAME=Digital Fitness Management System
   VITE_APP_VERSION=1.0.0
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

   The frontend will run on `http://localhost:3000`

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Product Endpoints
- `GET /api/products` - Get all products (with pagination, filtering, sorting)
- `GET /api/products/search` - Search products
- `GET /api/products/featured` - Get featured products
- `GET /api/products/on-sale` - Get products on sale
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)

### Order Endpoints
- `POST /api/orders` - Create order
- `GET /api/orders/my-orders` - Get user's orders
- `GET /api/orders/:id` - Get order by ID
- `PUT /api/orders/:id/cancel` - Cancel order
- `PUT /api/orders/:id/status` - Update order status (Admin only)
- `GET /api/orders/stats` - Get order statistics

### Workout Plan Endpoints
- `GET /api/workout-plans` - Get all workout plans
- `GET /api/workout-plans/search` - Search workout plans
- `GET /api/workout-plans/featured` - Get featured plans
- `GET /api/workout-plans/:id` - Get plan by ID
- `POST /api/workout-plans/:id/join` - Join workout plan
- `POST /api/workout-plans/:id/leave` - Leave workout plan
- `POST /api/workout-plans` - Create plan (Admin/Trainer only)

## 🔐 Authentication & Authorization

The system uses JWT tokens for authentication with role-based access control:

- **Customer**: Can browse products, place orders, join workout plans
- **Trainer**: Can create and manage workout plans, view plan members
- **Admin**: Full access to all features including user and system management

## 🛒 Shopping Features

### Product Management
- Real-time stock validation
- Product variants and reviews
- Advanced search and filtering
- Featured and sale products
- Image galleries and descriptions

### Order Processing
- Multiple payment methods (Card, Cash on Delivery)
- Order status tracking
- Automatic stock updates
- Order cancellation with stock restoration
- Shipping and billing information

### Cart Management
- Persistent cart storage
- Real-time price calculation
- Stock validation
- Quantity management

## 💪 Workout Plan Features

### Plan Management
- Multiple difficulty levels
- Trainer information and certifications
- Equipment requirements
- Session scheduling
- Member capacity management

### Member Features
- Join/leave plans
- Progress tracking
- Review and rating system
- Plan availability checking

## 📊 Admin Dashboard

### Product Management
- Create, edit, delete products
- Inventory management
- Low stock alerts
- Bulk operations
- Product analytics

### Order Management
- View all orders
- Update order status
- Order statistics
- Customer information
- Payment tracking

### User Management
- User accounts overview
- Role management
- Account status control
- User analytics

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB Atlas or local MongoDB
2. Configure production environment variables
3. Deploy to Heroku, AWS, or your preferred platform
4. Set up SSL certificates

### Frontend Deployment
1. Build the production bundle
   ```bash
   npm run build
   ```
2. Deploy to Vercel, Netlify, or your preferred platform
3. Configure environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔄 Version History

- **v1.0.0** - Initial release with core features
  - User authentication and authorization
  - Product management and shopping
  - Order processing and management
  - Workout plan system
  - Admin dashboard
  - Responsive design

---

**Built with ❤️ for the fitness community**
