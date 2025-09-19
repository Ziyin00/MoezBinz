import React from 'react';
import { getProductImageUrl } from '../utils/imageUtils';

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

interface AuctionCardProps {
  auction: Auction;
  onBidClick: () => void;
  getTimeRemaining: (endTime: string) => {
    hours: number;
    minutes: number;
    seconds: number;
    expired: boolean;
  };
  isAuthenticated?: boolean;
}

const AuctionCard: React.FC<AuctionCardProps> = ({ auction, onBidClick, getTimeRemaining, isAuthenticated = true }) => {
  const timeRemaining = getTimeRemaining(auction.end_time);
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };


  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Image */}
      <div className="relative h-48 bg-gray-200">
        <img
          src={auction.image_url ? getProductImageUrl(auction.image_url) : getProductImageUrl('/placeholder.jpg')}
          alt={auction.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = getProductImageUrl('/placeholder.jpg');
          }}
        />
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(auction.status)}`}>
            {auction.status.charAt(0).toUpperCase() + auction.status.slice(1)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Title and Category */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
            {auction.title}
          </h3>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm text-gray-500">{auction.category}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {auction.description}
        </p>

        {/* Pricing */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="text-sm text-gray-500">Starting Price:</span>
              <span className="text-lg font-semibold text-gray-900 ml-2">${auction.starting_price}</span>
            </div>
            <div className="text-right">
              <span className="text-sm text-gray-500">Current Bid:</span>
              <span className="text-xl font-bold text-purple-600 ml-2">${auction.current_price}</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>Bid Increment: ${auction.bid_increment}</span>
            <span>{auction.bid_count} bids</span>
          </div>
        </div>

        {/* Time Remaining */}
        <div className="mb-6">
          {timeRemaining.expired ? (
            <div className="text-center py-3 bg-red-50 rounded-lg">
              <span className="text-red-600 font-semibold">Auction Ended</span>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-center mb-2">
                <span className="text-sm text-gray-500">Time Remaining</span>
              </div>
              <div className="flex justify-center space-x-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{timeRemaining.hours}</div>
                  <div className="text-xs text-gray-500">Hours</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{timeRemaining.minutes}</div>
                  <div className="text-xs text-gray-500">Minutes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{timeRemaining.seconds}</div>
                  <div className="text-xs text-gray-500">Seconds</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bid Button */}
        <button
          onClick={onBidClick}
          disabled={timeRemaining.expired || auction.status === 'completed' || auction.status === 'cancelled'}
          className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors duration-200 ${
            timeRemaining.expired || auction.status === 'completed' || auction.status === 'cancelled'
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : !isAuthenticated
              ? 'bg-red-500 text-white hover:bg-red-600'
              : 'bg-red-600 text-white hover:bg-red-700'
          }`}
        >
          {timeRemaining.expired || auction.status === 'completed' || auction.status === 'cancelled'
            ? 'Auction Ended' 
            : !isAuthenticated 
            ? 'Login to Bid' 
            : 'Place Bid'
          }
        </button>
      </div>
    </div>
  );
};

export default AuctionCard;
