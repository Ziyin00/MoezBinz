// FIX: Replaced invalid file content with a functional Header component and adjusted import paths.
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout } from '../store/authSlice';
import Logo from './Logo';
import { MenuIcon, XIcon } from './Icons';

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

const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user, accessToken } = useAppSelector((state) => state.auth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const location = useLocation();
  
  const isAuthenticated = !!user && !!accessToken;
  const isAdmin = user?.role === 'admin';

  // Ultra-simple section detection that WILL work
  useEffect(() => {
    const handleScroll = () => {
      if (location.pathname !== '/') {
        setActiveSection('');
        return;
      }

      const scrollY = window.scrollY;
      
      // Simple hardcoded logic - this WILL work
      let newSection = '';
      if (scrollY < 500) {
        newSection = 'home';
      } else if (scrollY >= 500 && scrollY < 1500) {
        newSection = 'about';
      } else {
        newSection = 'how-it-works';
      }
      
      setActiveSection(newSection);
    };

    // Initial check
    handleScroll();
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  const scrollToSection = (sectionId: string) => {
    // Immediately set the active section when clicking
    setActiveSection(sectionId);
    
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
    setIsMenuOpen(false);
  };

  const navLinks = [
    { name: 'Home', to: '/', section: 'home', onClick: () => scrollToSection('home') },
    { name: 'About Us', to: '#about', section: 'about', onClick: () => scrollToSection('about') },
    { name: 'How It Works', to: '#how-it-works', section: 'how-it-works', onClick: () => scrollToSection('how-it-works') },
    { name: 'Products', to: '/product', section: null, onClick: undefined },
    { name: 'Visit Us', to: '/visit', section: null, onClick: undefined },
  ];

  const handleLogout = () => {
    dispatch(logout());
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white py-4 px-4 sm:px-6 lg:px-8 border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto">
        <nav className="flex justify-between items-center">
          <Link to="/">
            <Logo />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink 
                key={link.name} 
                to={link.to} 
                isActive={link.section ? false : location.pathname === link.to} 
                isSectionActive={link.section ? activeSection === link.section : false}
                onClick={link.onClick}
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-700">
                  Welcome, {user?.name}!
                </span>
                {isAdmin && (
                  <Link
                    to="/admin/dashboard"
                    className="bg-red-600 text-white font-bold py-2.5 px-6 rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform hover:-translate-y-0.5"
                  >
                    Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="bg-gray-600 text-white font-bold py-2.5 px-6 rounded-lg shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all transform hover:-translate-y-0.5"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-red-600 text-white font-bold py-2.5 px-8 rounded-lg shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all transform hover:-translate-y-0.5"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-900 p-2" aria-label="Toggle menu">
              {isMenuOpen ? <XIcon /> : <MenuIcon />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 border-t border-gray-200">
          <div className="flex flex-col items-center gap-6 py-6 animate-fade-in-up">
            {navLinks.map((link) => (
              <NavLink 
                key={link.name} 
                to={link.to} 
                isActive={link.section ? false : location.pathname === link.to} 
                isSectionActive={link.section ? activeSection === link.section : false}
                onClick={link.onClick}
              >
                {link.name}
              </NavLink>
            ))}
            {isAuthenticated ? (
              <div className="w-full max-w-xs text-center space-y-3">
                <div className="text-sm text-gray-700 mb-4">
                  Welcome, {user?.name}!
                </div>
                {isAdmin && (
                  <Link
                    to="/admin/dashboard"
                    className="w-full bg-blue-600 text-white font-bold py-2.5 px-8 rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform hover:-translate-y-0.5 block"
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
