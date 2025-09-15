import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '../services/api';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
  stock: number;
  sku?: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  isLoading: boolean;
  error: string | null;
}

const CartContext = createContext<CartContextType | null>(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('fitness_cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Failed to load cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem('fitness_cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (product: Product) => {
    setError(null);
    
    // Check if product is in stock
    if (product.stock <= 0) {
      setError('Product is out of stock');
      return;
    }

    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product._id);
      
      if (existingItem) {
        // Check if adding one more would exceed stock
        if (existingItem.quantity >= product.stock) {
          setError(`Only ${product.stock} items available in stock`);
          return prevItems;
        }
        
        return prevItems.map(item =>
          item.id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      
      // Add new item to cart
      const cartItem: CartItem = {
        id: product._id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.images[0]?.url || '/placeholder-product.jpg',
        category: product.category,
        stock: product.stock,
        sku: product.sku,
      };
      
      return [...prevItems, cartItem];
    });
  };

  const removeFromCart = (id: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }

    setItems(prevItems => {
      const item = prevItems.find(item => item.id === id);
      if (item && quantity > item.stock) {
        setError(`Only ${item.stock} items available in stock`);
        return prevItems;
      }

      return prevItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      );
    });
  };

  const clearCart = () => {
    setItems([]);
    setError(null);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotalItems,
      getTotalPrice,
      isLoading,
      error
    }}>
      {children}
    </CartContext.Provider>
  );
};