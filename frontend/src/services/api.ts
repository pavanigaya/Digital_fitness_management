// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Types
export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  phone?: string;
  role: 'customer' | 'admin' | 'trainer';
  membership: {
    type: 'basic' | 'premium' | 'vip';
    isActive: boolean;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  category: string;
  subcategory?: string;
  brand?: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  description: string;
  shortDescription?: string;
  images: Array<{
    url: string;
    alt?: string;
    isPrimary: boolean;
  }>;
  averageRating: number;
  reviewCount: number;
  isFeatured: boolean;
  isOnSale: boolean;
  discountPercentage: number;
  stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock';
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  user: User;
  items: Array<{
    product: string;
    name: string;
    sku?: string;
    image?: string;
    category: string;
    price: number;
    quantity: number;
    totalPrice: number;
  }>;
  shippingInfo: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: string;
  paymentStatus: string;
  subtotal: number;
  tax: number;
  shippingCost: number;
  discount: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
  trackingNumber?: string;
  trackingUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkoutPlan {
  _id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  duration: {
    value: number;
    unit: 'days' | 'weeks' | 'months';
  };
  price: number;
  compareAtPrice?: number;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  category: string;
  goals: string[];
  trainer: User;
  trainerInfo: {
    name: string;
    bio?: string;
    certifications: string[];
    experience: number;
    profileImage?: string;
  };
  difficulty: number;
  equipment: Array<{
    name: string;
    required: boolean;
    alternatives: string[];
  }>;
  sessions: Array<{
    name: string;
    description?: string;
    duration: number;
    exercises: Array<{
      name: string;
      sets?: number;
      reps?: string;
      weight?: string;
      rest?: number;
      notes?: string;
    }>;
    order: number;
  }>;
  maxMembers: number;
  activeMembers: number;
  averageRating: number;
  reviewCount: number;
  isFeatured: boolean;
  isOnSale: boolean;
  discountPercentage: number;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

// API Client Class
class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'An error occurred');
      }

      return data;
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  // Auth API
  async login(emailOrUsername: string, password: string) {
    const response = await this.request<{ user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ emailOrUsername, password }),
    });
    
    this.setToken(response.data.token);
    return response;
  }

  async register(userData: {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
    phone?: string;
    dateOfBirth?: string;
    gender?: string;
    fitnessLevel?: string;
    goals?: string[];
  }) {
    const response = await this.request<{ user: User; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    this.setToken(response.data.token);
    return response;
  }

  async getCurrentUser() {
    return this.request<User>('/auth/me');
  }

  async logout() {
    await this.request('/auth/logout', { method: 'POST' });
    this.setToken(null);
  }

  // Products API
  async getProducts(params: {
    page?: number;
    limit?: number;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    rating?: number;
    inStock?: boolean;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, value.toString());
      }
    });

    return this.request<{ items: Product[]; pagination: any }>(`/products?${searchParams}`);
  }

  async searchProducts(params: {
    q?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    rating?: number;
    inStock?: boolean;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
  } = {}) {
    const searchParams = new URLSearchParams();
    
    // Map frontend parameters to backend parameters
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        let mappedKey = key;
        let mappedValue = value.toString();
        
        // Map parameter names to match backend expectations
        if (key === 'q') {
          mappedKey = 'search';
        } else if (key === 'sortBy') {
          mappedKey = 'sort';
        } else if (key === 'sortOrder') {
          mappedKey = 'order';
        }
        
        searchParams.append(mappedKey, mappedValue);
      }
    });

    return this.request<{ items: Product[]; page: number; limit: number; total: number; totalPages: number }>(`/products?${searchParams}`);
  }

  async getProduct(id: string) {
    return this.request<Product>(`/products/${id}`);
  }

  async getProductBySlug(slug: string) {
    return this.request<Product>(`/products/slug/${slug}`);
  }

  async getFeaturedProducts(limit = 10) {
    return this.request<Product[]>(`/products/featured?limit=${limit}`);
  }

  async getProductsOnSale(limit = 10) {
    return this.request<Product[]>(`/products/on-sale?limit=${limit}`);
  }

  async addProductReview(productId: string, review: {
    rating: number;
    title: string;
    comment: string;
  }) {
    return this.request<Product>(`/products/${productId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(review),
    });
  }

  // Orders API
  async createOrder(orderData: {
    items: Array<{
      product: string;
      quantity: number;
    }>;
    shippingInfo: {
      fullName: string;
      email: string;
      phone: string;
      address: string;
      city: string;
      state?: string;
      postalCode: string;
      country: string;
    };
    billingInfo?: {
      fullName: string;
      email: string;
      phone: string;
      address: string;
      city: string;
      state?: string;
      postalCode: string;
      country: string;
    };
    paymentMethod: string;
    notes?: string;
    isGift?: boolean;
    giftMessage?: string;
  }) {
    return this.request<Order>('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async getOrders(params: {
    page?: number;
    limit?: number;
    status?: string;
    sort?: string;
    order?: 'asc' | 'desc';
  } = {}) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, value.toString());
      }
    });

    return this.request<{ data: Order[]; pagination: any }>(`/orders/my-orders?${searchParams}`);
  }

  async getOrder(id: string) {
    return this.request<Order>(`/orders/${id}`);
  }

  async cancelOrder(id: string, reason?: string) {
    return this.request<Order>(`/orders/${id}/cancel`, {
      method: 'PUT',
      body: JSON.stringify({ reason }),
    });
  }

  async getOrderStats(params: {
    startDate?: string;
    endDate?: string;
  } = {}) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, value.toString());
      }
    });

    return this.request<any>(`/orders/stats?${searchParams}`);
  }

  // Workout Plans API
  async getWorkoutPlans(params: {
    page?: number;
    limit?: number;
    category?: string;
    level?: string;
    minPrice?: number;
    maxPrice?: number;
    rating?: number;
    available?: boolean;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, value.toString());
      }
    });

    return this.request<{ data: WorkoutPlan[]; pagination: any }>(`/workout-plans?${searchParams}`);
  }

  async searchWorkoutPlans(params: {
    q?: string;
    category?: string;
    level?: string;
    minPrice?: number;
    maxPrice?: number;
    rating?: number;
    available?: boolean;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
  } = {}) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, value.toString());
      }
    });

    return this.request<{ data: WorkoutPlan[]; pagination: any }>(`/workout-plans/search?${searchParams}`);
  }

  async getWorkoutPlan(id: string) {
    return this.request<WorkoutPlan>(`/workout-plans/${id}`);
  }

  async getWorkoutPlanBySlug(slug: string) {
    return this.request<WorkoutPlan>(`/workout-plans/slug/${slug}`);
  }

  async getFeaturedPlans(limit = 10) {
    return this.request<WorkoutPlan[]>(`/workout-plans/featured?limit=${limit}`);
  }

  async getPlansOnSale(limit = 10) {
    return this.request<WorkoutPlan[]>(`/workout-plans/on-sale?limit=${limit}`);
  }

  async joinWorkoutPlan(planId: string) {
    return this.request<WorkoutPlan>(`/workout-plans/${planId}/join`, {
      method: 'POST',
    });
  }

  async leaveWorkoutPlan(planId: string) {
    return this.request<WorkoutPlan>(`/workout-plans/${planId}/leave`, {
      method: 'POST',
    });
  }

  async addWorkoutPlanReview(planId: string, review: {
    rating: number;
    title: string;
    comment: string;
  }) {
    return this.request<WorkoutPlan>(`/workout-plans/${planId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(review),
    });
  }

  // Workout Plan CRUD (for trainers)
  async createWorkoutPlan(plan: Partial<WorkoutPlan>) {
    return this.request<WorkoutPlan>('/workout-plans', {
      method: 'POST',
      body: JSON.stringify(plan),
    });
  }

  async updateWorkoutPlan(planId: string, plan: Partial<WorkoutPlan>) {
    return this.request<WorkoutPlan>(`/workout-plans/${planId}`, {
      method: 'PUT',
      body: JSON.stringify(plan),
    });
  }

  async deleteWorkoutPlan(planId: string) {
    return this.request<void>(`/workout-plans/${planId}`, {
      method: 'DELETE',
    });
  }

  // Admin API
  async getAllOrders(params: {
    page?: number;
    limit?: number;
    status?: string;
    sort?: string;
    order?: 'asc' | 'desc';
  } = {}) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, value.toString());
      }
    });

    return this.request<{ data: Order[]; pagination: any }>(`/orders?${searchParams}`);
  }

  async updateOrderStatus(id: string, statusData: {
    status: string;
    trackingNumber?: string;
    trackingUrl?: string;
    notes?: string;
  }) {
    return this.request<Order>(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify(statusData),
    });
  }

  async getAllProducts(params: {
    page?: number;
    limit?: number;
    category?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, value.toString());
      }
    });

    return this.request<{ items: Product[]; pagination: any }>(`/products?${searchParams}`);
  }

  async createProduct(productData: any) {
    return this.request<Product>('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  async updateProduct(id: string, productData: any) {
    return this.request<Product>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  }

  async deleteProduct(id: string) {
    return this.request<{ message: string }>(`/products/${id}`, {
      method: 'DELETE',
    });
  }

  async getLowStockProducts() {
    return this.request<Product[]>('/products/low-stock');
  }

  async updateProductStock(productId: string, stockData: {
    quantity: number;
    operation: 'set' | 'add' | 'subtract';
  }) {
    return this.request<Product>(`/products/${productId}/stock`, {
      method: 'PUT',
      body: JSON.stringify(stockData),
    });
  }

  async bulkUpdateStock(products: Array<{ id: string; stock: number }>) {
    return this.request<{ matched: number; modified: number }>('/products/bulk/stock', {
      method: 'PUT',
      body: JSON.stringify({ products }),
    });
  }

  async getAllUsers(params: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
  } = {}) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, value.toString());
      }
    });

    return this.request<{ items: User[]; pagination: any }>(`/users?${searchParams}`);
  }

  async updateUser(id: string, userData: any) {
    return this.request<User>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id: string) {
    return this.request<{ message: string }>(`/users/${id}`, {
      method: 'DELETE',
    });
  }
}

// Create and export API client instance
export const apiClient = new ApiClient(API_BASE_URL);

// Export types
export type { User, Product, Order, WorkoutPlan, ApiResponse };
