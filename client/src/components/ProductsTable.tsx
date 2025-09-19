import React, { useState, useEffect, useCallback } from 'react';
import { adminService } from '../services/adminService';
import type { Product, Bid } from '../services/adminService';
import { useToast } from '../contexts/ToastContext';
import ProductView from './ProductView';
import { getProductImageUrl } from '../utils/imageUtils';

const ProductsTable: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [productBids, setProductBids] = useState<Record<string, Bid[]>>({});
  const { error: showError } = useToast();

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Fetching products...');
      const data = await adminService.getProducts(currentPage, 10, categoryFilter, statusFilter);
      console.log('Products data received:', data);
      setProducts(data.products);
      setTotalPages(data.totalPages);
      
      // Fetch bids for all products
      await fetchBidsForProducts(data.products);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      console.error('Error details:', {
        message: (error as Error)?.message,
        response: (error as { response?: { data?: unknown; status?: number } })?.response?.data,
        status: (error as { response?: { data?: unknown; status?: number } })?.response?.status
      });
    } finally {
      setLoading(false);
    }
  }, [currentPage, categoryFilter, statusFilter]);

  const fetchBidsForProducts = async (products: Product[]) => {
    const bidsData: Record<string, Bid[]> = {};
    
    // Fetch bids for each product
    for (const product of products) {
      try {
        const bids = await adminService.getProductBids(product._id);
        bidsData[product._id] = bids || [];
      } catch (error) {
        console.error(`Failed to fetch bids for product ${product._id}:`, error);
        bidsData[product._id] = [];
      }
    }
    
    setProductBids(bidsData);
  };

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      try {
        await adminService.deleteProduct(productId);
        fetchProducts(); // Refresh the list
      } catch (error) {
        console.error('Failed to delete product:', error);
        showError('Failed to delete product', 'Please try again or contact support if the problem persists.');
      }
    }
  };

  const handleViewProduct = (productId: string) => {
    setSelectedProductId(productId);
  };

  const handleBackToList = () => {
    setSelectedProductId(null);
  };

  const handleProductUpdated = () => {
    fetchProducts(); // Refresh the list when a product is updated
  };

  const formatBidsDisplay = (productId: string) => {
    const bids = productBids[productId] || [];
    
    if (bids.length === 0) {
      return <span className="text-gray-500 text-xs">No bids</span>;
    }

    return (
      <div className="space-y-1 max-w-[200px]">
        {bids.slice(0, 3).map((bid) => (
          <div key={bid._id} className="text-xs bg-gray-50 p-1 rounded border">
            <div className="font-medium text-gray-900 truncate">
              {bid.bidder.name}
            </div>
            <div className="text-gray-600 truncate">
              {bid.bidder.email}
            </div>
            <div className="font-semibold text-green-600">
              ${bid.amount}
            </div>
          </div>
        ))}
        {bids.length > 3 && (
          <div className="text-xs text-gray-500 text-center">
            +{bids.length - 3} more
          </div>
        )}
      </div>
    );
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

  if (loading && products.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
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

  // Show ProductView if a product is selected
  if (selectedProductId) {
    return (
      <ProductView
        productId={selectedProductId}
        onBack={handleBackToList}
        onProductUpdated={handleProductUpdated}
      />
    );
  }

  return (
    <div className="space-y-6 max-w-full">
      <div className="bg-white rounded-lg shadow p-6 overflow-hidden max-w-full">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Product Management</h2>
        
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="md:w-48">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              <option value="electronics">Electronics</option>
              <option value="clothing">Clothing</option>
              <option value="home">Home & Garden</option>
              <option value="collectibles">Collectibles</option>
              <option value="automotive">Automotive</option>
              <option value="books">Books</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="md:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="sold">Sold</option>
              <option value="expired">Expired</option>
            </select>
          </div>
        </div>

        {/* Products Table */}
        <div className="w-full">
          <div className="text-xs text-gray-500 mb-2 text-center">
            <span className="hidden md:inline">← Scroll horizontally to see all columns →</span>
            <span className="md:hidden">← Swipe to see all columns →</span>
          </div>
          <div className="w-full overflow-x-auto border border-gray-200 rounded-lg shadow-sm" style={{ maxWidth: '100%' }}>
            <table className="w-full table-auto" style={{ minWidth: '1200px' }}>
            <thead>
              <tr className="bg-gray-50">
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[200px]">
                  Product
                </th>
                <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                  Category
                </th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[100px]">
                  Price
                </th>
                <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Status
                </th>
                <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                  Condition
                </th>
                <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                  End Date
                </th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell w-[220px]">
                  Bids
                </th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[120px]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="px-2 py-4 whitespace-nowrap w-[200px]">
                    <div className="flex items-center">
                      <img
                        src={getProductImageUrl(product.imageUrl)}
                        alt={product.name}
                        className="w-8 h-8 rounded-lg object-cover mr-2"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = getProductImageUrl('/placeholder.jpg');
                        }}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-medium text-gray-900 truncate">{product.name}</div>
                        <div className="text-xs text-gray-500 truncate hidden sm:block">
                          {product.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 lg:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                    <span className="text-xs lg:text-sm text-gray-900 capitalize">{product.category}</span>
                  </td>
                  <td className="px-2 py-4 whitespace-nowrap w-[100px]">
                    <div className="text-xs text-gray-900">
                      <div className="font-medium">${product.currentPrice}</div>
                      <div className="text-gray-500 hidden sm:block">${product.startingPrice}</div>
                    </div>
                  </td>
                  <td className="px-3 lg:px-6 py-4 whitespace-nowrap hidden md:table-cell">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(product.status)}`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-3 lg:px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getConditionBadge(product.condition)}`}>
                      {product.condition}
                    </span>
                  </td>
                  <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-xs lg:text-sm text-gray-500 hidden lg:table-cell">
                    {new Date(product.endDate).toLocaleDateString()}
                  </td>
                  <td className="px-2 py-4 hidden md:table-cell w-[220px]">
                    {formatBidsDisplay(product._id)}
                  </td>
                  <td className="px-2 py-4 whitespace-nowrap text-xs font-medium w-[120px]">
                    <div className="flex flex-col space-y-1">
                      <button
                        onClick={() => handleViewProduct(product._id)}
                        className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded transition-colors text-xs"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product._id)}
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
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsTable;