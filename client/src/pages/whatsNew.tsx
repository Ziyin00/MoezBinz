import React, { useState, useEffect } from 'react';
import { newsService, type News } from '../services/newsService';
import { useToast } from '../contexts/ToastContext';
import Header from '../components/Navbar';
import Footer from '../components/Footer';
import { getNewsImageUrl } from '../utils/imageUtils';

const WhatsNew: React.FC = () => {
  const [news, setNews] = useState<News[]>([]);
  const [featuredNews, setFeaturedNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedNews, setSelectedNews] = useState<News | null>(null);
  const { error: showError } = useToast();

  useEffect(() => {
    fetchNews();
    fetchFeaturedNews();
  }, [currentPage]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const data = await newsService.getNews(currentPage, 9);
      setNews(data.news);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Failed to fetch news:', error);
      showError('Failed to load news', 'Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchFeaturedNews = async () => {
    try {
      const data = await newsService.getFeaturedNews(3);
      setFeaturedNews(data.news);
    } catch (error) {
      console.error('Failed to fetch featured news:', error);
    }
  };

  const handleNewsClick = (newsItem: News) => {
    setSelectedNews(newsItem);
  };

  const handleBackToList = () => {
    setSelectedNews(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (selectedNews) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 pt-20">
          <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Back Button */}
            <button
              onClick={handleBackToList}
              className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to News
            </button>

            {/* News Article */}
            <article className="bg-white rounded-lg shadow-lg overflow-hidden">
              {selectedNews.imageUrl && (
                <div className="aspect-video w-full">
                  <img
                    src={getNewsImageUrl(selectedNews.imageUrl)}
                    alt={selectedNews.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = getNewsImageUrl('/placeholder.jpg');
                    }}
                  />
                </div>
              )}
              
              <div className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-500">By {selectedNews.author.name}</span>
                    <span className="text-sm text-gray-500">•</span>
                    <span className="text-sm text-gray-500">{formatDate(selectedNews.publishedAt)}</span>
                  </div>
                  {selectedNews.featured && (
                    <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                      Featured
                    </span>
                  )}
                </div>
                
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{selectedNews.title}</h1>
                
                {selectedNews.excerpt && (
                  <p className="text-lg text-gray-600 mb-6 leading-relaxed">{selectedNews.excerpt}</p>
                )}
                
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{selectedNews.content}</p>
                </div>
              </div>
            </article>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative h-[50vh] bg-black">
          <img 
            src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
            alt="News and updates"
            className="absolute inset-0 w-full h-full object-cover opacity-40"
          />
          <div className="relative h-full flex flex-col justify-center items-center text-center text-white px-4">
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight animate-fade-in-up">
              What's New
            </h1>
            <p className="mt-4 text-lg sm:text-xl max-w-3xl animate-fade-in-up animation-delay-200">
              Stay updated with the latest news, announcements, and updates from Moez Binz
            </p>
          </div>
        </section>

        <div className="bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 py-8">

          {/* Featured News Section */}
          {featuredNews.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured News</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {featuredNews.map((newsItem) => (
                  <div
                    key={newsItem._id}
                    onClick={() => handleNewsClick(newsItem)}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  >
                    {newsItem.imageUrl && (
                      <div className="aspect-video">
                        <img
                          src={getNewsImageUrl(newsItem.imageUrl)}
                          alt={newsItem.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = getNewsImageUrl('/placeholder.jpg');
                          }}
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-500">{formatDate(newsItem.publishedAt)}</span>
                        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
                          Featured
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                        {newsItem.title}
                      </h3>
                      {newsItem.excerpt && (
                        <p className="text-gray-600 text-sm line-clamp-3">{newsItem.excerpt}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* All News Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">All News</h2>
            
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                    <div className="aspect-video bg-gray-200"></div>
                    <div className="p-6">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : news.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 12h6M7 8h6" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No news available</h3>
                <p className="text-gray-500">Check back later for updates!</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {news.map((newsItem) => (
                    <div
                      key={newsItem._id}
                      onClick={() => handleNewsClick(newsItem)}
                      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                    >
                      {newsItem.imageUrl && (
                        <div className="aspect-video">
                          <img
                            src={getNewsImageUrl(newsItem.imageUrl)}
                            alt={newsItem.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = getNewsImageUrl('/placeholder.jpg');
                            }}
                          />
                        </div>
                      )}
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-500">{formatDate(newsItem.publishedAt)}</span>
                          {newsItem.featured && (
                            <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
                              Featured
                            </span>
                          )}
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                          {newsItem.title}
                        </h3>
                        {newsItem.excerpt && (
                          <p className="text-gray-600 text-sm line-clamp-3">{newsItem.excerpt}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center space-x-2 mt-12">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    
                    {[...Array(totalPages)].map((_, index) => {
                      const page = index + 1;
                      const isCurrentPage = page === currentPage;
                      const shouldShow = page === 1 || page === totalPages || Math.abs(page - currentPage) <= 2;
                      
                      if (!shouldShow) {
                        if (page === 2 && currentPage > 4) {
                          return <span key={page} className="px-4 py-2 text-sm text-gray-500">...</span>;
                        }
                        if (page === totalPages - 1 && currentPage < totalPages - 3) {
                          return <span key={page} className="px-4 py-2 text-sm text-gray-500">...</span>;
                        }
                        return null;
                      }
                      
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-4 py-2 text-sm font-medium rounded-md ${
                            isCurrentPage
                              ? 'text-white bg-red-600 border border-red-600'
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
                      className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WhatsNew;
