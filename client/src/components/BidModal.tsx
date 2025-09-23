import React, { useState, useEffect } from 'react';
import { type Product } from '../services/productService';
import { bidService, type Bid } from '../services/bidService';
import { useToast } from '../contexts/ToastContext';

interface BidModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  onBidPlaced: () => void;
}

const BidModal: React.FC<BidModalProps> = ({ isOpen, onClose, product, onBidPlaced }) => {
  const [bidAmount, setBidAmount] = useState(product.currentPrice);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingBids, setExistingBids] = useState<Bid[]>([]);
  const [loadingBids, setLoadingBids] = useState(false);
  const { success, error } = useToast();

  // Fetch existing bids when modal opens
  useEffect(() => {
    if (isOpen && product._id) {
      fetchExistingBids();
    }
  }, [isOpen, product._id]);

  const fetchExistingBids = async () => {
    try {
      setLoadingBids(true);
      const response = await bidService.getProductBids(product._id, 1, 10);
      setExistingBids(response.bids);
    } catch (error) {
      console.error('Failed to fetch existing bids:', error);
    } finally {
      setLoadingBids(false);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      console.log(`Placing bid: $${bidAmount} on product ${product._id}`);
      
      const bidData = {
        productId: product._id,
        amount: bidAmount,
        isAutoBid: false
      };
      
      const response = await bidService.createBid(bidData);
      console.log('Bid placed successfully:', response);
      
      // Refresh the bids list to show the new/updated bid
      await fetchExistingBids();
      
      const isUpdate = response.message?.includes('updated');
      success(
        isUpdate ? 'Bid updated successfully!' : 'Bid placed successfully!', 
        isUpdate ? 'Your bid amount has been updated.' : 'Your bid has been recorded.'
      );
      onBidPlaced();
      onClose();
    } catch (err: any) {
      console.error('Failed to place bid:', err);
      console.error('Error response:', err.response?.data);
      const errorMessage = err.response?.data?.message || 'Failed to place bid. Please try again.';
      error('Bid Failed', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Place Your Bid</h2>
          <button
            onClick={onClose}
            className="bg-white/90 hover:bg-white text-gray-800 hover:text-gray-600 transition-all duration-200 rounded-full p-2 shadow-lg"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column: Existing Bids */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Bids</h3>
              {loadingBids ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                  <span className="ml-2 text-gray-600">Loading bids...</span>
                </div>
              ) : existingBids.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {existingBids
                    .sort((a, b) => b.amount - a.amount)
                    .map((bid, index) => (
                    <div key={bid._id} className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                      index === 0 
                        ? 'bg-green-50 border-green-200 shadow-md' 
                        : 'bg-gray-50 border-gray-200'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-xs ${
                            index === 0 ? 'bg-green-500' : 'bg-gray-400'
                          }`}>
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 text-sm">{bid.bidder.name}</div>
                            <div className="text-xs text-gray-600">{bid.bidder.email}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-lg font-bold ${
                            index === 0 ? 'text-green-600' : 'text-gray-900'
                          }`}>
                            ${bid.amount}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(bid.bidTime).toLocaleString()}
                          </div>
                          {index === 0 && (
                            <div className="text-xs font-semibold text-green-600 mt-1">
                              🏆 Highest
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <div className="text-gray-400 mb-2">
                    <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h4 className="text-sm font-medium text-gray-900 mb-1">No Bids Yet</h4>
                  <p className="text-xs text-gray-500">Be the first to bid on this item!</p>
                </div>
              )}
            </div>

            {/* Right Column: Place Bid Form */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Place Your Bid</h3>
              <div className="mb-4">
                <h4 className="text-md font-medium text-gray-900 mb-2">{product.name}</h4>
                <p className="text-gray-600 text-sm">Current Price: <span className="font-semibold text-green-600">${product.currentPrice}</span></p>
                <p className="text-gray-500 text-xs mt-1">Bid any amount you want - higher or lower than current price</p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Bid Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(Number(e.target.value))}
                      min="0"
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Enter bid amount"
                    />
                  </div>
                  {bidAmount > product.currentPrice && (
                    <p className="text-xs text-green-600 mt-1">
                      ✓ Your bid is ${bidAmount - product.currentPrice} higher than current price
                    </p>
                  )}
                  {bidAmount < product.currentPrice && bidAmount > 0 && (
                    <p className="text-xs text-blue-600 mt-1">
                      ℹ Your bid is ${product.currentPrice - bidAmount} lower than current price
                    </p>
                  )}
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || bidAmount <= 0}
                    className="flex-1 py-3 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSubmitting ? 'Placing Bid...' : 'Place Bid'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BidModal;