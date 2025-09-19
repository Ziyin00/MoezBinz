import React, { useState, useEffect } from 'react';
import { getAuctionImageUrl } from '../utils/imageUtils';

interface Auction {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  startingPrice: number;
  currentPrice: number;
  bidIncrement: number;
  endTime: string;
  status: 'active' | 'ending' | 'ended';
  category: string;
  condition: string;
  bidCount: number;
  isFeatured: boolean;
}

interface BidModalProps {
  auction: Auction;
  onClose: () => void;
  onSubmit: (bidAmount: number) => void;
  getTimeRemaining: (endTime: string) => {
    hours: number;
    minutes: number;
    seconds: number;
    expired: boolean;
  };
}

const AuctionBidModal: React.FC<BidModalProps> = ({ auction, onClose, onSubmit, getTimeRemaining }) => {
  const [bidAmount, setBidAmount] = useState(auction.currentPrice + auction.bidIncrement);
  const [timeRemaining, setTimeRemaining] = useState(getTimeRemaining(auction.endTime));
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update countdown every second
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(getTimeRemaining(auction.endTime));
    }, 1000);

    return () => clearInterval(interval);
  }, [auction.endTime, getTimeRemaining]);

  const handleBidAmountChange = (amount: number) => {
    if (amount >= auction.currentPrice + auction.bidIncrement) {
      setBidAmount(amount);
    }
  };

  const handleQuickBid = (increment: number) => {
    const newAmount = auction.currentPrice + increment;
    setBidAmount(newAmount);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (bidAmount < auction.currentPrice + auction.bidIncrement) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(bidAmount);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (time: number) => time.toString().padStart(2, '0');

  return (
    <div className="fixed inset-0 bg-gray-200 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Place Your Bid</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Auction Info */}
          <div className="flex gap-4 mb-6">
            <img
              src={getAuctionImageUrl(auction.imageUrl)}
              alt={auction.title}
              className="w-24 h-24 object-cover rounded-lg"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = getAuctionImageUrl('/placeholder.jpg');
              }}
            />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{auction.title}</h3>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>Current Bid: <span className="font-semibold text-purple-600">${auction.currentPrice}</span></span>
                <span>Bid Increment: <span className="font-semibold">${auction.bidIncrement}</span></span>
              </div>
            </div>
          </div>

          {/* Time Remaining */}
          {!timeRemaining.expired ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-red-800 font-medium">Time Remaining:</span>
                <div className="flex items-center space-x-2 text-red-600 font-bold">
                  <span>{formatTime(timeRemaining.hours)}:</span>
                  <span>{formatTime(timeRemaining.minutes)}:</span>
                  <span>{formatTime(timeRemaining.seconds)}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
              <span className="text-gray-600 font-medium">Auction has ended</span>
            </div>
          )}

          {/* Bid Form */}
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
                  onChange={(e) => handleBidAmountChange(Number(e.target.value))}
                  min={auction.currentPrice + auction.bidIncrement}
                  step={auction.bidIncrement}
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter bid amount"
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Minimum bid: ${auction.currentPrice + auction.bidIncrement}
              </p>
            </div>

            {/* Quick Bid Buttons */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quick Bid Options
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[1, 2, 5, 10].map((multiplier) => {
                  const amount = auction.currentPrice + (auction.bidIncrement * multiplier);
                  return (
                    <button
                      key={multiplier}
                      type="button"
                      onClick={() => handleQuickBid(auction.bidIncrement * multiplier)}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                    >
                      ${amount}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bid Summary */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h4 className="font-medium text-gray-900 mb-2">Bid Summary</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Your Bid:</span>
                  <span className="font-semibold">${bidAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Current Highest:</span>
                  <span>${auction.currentPrice}</span>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-1">
                  <span className="text-gray-600">You'll Pay:</span>
                  <span className="font-semibold text-purple-600">${bidAmount}</span>
                </div>
              </div>
            </div>

            {/* Terms */}
            <div className="mb-6">
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="terms"
                  required
                  className="mt-1 mr-3"
                />
                <label htmlFor="terms" className="text-sm text-gray-600">
                  I understand that this is a binding bid and I will be required to pay and collect the item if I win the auction.
                </label>
              </div>
            </div>

            {/* Action Buttons */}
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
                disabled={isSubmitting || timeRemaining.expired || bidAmount < auction.currentPrice + auction.bidIncrement}
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

export default AuctionBidModal;