import { api } from '../api/axios';

export interface Auction {
  id: number;
  title: string;
  description: string;
  image_url: string | null;
  category: string;
  starting_price: number;
  current_price: number;
  reserve_price: number | null;
  bid_increment: number;
  start_time: string;
  end_time: string;
  status: 'active' | 'completed' | 'cancelled';
  winner_id: number | null;
  winning_bid: number | null;
  payment_status: 'pending' | 'completed' | 'failed';
  collection_status: 'pending' | 'collected' | 'forfeited';
  created_by: number;
  created_at: string;
  updated_at: string;
  created_by_name: string;
  bid_count: number;
  highest_bid: number | null;
  recent_bids?: AuctionBid[];
}

export interface AuctionBid {
  id: number;
  auction_id: number;
  user_id: number;
  bid_amount: number;
  bid_time: string;
  is_winning_bid: boolean;
  auto_bid_max: number | null;
  created_at: string;
  username: string;
  email: string;
  // Additional fields from JOIN with auctions table
  auction_title: string;
  image_url: string | null;
  end_time: string;
  auction_status: string;
  current_price: number;
  winner_id: number | null;
}

export interface CreateAuctionData {
  title: string;
  description: string;
  category: string;
  starting_price: number;
  reserve_price?: number;
  bid_increment?: number;
  start_time: string;
  end_time: string;
  image?: File;
}

export interface UpdateAuctionData {
  title?: string;
  description?: string;
  category?: string;
  starting_price?: number;
  reserve_price?: number;
  bid_increment?: number;
  start_time?: string;
  end_time?: string;
  status?: string;
  image?: File;
}

export interface ApproveWinnerData {
  winner_id: number;
  winning_bid: number;
}

export interface AuctionStats {
  totalAuctions: number;
  activeAuctions: number;
  completedAuctions: number;
  totalBids: number;
  totalRevenue: number;
}

export const auctionService = {
  // Get all auctions with pagination and filters
  getAuctions: async (params?: {
    status?: string;
    category?: string;
    page?: number;
    limit?: number;
  }): Promise<{ auctions: Auction[]; pagination: any }> => {
    const response = await api.get('/auctions', { params });
    return response.data;
  },

  // Get single auction with bids
  getAuction: async (id: number): Promise<Auction> => {
    const response = await api.get(`/auctions/${id}`);
    return response.data;
  },

  // Create new auction (admin only)
  createAuction: async (data: CreateAuctionData): Promise<Auction> => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('category', data.category);
    formData.append('starting_price', data.starting_price.toString());
    if (data.reserve_price) formData.append('reserve_price', data.reserve_price.toString());
    if (data.bid_increment) formData.append('bid_increment', data.bid_increment.toString());
    formData.append('start_time', data.start_time);
    formData.append('end_time', data.end_time);
    if (data.image) formData.append('image', data.image);

    const response = await api.post('/auctions', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Update auction (admin only)
  updateAuction: async (id: number, data: UpdateAuctionData): Promise<Auction> => {
    const formData = new FormData();
    if (data.title) formData.append('title', data.title);
    if (data.description) formData.append('description', data.description);
    if (data.category) formData.append('category', data.category);
    if (data.starting_price) formData.append('starting_price', data.starting_price.toString());
    if (data.reserve_price !== undefined) formData.append('reserve_price', data.reserve_price.toString());
    if (data.bid_increment) formData.append('bid_increment', data.bid_increment.toString());
    if (data.start_time) formData.append('start_time', data.start_time);
    if (data.end_time) formData.append('end_time', data.end_time);
    if (data.status) formData.append('status', data.status);
    if (data.image) formData.append('image', data.image);

    const response = await api.put(`/auctions/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete auction (admin only)
  deleteAuction: async (id: number): Promise<void> => {
    await api.delete(`/auctions/${id}`);
  },

  // Get auction bids (admin only)
  getAuctionBids: async (id: number): Promise<AuctionBid[]> => {
    const response = await api.get(`/auctions/${id}/bids`);
    return response.data;
  },

  // Approve auction winner (admin only)
  approveWinner: async (id: number, data: ApproveWinnerData): Promise<Auction> => {
    const response = await api.post(`/auctions/${id}/approve-winner`, data);
    return response.data.auction;
  },

  // Get auction statistics (admin only)
  getAuctionStats: async (): Promise<AuctionStats> => {
    const response = await api.get('/auctions/stats');
    return response.data;
  },

  // Place a bid
  placeBid: async (auctionId: number, bidAmount: number, autoBidMax?: number): Promise<any> => {
    const response = await api.post('/auction-bids', {
      auction_id: auctionId,
      bid_amount: bidAmount,
      auto_bid_max: autoBidMax,
    });
    return response.data;
  },

  // Get user's bids
  getMyBids: async (): Promise<AuctionBid[]> => {
    const response = await api.get('/auction-bids/my-bids');
    return response.data;
  },

  // Get auction bids (public)
  getAuctionBidsPublic: async (auctionId: number): Promise<any[]> => {
    const response = await api.get(`/auction-bids/auction/${auctionId}`);
    return response.data;
  },

  // Get current highest bidder
  getCurrentBidder: async (auctionId: number): Promise<any> => {
    const response = await api.get(`/auction-bids/auction/${auctionId}/current-bidder`);
    return response.data;
  },
};
