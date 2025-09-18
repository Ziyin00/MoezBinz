import React, { useState } from 'react';
import { adminService } from '../services/adminService';
import type { CreateProductData } from '../services/adminService';
import { useToast } from '../contexts/ToastContext';

interface CreateProductFormProps {
  onSuccess: () => void;
}

const CreateProductForm: React.FC<CreateProductFormProps> = ({ onSuccess }) => {
  const { error: showError, success: showSuccess, warning: showWarning } = useToast();
  const [formData, setFormData] = useState<Omit<CreateProductData, 'image'> & { image: File | null }>({
    name: '',
    description: '',
    category: '',
    startingPrice: 0,
    endDate: '',
    condition: 'good',
    location: '',
    shippingCost: 0,
    tags: '',
    isFeatured: false,
    image: null
  });

  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const categories = [
    'electronics',
    'clothing',
    'home',
    'collectibles',
    'automotive',
    'books',
    'jewelry',
    'art',
    'sports',
    'toys',
    'other'
  ];

  const conditions = [
    { value: 'new', label: 'New' },
    { value: 'like-new', label: 'Like New' },
    { value: 'good', label: 'Good' },
    { value: 'fair', label: 'Fair' },
    { value: 'poor', label: 'Poor' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.image) {
      showWarning('Image Required', 'Please select an image for the product');
      return;
    }

    try {
      setLoading(true);
      console.log('Creating product with data:', formData);
      
      const productData: CreateProductData = {
        ...formData,
        image: formData.image!
      };

      const result = await adminService.createProduct(productData);
      console.log('Product created successfully:', result);
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        category: '',
        startingPrice: 0,
        endDate: '',
        condition: 'good',
        location: '',
        shippingCost: 0,
        tags: '',
        isFeatured: false,
        image: null
      });
      setImagePreview(null);
      
      showSuccess('Product Created!', 'Your product has been successfully created and is now live.');
      onSuccess();
    } catch (error) {
      console.error('Failed to create product:', error);
      console.error('Error details:', {
        message: (error as any)?.message,
        response: (error as any)?.response?.data,
        status: (error as any)?.response?.status
      });
      const errorMessage = (error as any)?.response?.data?.message || (error as any)?.message || 'Unknown error';
      showError('Failed to create product', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Set minimum date to today
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="bg-white rounded-lg shadow p-4 lg:p-6">
        <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4 lg:mb-6">Create New Product</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 lg:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base"
                  placeholder="Enter product name"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-3 lg:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base"
                  placeholder="Describe your product in detail"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 lg:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base"
                  >
                    <option value="">Select category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-1">
                    Condition *
                  </label>
                  <select
                    id="condition"
                    name="condition"
                    value={formData.condition}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 lg:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base"
                  >
                    {conditions.map(condition => (
                      <option key={condition.value} value={condition.value}>
                        {condition.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="startingPrice" className="block text-sm font-medium text-gray-700 mb-1">
                    Starting Price ($) *
                  </label>
                  <input
                    type="number"
                    id="startingPrice"
                    name="startingPrice"
                    value={formData.startingPrice}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-3 lg:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label htmlFor="shippingCost" className="block text-sm font-medium text-gray-700 mb-1">
                    Shipping Cost ($)
                  </label>
                  <input
                    type="number"
                    id="shippingCost"
                    name="shippingCost"
                    value={formData.shippingCost}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="w-full px-3 lg:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Auction End Date *
                  </label>
                  <input
                    type="datetime-local"
                    id="endDate"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    required
                    min={today}
                    className="w-full px-3 lg:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base"
                  />
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                    Location *
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 lg:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base"
                    placeholder="City, State"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  className="w-full px-3 lg:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base"
                  placeholder="vintage, rare, collectible"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isFeatured"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isFeatured" className="ml-2 block text-sm text-gray-700">
                  Feature this product
                </label>
              </div>
            </div>

            {/* Right Column - Image Upload */}
            <div className="space-y-4">
              <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                  Product Image *
                </label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  onChange={handleImageChange}
                  accept="image/*"
                  required
                  className="w-full px-3 lg:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base"
                />
              </div>

              {imagePreview && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image Preview
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    <img
                      src={imagePreview}
                      alt="Product preview"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => {
                setFormData({
                  name: '',
                  description: '',
                  category: '',
                  startingPrice: 0,
                  endDate: '',
                  condition: 'good',
                  location: '',
                  shippingCost: 0,
                  tags: '',
                  isFeatured: false,
                  image: null
                });
                setImagePreview(null);
              }}
              className="w-full sm:w-auto px-4 lg:px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:border-transparent text-sm lg:text-base"
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-4 lg:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed text-sm lg:text-base"
            >
              {loading ? 'Creating...' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProductForm;
