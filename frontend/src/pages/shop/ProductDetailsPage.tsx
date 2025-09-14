import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, ShoppingCart, Heart, Share2, Truck, Shield, RotateCcw } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';

const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  // Mock product data - in real app, this would be fetched based on ID
  const product = {
    id: id || '1',
    name: 'Whey Protein Isolate',
    category: 'protein',
    price: 8500,
    originalPrice: 9500,
    images: [
      'https://images.pexels.com/photos/4162493/pexels-photo-4162493.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/4162491/pexels-photo-4162491.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/4162564/pexels-photo-4162564.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    rating: 4.8,
    reviews: 245,
    inStock: true,
    stockCount: 23,
    description: 'Premium whey protein isolate designed for serious athletes and fitness enthusiasts. This high-quality protein powder delivers 25g of pure protein per serving with minimal carbs and fats.',
    ingredients: ['Whey Protein Isolate', 'Natural Flavors', 'Lecithin', 'Stevia Extract'],
    nutritionFacts: {
      servingSize: '30g',
      protein: '25g',
      carbs: '2g',
      fat: '0.5g',
      calories: '110'
    },
    features: [
      'Fast-absorbing whey protein isolate',
      '25g protein per serving',
      'Low in carbs and fat',
      'Gluten-free formula',
      'Third-party tested for purity',
      'Available in 5 delicious flavors'
    ]
  };

  const reviews = [
    {
      name: 'John Silva',
      rating: 5,
      comment: 'Excellent quality protein! Mixes well and tastes great. Highly recommended!',
      date: '2 weeks ago',
      verified: true
    },
    {
      name: 'Priya Fernando',
      rating: 4,
      comment: 'Good protein powder, helps with recovery after workouts. Value for money.',
      date: '1 month ago',
      verified: true
    },
    {
      name: 'Mike Perera',
      rating: 5,
      comment: 'Been using this for 6 months. Great results and no digestive issues.',
      date: '2 months ago',
      verified: true
    }
  ];

  const relatedProducts = [
    { id: '2', name: 'Creatine Monohydrate', price: 3200, image: 'https://images.pexels.com/photos/4162491/pexels-photo-4162491.jpeg?auto=compress&cs=tinysrgb&w=300' },
    { id: '4', name: 'Pre-Workout Formula', price: 4200, image: 'https://images.pexels.com/photos/4162564/pexels-photo-4162564.jpeg?auto=compress&cs=tinysrgb&w=300' },
    { id: '8', name: 'BCAA Recovery Drink', price: 2800, image: 'https://images.pexels.com/photos/4162493/pexels-photo-4162493.jpeg?auto=compress&cs=tinysrgb&w=300' }
  ];

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        category: product.category
      });
    }
    alert(`Added ${quantity} ${product.name}(s) to cart!`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex mb-8 text-sm">
          <Link to="/" className="text-blue-600 hover:text-blue-700">Home</Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link to="/shop" className="text-blue-600 hover:text-blue-700">Shop</Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-600">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Product Images */}
          <div>
            <div className="mb-4">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-96 object-cover rounded-xl shadow-lg"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`border-2 rounded-lg overflow-hidden ${
                    selectedImage === index ? 'border-blue-500' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-24 object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-4">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-gray-600">({product.reviews} reviews)</span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {product.inStock ? `In Stock (${product.stockCount})` : 'Out of Stock'}
                </span>
              </div>
            </div>

            {/* Pricing */}
            <div className="mb-6">
              <div className="flex items-center space-x-4">
                <span className="text-3xl font-bold text-gray-900">
                  Rs. {product.price.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <>
                    <span className="text-xl text-gray-500 line-through">
                      Rs. {product.originalPrice.toLocaleString()}
                    </span>
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm font-medium">
                      {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Features */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Key Features:</h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-600">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Add to Cart */}
            <div className="mb-6">
              <div className="flex items-center space-x-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 text-gray-900 font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4 mb-6">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center ${
                    product.inStock
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </button>
                <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Heart className="h-5 w-5 text-gray-600" />
                </button>
                <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Share2 className="h-5 w-5 text-gray-600" />
                </button>
              </div>

              {/* Guarantees */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="flex flex-col items-center">
                  <Truck className="h-6 w-6 text-green-600 mb-2" />
                  <span className="text-xs text-gray-600">Free Delivery</span>
                </div>
                <div className="flex flex-col items-center">
                  <Shield className="h-6 w-6 text-blue-600 mb-2" />
                  <span className="text-xs text-gray-600">Authentic</span>
                </div>
                <div className="flex flex-col items-center">
                  <RotateCcw className="h-6 w-6 text-purple-600 mb-2" />
                  <span className="text-xs text-gray-600">Easy Returns</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Nutrition Facts & Reviews */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Nutrition Facts */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Nutrition Facts</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Serving Size:</span>
                <span className="font-medium">{product.nutritionFacts.servingSize}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Protein:</span>
                <span className="font-medium">{product.nutritionFacts.protein}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Carbohydrates:</span>
                <span className="font-medium">{product.nutritionFacts.carbs}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Fat:</span>
                <span className="font-medium">{product.nutritionFacts.fat}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-gray-600">Calories:</span>
                <span className="font-bold">{product.nutritionFacts.calories}</span>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="font-semibold text-gray-900 mb-2">Ingredients:</h4>
              <p className="text-gray-600 text-sm">
                {product.ingredients.join(', ')}
              </p>
            </div>
          </div>

          {/* Reviews */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Customer Reviews</h3>
            <div className="space-y-4">
              {reviews.map((review, index) => (
                <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">{review.name}</span>
                      {review.verified && (
                        <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs">
                          Verified
                        </span>
                      )}
                    </div>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-1">{review.comment}</p>
                  <p className="text-xs text-gray-500">{review.date}</p>
                </div>
              ))}
            </div>
            <button className="mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium">
              View all {product.reviews} reviews
            </button>
          </div>
        </div>

        {/* Related Products */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">You might also like</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <Link
                key={relatedProduct.id}
                to={`/product/${relatedProduct.id}`}
                className="group"
              >
                <div className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                  <img
                    src={relatedProduct.image}
                    alt={relatedProduct.name}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4">
                    <h4 className="font-medium text-gray-900 mb-2">{relatedProduct.name}</h4>
                    <p className="text-lg font-bold text-blue-600">
                      Rs. {relatedProduct.price.toLocaleString()}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;