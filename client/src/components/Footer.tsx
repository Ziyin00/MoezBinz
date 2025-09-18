// FIX: Implemented a complete Footer component.
import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import { FacebookIcon, InstagramIcon, TikTokIcon } from './Icons';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and mission */}
          <div className="md:col-span-1">
            <Link to="/" className="mb-4 inline-block">
              <Logo />
            </Link>
            <p className="text-gray-600 text-sm">
              The ultimate treasure hunt for premium brand goods at throwaway prices.
            </p>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:col-span-3">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Quick Links</h3>
              <ul className="mt-4 space-y-2">
                <li><Link to="/" className="text-sm text-gray-600 hover:text-red-600">Home</Link></li>
                <li><Link to="/#about" className="text-sm text-gray-600 hover:text-red-600">About Us</Link></li>
                <li><Link to="/#how-it-works" className="text-sm text-gray-600 hover:text-red-600">How It Works</Link></li>
                <li><Link to="/product" className="text-sm text-gray-600 hover:text-red-600">Products</Link></li>
                <li><Link to="/visit" className="text-sm text-gray-600 hover:text-red-600">Visit Us</Link></li>
                <li><Link to="/whats-new" className="text-sm text-gray-600 hover:text-red-600">What's New</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Account</h3>
              <ul className="mt-4 space-y-2">
                <li><Link to="/login" className="text-sm text-gray-600 hover:text-red-600">Log In</Link></li>
                <li><Link to="/signup" className="text-sm text-gray-600 hover:text-red-600">Sign Up</Link></li>
                <li><a href="#/faq" className="text-sm text-gray-600 hover:text-red-600">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Legal</h3>
              <ul className="mt-4 space-y-2">
                <li><a href="#/privacy" className="text-sm text-gray-600 hover:text-red-600">Privacy Policy</a></li>
                <li><a href="#/terms" className="text-sm text-gray-600 hover:text-red-600">Terms of Service</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-200 pt-8 flex flex-col sm:flex-row items-center justify-between">
          <p className="text-sm text-gray-500 order-2 sm:order-1 mt-4 sm:mt-0">
            &copy; {new Date().getFullYear()} Moez Binz. All rights reserved.
          </p>
          <div className="flex space-x-6 order-1 sm:order-2">
            <a href="https://www.facebook.com/Moezbinzstore" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-red-600">
              <span className="sr-only">Facebook</span>
              <FacebookIcon />
            </a>
            <a href="https://www.instagram.com/Moezbinzstore" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-red-600">
              <span className="sr-only">Instagram</span>
              <InstagramIcon />
            </a>
            <a href="https://www.tiktok.com/@Moezbinzstore" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-red-600">
              <span className="sr-only">TikTok</span>
              <TikTokIcon />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
