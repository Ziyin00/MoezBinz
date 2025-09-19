import React, { useState, useEffect } from 'react';
import Header from '../components/Navbar';
import { auctionService, type AuctionBid } from '../services/auctionService';
import { getProductImageUrl } from '../utils/imageUtils';
import { useToast } from '../contexts/ToastContext';
import { useAppSelector } from '../store/hooks';
import { useNavigate } from 'react-router-dom';

const MyBids: React.FC = () => {
  const [bids, setBids] = useState<AuctionBid[]>([]);
  const [loading, setLoading] = useState(true);
  const { error } = useToast();
  const { user, accessToken } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!accessToken) {
      navigate('/login');
      return;
    }

    fetchMyBids();
  }, [accessToken, navigate]);

  const fetchMyBids = async () => {
    try {
      setLoading(true);
      const response = await auctionService.getMyBids();
      setBids(response);
    } catch (error) {
      console.error('Error fetching bids:', error);
      error('Failed to load your bids', 'Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (isWinningBid: boolean, auctionStatus: string) => {
    if (auctionStatus === 'completed' && isWinningBid) {
      return (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Won
        </span>
      );
    } else if (auctionStatus === 'completed') {
      return (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
          Lost
        </span>
      );
    } else if (isWinningBid) {
      return (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          Winning
        </span>
      );
    } else {
      return (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          Outbid
        </span>
      );
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!user) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bids</h1>
            <p className="text-gray-600">Track your auction bidding activity and results</p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
          ) : bids.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No bids yet</h3>
              <p className="text-gray-600 mb-6">You haven't placed any bids on auctions yet.</p>
              <a
                href="/auction"
                className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Browse Auctions
              </a>
            </div>
          ) : (
            <div className="space-y-6">
              {bids.map((bid) => (
                <div key={bid.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      {/* Auction Image */}
                      <div className="flex-shrink-0">
                        <img
                          src={bid.auction_image_url ? getProductImageUrl(bid.auction_image_url) : getProductImageUrl('/placeholder.jpg')}
                          alt={bid.auction_title}
                          className="w-20 h-20 object-cover rounded-lg"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = getProductImageUrl('/placeholder.jpg');
                          }}
                        />
                      </div>

                      {/* Bid Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                              {bid.auction_title}
                            </h3>
                            <p className="text-sm text-gray-600 mb-2">
                              Bid placed on {formatDate(bid.bid_time)}
                            </p>
                            <div className="flex items-center gap-4 text-sm">
                              <span className="text-gray-600">
                                Your bid: <span className="font-semibold text-red-600">${bid.bid_amount}</span>
                              </span>
                              {bid.auto_bid_max && (
                                <span className="text-gray-600">
                                  Max auto-bid: <span className="font-semibold">${bid.auto_bid_max}</span>
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Status Badge */}
                          <div className="flex-shrink-0">
                            {getStatusBadge(bid.is_winning_bid, bid.auction_status)}
                          </div>
                        </div>

                        {/* Auction Status */}
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">
                              Auction Status: <span className="font-medium capitalize">{bid.auction_status}</span>
                            </span>
                            {bid.auction_status === 'active' && (
                              <span className="text-gray-600">
                                Ends: {new Date(bid.auction_end_time).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Summary Stats */}
          {bids.length > 0 && (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Bids</p>
                    <p className="text-2xl font-semibold text-gray-900">{bids.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Winning Bids</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {bids.filter(bid => bid.is_winning_bid).length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Auctions</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {bids.filter(bid => bid.auction_status === 'active').length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MyBids;
