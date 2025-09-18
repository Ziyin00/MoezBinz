import { api } from '../api/axios';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  category: string;
  startingPrice: number;
  currentPrice: number;
  imageUrl: string;
  status: 'active' | 'sold' | 'expired';
  endDate: string;
  createdBy: User;
  winner?: User;
  tags: string[];
  condition: 'new' | 'like-new' | 'good' | 'fair' | 'poor';
  location: string;
  shippingCost: number;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Bid {
  _id: string;
  product: Product;
  bidder: User;
  amount: number;
  status: 'active' | 'outbid' | 'winning' | 'won' | 'lost';
  isAutoBid: boolean;
  maxBidAmount?: number;
  bidTime: string;
}

export interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalBids: number;
  activeProducts: number;
  soldProducts: number;
  recentUsers: User[];
  topProducts: Product[];
}

export interface CreateProductData {
  name: string;
  description: string;
  category: string;
  startingPrice: number;
  endDate: string;
  condition: string;
  location: string;
  shippingCost: number;
  tags: string;
  isFeatured: boolean;
  image: File;
}

// Admin API functions
export const adminService = {
  // Dashboard stats
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await api.get('/admin/stats');
    return response.data;
  },

  // User management
  getUsers: async (page = 1, limit = 10, search = '', role = '') => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    if (search) params.append('search', search);
    if (role) params.append('role', role);
    
    const response = await api.get(`/admin/users?${params}`);
    return response.data;
  },

  updateUserRole: async (userId: string, role: 'admin' | 'user') => {
    const response = await api.put(`/admin/users/${userId}/role`, { role });
    return response.data;
  },

  deleteUser: async (userId: string) => {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  },

  // Product management
  getProducts: async (page = 1, limit = 10, category = '', status = '') => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    if (category) params.append('category', category);
    if (status) params.append('status', status);
    
    const response = await api.get(`/admin/products?${params}`);
    return response.data;
  },

  createProduct: async (productData: CreateProductData) => {
    const formData = new FormData();
    
    Object.entries(productData).forEach(([key, value]) => {
      if (key === 'image') {
        formData.append('image', value);
      } else {
        formData.append(key, value.toString());
      }
    });
    
    const response = await api.post('/admin/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updateProduct: async (productId: string, productData: Partial<CreateProductData>) => {
    const formData = new FormData();
    
    Object.entries(productData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'image') {
          // Only append if value is an object (File or Blob)
          if (typeof value === 'object' && value !== null && 'size' in value && 'type' in value) {
            formData.append('image', value as Blob);
          }
        } else {
          formData.append(key, String(value));
        }
      }
    });
    
    const response = await api.put(`/admin/products/${productId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteProduct: async (productId: string) => {
    const response = await api.delete(`/admin/products/${productId}`);
    return response.data;
  },

  // Bid management
  getBids: async (page = 1, limit = 10, productId = '') => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    if (productId) params.append('productId', productId);
    
    const response = await api.get(`/admin/bids?${params}`);
    return response.data;
  },

  getProductBids: async (productId: string) => {
    const response = await api.get(`/products/${productId}/bids`);
    return response.data;
  },
};
