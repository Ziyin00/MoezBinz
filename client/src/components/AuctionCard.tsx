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
  onImageClick: (imageUrl: string) => void;
  getTimeRemaining: (endTime: string) => {
    hours: number;
    minutes: number;
    seconds: number;
    expired: boolean;
  };
  isAuthenticated?: boolean;
}

const AuctionCard: React.FC<AuctionCardProps> = ({ auction, onBidClick, onImageClick, getTimeRemaining, isAuthenticated = true }) => {
  const timeRemaining = getTimeRemaining(auction.end_time);


  return (
    <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden border border-gray-100">
      <div className="relative overflow-hidden">
        <img 
          src={auction.image_url ? getProductImageUrl(auction.image_url) : getProductImageUrl('/placeholder.jpg')} 
          alt={auction.title} 
          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110 cursor-pointer"
          onClick={() => onImageClick(auction.image_url ? getProductImageUrl(auction.image_url) : getProductImageUrl('/placeholder.jpg'))}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = getProductImageUrl('/placeholder.jpg');
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
        
        {/* Status badge */}
        <div className="absolute top-3 right-3">
          <span className={`px-3 py-1 text-xs font-bold rounded-full shadow-lg ${
            auction.status === 'active' 
              ? 'bg-green-500 text-white' 
              : auction.status === 'completed'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-500 text-white'
          }`}>
            {auction.status === 'active' ? 'LIVE' : auction.status === 'completed' ? 'ENDED' : 'CANCELLED'}
          </span>
        </div>

        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-white/90 text-gray-700 shadow-lg">
            {auction.category}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-red-600 transition-colors">
          {auction.title}
        </h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{auction.description}</p>
        
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-2xl font-bold text-red-600">${auction.current_price}</p>
            <p className="text-sm text-gray-500">Start: ${auction.starting_price}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Ends in</p>
            <p className="text-sm font-semibold text-gray-900">
              {timeRemaining.expired ? 'Ended' : `${Math.ceil((new Date(auction.end_time).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} day${Math.ceil((new Date(auction.end_time).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) !== 1 ? 's' : ''}`}
            </p>
          </div>
        </div>
        
        <button 
          onClick={onBidClick}
          disabled={timeRemaining.expired || auction.status !== 'active'}
          className="w-full bg-red-600 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 hover:bg-red-700 transition-all duration-300 transform group-hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          {timeRemaining.expired ? 'Auction Ended' : !isAuthenticated ? 'Login to Bid' : 'Place Bid'}
        </button>
      </div>
    </div>
  );
};

export default AuctionCard;
