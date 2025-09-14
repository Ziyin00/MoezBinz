import React, { useState, useEffect } from 'react';
import { BidIcon, ChevronRightIcon } from './Icons';
import { productService, type Product } from '../services/productService';
import BidModal from './BidModal';

// Remove static products - we'll fetch from API

interface ProductCardProps {
  product: Product;
  onBidClick: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onBidClick }) => {
  const isAuctionEnded = new Date() > new Date(product.endDate);
  const timeLeft = new Date(product.endDate).getTime() - new Date().getTime();
  const daysLeft = Math.ceil(timeLeft / (1000 * 60 * 60 * 24));

  return (
    <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden border border-gray-100">
      <div className="relative overflow-hidden">
        <img 
          src={`http://localhost:3001${product.imageUrl}`} 
          alt={product.name} 
          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Status badge */}
        <div className="absolute top-3 right-3">
          <span className={`px-3 py-1 text-xs font-bold rounded-full shadow-lg ${
            product.status === 'active' 
              ? 'bg-green-500 text-white' 
              : 'bg-gray-500 text-white'
          }`}>
            {product.status === 'active' ? 'LIVE' : 'ENDED'}
          </span>
        </div>

        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-white/90 text-gray-700 shadow-lg">
            {product.category}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-red-600 transition-colors">
          {product.name}
        </h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description}</p>
        
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-2xl font-bold text-red-600">${product.currentPrice.toFixed(2)}</p>
            <p className="text-sm text-gray-500">Start: ${product.startingPrice.toFixed(2)}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Ends in</p>
            <p className="text-sm font-semibold text-gray-900">
              {isAuctionEnded ? 'Ended' : `${daysLeft} day${daysLeft !== 1 ? 's' : ''}`}
            </p>
          </div>
        </div>
        
        <button 
          onClick={() => onBidClick(product)}
          disabled={isAuctionEnded || product.status !== 'active'}
          className="w-full bg-red-600 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 hover:bg-red-700 transition-all duration-300 transform group-hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl"
        >
          <BidIcon className="w-5 h-5" />
          {isAuctionEnded ? 'Auction Ended' : 'Place Bid'}
        </button>
      </div>
    </div>
  );
}


const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isBidModalOpen, setIsBidModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState('sat');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const dailyPrices = [
    { day: 'sat', label: 'Sat', price: '$19.99', fullDay: 'Smashing Saturday' },
    { day: 'sun', label: 'Sun', price: '$15.00', fullDay: 'Smart Sunday' },
    { day: 'mon', label: 'Mon', price: '$11.99', fullDay: 'Mega Monday' },
    { day: 'tue', label: 'Tue', price: '$8.99', fullDay: 'Thrifty Tuesday' },
    { day: 'wed', label: 'Wed', price: '$6.99', fullDay: 'Wow Wednesday' },
    { day: 'thu', label: 'Thu', price: '$4.99', fullDay: 'Treasure Thursday' },
    { day: 'fri', label: 'Fri', price: '$1.99', fullDay: 'Freak-out Friday' },
  ];

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'electronics', label: 'Electronics' },
    { id: 'home', label: 'Home & Garden' },
    { id: 'fashion', label: 'Fashion' },
    { id: 'sports', label: 'Sports & Outdoors' },
    { id: 'toys', label: 'Toys & Games' },
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getActiveProducts(1, 12);
      setProducts(response.products);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleBidClick = (product: Product) => {
    setSelectedProduct(product);
    setIsBidModalOpen(true);
  };

  const handleBidPlaced = () => {
    fetchProducts();
  };

  const handleCloseBidModal = () => {
    setIsBidModalOpen(false);
    setSelectedProduct(null);
  };

  const filteredProducts = products.filter(product => {
    if (selectedCategory === 'all') return true;
    return product.category.toLowerCase() === selectedCategory;
  });

  if (loading) {
    return (
      <main className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading products...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={fetchProducts}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <>
      <main className="bg-gray-50 min-h-screen">
        {/* Breadcrumb */}
        <div className="bg-gray-800 py-3">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="text-white text-sm">
              <span className="text-gray-300">Home</span>
              <ChevronRightIcon className="w-4 h-4 inline mx-2 text-gray-400" />
              <span className="text-gray-300">Products</span>
              <ChevronRightIcon className="w-4 h-4 inline mx-2 text-gray-400" />
              <span className="text-white font-medium">All Categories</span>
            </nav>
          </div>
        </div>

        {/* Hero Section */}
        <div className="bg-gray-800 py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl sm:text-6xl font-bold text-white tracking-tight mb-4">
                All Categories
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                From electronics and home goods to fashion and toys — discover premium items for less in our treasure bins.
              </p>
            </div>
          </div>
        </div>

        {/* Bin Prices Section */}
        <div className="bg-gray-100 py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Bin Prices This Week</h2>
            
            {/* Daily Prices */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {dailyPrices.map((day) => (
                <button
                  key={day.day}
                  onClick={() => setSelectedDay(day.day)}
                  className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                    selectedDay === day.day
                      ? 'bg-red-600 text-white shadow-lg transform scale-105'
                      : 'bg-white text-gray-700 hover:bg-red-50 hover:text-red-600 border border-gray-200'
                  }`}
                >
                  {day.label} {day.price}
                </button>
              ))}
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                    selectedCategory === category.id
                      ? 'bg-red-600 text-white shadow-lg transform scale-105'
                      : 'bg-white text-gray-700 hover:bg-red-50 hover:text-red-600 border border-gray-200'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Top Finds in {selectedCategory === 'all' ? 'All Categories' : categories.find(c => c.id === selectedCategory)?.label}
            </h2>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <div className="bg-white rounded-2xl p-12 shadow-lg">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <BidIcon className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No items found</h3>
                  <p className="text-gray-600 mb-6">Try selecting a different category or check back later for new items!</p>
                  <button 
                    onClick={() => setSelectedCategory('all')}
                    className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    View All Categories
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard 
                    key={product._id} 
                    product={product} 
                    onBidClick={handleBidClick}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Pro Tips Section */}
        <div className="bg-yellow-400 py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Pro Tips for Treasure Hunters</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-red-600 font-bold text-lg">1</span>
                  </div>
                  <p className="text-gray-700 font-medium">Arrive early Saturday for premium items</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-red-600 font-bold text-lg">2</span>
                  </div>
                  <p className="text-gray-700 font-medium">Check midweek for price drops</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-red-600 font-bold text-lg">3</span>
                  </div>
                  <p className="text-gray-700 font-medium">Friday = best steals</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Visit Us Section */}
        <div className="bg-white py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Visit Us</h2>
              <div className="bg-gray-50 rounded-2xl p-8 max-w-2xl mx-auto">
                <div className="space-y-4 text-gray-700">
                  <div>
                    <h3 className="font-semibold text-gray-900">Address</h3>
                    <p>1100 Sheppard Ave W, Unit 5 & 6, North York</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Hours</h3>
                    <p>Open daily</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Parking</h3>
                    <p>Free parking available</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Bid Modal */}
      {selectedProduct && (
        <BidModal
          isOpen={isBidModalOpen}
          onClose={handleCloseBidModal}
          product={selectedProduct}
          onBidPlaced={handleBidPlaced}
        />
      )}
    </>
  );
};

export default ProductsPage;