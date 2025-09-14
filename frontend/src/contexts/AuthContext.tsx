import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  username: string;
  isAdmin: boolean;
  membershipStatus: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  username: string;
  password: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('gainshub_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock user data - in real app, this would come from your backend
    if (username === 'admin' && password === 'admin123') {
      const adminUser: User = {
        id: '1',
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@gainshub.com',
        phone: '+94117693510',
        address: 'Colombo, Sri Lanka',
        username: 'admin',
        isAdmin: true,
        membershipStatus: 'Premium'
      };
      setUser(adminUser);
      localStorage.setItem('gainshub_user', JSON.stringify(adminUser));
      setIsLoading(false);
      return true;
    } else if (username === 'john' && password === 'password') {
      const regularUser: User = {
        id: '2',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '+94771234567',
        address: '123 Main St, Colombo',
        username: 'john',
        isAdmin: false,
        membershipStatus: 'Basic'
      };
      setUser(regularUser);
      localStorage.setItem('gainshub_user', JSON.stringify(regularUser));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock registration - in real app, this would create user in backend
    const newUser: User = {
      id: Date.now().toString(),
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      phone: userData.phone,
      address: userData.address,
      username: userData.username,
      isAdmin: false,
      membershipStatus: 'Basic'
    };
    
    setUser(newUser);
    localStorage.setItem('gainshub_user', JSON.stringify(newUser));
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('gainshub_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};