import { api } from '../api/axios';

export interface Product {
  _id: string;
  name: string;
  description: string;
  category: string;
  startingPrice: number;
  currentPrice: number;
  endDate: string;
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  location: string;
  shippingCost: number;
  tags: string[];
  isFeatured: boolean;
  imageUrl: string;
  status: 'active' | 'sold' | 'cancelled' | 'expired';
  seller: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  products: Product[];
  totalPages: number;
  currentPage: number;
  total: number;
}

export interface ProductFilters {
  category?: string;
  status?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  page?: number;
  limit?: number;
}

export const productService = {
  // Get all products with optional filters
  getProducts: async (filters: ProductFilters = {}): Promise<ProductsResponse> => {
    const params = new URLSearchParams();
    
    if (filters.category) params.append('category', filters.category);
    if (filters.status) params.append('status', filters.status);
    if (filters.minPrice) params.append('minPrice', filters.minPrice.toString());
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
    if (filters.search) params.append('search', filters.search);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    const response = await api.get(`/products?${params.toString()}`);
    return response.data;
  },

  // Get a single product by ID
  getProduct: async (productId: string): Promise<Product> => {
    const response = await api.get(`/products/${productId}`);
    return response.data;
  },

  // Get products by category
  getProductsByCategory: async (category: string, page: number = 1, limit: number = 12): Promise<ProductsResponse> => {
    const response = await api.get(`/products?category=${category}&page=${page}&limit=${limit}`);
    return response.data;
  },

  // Get featured products
  getFeaturedProducts: async (limit: number = 6): Promise<ProductsResponse> => {
    const response = await api.get(`/products?isFeatured=true&limit=${limit}`);
    return response.data;
  },

  // Get active products (for auction page)
  getActiveProducts: async (page: number = 1, limit: number = 12): Promise<ProductsResponse> => {
    const response = await api.get(`/products?status=active&page=${page}&limit=${limit}`);
    return response.data;
  }
};
