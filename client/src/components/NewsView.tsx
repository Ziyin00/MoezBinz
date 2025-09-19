import React, { useState, useEffect, useCallback } from 'react';
import { newsService } from '../services/newsService';
import type { News, CreateNewsData } from '../services/newsService';
import { useToast } from '../contexts/ToastContext';
import { getNewsImageUrl } from '../utils/imageUtils';

interface NewsViewProps {
  newsId: string;
  onBack: () => void;
  onNewsUpdated: () => void;
}

const NewsView: React.FC<NewsViewProps> = ({ newsId, onBack, onNewsUpdated }) => {
  const [news, setNews] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState<Partial<News>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { success: showSuccess, error: showError } = useToast();

  const fetchNews = useCallback(async () => {
    try {
      setLoading(true);
      const response = await newsService.getAdminNewsItem(newsId);
      setNews(response.news);
      setEditForm(response.news);
    } catch (error) {
      console.error('Failed to fetch news:', error);
      showError('Failed to load news', 'Please try again or contact support if the problem persists.');
    } finally {
      setLoading(false);
    }
  }, [newsId, showError]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditForm(news || {});
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm(news || {});
    setImageFile(null);
    setImagePreview(null);
  };

  const handleInputChange = (field: keyof News, value: string | boolean) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!news) return;

    try {
      setSaving(true);
      // Convert News data to CreateNewsData format
      const updateData: Partial<CreateNewsData> = {
        title: editForm.title,
        content: editForm.content,
        excerpt: editForm.excerpt,
        status: editForm.status as 'published' | 'draft',
        featured: editForm.featured,
        image: imageFile || undefined,
      };
      
      await newsService.updateNews(newsId, updateData);
      showSuccess('News updated successfully!');
      setIsEditing(false);
      await fetchNews(); // Refresh the news data
      onNewsUpdated(); // Notify parent component
    } catch (error) {
      console.error('Failed to update news:', error);
      showError('Failed to update news', 'Please try again or contact support if the problem persists.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4 w-64"></div>
          <div className="h-4 bg-gray-200 rounded mb-2 w-full"></div>
          <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded mb-2 w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900">News not found</h3>
          <p className="text-gray-500 mt-2">The news article you're looking for doesn't exist.</p>
          <button
            onClick={onBack}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to News List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-full">
      <div className="bg-white rounded-lg shadow p-6 overflow-hidden max-w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h2 className="text-2xl font-bold text-gray-900">News Details</h2>
          </div>
          <div className="flex space-x-2">
            {!isEditing ? (
              <button
                onClick={handleEdit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Edit
              </button>
            ) : (
              <>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </>
            )}
          </div>
        </div>

        {/* News Content */}
        <div className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            {isEditing ? (
              <input
                type="text"
                value={editForm.title || ''}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter news title"
              />
            ) : (
              <h3 className="text-xl font-semibold text-gray-900">{news.title}</h3>
            )}
          </div>

          {/* Image */}
          {news.imageUrl && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
              {isEditing ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <img
                      src={imagePreview || getNewsImageUrl(news.imageUrl)}
                      alt={news.title}
                      className="w-32 h-32 object-cover rounded-lg border"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = getNewsImageUrl('/placeholder.jpg');
                      }}
                    />
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                      <p className="text-xs text-gray-500 mt-1">Leave empty to keep current image</p>
                    </div>
                  </div>
                </div>
              ) : (
                <img
                  src={getNewsImageUrl(news.imageUrl)}
                  alt={news.title}
                  className="w-full max-w-md h-64 object-cover rounded-lg border"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = getNewsImageUrl('/placeholder.jpg');
                  }}
                />
              )}
            </div>
          )}

          {/* Status and Featured */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              {isEditing ? (
                <select
                  value={editForm.status || 'published'}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              ) : (
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                  news.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {news.status}
                </span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Featured</label>
              {isEditing ? (
                <select
                  value={editForm.featured ? 'true' : 'false'}
                  onChange={(e) => handleInputChange('featured', e.target.value === 'true')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
              ) : (
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                  news.featured ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {news.featured ? 'Featured' : 'Not Featured'}
                </span>
              )}
            </div>
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt</label>
            {isEditing ? (
              <textarea
                value={editForm.excerpt || ''}
                onChange={(e) => handleInputChange('excerpt', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter news excerpt (optional)"
              />
            ) : (
              <p className="text-gray-700">{news.excerpt || 'No excerpt provided'}</p>
            )}
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
            {isEditing ? (
              <textarea
                value={editForm.content || ''}
                onChange={(e) => handleInputChange('content', e.target.value)}
                rows={10}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter news content"
              />
            ) : (
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap">{news.content}</p>
              </div>
            )}
          </div>

          {/* Author and Dates */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
              <p className="text-sm text-gray-600">{news.author.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Published</label>
              <p className="text-sm text-gray-600">{new Date(news.publishedAt).toLocaleDateString()}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Updated</label>
              <p className="text-sm text-gray-600">{new Date(news.updatedAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsView;
