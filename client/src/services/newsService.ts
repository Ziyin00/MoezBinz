import { api } from '../api/axios';

export interface News {
  _id: string;
  title: string;
  content: string;
  excerpt?: string;
  imageUrl?: string;
  author: {
    _id?: string;
    name: string;
    email?: string;
  };
  status: 'published' | 'draft';
  featured: boolean;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNewsData {
  title: string;
  content: string;
  excerpt?: string;
  image?: File;
  status?: 'published' | 'draft';
  featured?: boolean;
}

export interface NewsResponse {
  news: News[];
  totalPages: number;
  currentPage: number;
  total: number;
}

export const newsService = {
  // Get all news (public)
  getNews: async (page = 1, limit = 12, featured = '') => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    if (featured) {
      params.append('featured', featured);
    }
    
    const response = await api.get(`/news?${params.toString()}`);
    return response.data;
  },

  // Get single news item (public)
  getNewsItem: async (newsId: string) => {
    const response = await api.get(`/news/${newsId}`);
    return response.data;
  },

  // Get featured news (public)
  getFeaturedNews: async (limit = 3) => {
    const response = await api.get(`/news/featured/list?limit=${limit}`);
    return response.data;
  },

  // Admin news management
  getAdminNews: async (page = 1, limit = 10, status = '', featured = '') => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    if (status) {
      params.append('status', status);
    }
    
    if (featured) {
      params.append('featured', featured);
    }
    
    const response = await api.get(`/admin/news?${params.toString()}`);
    return response.data;
  },

  // Get single news item (admin)
  getAdminNewsItem: async (newsId: string) => {
    const response = await api.get(`/admin/news/${newsId}`);
    return response.data;
  },

  // Create news (admin)
  createNews: async (newsData: CreateNewsData) => {
    const formData = new FormData();
    formData.append('title', newsData.title);
    formData.append('content', newsData.content);
    
    if (newsData.excerpt) {
      formData.append('excerpt', newsData.excerpt);
    }
    
    if (newsData.image) {
      formData.append('image', newsData.image);
    }
    
    if (newsData.status) {
      formData.append('status', newsData.status);
    }
    
    if (newsData.featured !== undefined) {
      formData.append('featured', newsData.featured.toString());
    }
    
    const response = await api.post('/admin/news', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Update news (admin)
  updateNews: async (newsId: string, newsData: Partial<CreateNewsData>) => {
    const formData = new FormData();
    
    if (newsData.title !== undefined) {
      formData.append('title', newsData.title);
    }
    
    if (newsData.content !== undefined) {
      formData.append('content', newsData.content);
    }
    
    if (newsData.excerpt !== undefined) {
      formData.append('excerpt', newsData.excerpt);
    }
    
    if (newsData.image) {
      formData.append('image', newsData.image);
    }
    
    if (newsData.status !== undefined) {
      formData.append('status', newsData.status);
    }
    
    if (newsData.featured !== undefined) {
      formData.append('featured', newsData.featured.toString());
    }
    
    const response = await api.put(`/admin/news/${newsId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete news (admin)
  deleteNews: async (newsId: string) => {
    const response = await api.delete(`/admin/news/${newsId}`);
    return response.data;
  },
};
