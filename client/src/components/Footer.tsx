// FIX: Implemented a complete Footer component.
import React from 'react';
import Logo from './Logo';
import { FacebookIcon, InstagramIcon, TwitterIcon } from './Icons';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and mission */}
          <div className="md:col-span-1">
            <a href="#/" className="mb-4 inline-block">
              <Logo />
            </a>
            <p className="text-gray-600 text-sm">
              The ultimate treasure hunt for premium brand goods at throwaway prices.
            </p>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:col-span-3">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Quick Links</h3>
              <ul className="mt-4 space-y-2">
                <li><a href="#/" className="text-sm text-gray-600 hover:text-red-600">Home</a></li>
                <li><a href="#/about" className="text-sm text-gray-600 hover:text-red-600">About Us</a></li>
                <li><a href="#/how-it-works" className="text-sm text-gray-600 hover:text-red-600">How It Works</a></li>
                <li><a href="#/products" className="text-sm text-gray-600 hover:text-red-600">Products</a></li>
                <li><a href="#/visit" className="text-sm text-gray-600 hover:text-red-600">Visit Us</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Account</h3>
              <ul className="mt-4 space-y-2">
                <li><a href="#/login" className="text-sm text-gray-600 hover:text-red-600">Log In</a></li>
                <li><a href="#/signup" className="text-sm text-gray-600 hover:text-red-600">Sign Up</a></li>
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
            <a href="#" className="text-gray-400 hover:text-red-600">
              <span className="sr-only">Facebook</span>
              <FacebookIcon />
            </a>
            <a href="#" className="text-gray-400 hover:text-red-600">
              <span className="sr-only">Instagram</span>
              <InstagramIcon />
            </a>
            <a href="#" className="text-gray-400 hover:text-red-600">
              <span className="sr-only">Twitter</span>
              <TwitterIcon />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
