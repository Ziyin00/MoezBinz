import { api } from '../api/axios';

export interface Bid {
  _id: string;
  product: {
    _id: string;
    name: string;
    imageUrl: string;
    currentPrice: number;
  };
  bidder: {
    _id: string;
    name: string;
    email: string;
  };
  amount: number;
  status: 'active' | 'cancelled' | 'won' | 'lost';
  isAutoBid: boolean;
  maxBidAmount?: number;
  bidTime: string;
}

export interface CreateBidData {
  productId: string;
  amount: number;
  isAutoBid?: boolean;
  maxBidAmount?: number;
}

export interface BidsResponse {
  bids: Bid[];
  totalPages: number;
  currentPage: number;
  total: number;
}

export const bidService = {
  // Get all bids for a specific product
  getProductBids: async (productId: string, page: number = 1, limit: number = 10): Promise<BidsResponse> => {
    const response = await api.get(`/bids/product/${productId}?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Get all bids by a specific user
  getUserBids: async (userId: string, page: number = 1, limit: number = 10): Promise<BidsResponse> => {
    const response = await api.get(`/bids/user/${userId}?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Create a new bid
  createBid: async (bidData: CreateBidData): Promise<{ message: string; bid: Bid }> => {
    const response = await api.post('/bids', bidData);
    return response.data;
  },

  // Update a bid
  updateBid: async (bidId: string, updateData: { amount?: number; maxBidAmount?: number }): Promise<{ message: string; bid: Bid }> => {
    const response = await api.put(`/bids/${bidId}`, updateData);
    return response.data;
  },

  // Cancel a bid
  cancelBid: async (bidId: string): Promise<{ message: string }> => {
    const response = await api.delete(`/bids/${bidId}`);
    return response.data;
  }
};
