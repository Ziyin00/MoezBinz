import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Navbar';
import AuctionCard from '../components/AuctionCard';
import AuctionBidModal from '../components/AuctionBidModal';
import { useToast } from '../contexts/ToastContext';
import { useAppSelector } from '../store/hooks';
import { auctionService } from '../services/auctionService';

interface Auction {
  id: number;
  title: string;
  description: string;
  image_url: string | null;
  starting_price: number;
  current_price: number;
  bid_increment: number;
  end_time: string;
  status: 'active' | 'completed' | 'cancelled';
  category: string;
  bid_count: number;
  highest_bid: number | null;
}

const Auction: React.FC = () => {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAuction, setSelectedAuction] = useState<Auction | null>(null);
  const [showBidModal, setShowBidModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { success, error } = useToast();
  const navigate = useNavigate();
  const { user, accessToken } = useAppSelector((state) => state.auth);
  const isAuthenticated = !!user && !!accessToken;

  // Fetch real auctions from API
  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        setLoading(true);
        const response = await auctionService.getAuctions({ status: 'active' });
        setAuctions(response.auctions);
      } catch (err) {
        console.error('Error fetching auctions:', err);
        error('Failed to load auctions', 'Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAuctions();
  }, [error]);

  const handleBidClick = (auction: Auction) => {
    // Check if user is authenticated before allowing bidding
    if (!isAuthenticated) {
      error('Please log in to place a bid', 'You need to be logged in to participate in auctions.');
      navigate('/login');
      return;
    }
    
    setSelectedAuction(auction);
    setShowBidModal(true);
  };

  const handleBidSubmit = async (bidAmount: number) => {
    if (!selectedAuction) return;

    try {
      // Submit bid via API
      await auctionService.placeBid(selectedAuction.id, bidAmount);
      
      // Update local state
      setAuctions(prev => prev.map(auction => 
        auction.id === selectedAuction.id 
          ? { ...auction, current_price: bidAmount, bid_count: auction.bid_count + 1 }
          : auction
      ));

      success('Bid placed successfully!', 'You will be notified if you are outbid.');
      setShowBidModal(false);
      setSelectedAuction(null);
    } catch (err) {
      console.error('Error placing bid:', err);
      error('Failed to place bid', 'Please try again or contact support.');
    }
  };

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const getTimeRemaining = (endTime: string) => {
    const now = new Date().getTime();
    const end = new Date(endTime).getTime();
    const difference = end - now;

    if (difference <= 0) {
      return { hours: 0, minutes: 0, seconds: 0, expired: true };
    }

    const hours = Math.floor(difference / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return { hours, minutes, seconds, expired: false };
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
       

        {/* Hero Image Section with Mobile/Desktop Versions */}
        <section className="relative w-full h-[50vh] sm:h-[55vh] md:h-[50vh] lg:h-[55vh] xl:h-[60vh] overflow-hidden">
          {/* Desktop Image */}
          <img 
            src="/Auction Visual.jpeg"
            alt="Moez Binz Auction - Bid and Win"
            className="hidden sm:block w-full h-full object-cover object-center"
            loading="eager"
            decoding="async"
            sizes="100vw"
          />
          
          {/* Mobile Image */}
          <img 
            src="/Auction Visual-Mobile.jpg"
            alt="Moez Binz Auction - Bid and Win"
            className="block sm:hidden w-full h-full object-cover object-center"
            loading="eager"
            decoding="async"
            sizes="100vw"
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/30 z-10"></div>
          
        
        </section>

        {/* Additional Hero Text Section */}
        <section className="py-8 bg-white border-b-2 border-red-500">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
                {/* Hero Content */}
          <div className=" z-20 flex items-center justify-center">
            <div className="text-center  px-4 max-w-4xl">
              <h1 className="text-3xl text-red-600 sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                BINZ AUCTION
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl mb-10 text-gray-800 max-w-3xl mx-auto">
                Bid. Win. Collect. The Binz Auction is Here! Big brands, small bids — your deal, your win.
              </p>
            </div>
          </div>
              <h2 className="text-2xl md:text-3xl font-bold text-red-600 mb-4">
                Premium Brand Goods at{' '}
                <span className="text-red-600 bg-clip-text bg-gradient-to-r">
                  Throwaway Prices
                </span>
                {' '}– New Deals Every Day!
              </h2>
              <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                Discover deeply discounted Amazon returns and overstock items in every category: 
                <span className="font-semibold"> home goods</span>, 
                <span className="font-semibold"> electronics</span>, 
                <span className="font-semibold"> fashion</span>, 
                <span className="font-semibold"> arts & crafts</span>, 
                and more. Every visit is a treasure hunt with daily-changing prices!
              </p>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-red-600 mb-8">How Our Auctions Work</h2>
              <p className="text-lg text-gray-600 mb-12 leading-relaxed">
                Join the thrill of bidding on unique Amazon returns and big brand overstocks. 
                Individual and bulk lots are up for grabs—bid online, collect at our store, and unlock unbeatable deals!
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">1. Register</h3>
                  <p className="text-gray-600 text-sm">Register or log in to start bidding</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">2. Explore</h3>
                  <p className="text-gray-600 text-sm">Browse current listings and pallets</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">3. Bid</h3>
                  <p className="text-gray-600 text-sm">Place your bid before time runs out</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4 19h6v-2H4v2zM4 5h6V3H4v2zM4 12h6v-2H4v2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">4. Win</h3>
                  <p className="text-gray-600 text-sm">Get notified instantly when you win!</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Auction Listings Section */}
        <section id="auctions" className="py-16 bg-red-600">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Auction Listings</h2>
              <p className="text-lg text-gray-100">Featured auctions right now</p>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-8xl mx-auto">
                {auctions.map((auction) => (
                  <AuctionCard
                    key={auction.id}
                    auction={auction}
                    onBidClick={() => handleBidClick(auction)}
                    onImageClick={handleImageClick}
                    getTimeRemaining={getTimeRemaining}
                    isAuthenticated={isAuthenticated}
                  />
                ))}
              </div>
            )}

            <div className="text-center mt-12">
              <a
                href="/product"
                className="inline-flex items-center px-8 py-4 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors"
              >
                Browse All Auctions
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        </section>

        {/* Why Bid Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-red-600 mb-16 text-center leading-tight">Why Bid with Moez Binz?</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center mr-4 mt-1">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Real-time bidding</h3>
                      <p className="text-gray-600">Maximum excitement with live bid updates</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center mr-4 mt-1">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Transparent process</h3>
                      <p className="text-gray-600">See bid history and auction timers</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center mr-4 mt-1">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Collections only</h3>
                      <p className="text-gray-600">No shipping hassles, pick up at store</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center mr-4 mt-1">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Save huge</h3>
                      <p className="text-gray-600">On brands you love at unbeatable prices</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-yellow-300 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">Winning & Collecting Your Items</h3>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-red-600 rounded-full mr-3 mt-2"></div>
                      <p className="text-gray-700">When auction ends, winners receive instant notification</p>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-red-600 rounded-full mr-3 mt-2"></div>
                      <p className="text-gray-700">Pay online or at pick-up</p>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-red-600 rounded-full mr-3 mt-2"></div>
                      <p className="text-gray-700">Collect your treasures during store hours - bring ID and order confirmation</p>
                    </div>
                  </div>
                  
                  <div className=" pt-4 border-t border-yellow-300">
                    <h4 className="text-lg font-semibold text-gray-900 mb-1">Auction Rules & Policies</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p>• All sales are final; inspect items at pickup</p>
                      <p>• Payment must be completed before collection</p>
                      <p>• Failure to collect within 7 days may forfeit your win</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Bid Modal */}
      {showBidModal && selectedAuction && (
        <AuctionBidModal
          auction={selectedAuction}
          onClose={() => setShowBidModal(false)}
          onSubmit={handleBidSubmit}
          getTimeRemaining={getTimeRemaining}
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
              alt="Auction Item"
              className="w-full h-full object-cover"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}

    </>
  );
};

export default Auction;
