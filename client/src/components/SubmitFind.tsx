import React from 'react';
import { TikTokIcon, FacebookIcon, InstagramIcon } from './Icons';

const socialLinks = [
  { Icon: TikTokIcon, label: 'TikTok', href: 'https://www.tiktok.com/@Moezbinzstore' },
  { Icon: FacebookIcon, label: 'Facebook', href: 'https://www.facebook.com/Moezbinzstore' },
  { Icon: InstagramIcon, label: 'Instagram', href: 'https://www.instagram.com/Moezbinzstore' },
];

const SubmitFind: React.FC = () => {
  return (
    <section className="bg-white py-8 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Combined Banner with Side-by-Side Layout */}
        <div className="relative bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            
            {/* Left Section - White Background */}
            <div className="lg:w-4/8 bg-white p-8 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-red-600 text-white rounded-full p-2 shadow-lg">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                  Submit Your Find!
                </h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Share your Moez Binz treasure with us on social — tag #MoezBinzFinds to be featured!
              </p>
            </div>

            {/* Center Section - Social Icons */}
            

            {/* Right Section - Red Background */}
            <div className="lg:w-4/8 bg-red-600 p-8 flex flex-row justify-center">
              <div className=" -ml-16 lg:flex items-center justify-center py-8 lg:py-0 hidden ">
              <div className="flex flex-col lg:flex-col items-center space-y-4 lg:space-y-2">
                {socialLinks.map(({ Icon, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    className="bg-blue-600 text-white rounded-full p-4 hover:bg-blue-700 transition-all duration-300 transform hover:scale-110 shadow-lg"
                    aria-label={`Share on ${label}`}
                  >
                    <Icon className="h-6 w-6" />
                  </a>
                ))}
              </div>
              </div>
              <div className='flex flex-col ml-10'>

              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                Join the bargain hunt of your lifetime
              </h3>
              <p className="text-red-100 leading-relaxed">
                Follow @Moezbinzstore on Facebook, Instagram, and TikTok for live restock videos, customer finds, deal alerts, and more!
              </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SubmitFind;
