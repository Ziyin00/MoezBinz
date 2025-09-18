import React, { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';
import type { Bid } from '../services/adminService';

const BidsTable: React.FC = () => {
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [productFilter, setProductFilter] = useState('');

  useEffect(() => {
    fetchBids();
  }, [currentPage, productFilter]);

  const fetchBids = async () => {
    try {
      setLoading(true);
      console.log('Fetching bids...');
      const data = await adminService.getBids(currentPage, 10, productFilter);
      console.log('Bids data received:', data);
      setBids(data.bids);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Failed to fetch bids:', error);
      console.error('Error details:', {
        message: (error as any)?.message,
        response: (error as any)?.response?.data,
        status: (error as any)?.response?.status
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      active: 'bg-green-100 text-green-800',
      outbid: 'bg-yellow-100 text-yellow-800',
      winning: 'bg-blue-100 text-blue-800',
      won: 'bg-purple-100 text-purple-800',
      lost: 'bg-red-100 text-red-800'
    };
    return badges[status as keyof typeof badges] || 'bg-gray-100 text-gray-800';
  };

  if (loading && bids.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4 w-48"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Bid Management</h2>
        
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Filter by product ID..."
              value={productFilter}
              onChange={(e) => setProductFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Bids Table */}
        <div className="overflow-x-auto">
          <table className="w-full table-auto min-w-[700px]">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                  Bidder
                </th>
                <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Status
                </th>
                <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                  Bid Time
                </th>
                <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                  Auto Bid
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bids.map((bid) => (
                <tr key={bid._id} className="hover:bg-gray-50">
                  <td className="px-3 lg:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={bid.product.imageUrl.startsWith('http') ? bid.product.imageUrl : `/uploads${bid.product.imageUrl}`}
                        alt={bid.product.name}
                        className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg object-cover mr-2 lg:mr-3"
                      />
                      <div>
                        <div className="text-xs lg:text-sm font-medium text-gray-900">{bid.product.name}</div>
                        <div className="text-xs lg:text-sm text-gray-500">
                          Current: ${bid.product.currentPrice}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 lg:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                    <div>
                      <div className="text-xs lg:text-sm font-medium text-gray-900">{bid.bidder.name}</div>
                      <div className="text-xs lg:text-sm text-gray-500">{bid.bidder.email}</div>
                    </div>
                  </td>
                  <td className="px-3 lg:px-6 py-4 whitespace-nowrap">
                    <div className="text-xs lg:text-sm font-medium text-gray-900">${bid.amount}</div>
                    {bid.maxBidAmount && (
                      <div className="text-xs lg:text-sm text-gray-500 hidden sm:block">Max: ${bid.maxBidAmount}</div>
                    )}
                  </td>
                  <td className="px-3 lg:px-6 py-4 whitespace-nowrap hidden md:table-cell">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(bid.status)}`}>
                      {bid.status}
                    </span>
                  </td>
                  <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-xs lg:text-sm text-gray-500 hidden lg:table-cell">
                    {new Date(bid.bidTime).toLocaleString()}
                  </td>
                  <td className="px-3 lg:px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                    {bid.isAutoBid ? (
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        Auto
                      </span>
                    ) : (
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                        Manual
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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

        {bids.length === 0 && !loading && (
          <div className="text-center py-8">
            <p className="text-gray-500">No bids found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BidsTable;
