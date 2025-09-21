import React, { useState } from 'react';
import { CubeIcon, UsersIcon, ChartBarIcon, Bars3Icon, XMarkIcon, NewspaperIcon, GavelIcon } from './Icons';

type ActiveTab = 'overview' | 'users' | 'products' | 'bids' | 'news' | 'auctions';

interface DashboardSidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

const SidebarLink: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors duration-200 ${
        isActive
          ? 'bg-red-50 text-red-600'
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
};

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ activeTab, setActiveTab }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleTabClick = (tab: ActiveTab) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false); // Close mobile menu when tab is selected
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-20 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="bg-white p-2 rounded-md shadow-md border border-gray-200"
        >
          {isMobileMenuOpen ? (
            <XMarkIcon className="w-6 h-6 text-gray-600" />
          ) : (
            <Bars3Icon className="w-6 h-6 text-gray-600" />
          )}
        </button>
      </div>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-gray-100 bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 md:z-0 z-50 w-64 bg-white  h-[100vh] transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Admin Panel</h2>
          <nav className="space-y-2">
            <SidebarLink
              icon={<ChartBarIcon />}
              label="Overview"
              isActive={activeTab === 'overview'}
              onClick={() => handleTabClick('overview')}
            />
            <SidebarLink
              icon={<UsersIcon />}
              label="Manage Users"
              isActive={activeTab === 'users'}
              onClick={() => handleTabClick('users')}
            />
            <SidebarLink
              icon={<CubeIcon />}
              label="Manage Products"
              isActive={activeTab === 'products'}
              onClick={() => handleTabClick('products')}
            />
            {/* <SidebarLink
              icon={<EyeIcon />}
              label="View Bids"
              isActive={activeTab === 'bids'}
              onClick={() => handleTabClick('bids')}
            /> */}
            <SidebarLink
              icon={<NewspaperIcon />}
              label="Manage News"
              isActive={activeTab === 'news'}
              onClick={() => handleTabClick('news')}
            />
            <SidebarLink
              icon={<GavelIcon />}
              label="Manage Auctions"
              isActive={activeTab === 'auctions'}
              onClick={() => handleTabClick('auctions')}
            />
          </nav>
        </div>
      </aside>
    </>
  );
};

export default DashboardSidebar;
