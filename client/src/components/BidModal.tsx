import React, { useState, useEffect } from 'react';
import { XMarkIcon, ClockIcon, UserIcon } from './Icons';
import { bidService, type Bid, type CreateBidData } from '../services/bidService';
import { useAppSelector } from '../store/hooks';

interface BidModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    _id: string;
    name: string;
    imageUrl: string;
    currentPrice: number;
    endDate: string;
  };
  onBidPlaced?: () => void;
}

const BidModal: React.FC<BidModalProps> = ({ isOpen, onClose, product, onBidPlaced }) => {
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(false);
  const [bidding, setBidding] = useState(false);
  const [bidAmount, setBidAmount] = useState('');
  const [isAutoBid, setIsAutoBid] = useState(false);
  const [maxBidAmount, setMaxBidAmount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isOpen && product._id) {
      fetchBids();
    }
  }, [isOpen, product._id, currentPage]);

  const fetchBids = async () => {
    try {
      setLoading(true);
      const response = await bidService.getProductBids(product._id, currentPage, 10);
      setBids(response.bids);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Error fetching bids:', error);
      setError('Failed to load bids');
    } finally {
      setLoading(false);
    }
  };

  const handleBidSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError('You must be logged in to place a bid');
      return;
    }

    const amount = parseFloat(bidAmount);
    if (isNaN(amount) || amount <= product.currentPrice) {
      setError(`Bid must be higher than current price of $${product.currentPrice}`);
      return;
    }

    if (isAutoBid && maxBidAmount) {
      const maxAmount = parseFloat(maxBidAmount);
      if (isNaN(maxAmount) || maxAmount <= amount) {
        setError('Maximum bid amount must be higher than initial bid amount');
        return;
      }
    }

    try {
      setBidding(true);
      setError('');
      
      const bidData: CreateBidData = {
        productId: product._id,
        amount,
        isAutoBid,
        maxBidAmount: isAutoBid && maxBidAmount ? parseFloat(maxBidAmount) : undefined
      };

      await bidService.createBid(bidData);
      
      setSuccess('Bid placed successfully!');
      setBidAmount('');
      setMaxBidAmount('');
      setIsAutoBid(false);
      
      // Refresh bids and notify parent
      await fetchBids();
      if (onBidPlaced) {
        onBidPlaced();
      }
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (error: any) {
      console.error('Error placing bid:', error);
      setError(error.response?.data?.message || 'Failed to place bid');
    } finally {
      setBidding(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'won': return 'text-blue-600 bg-blue-100';
      case 'lost': return 'text-gray-600 bg-gray-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const isAuctionEnded = new Date() > new Date(product.endDate);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <img 
              src={`http://localhost:3001${product.imageUrl}`} 
              alt={product.name}
              className="w-16 h-16 object-cover rounded-lg"
            />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Bids for {product.name}</h2>
              <p className="text-gray-600">Current Price: {formatCurrency(product.currentPrice)}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="flex flex-col lg:flex-row h-full">
          {/* Bids List */}
          <div className="flex-1 p-6 overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Bid History</h3>
            
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
              </div>
            ) : bids.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <ClockIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No bids yet. Be the first to bid!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {bids.map((bid) => (
                  <div key={bid._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                        <UserIcon className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{bid.bidder.name}</p>
                        <p className="text-sm text-gray-500">{bid.bidder.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-gray-900">{formatCurrency(bid.amount)}</p>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(bid.status)}`}>
                          {bid.status}
                        </span>
                        {bid.isAutoBid && (
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                            Auto
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">{formatDate(bid.bidTime)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2 mt-6">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>

          {/* Bid Form */}
          <div className="w-full lg:w-96 p-6 border-l border-gray-200 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Place Your Bid</h3>
            
            {isAuctionEnded ? (
              <div className="text-center py-8">
                <ClockIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600">This auction has ended</p>
              </div>
            ) : !user ? (
              <div className="text-center py-8">
                <UserIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600">Please log in to place a bid</p>
              </div>
            ) : (
              <form onSubmit={handleBidSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                  </div>
                )}
                
                {success && (
                  <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                    {success}
                  </div>
                )}

                <div>
                  <label htmlFor="bidAmount" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Bid ($)
                  </label>
                  <input
                    type="number"
                    id="bidAmount"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    min={product.currentPrice + 0.01}
                    step="0.01"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder={`Min: $${product.currentPrice + 0.01}`}
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isAutoBid"
                    checked={isAutoBid}
                    onChange={(e) => setIsAutoBid(e.target.checked)}
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isAutoBid" className="ml-2 block text-sm text-gray-700">
                    Enable Auto-Bidding
                  </label>
                </div>

                {isAutoBid && (
                  <div>
                    <label htmlFor="maxBidAmount" className="block text-sm font-medium text-gray-700 mb-1">
                      Maximum Bid ($)
                    </label>
                    <input
                      type="number"
                      id="maxBidAmount"
                      value={maxBidAmount}
                      onChange={(e) => setMaxBidAmount(e.target.value)}
                      min={bidAmount ? parseFloat(bidAmount) + 0.01 : product.currentPrice + 0.01}
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Enter maximum bid amount"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      We'll automatically bid up to this amount for you
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={bidding || !bidAmount}
                  className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {bidding ? 'Placing Bid...' : 'Place Bid'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BidModal;
