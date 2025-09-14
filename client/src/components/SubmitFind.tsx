import React from 'react';
import { TikTokIcon, FacebookIcon, InstagramIcon } from './Icons';

const socialLinks = [
  { Icon: TikTokIcon, label: 'TikTok', href: '#' },
  { Icon: FacebookIcon, label: 'Facebook', href: '#' },
  { Icon: InstagramIcon, label: 'Instagram', href: '#' },
];

const SubmitFind: React.FC = () => {
  return (
    <section className="bg-gray-50 py-4 sm:py-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 flex flex-col sm:flex-row justify-between items-center gap-6 text-center sm:text-left">
          <div className="flex-grow">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              Submit Your Find!
            </h2>
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
