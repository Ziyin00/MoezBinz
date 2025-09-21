import React, { useState } from 'react';
import { type Product } from '../services/productService';
import { bidService } from '../services/bidService';
import { useToast } from '../contexts/ToastContext';

interface BidModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  onBidPlaced: () => void;
}

const BidModal: React.FC<BidModalProps> = ({ isOpen, onClose, product, onBidPlaced }) => {
  const [bidAmount, setBidAmount] = useState(product.currentPrice + 1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { success, error } = useToast();

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
      
      success('Bid placed successfully!', 'Your bid has been recorded.');
      onBidPlaced();
      onClose();
    } catch (err: any) {
      console.error('Failed to place bid:', err);
      const errorMessage = err.response?.data?.message || 'Failed to place bid. Please try again.';
      error('Bid Failed', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-200 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Place Your Bid</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
            <p className="text-gray-600 text-sm">Current Price: ${product.currentPrice}</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Bid Amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(Number(e.target.value))}
                  min={product.currentPrice + 1}
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter bid amount"
                />
              </div>
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
                disabled={isSubmitting || bidAmount <= product.currentPrice}
                className="flex-1 py-3 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Placing Bid...' : 'Place Bid'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BidModal;