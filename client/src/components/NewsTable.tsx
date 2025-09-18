import React, { useState, useEffect, useCallback } from 'react';
import { newsService } from '../services/newsService';
import type { News } from '../services/newsService';
import { useToast } from '../contexts/ToastContext';
import NewsView from './NewsView';

const NewsTable: React.FC = () => {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [featuredFilter, setFeaturedFilter] = useState('');
  const [selectedNewsId, setSelectedNewsId] = useState<string | null>(null);
  const { error: showError } = useToast();

  const fetchNews = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Fetching news...');
      const data = await newsService.getAdminNews(currentPage, 10, statusFilter, featuredFilter);
      console.log('News data received:', data);
      setNews(data.news);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Failed to fetch news:', error);
      console.error('Error details:', {
        message: (error as Error)?.message,
        response: (error as { response?: { data?: unknown; status?: number } })?.response?.data,
        status: (error as { response?: { data?: unknown; status?: number } })?.response?.status
      });
    } finally {
      setLoading(false);
    }
  }, [currentPage, statusFilter, featuredFilter]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  const handleDeleteNews = async (newsId: string) => {
    if (window.confirm('Are you sure you want to delete this news article? This action cannot be undone.')) {
      try {
        await newsService.deleteNews(newsId);
        fetchNews(); // Refresh the list
      } catch (error) {
        console.error('Failed to delete news:', error);
        showError('Failed to delete news', 'Please try again or contact support if the problem persists.');
      }
    }
  };

  const handleViewNews = (newsId: string) => {
    setSelectedNewsId(newsId);
  };

  const handleBackToList = () => {
    setSelectedNewsId(null);
  };

  const handleNewsUpdated = () => {
    fetchNews(); // Refresh the list when news is updated
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      published: 'bg-green-100 text-green-800',
      draft: 'bg-yellow-100 text-yellow-800',
    };
    return badges[status as keyof typeof badges] || 'bg-gray-100 text-gray-800';
  };

  const getFeaturedBadge = (featured: boolean) => {
    return featured 
      ? 'bg-purple-100 text-purple-800' 
      : 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4 w-48"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Show NewsView if a news item is selected
  if (selectedNewsId) {
    return (
      <NewsView
        newsId={selectedNewsId}
        onBack={handleBackToList}
        onNewsUpdated={handleNewsUpdated}
      />
    );
  }

  return (
    <div className="space-y-6 max-w-full">
      <div className="bg-white rounded-lg shadow p-6 overflow-hidden max-w-full">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">News Management</h2>
        
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="md:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
          <div className="md:w-48">
            <select
              value={featuredFilter}
              onChange={(e) => setFeaturedFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Featured</option>
              <option value="true">Featured</option>
              <option value="false">Not Featured</option>
            </select>
          </div>
        </div>

        {/* News Table */}
        <div className="w-full">
          <div className="text-xs text-gray-500 mb-2 text-center">
            <span className="hidden md:inline">← Scroll horizontally to see all columns →</span>
            <span className="md:hidden">← Swipe to see all columns →</span>
          </div>
          <div className="w-full overflow-x-auto border border-gray-200 rounded-lg shadow-sm" style={{ maxWidth: '100%' }}>
            <table className="w-full table-auto" style={{ minWidth: '1000px' }}>
            <thead>
              <tr className="bg-gray-50">
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[300px]">
                  Title
                </th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell w-[200px]">
                  Author
                </th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[100px]">
                  Status
                </th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[100px]">
                  Featured
                </th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell w-[150px]">
                  Published
                </th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[120px]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {news.map((newsItem) => (
                <tr key={newsItem._id} className="hover:bg-gray-50">
                  <td className="px-2 py-4 w-[300px]">
                    <div className="flex items-center">
                      {newsItem.imageUrl && (
                        <img
                          src={newsItem.imageUrl.startsWith('http') ? newsItem.imageUrl : `/uploads${newsItem.imageUrl}`}
                          alt={newsItem.title}
                          className="w-12 h-12 rounded-lg object-cover mr-3"
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium text-gray-900 truncate">{newsItem.title}</div>
                        <div className="text-xs text-gray-500 truncate hidden sm:block">
                          {newsItem.excerpt || newsItem.content.substring(0, 100) + '...'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-2 py-4 whitespace-nowrap hidden md:table-cell w-[200px]">
                    <span className="text-xs text-gray-900">{newsItem.author.name}</span>
                  </td>
                  <td className="px-2 py-4 whitespace-nowrap w-[100px]">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(newsItem.status)}`}>
                      {newsItem.status}
                    </span>
                  </td>
                  <td className="px-2 py-4 whitespace-nowrap w-[100px]">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getFeaturedBadge(newsItem.featured)}`}>
                      {newsItem.featured ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-2 py-4 whitespace-nowrap text-xs text-gray-500 hidden lg:table-cell w-[150px]">
                    {new Date(newsItem.publishedAt).toLocaleDateString()}
                  </td>
                  <td className="px-2 py-4 whitespace-nowrap text-xs font-medium w-[120px]">
                    <div className="flex flex-col space-y-1">
                      <button
                        onClick={() => handleViewNews(newsItem._id)}
                        className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded transition-colors text-xs"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleDeleteNews(newsItem._id)}
                        className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-2 py-1 rounded transition-colors text-xs"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-6">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            {[...Array(totalPages)].map((_, index) => {
              const page = index + 1;
              const isCurrentPage = page === currentPage;
              const shouldShow = page === 1 || page === totalPages || Math.abs(page - currentPage) <= 2;
              
              if (!shouldShow) {
                if (page === 2 && currentPage > 4) {
                  return <span key={page} className="px-3 py-2 text-sm text-gray-500">...</span>;
                }
                if (page === totalPages - 1 && currentPage < totalPages - 3) {
                  return <span key={page} className="px-3 py-2 text-sm text-gray-500">...</span>;
                }
                return null;
              }
              
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    isCurrentPage
                      ? 'text-white bg-blue-600 border border-blue-600'
                      : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              );
            })}
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsTable;