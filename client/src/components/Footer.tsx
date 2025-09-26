// FIX: Implemented a complete Footer component.
import React from 'react';
import { Link } from 'react-router-dom';
import { FacebookIcon, InstagramIcon, TikTokIcon } from './Icons';

const Footer: React.FC = () => {
  return (
    <footer className="bg-red-700 border-t border-red-700">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and mission */}
          <div className="lg:col-span-1">
            <Link to="/" className="mb-4 inline-block">
               <div className="flex items-center">
      <img src="/MB-Logo.png" alt="Moez Binz Logo" className="h-10 md:h-12 w-auto mr-3" />
    
    </div>
            </Link>
            <p className="text-white/90 text-sm leading-relaxed mb-4">
              The ultimate treasure hunt for premium brand goods at throwaway prices. Discover amazing deals on Amazon returns and overstock items.
            </p>
            <div className="space-y-2">
              <div className="flex items-center text-white/80 text-sm">
                <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
                Daily changing prices
              </div>
              <div className="flex items-center text-white/80 text-sm">
                <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
                Premium brand items
              </div>
              <div className="flex items-center text-white/80 text-sm">
                <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
                Live auctions
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-sm text-white/80 hover:text-white transition-colors flex items-center">
                <span className="w-1 h-1 bg-yellow-400 rounded-full mr-2"></span>Home
              </Link></li>
              <li><Link to="/about" className="text-sm text-white/80 hover:text-white transition-colors flex items-center">
                <span className="w-1 h-1 bg-yellow-400 rounded-full mr-2"></span>About Us
              </Link></li>
              <li><Link to="/how-it-works" className="text-sm text-white/80 hover:text-white transition-colors flex items-center">
                <span className="w-1 h-1 bg-yellow-400 rounded-full mr-2"></span>How It Works
              </Link></li>
              <li><Link to="/product" className="text-sm text-white/80 hover:text-white transition-colors flex items-center">
                <span className="w-1 h-1 bg-yellow-400 rounded-full mr-2"></span>Products
              </Link></li>
              <li><Link to="/auction" className="text-sm text-white/80 hover:text-white transition-colors flex items-center">
                <span className="w-1 h-1 bg-yellow-400 rounded-full mr-2"></span>Live Auctions
              </Link></li>
              <li><Link to="/visit" className="text-sm text-white/80 hover:text-white transition-colors flex items-center">
                <span className="w-1 h-1 bg-yellow-400 rounded-full mr-2"></span>Visit Us
              </Link></li>
              <li><Link to="/whats-new" className="text-sm text-white/80 hover:text-white transition-colors flex items-center">
                <span className="w-1 h-1 bg-yellow-400 rounded-full mr-2"></span>What's New
              </Link></li>
            </ul>
          </div>

          {/* Customer Support */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Customer Support</h3>
            <ul className="space-y-2">
              <li><Link to="/login" className="text-sm text-white/80 hover:text-white transition-colors flex items-center">
                <span className="w-1 h-1 bg-yellow-400 rounded-full mr-2"></span>My Account
              </Link></li>
              <li><Link to="/signup" className="text-sm text-white/80 hover:text-white transition-colors flex items-center">
                <span className="w-1 h-1 bg-yellow-400 rounded-full mr-2"></span>Sign Up
              </Link></li>
              <li><a href="#/faq" className="text-sm text-white/80 hover:text-white transition-colors flex items-center">
                <span className="w-1 h-1 bg-yellow-400 rounded-full mr-2"></span>FAQ
              </a></li>
              <li><a href="mailto:support@moezbinz.com" className="text-sm text-white/80 hover:text-white transition-colors flex items-center">
                <span className="w-1 h-1 bg-yellow-400 rounded-full mr-2"></span>Contact Support
              </a></li>
              <li><a href="tel:+1234567890" className="text-sm text-white/80 hover:text-white transition-colors flex items-center">
                <span className="w-1 h-1 bg-yellow-400 rounded-full mr-2"></span>Call Us
              </a></li>
            </ul>
          </div>

          {/* Store Info & Legal */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Store Info</h3>
            <div className="space-y-3 mb-4">
              <div className="text-sm text-white/80">
                <p className="font-medium text-white mb-1">Store Hours</p>
                <p>Mon-Fri: 9AM-8PM</p>
                <p>Sat-Sun: 10AM-6PM</p>
              </div>
              <div className="text-sm text-white/80">
                <p className="font-medium text-white mb-1">Location</p>
                <p>Visit our physical store for the best deals!</p>
              </div>
            </div>
            <div className="border-t border-red-600 pt-3">
              <h4 className="text-xs font-semibold text-white/70 uppercase mb-2">Legal</h4>
              <ul className="space-y-1">
                <li><a href="#/privacy" className="text-xs text-white/60 hover:text-white/80 transition-colors">Privacy Policy</a></li>
                <li><a href="#/terms" className="text-xs text-white/60 hover:text-white/80 transition-colors">Terms of Service</a></li>
                <li><a href="#/returns" className="text-xs text-white/60 hover:text-white/80 transition-colors">Return Policy</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
       

        <div className="mt-6 border-t border-red-800 pt-6 flex flex-col sm:flex-row items-center justify-between">
          <div className="text-center sm:text-left order-2 sm:order-1 mt-4 sm:mt-0">
            <p className="text-sm text-white/70 mb-2">
              &copy; {new Date().getFullYear()} Moez Binz. All rights reserved.
            </p>
            <p className="text-xs text-white/60">
              Your trusted source for premium deals and treasure hunting experiences.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 order-1 sm:order-2">
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/Moezbinzstore" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white transition-colors">
                <span className="sr-only">Facebook</span>
                <FacebookIcon />
              </a>
              <a href="https://www.instagram.com/Moezbinzstore" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white transition-colors">
                <span className="sr-only">Instagram</span>
                <InstagramIcon />
              </a>
              <a href="https://www.tiktok.com/@Moezbinzstore" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white transition-colors">
                <span className="sr-only">TikTok</span>
                <TikTokIcon />
              </a>
            </div>
            <div className="text-xs text-white/60 text-center sm:text-right">
              <p>Follow us for daily deals & updates</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
