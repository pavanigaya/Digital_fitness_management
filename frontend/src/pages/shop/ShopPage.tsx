import React, { useState, useEffect } from 'react';
import { Search, Filter, ShoppingCart, Star, Grid, List, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { apiClient, Product } from '../../services/api';

const ShopPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { addToCart } = useCart();

  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'protein', name: 'Protein' },
    { id: 'supplements', name: 'Supplements' },
    { id: 'equipment', name: 'Equipment' },
    { id: 'apparel', name: 'Apparel' },
    { id: 'accessories', name: 'Accessories' },
    { id: 'nutrition', name: 'Nutrition' },
    { id: 'fitness', name: 'Fitness' }
  ];

  // Fetch products from API
  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, sortBy, sortOrder, currentPage, searchTerm]);

  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const params: any = {
        page: currentPage,
        limit: 12,
        sortBy,
        sortOrder,
      };

      if (selectedCategory !== 'all') {
        params.category = selectedCategory;
      }

      if (searchTerm.trim()) {
        params.q = searchTerm.trim();
      }

      const response = await apiClient.searchProducts(params);
      console.log('Products API response:', response);
      
      // The API service returns data directly, not wrapped in response.data
      if (response && response.items) {
        setProducts(response.items);
        setTotalPages(response.totalPages);
      } else if (response && Array.isArray(response)) {
        // Fallback if response is directly an array
        setProducts(response);
        setTotalPages(1);
      } else {
        console.error('Unexpected response structure:', response);
        setProducts([]);
        setTotalPages(1);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch products');
      console.error('Error fetching products:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchProducts();
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
    setCurrentPage(1);
  };

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
          <form onSubmit={handleSearch} className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
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
                onChange={(e) => handleCategoryChange(e.target.value)}
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
                onChange={(e) => handleSortChange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="createdAt">Newest First</option>
                <option value="price">Price: Low to High</option>
                <option value="-price">Price: High to Low</option>
                <option value="averageRating">Highest Rated</option>
                <option value="name">Name A-Z</option>
                <option value="-name">Name Z-A</option>
              </select>

              {/* View Mode */}
              <div className="flex border border-gray-300 rounded-lg">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-600'}`}
                >
                  <Grid className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600'}`}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Loading products...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="text-red-500 text-lg mb-2">Error loading products</div>
            <p className="text-gray-500 mb-4">{error}</p>
            <button
              onClick={fetchProducts}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Products Grid */}
        {!isLoading && !error && (
          <>
            <div className={`grid gap-6 mb-12 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1'
            }`}>
              {products.map((product) => (
                <div
                  key={product._id}
                  className={`bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 ${
                    viewMode === 'list' ? 'flex' : ''
                  }`}
                >
                  <div className={`${viewMode === 'list' ? 'w-48 flex-shrink-0' : ''}`}>
                    <div className="relative">
                      <img
                        src={product.images[0]?.url || '/placeholder-product.jpg'}
                        alt={product.name}
                        className={`w-full object-cover ${viewMode === 'list' ? 'h-48' : 'h-48'}`}
                      />
                      {product.compareAtPrice && product.compareAtPrice > product.price && (
                        <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                          Save Rs. {(product.compareAtPrice - product.price).toLocaleString()}
                        </div>
                      )}
                      {product.stock <= 0 && (
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
                        <span className="text-sm text-gray-600">{product.averageRating.toFixed(1)}</span>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-3">
                      {product.shortDescription || product.description}
                    </p>

                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="text-xl font-bold text-gray-900">
                          Rs. {product.price.toLocaleString()}
                        </div>
                        {product.compareAtPrice && product.compareAtPrice > product.price && (
                          <div className="text-sm text-gray-500 line-through">
                            Rs. {product.compareAtPrice.toLocaleString()}
                          </div>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">
                        {product.reviewCount} reviews
                      </span>
                    </div>

                    <div className="flex space-x-2">
                      <Link
                        to={`/product/${product._id}`}
                        className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg text-center font-medium hover:bg-gray-200 transition-colors"
                      >
                        View Details
                      </Link>
                      <button
                        onClick={() => addToCart(product)}
                        disabled={product.stock <= 0}
                        className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center ${
                          product.stock > 0
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                
                <div className="flex space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-2 rounded-lg ${
                          currentPage === page
                            ? 'bg-blue-600 text-white'
                            : 'border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            )}

            {products.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-lg mb-2">No products found</div>
                <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ShopPage;