import React, { useState, useEffect, useCallback } from 'react';
import { adminService } from '../services/adminService';
import type { Product } from '../services/adminService';
import { useToast } from '../contexts/ToastContext';

interface ProductViewProps {
  productId: string;
  onBack: () => void;
  onProductUpdated: () => void;
}

const ProductView: React.FC<ProductViewProps> = ({ productId, onBack, onProductUpdated }) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Product>>({});
  const [saving, setSaving] = useState(false);
  const { success: showSuccess, error: showError } = useToast();

  const fetchProduct = useCallback(async () => {
    try {
      setLoading(true);
      const response = await adminService.getProduct(productId);
      setProduct(response.product);
      setEditForm(response.product);
    } catch (error) {
      console.error('Failed to fetch product:', error);
      showError('Failed to load product', 'Please try again or contact support if the problem persists.');
    } finally {
      setLoading(false);
    }
  }, [productId, showError]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm(product || {});
  };

  const handleSave = async () => {
    if (!product) return;

    try {
      setSaving(true);
      // Convert Product data to CreateProductData format
      const updateData = {
        name: editForm.name,
        description: editForm.description,
        category: editForm.category,
        startingPrice: editForm.startingPrice,
        endDate: editForm.endDate,
        condition: editForm.condition,
        location: editForm.location,
        shippingCost: editForm.shippingCost,
        tags: Array.isArray(editForm.tags) ? editForm.tags.join(',') : (editForm.tags || ''),
        isFeatured: editForm.isFeatured,
        // Note: image field is not included as it's optional for updates
      };
      await adminService.updateProduct(productId, updateData);
      showSuccess('Product updated successfully!');
      setIsEditing(false);
      await fetchProduct(); // Refresh the product data
      onProductUpdated(); // Notify parent component
    } catch (error) {
      console.error('Failed to update product:', error);
      showError('Failed to update product', 'Please try again or contact support if the problem persists.');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof Product, value: string | number | boolean | string[]) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      active: 'bg-green-100 text-green-800',
      sold: 'bg-blue-100 text-blue-800',
      expired: 'bg-red-100 text-red-800'
    };
    return badges[status as keyof typeof badges] || 'bg-gray-100 text-gray-800';
  };

  const getConditionBadge = (condition: string) => {
    const badges = {
      'new': 'bg-green-100 text-green-800',
      'like-new': 'bg-blue-100 text-blue-800',
      'good': 'bg-yellow-100 text-yellow-800',
      'fair': 'bg-orange-100 text-orange-800',
      'poor': 'bg-red-100 text-red-800'
    };
    return badges[condition as keyof typeof badges] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4 w-48"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center">
          <p className="text-red-600 mb-4">Product not found</p>
          <button
            onClick={onBack}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBack}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Products
          </button>
          <div className="flex space-x-2">
            {!isEditing ? (
              <button
                onClick={handleEdit}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Edit Product
              </button>
            ) : (
              <>
                <button
                  onClick={handleCancel}
                  className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </>
            )}
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Product Details</h1>
      </div>

      {/* Product Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Product Image */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Product Image</h2>
          <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
            <img
              src={product.imageUrl && product.imageUrl.startsWith('http') ? product.imageUrl : `/uploads${product.imageUrl || '/placeholder.jpg'}`}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Product Details */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Product Information</h2>
          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editForm.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900">{product.name}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              {isEditing ? (
                <textarea
                  value={editForm.description || ''}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900">{product.description}</p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              {isEditing ? (
                <select
                  value={editForm.category || ''}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="electronics">Electronics</option>
                  <option value="clothing">Clothing</option>
                  <option value="home">Home & Garden</option>
                  <option value="collectibles">Collectibles</option>
                  <option value="automotive">Automotive</option>
                  <option value="books">Books</option>
                  <option value="other">Other</option>
                </select>
              ) : (
                <p className="text-gray-900 capitalize">{product.category}</p>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              {isEditing ? (
                <select
                  value={editForm.status || ''}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="active">Active</option>
                  <option value="sold">Sold</option>
                  <option value="expired">Expired</option>
                </select>
              ) : (
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(product.status)}`}>
                  {product.status}
                </span>
              )}
            </div>

            {/* Condition */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
              {isEditing ? (
                <select
                  value={editForm.condition || ''}
                  onChange={(e) => handleInputChange('condition', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="new">New</option>
                  <option value="like-new">Like New</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                  <option value="poor">Poor</option>
                </select>
              ) : (
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getConditionBadge(product.condition)}`}>
                  {product.condition}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Pricing and Dates */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pricing */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Pricing</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Starting Price</label>
              {isEditing ? (
                <input
                  type="number"
                  step="0.01"
                  value={editForm.startingPrice || ''}
                  onChange={(e) => handleInputChange('startingPrice', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900">${product.startingPrice}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Price</label>
              <p className="text-gray-900">${product.currentPrice}</p>
            </div>
          </div>
        </div>

        {/* Dates */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Dates</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              {isEditing ? (
                <input
                  type="datetime-local"
                  value={editForm.endDate ? new Date(editForm.endDate).toISOString().slice(0, 16) : ''}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900">{new Date(product.endDate).toLocaleString()}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Created Date</label>
              <p className="text-gray-900">{new Date(product.createdAt).toLocaleString()}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Updated</label>
              <p className="text-gray-900">{new Date(product.updatedAt).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Additional Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            {isEditing ? (
              <input
                type="text"
                value={editForm.location || ''}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-900">{product.location}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Cost</label>
            {isEditing ? (
              <input
                type="number"
                step="0.01"
                value={editForm.shippingCost || ''}
                onChange={(e) => handleInputChange('shippingCost', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-900">${product.shippingCost}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Featured</label>
            {isEditing ? (
              <select
                value={editForm.isFeatured ? 'true' : 'false'}
                onChange={(e) => handleInputChange('isFeatured', e.target.value === 'true')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            ) : (
              <p className="text-gray-900">{product.isFeatured ? 'Yes' : 'No'}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
            {isEditing ? (
              <input
                type="text"
                value={Array.isArray(editForm.tags) ? editForm.tags.join(', ') : ''}
                onChange={(e) => handleInputChange('tags', e.target.value)}
                placeholder="Enter tags separated by commas"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-900">{Array.isArray(product.tags) ? product.tags.join(', ') : 'No tags'}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductView;
