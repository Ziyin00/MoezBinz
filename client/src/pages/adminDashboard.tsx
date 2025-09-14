import React, { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';
import type { DashboardStats } from '../services/adminService';
import DashboardSidebar from '../components/DashboardSidebar';
import UsersTable from '../components/UsersTable';
import ProductsTable from '../components/ProductsTable';
import BidsTable from '../components/BidsTable';
import CreateProductForm from '../components/CreateProductForm';
import Header from '../components/Navbar';
import Footer from '../components/Footer';
import { useAppSelector } from '../store/hooks';

type ActiveTab = 'overview' | 'users' | 'products' | 'bids' | 'create-product';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { user, accessToken } = useAppSelector((state) => state.auth);

  useEffect(() => {
    console.log('AdminDashboard mounted. Auth state:', { user, accessToken: accessToken ? 'present' : 'missing' });
    if (accessToken) {
      fetchDashboardStats();
    }
  }, [accessToken]);

  const fetchDashboardStats = async () => {
    if (!accessToken) {
      console.error('No access token available for dashboard API calls');
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      console.log('Fetching dashboard stats with token:', accessToken.substring(0, 20) + '...');
      const data = await adminService.getDashboardStats();
      console.log('Dashboard stats received:', data);
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
      console.error('Error details:', {
        message: (error as any)?.message,
        response: (error as any)?.response?.data,
        status: (error as any)?.response?.status
      });
    } finally {
      setLoading(false);
    }
  };

  const renderOverview = () => (
    <div className="space-y-4">
      <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Dashboard Overview</h1>
      
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white p-4 lg:p-6 rounded-lg shadow animate-pulse">
              <div className="h-3 lg:h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-6 lg:h-8 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <div className="bg-white p-4 lg:p-6 rounded-lg shadow border-l-4 border-blue-500">
            <h3 className="text-sm lg:text-lg font-semibold text-gray-700">Total Users</h3>
            <p className="text-2xl lg:text-3xl font-bold text-blue-600">{stats?.totalUsers || 0}</p>
          </div>
          
          <div className="bg-white p-4 lg:p-6 rounded-lg shadow border-l-4 border-green-500">
            <h3 className="text-sm lg:text-lg font-semibold text-gray-700">Total Products</h3>
            <p className="text-2xl lg:text-3xl font-bold text-green-600">{stats?.totalProducts || 0}</p>
          </div>
          
          <div className="bg-white p-4 lg:p-6 rounded-lg shadow border-l-4 border-yellow-500">
            <h3 className="text-sm lg:text-lg font-semibold text-gray-700">Active Products</h3>
            <p className="text-2xl lg:text-3xl font-bold text-yellow-600">{stats?.activeProducts || 0}</p>
          </div>
          
          <div className="bg-white p-4 lg:p-6 rounded-lg shadow border-l-4 border-purple-500">
            <h3 className="text-sm lg:text-lg font-semibold text-gray-700">Total Bids</h3>
            <p className="text-2xl lg:text-3xl font-bold text-purple-600">{stats?.totalBids || 0}</p>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <div className="bg-white rounded-lg shadow p-4 lg:p-6">
          <h2 className="text-lg lg:text-xl font-semibold mb-4 text-gray-800">Recent Users</h2>
          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex justify-between items-center animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {stats?.recentUsers?.map((user) => (
                <div key={user._id} className="flex justify-between items-center">
                  <div>
                    <span className="text-gray-800 font-medium">{user.name}</span>
                    <span className="text-gray-500 text-sm ml-2">({user.role})</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="bg-white rounded-lg shadow p-4 lg:p-6">
          <h2 className="text-lg lg:text-xl font-semibold mb-4 text-gray-800">Top Products</h2>
          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex justify-between items-center animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {stats?.topProducts?.map((product) => (
                <div key={product._id} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <img 
                      src={`http://localhost:3001${product.imageUrl}`} 
                      alt={product.name}
                      className="w-10 h-10 rounded object-cover mr-3"
                    />
                    <span className="text-gray-800">{product.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-green-600">
                      ${product.currentPrice}
                    </div>
                    <div className="text-xs text-gray-500">
                      {(product as typeof product & { bidCount?: number }).bidCount || 0} bids
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'users':
        return <UsersTable />;
      case 'products':
        return <ProductsTable />;
      case 'bids':
        return <BidsTable />;
      case 'create-product':
        return <CreateProductForm onSuccess={() => setActiveTab('products')} />;
      default:
        return renderOverview();
    }
  };

  // Show loading if no access token
  if (!accessToken) {
    return (
      <>
        <Header/>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading authentication...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header/>
      <div className="min-h-screen bg-gray-50 flex">
        <DashboardSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <div className="flex-1 p-4 lg:p-8 pt-16 lg:pt-8">
          {renderContent()}
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;