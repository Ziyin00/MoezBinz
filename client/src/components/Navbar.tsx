// FIX: Replaced invalid file content with a functional Header component and adjusted import paths.
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout } from '../store/authSlice';
import Logo from './Logo';
import { MenuIcon, XIcon, ChevronDownIcon } from './Icons';

const NavLink = ({ to, children, isActive = false, onClick, isSectionActive = false }: { to: string; children: React.ReactNode; isActive?: boolean; onClick?: () => void; isSectionActive?: boolean }) => {
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };

  const isLinkActive = isActive || isSectionActive;

  return (
    <Link to={to} onClick={handleClick} className={`group text-sm font-bold uppercase tracking-wider relative pb-1 transition-all duration-300 ${
      isLinkActive 
        ? 'text-red-600 bg-red-50 px-3 py-1 rounded-md' 
        : 'text-gray-900 hover:text-red-600 hover:bg-red-50  hover:py-1 hover:rounded-md'
    }`}>
      {children}
      <span 
        className={`absolute bottom-0 left-0 w-full h-0.5 bg-red-600 transition-transform duration-300 ease-out transform origin-left ${
          isLinkActive ? 'scale-x-100' : 'scale-x-0'
        } group-hover:scale-x-100`}
      ></span>
    </Link>
  );
};

const DropdownMenu = ({ title, items, isActive = false }: { title: string; items: Array<{ name: string; to: string; onClick?: () => void }>; isActive?: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [closeTimeout, setCloseTimeout] = useState<number | null>(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (closeTimeout) {
        clearTimeout(closeTimeout);
      }
    };
  }, [closeTimeout]);

  const handleMouseEnter = () => {
    // Clear any pending close timeout
    if (closeTimeout) {
      clearTimeout(closeTimeout);
      setCloseTimeout(null);
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    // Set a delay before closing the dropdown
    const timeout = setTimeout(() => {
      setIsOpen(false);
    }, 300); // 300ms delay
    setCloseTimeout(timeout);
  };

  const handleItemClick = () => {
    // Close immediately when an item is clicked
    setIsOpen(false);
    if (closeTimeout) {
      clearTimeout(closeTimeout);
      setCloseTimeout(null);
    }
  };

  return (
    <div className="relative group">
      <button
        className={`flex items-center gap-1 text-sm font-bold uppercase tracking-wider relative pb-1 transition-all duration-300 ${
          isActive 
            ? 'text-red-600 bg-red-50 px-3 py-1 rounded-md' 
            : 'text-gray-900 hover:text-red-600 hover:bg-red-50 hover:py-1 hover:rounded-md'
        }`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {title}
        <ChevronDownIcon className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        <span 
          className={`absolute bottom-0 left-0 w-full h-0.5 bg-red-600 transition-transform duration-300 ease-out transform origin-left ${
            isActive ? 'scale-x-100' : 'scale-x-0'
          } group-hover:scale-x-100`}
        ></span>
      </button>
      
      {isOpen && (
        <div 
          className="absolute top-full mt-1 w-44 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50 animate-fade-in-up
                     md:right-0 md:left-auto md:w-40
                     lg:left-0 lg:right-auto lg:w-44
                     xl:w-48
                     min-w-[160px]"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Small arrow pointing up */}
          <div className="absolute -top-1 w-2 h-2 bg-white border-l border-t border-gray-200 transform rotate-45
                          left-4 md:left-auto md:right-4 lg:left-4 lg:right-auto"></div>
          {items.map((item, index) => (
            <Link
              key={index}
              to={item.to}
              onClick={() => {
                handleItemClick();
                if (item.onClick) item.onClick();
              }}
              className="block px-4 py-3 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200 hover:pl-6"
            >
              {item.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user, accessToken } = useAppSelector((state) => state.auth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const location = useLocation();
  
  const isAuthenticated = !!user && !!accessToken;
  const isAdmin = user?.role === 'admin';

  // Handle hash navigation when page loads
  useEffect(() => {
    if (location.pathname === '/' && location.hash) {
      const sectionId = location.hash.substring(1); // Remove the #
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
          // Set active section immediately and after scrolling
          setActiveSection(sectionId);
          setTimeout(() => {
            setActiveSection(sectionId);
          }, 500); // Longer delay to ensure scroll is complete
        }
      }, 100); // Small delay to ensure page is loaded
    }
  }, [location.pathname, location.hash]);

  // Improved section detection with proper About Us handling
  // useEffect(() => {
  //   const handleScroll = () => {
  //     if (location.pathname !== '/') {
  //       setActiveSection('');
  //       return;
  //     }

  //     const scrollY = window.scrollY;
      
  //     // Get the actual positions of sections
  //     const aboutSection = document.getElementById('about');
  //     const howItWorksSection = document.getElementById('how-it-works');
      
  //     let newSection = 'home'; // default
      
  //     if (aboutSection && howItWorksSection) {
  //       const aboutTop = aboutSection.offsetTop - 100; // 100px offset for better UX
  //       const howItWorksTop = howItWorksSection.offsetTop - 100;
        
  //       if (scrollY >= howItWorksTop) {
  //         newSection = 'how-it-works';
  //       } else if (scrollY >= aboutTop) {
  //         newSection = 'about';
  //       } else {
  //         newSection = 'home';
  //       }
  //     } else {
  //       // Fallback to scroll-based detection if sections not found
  //       if (scrollY < 500) {
  //         newSection = 'home';
  //       } else if (scrollY >= 500 && scrollY < 2000) {
  //         newSection = 'about';
  //       } else {
  //         newSection = 'how-it-works';
  //       }
  //     }
      
  //     setActiveSection(newSection);
  //   };

  //   // Initial check
  //   handleScroll();
    
  //   window.addEventListener('scroll', handleScroll);
  //   return () => window.removeEventListener('scroll', handleScroll);
  // }, [location.pathname]);


  // Main navigation links
  const mainNavLinks = [
    { name: 'Home', to: '/', section: 'home', onClick: undefined},
    { name: 'About Us', to: '/about', section: null, onClick: undefined },
    { name: 'How It Works', to: '/how-it-works', section: null, onClick: undefined },
  ];

  // Shop dropdown items
  const shopItems = [
    { name: 'Products', to: '/product', onClick: undefined },
    { name: 'Auction', to: '/auction', onClick: undefined },
    ...(isAuthenticated ? [{ name: 'My Bids', to: '/my-bids', onClick: undefined }] : []),
  ];

  // More dropdown items
  const moreItems = [
    { name: 'Visit Us', to: '/visit', onClick: undefined },
    { name: "What's New", to: '/whats-new', onClick: undefined },
  ];

  const handleLogout = () => {
    dispatch(logout());
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white py-4 px-4 sm:px-6 lg:px-8 border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto">
        <nav className="flex justify-between items-center">
          <Link to="/" onClick={() => {
            if (location.pathname !== '/') {
              window.location.href = '/';
            }
          }}>
            <Logo />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden xl:flex items-center gap-6 xl:gap-8">
            {/* Main Navigation Links */}
            {mainNavLinks.map((link) => (
              <NavLink 
                key={link.name} 
                to={link.to} 
                isActive={link.name === 'Home' ? location.pathname === '/' : (link.section ? false : location.pathname === link.to)} 
                isSectionActive={link.section ? activeSection === link.section : false}
                onClick={link.onClick}
              >
                {link.name}
              </NavLink>
            ))}
            
            {/* Shop Dropdown */}
            <DropdownMenu 
              title="Shop" 
              items={shopItems}
              isActive={shopItems.some(item => location.pathname === item.to)}
            />
            
            {/* More Dropdown */}
            <DropdownMenu 
              title="More" 
              items={moreItems}
              isActive={moreItems.some(item => location.pathname === item.to)}
            />
          </div>

          {/* Medium Screen Navigation (1024px - 1279px) */}
          <div className="hidden lg:flex xl:hidden items-center gap-2">
            {mainNavLinks.slice(0, 2).map((link) => (
              <NavLink 
                key={link.name} 
                to={link.to} 
                isActive={link.name === 'Home' ? location.pathname === '/' : (link.section ? false : location.pathname === link.to)} 
                isSectionActive={link.section ? activeSection === link.section : false}
                onClick={link.onClick}
              >
                {link.name}
              </NavLink>
            ))}
            <DropdownMenu 
              title="Shop" 
              items={shopItems}
              isActive={shopItems.some(item => location.pathname === item.to)}
            />
            <DropdownMenu 
              title="More" 
              items={moreItems}
              isActive={moreItems.some(item => location.pathname === item.to)}
            />
          </div>

          {/* Small Desktop Navigation (768px - 1023px) */}
          <div className="hidden md:flex lg:hidden items-center gap-2">
            {mainNavLinks.slice(0, 1).map((link) => (
              <NavLink 
                key={link.name} 
                to={link.to} 
                isActive={link.name === 'Home' ? location.pathname === '/' : (link.section ? false : location.pathname === link.to)} 
                isSectionActive={link.section ? activeSection === link.section : false}
                onClick={link.onClick}
              >
                {link.name}
              </NavLink>
            ))}
            <DropdownMenu 
              title="Shop" 
              items={shopItems}
              isActive={shopItems.some(item => location.pathname === item.to)}
            />
            <DropdownMenu 
              title="More" 
              items={moreItems}
              isActive={moreItems.some(item => location.pathname === item.to)}
            />
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center gap-2 lg:gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-2 lg:gap-4">
                <span className="text-xs lg:text-sm text-gray-700 hidden lg:block">
                  Welcome, {user?.name}!
                </span>
                {isAdmin && (
                  <Link
                    to="/admin/dashboard"
                    className="bg-red-600 text-white font-bold py-2 px-3 lg:py-2.5 lg:px-6 rounded-lg shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform hover:-translate-y-0.5 text-xs lg:text-sm"
                  >
                    Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="bg-gray-600 text-white font-bold py-2 px-3 lg:py-2.5 lg:px-6 rounded-lg shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all transform hover:-translate-y-0.5 text-xs lg:text-sm"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-red-600 text-white font-bold py-2 px-4 lg:py-2.5 lg:px-8 rounded-lg shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all transform hover:-translate-y-0.5 text-xs lg:text-sm"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-900 p-2" aria-label="Toggle menu">
              {isMenuOpen ? <XIcon /> : <MenuIcon />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden mt-4 border-t border-gray-200">
          <div className="flex flex-col items-center gap-6 py-6 animate-fade-in-up">
            {/* Main Navigation Links */}
            {mainNavLinks.map((link) => (
              <NavLink 
                key={link.name} 
                to={link.to} 
                isActive={link.name === 'Home' ? location.pathname === '/' : (link.section ? false : location.pathname === link.to)} 
                isSectionActive={link.section ? activeSection === link.section : false}
                onClick={link.onClick}
              >
                {link.name}
              </NavLink>
            ))}
            
            {/* Shop Section */}
            <div className="w-full max-w-xs text-center">
              <div className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-3 px-4">Shop</div>
              {shopItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.to}
                  onClick={item.onClick}
                  className={`group text-sm font-bold uppercase tracking-wider relative pb-1 transition-all duration-300 block px-4 py-2 ${
                    location.pathname === item.to
                      ? 'text-red-600 bg-red-50 rounded-md' 
                      : 'text-gray-900 hover:text-red-600 hover:bg-red-50 hover:rounded-md'
                  }`}
                >
                  {item.name}
                  <span 
                    className={`absolute bottom-0 left-4 right-4 h-0.5 bg-red-600 transition-transform duration-300 ease-out transform origin-left ${
                      location.pathname === item.to ? 'scale-x-100' : 'scale-x-0'
                    } group-hover:scale-x-100`}
                  ></span>
                </Link>
              ))}
            </div>
            
            {/* More Section */}
            <div className="w-full max-w-xs text-center">
              <div className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-3 px-4">More</div>
              {moreItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.to}
                  onClick={item.onClick}
                  className={`group text-sm font-bold uppercase tracking-wider relative pb-1 transition-all duration-300 block px-4 py-2 ${
                    location.pathname === item.to
                      ? 'text-red-600 bg-red-50 rounded-md' 
                      : 'text-gray-900 hover:text-red-600 hover:bg-red-50 hover:rounded-md'
                  }`}
                >
                  {item.name}
                  <span 
                    className={`absolute bottom-0 left-4 right-4 h-0.5 bg-red-600 transition-transform duration-300 ease-out transform origin-left ${
                      location.pathname === item.to ? 'scale-x-100' : 'scale-x-0'
                    } group-hover:scale-x-100`}
                  ></span>
                </Link>
              ))}
            </div>
            
            {/* Auth Section */}
            {isAuthenticated ? (
              <div className="w-full max-w-xs text-center space-y-3">
                <div className="text-sm text-gray-700 mb-4">
                  Welcome, {user?.name}!
                </div>
                {isAdmin && (
                  <Link
                    to="/admin/dashboard"
                    className="w-full bg-red-600 text-white font-bold py-2.5 px-8 rounded-lg shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform hover:-translate-y-0.5 block"
                  >
                    Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full bg-gray-600 text-white font-bold py-2.5 px-8 rounded-lg shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all transform hover:-translate-y-0.5"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="w-full max-w-xs text-center bg-red-600 text-white font-bold py-2.5 px-8 rounded-lg shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all transform hover:-translate-y-0.5"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
