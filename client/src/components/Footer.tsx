// FIX: Implemented a complete Footer component.
import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import { FacebookIcon, InstagramIcon, TikTokIcon } from './Icons';

const Footer: React.FC = () => {
  return (
    <footer className="bg-red-700 border-t border-red-700">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Logo and mission */}
          <div className="md:col-span-1">
            <Link to="/" className="mb-2 inline-block">
              <Logo />
            </Link>
            <p className="text-white/90 text-sm leading-snug">
              The ultimate treasure hunt for premium brand goods at throwaway prices.
            </p>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:col-span-3">
            <div>
              <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-2">Quick Links</h3>
              <ul className="space-y-1">
                <li><Link to="/" className="text-sm text-white/80 hover:text-white transition-colors">Home</Link></li>
                <li><Link to="/about" className="text-sm text-white/80 hover:text-white transition-colors">About Us</Link></li>
                <li><Link to="/how-it-works" className="text-sm text-white/80 hover:text-white transition-colors">How It Works</Link></li>
                <li><Link to="/product" className="text-sm text-white/80 hover:text-white transition-colors">Products</Link></li>
                <li><Link to="/auction" className="text-sm text-white/80 hover:text-white transition-colors">Auction</Link></li>
                <li><Link to="/visit" className="text-sm text-white/80 hover:text-white transition-colors">Visit Us</Link></li>
                <li><Link to="/whats-new" className="text-sm text-white/80 hover:text-white transition-colors">What's New</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-2">Account</h3>
              <ul className="space-y-1">
                <li><Link to="/login" className="text-sm text-white/80 hover:text-white transition-colors">Log In</Link></li>
                <li><Link to="/signup" className="text-sm text-white/80 hover:text-white transition-colors">Sign Up</Link></li>
                <li><a href="#/faq" className="text-sm text-white/80 hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-2">Legal</h3>
              <ul className="space-y-1">
                <li><a href="#/privacy" className="text-sm text-white/80 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#/terms" className="text-sm text-white/80 hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-6 border-t border-red-800 pt-4 flex flex-col sm:flex-row items-center justify-between">
          <p className="text-sm text-white/70 order-2 sm:order-1 mt-2 sm:mt-0">
            &copy; {new Date().getFullYear()} Moez Binz. All rights reserved.
          </p>
          <div className="flex space-x-3 order-1 sm:order-2">
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
        </div>
      </div>
    </footer>
  );
};

export default Footer;
