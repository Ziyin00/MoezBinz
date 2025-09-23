import React from 'react';
import { TikTokIcon, FacebookIcon, InstagramIcon } from './Icons';

const socialLinks = [
  { Icon: TikTokIcon, label: 'TikTok', href: 'https://www.tiktok.com/@Moezbinzstore' },
  { Icon: FacebookIcon, label: 'Facebook', href: 'https://www.facebook.com/Moezbinzstore' },
  { Icon: InstagramIcon, label: 'Instagram', href: 'https://www.instagram.com/Moezbinzstore' },
];

const SubmitFind: React.FC = () => {
  return (
    <section className="bg-gray-50 py-4 sm:py-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 flex flex-col sm:flex-row justify-between items-center gap-6 text-center sm:text-left">
          <div className="flex-grow">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-red-600 text-white rounded-full p-2 shadow-lg">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                Submit Your Find!
              </h2>
            </div>
            <p className="mt-2 text-gray-600">
              Share your Moez Binz treasure with us on social — tag #MoezBinzFinds to be featured!
            </p>
          </div>
          <div className="flex items-center space-x-3 flex-shrink-0">
            {socialLinks.map(({ Icon, label, href }) => (
              <a
                key={label}
                href={href}
                className="bg-gray-900 text-white rounded-full p-3 hover:bg-red-600 transition-all duration-300 transform hover:scale-110"
                aria-label={`Share on ${label}`}
              >
                <Icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SubmitFind;
