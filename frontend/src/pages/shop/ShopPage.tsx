import React, { useState } from 'react';
import { Search, Filter, ShoppingCart, Star, Grid, List } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';

const ShopPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('name');
  const { addToCart } = useCart();

  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'protein', name: 'Protein' },
    { id: 'supplements', name: 'Supplements' },
    { id: 'equipment', name: 'Equipment' },
    { id: 'apparel', name: 'Apparel' },
    { id: 'accessories', name: 'Accessories' }
  ];

  const products = [
    {
      id: '1',
      name: 'Whey Protein Isolate',
      category: 'protein',
      price: 8500,
      originalPrice: 9500,
      image: 'https://images.pexels.com/photos/4162493/pexels-photo-4162493.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.8,
      reviews: 245,
      inStock: true,
      description: 'Premium whey protein isolate for muscle building and recovery.'
    },
    {
      id: '2',
      name: 'Creatine Monohydrate',
      category: 'supplements',
      price: 3200,
      originalPrice: null,
      image: 'https://images.pexels.com/photos/4162491/pexels-photo-4162491.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.9,
      reviews: 189,
      inStock: true,
      description: 'Pure creatine monohydrate for enhanced strength and power.'
    },
    {
      id: '3',
      name: 'Adjustable Dumbbells',
      category: 'equipment',
      price: 25000,
      originalPrice: 28000,
      image: 'https://images.pexels.com/photos/1229356/pexels-photo-1229356.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.7,
      reviews: 78,
      inStock: true,
      description: 'Professional adjustable dumbbells set (5-50kg per dumbbell).'
    },
    {
      id: '4',
      name: 'Pre-Workout Formula',
      category: 'supplements',
      price: 4200,
      originalPrice: null,
      image: 'https://images.pexels.com/photos/4162564/pexels-photo-4162564.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.6,
      reviews: 156,
      inStock: true,
      description: 'Energy-boosting pre-workout formula with natural ingredients.'
    },
    {
      id: '5',
      name: 'Yoga Mat Premium',
      category: 'accessories',
      price: 1800,
      originalPrice: 2200,
      image: 'https://images.pexels.com/photos/4056723/pexels-photo-4056723.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.5,
      reviews: 92,
      inStock: true,
      description: 'Non-slip premium yoga mat for all types of workouts.'
    },
    {
      id: '6',
      name: 'Fitness Tracker Band',
      category: 'accessories',
      price: 6800,
      originalPrice: null,
      image: 'https://images.pexels.com/photos/437040/pexels-photo-437040.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.3,
      reviews: 134,
      inStock: false,
      description: 'Advanced fitness tracker with heart rate monitoring.'
    },
    {
      id: '7',
      name: 'Gym Apparel Set',
      category: 'apparel',
      price: 3500,
      originalPrice: 4000,
      image: 'https://images.pexels.com/photos/1229356/pexels-photo-1229356.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.4,
      reviews: 67,
      inStock: true,
      description: 'Comfortable and breathable workout clothes set.'
    },
    {
      id: '8',
      name: 'BCAA Recovery Drink',
      category: 'supplements',
      price: 2800,
      originalPrice: null,
      image: 'https://images.pexels.com/photos/4162493/pexels-photo-4162493.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.7,
      reviews: 203,
      inStock: true,
      description: 'Essential amino acids for faster muscle recovery.'
    }
  ];

  const filteredProducts = products
    .filter(product => 
      (selectedCategory === 'all' || product.category === selectedCategory) &&
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        default:
          return a.name.localeCompare(b.name);
      }
    });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Shop Products</h1>
          <p className="text-gray-600">
            Premium supplements, equipment, and accessories for your fitness journey.
          </p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center space-x-4">
              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="name">Sort by Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>

              {/* View Mode */}
              <div className="flex border border-gray-300 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-600'}`}
                >
                  <Grid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600'}`}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className={`grid gap-6 mb-12 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
            : 'grid-cols-1'
        }`}>
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className={`bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 ${
                viewMode === 'list' ? 'flex' : ''
              }`}
            >
              <div className={`${viewMode === 'list' ? 'w-48 flex-shrink-0' : ''}`}>
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className={`w-full object-cover ${viewMode === 'list' ? 'h-48' : 'h-48'}`}
                  />
                  {product.originalPrice && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                      Save Rs. {(product.originalPrice - product.price).toLocaleString()}
                    </div>
                  )}
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <span className="text-white font-semibold">Out of Stock</span>
                    </div>
                  )}
                </div>
              </div>

              <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600">{product.rating}</span>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-3">{product.description}</p>

                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-xl font-bold text-gray-900">
                      Rs. {product.price.toLocaleString()}
                    </div>
                    {product.originalPrice && (
                      <div className="text-sm text-gray-500 line-through">
                        Rs. {product.originalPrice.toLocaleString()}
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">
                    {product.reviews} reviews
                  </span>
                </div>

                <div className="flex space-x-2">
                  <Link
                    to={`/product/${product.id}`}
                    className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg text-center font-medium hover:bg-gray-200 transition-colors"
                  >
                    View Details
                  </Link>
                  <button
                    onClick={() => addToCart(product)}
                    disabled={!product.inStock}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center ${
                      product.inStock
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-2">No products found</div>
            <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopPage;