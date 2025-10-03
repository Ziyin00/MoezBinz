import React, { useState, useEffect } from 'react';
import { BidIcon } from './Icons';
import { productService, type Product } from '../services/productService';
import BidModal from './BidModal';
import { useAppSelector } from '../store/hooks';
import { getProductImageUrl } from '../utils/imageUtils';

// Remove static products - we'll fetch from API

interface ProductCardProps {
  product: Product;
  onBidClick: (product: Product) => void;
  isLoggedIn: boolean;
  onImageClick: (imageUrl: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onBidClick, isLoggedIn, onImageClick }) => {
  // Debug logging
  // console.log('ProductCard received product:', product);
  
  const isAuctionEnded = new Date() > new Date(product.endDate);
  const timeLeft = new Date(product.endDate).getTime() - new Date().getTime();
  const daysLeft = Math.ceil(timeLeft / (1000 * 60 * 60 * 24));

  return (
    <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden border border-gray-100">
      <div className="relative overflow-hidden">
        <img 
          src={getProductImageUrl(product.imageUrl)} 
          alt={product.name} 
          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110 cursor-pointer"
          onClick={() => onImageClick(getProductImageUrl(product.imageUrl))}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = getProductImageUrl('/placeholder.jpg');
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
        
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
            <p className="text-2xl font-bold text-red-600">${(product.currentPrice || 0).toFixed(2)}</p>
            <p className="text-sm text-gray-500">Start: ${(product.startingPrice || 0).toFixed(2)}</p>
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
          {isAuctionEnded ? 'Auction Ended' : isLoggedIn ? 'Place Bid' : 'Login to Bid'}
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
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };
  
  const { user } = useAppSelector((state) => state.auth);

  const dailyPrices = [
    { day: 'sun', label: 'Sun', price: '$15.00', fullDay: 'Smart Sunday' },
    { day: 'mon', label: 'Mon', price: '$11.99', fullDay: 'Mega Monday' },
    { day: 'tue', label: 'Tue', price: '$8.99', fullDay: 'Thrifty Tuesday' },
    { day: 'wed', label: 'Wed', price: '$6.99', fullDay: 'Wow Wednesday' },
    { day: 'thu', label: 'Thu', price: '$4.99', fullDay: 'Treasure Thursday' },
    { day: 'fri', label: 'Fri', price: '$1.99', fullDay: 'Freak-out Friday' },
    { day: 'sat', label: 'Sat', price: '$19.99', fullDay: 'Smashing Saturday' },
  ];

  // Get current day in Canadian timezone
  const getCurrentDay = () => {
    const now = new Date();
    const canadianTime = new Date(now.toLocaleString("en-US", {timeZone: "America/Toronto"}));
    const dayOfWeek = canadianTime.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    
    const dayMap = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    return dayMap[dayOfWeek];
  };

  const currentDay = getCurrentDay();

  const categories = [
    { 
      id: 'all', 
      label: 'All', 
      image: '/deal-1.jpg',
      icon: '🛍️',
      description: 'Browse all categories'
    },
    { 
      id: 'electronics', 
      label: 'Electronics', 
      image: '/deal-2.jpg',
      icon: '📱',
      description: 'Phones, laptops & gadgets'
    },
    { 
      id: 'home', 
      label: 'Home & Garden', 
      image: '/deal-3.jpg',
      icon: '🏠',
      description: 'Furniture & decor'
    },
    { 
      id: 'fashion', 
      label: 'Fashion', 
      image: '/deal-4.jpeg',
      icon: '👗',
      description: 'Clothing & accessories'
    },
    { 
      id: 'sports', 
      label: 'Sports & Outdoors', 
      image: '/deal-1.jpg',
      icon: '⚽',
      description: 'Fitness & outdoor gear'
    },
    { 
      id: 'toys', 
      label: 'Toys & Games', 
      image: '/deal-2.jpg',
      icon: '🧸',
      description: 'Kids toys & games'
    },
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getActiveProducts(1, 12);
      // console.log('Fetched products response:', response);
      // console.log('Products array:', response.products);
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
        {/* Hero Section */}
        <section className="relative h-[50vh] bg-black">
          <img 
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
            alt="Shopping and products"
            className="absolute inset-0 w-full h-full object-cover opacity-40"
          />
          <div className="relative h-full flex flex-col justify-center items-center text-center text-white px-4">
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight animate-fade-in-up">
              All Categories
            </h1>
            <p className="mt-4 text-lg sm:text-xl max-w-3xl animate-fade-in-up animation-delay-200">
              From electronics and home goods to fashion and toys — discover premium items for less in our treasure bins.
            </p>
          </div>
        </section>

        {/* Bin Prices Section */}
        <div className="bg-gray-100 py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Bin Prices This Week</h2>
            
            {/* Daily Prices */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {dailyPrices.map((day) => (
                <div
                  key={day.day}
                  className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                    currentDay === day.day
                      ? 'bg-red-600 text-white shadow-lg transform scale-105'
                      : 'bg-white text-gray-700 border border-gray-200'
                  }`}
                >
                  {day.label} {day.price}
                 
                </div>
              ))}
            </div>

            {/* Category Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-6xl mx-auto">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`group relative overflow-hidden rounded-2xl transition-all duration-300 transform hover:scale-105 ${
                    selectedCategory === category.id
                      ? 'ring-4 ring-red-500 ring-opacity-75 shadow-2xl'
                      : 'shadow-lg hover:shadow-xl'
                  }`}
                >
                  {/* Background Image */}
                  <div className="relative h-32 w-full">
                    <img 
                      src={category.image} 
                      alt={category.label}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder.jpg';
                      }}
                    />
                    
                    {/* Overlay */}
                    <div className={`absolute inset-0 transition-opacity duration-300 ${
                      selectedCategory === category.id 
                        ? 'bg-red-600/80' 
                        : 'bg-black/40 group-hover:bg-black/60'
                    }`}></div>
                    
                    {/* Content */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-2">
                      <div className="text-2xl mb-1">{category.icon}</div>
                      <h3 className="text-sm font-bold text-center leading-tight">
                        {category.label}
                      </h3>
                    </div>
                    
                    {/* Selection Indicator */}
                    {selectedCategory === category.id && (
                      <div className="absolute top-2 right-2">
                        <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Description */}
                  <div className="absolute -bottom-8 left-0 right-0 bg-white p-2 rounded-b-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <p className="text-xs text-gray-600 text-center font-medium">
                      {category.description}
                    </p>
                  </div>
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
                {filteredProducts.map((product, index) => (
                  <ProductCard 
                    key={product._id || `product-${index}`} 
                    product={product} 
                    onBidClick={handleBidClick}
                    isLoggedIn={!!user}
                    onImageClick={handleImageClick}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Pro Tips Section */}
        {/* <div className="bg-yellow-400 py-12">
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
        </div> */}

        {/* Visit Us Section */}
        {/* <div className="bg-white py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Visit Us</h2>
              <div className="bg-gray-50 rounded-2xl p-8 max-w-2xl mx-auto">
                <div className="space-y-4 text-gray-700">
                  <div>
                    <h3 className="font-semibold text-gray-900">Address</h3>
                    <p>5 - 1150 Sheppard Avenue West, North York, ON M3K 2B5</p>
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
        </div> */}
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

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[9999] p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-9xl max-h-[95vh] overflow-hidden flex flex-col">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white hover:text-gray-200 transition-all duration-200 rounded-full p-2 shadow-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img
              src={selectedImage}
              alt="Product"
              className="w-full h-full object-cover"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ProductsPage;