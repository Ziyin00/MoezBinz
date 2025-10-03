import React, { useState } from 'react';
import Header from '../components/Navbar';
import { ChevronDownIcon, ShieldCheckIcon, ExclamationTriangleIcon, InformationCircleIcon, MagnifyingGlassIcon, CheckCircleIcon, ClockIcon, XCircleIcon } from '../components/Icons';

const FaqItem: React.FC<{ question: string, children: React.ReactNode, icon: React.ReactNode }> = ({ question, children, icon }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 last:border-b-0 py-1">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left text-lg font-semibold text-gray-800 hover:text-red-600 transition-all duration-300 ease-in-out p-4 rounded-lg hover:bg-gray-50 group"
      >
        <div className="flex items-center">
          <div className="w-6 h-6 mr-3 text-red-600">
            {icon}
          </div>
          <span className="transition-colors duration-300 group-hover:text-red-600">{question}</span>
        </div>
        <ChevronDownIcon className={`transform transition-all duration-500 ease-in-out w-5 h-5 ${isOpen ? 'rotate-180 text-red-600 scale-110' : 'text-gray-400 group-hover:text-red-500'}`} />
      </button>
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-96 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}
      >
        <div className="text-gray-600 pr-8 pl-4 pb-4 leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
};

const HowItWorks: React.FC = () => {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
       

        {/* Hero Image Section with Mobile/Desktop Versions */}
        <section className="relative w-full h-[50vh] sm:h-[55vh] md:h-[50vh] lg:h-[55vh] xl:h-[60vh] overflow-hidden">
          {/* Desktop Image */}
          <img 
            src="/How it Works Banner.jpg"
            alt="Moez Binz How It Works - Daily Decreasing Prices"
            className="hidden sm:block w-full h-full object-cover object-center"
            loading="eager"
            decoding="async"
            sizes="100vw"
          />
          
          {/* Mobile Image */}
          <img 
            src="/How it Works Visual-Mobile.jpg"
            alt="Moez Binz How It Works - Daily Decreasing Prices"
            className="block sm:hidden w-full h-full object-cover object-center"
            loading="eager"
            decoding="async"
            sizes="100vw"
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/30 z-10"></div>
          
          {/* Hero Content */}
          
        </section>

        {/* Additional Hero Text Section */}
        <section className="py-8 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className=" z-20 flex items-center justify-center">
            <div className="text-center text-red-600 px-4 max-w-4xl">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                How It Works
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-black/90 max-w-3xl mx-auto mb-8">
                Discover our unique daily-decreasing price model and start your treasure hunt today
              </p>
            </div>
          </div>
            
          </div>
        </section>

        {/* Main Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-6xl mx-auto">
             {/* Dig, Discover, Save! */}
             <section className="mb-16">
               <div className="flex items-center justify-center mb-8">
                 <InformationCircleIcon className="w-8 h-8 text-red-600 mr-3" />
                 <h2 className="text-3xl font-bold text-red-600">Dig, Discover, Save!</h2>
               </div>
              <div className="bg-white rounded-lg shadow-lg p-8">
                <p className="text-lg text-center text-gray-700 leading-relaxed">
                  Our store runs on a daily-decreasing price model. We stock fresh bins every Saturday: $19.99 per item on stock day, down to a jaw-dropping $1.99 on Friday. No matter the size or the original value, every item is up for grabs. It's cash-and-carry, no returns, no fuss - just real, accessible deals.
                </p>
              </div>
            </section>

             {/* The Daily Pricing Model */}
             <section className="mb-16">
               <div className="flex items-center justify-center mb-8">
                 <ExclamationTriangleIcon className="w-8 h-8 text-red-600 mr-3" />
                 <h2 className="text-3xl font-bold text-red-600">The Daily Pricing Model</h2>
               </div>
              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="shadow-md  rounded-lg p-4 text-center">
                    <h3 className="text-lg font-bold text-red-600 mb-2">Smashing Saturday</h3>
                    <p className="text-2xl font-bold text-gray-900">$19.99</p>
                    <p className="text-sm text-gray-600">per item</p>
                  </div>
                  <div className="shadow-md  rounded-lg p-4 text-center">
                    <h3 className="text-lg font-bold text-red-600 mb-2">Smart Sunday</h3>
                    <p className="text-2xl font-bold text-gray-900">$15.00</p>
                    <p className="text-sm text-gray-600">per item</p>
                  </div>
                  <div className="shadow-md  rounded-lg p-4 text-center">
                    <h3 className="text-lg font-bold text-red-600 mb-2">Mega Monday</h3>
                    <p className="text-2xl font-bold text-gray-900">$11.99</p>
                    <p className="text-sm text-gray-600">per item</p>
                  </div>
                  <div className="shadow-md  rounded-lg p-4 text-center">
                    <h3 className="text-lg font-bold text-red-600 mb-2">Thrifty Tuesday</h3>
                    <p className="text-2xl font-bold text-gray-900">$8.99</p>
                    <p className="text-sm text-gray-600">per item</p>
                  </div>
                  <div className="shadow-md  rounded-lg p-4 text-center">
                    <h3 className="text-lg font-bold text-red-600 mb-2">Wow Wednesday</h3>
                    <p className="text-2xl font-bold text-gray-900">$6.99</p>
                    <p className="text-sm text-gray-600">per item</p>
                  </div>
                  <div className="shadow-md  rounded-lg p-4 text-center">
                    <h3 className="text-lg font-bold text-red-600 mb-2">Treasure Thursday</h3>
                    <p className="text-2xl font-bold text-gray-900">$4.99</p>
                    <p className="text-sm text-gray-600">per item</p>
                  </div>
                  <div className="shadow-md  rounded-lg p-4 text-center">
                    <h3 className="text-lg font-bold text-red-600 mb-2">Freak-out Friday</h3>
                    <p className="text-2xl font-bold text-gray-900">$1.99</p>
                    <p className="text-sm text-gray-600">per item</p>
                  </div>
                </div>
              </div>
            </section>

             {/* Store Rules & Shopping Guidelines */}
             <section className="mb-16">
               <div className="flex items-center justify-center mb-8">
                 <ShieldCheckIcon className="w-8 h-8 text-red-600 mr-3" />
                 <h2 className="text-3xl font-bold text-red-600">Store Rules & Shopping Guidelines</h2>
               </div>
               <div className="bg-white rounded-lg shadow-lg p-8">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div>
                     <div className="flex items-center mb-4">
                       <ExclamationTriangleIcon className="w-6 h-6 text-red-600 mr-2" />
                       <h3 className="text-xl font-semibold text-red-600">General Rules</h3>
                     </div>
                     <ul className="text-gray-700 space-y-3">
                       <li className="flex items-start">
                         <span className="text-red-600 font-bold text-lg mr-3">•</span>
                         <span>No returns, exchanges, or refunds</span>
                       </li>
                       <li className="flex items-start">
                         <span className="text-red-600 font-bold text-lg mr-3">•</span>
                         <span>Items must be purchased and taken same day</span>
                       </li>
                       <li className="flex items-start">
                         <span className="text-red-600 font-bold text-lg mr-3">•</span>
                         <span>Fixed daily prices, no negotiation</span>
                       </li>
                     </ul>
                   </div>
                   <div>
                     <div className="flex items-center mb-4">
                       <ShieldCheckIcon className="w-6 h-6 text-red-600 mr-2" />
                       <h3 className="text-xl font-semibold text-red-600">Safety & Conduct</h3>
                     </div>
                     <ul className="text-gray-700 space-y-3">
                       <li className="flex items-start">
                         <span className="text-red-600 font-bold text-lg mr-3">•</span>
                         <span>No running or rough play</span>
                       </li>
                       <li className="flex items-start">
                         <span className="text-red-600 font-bold text-lg mr-3">•</span>
                         <span>Adult supervision for all children under 16</span>
                       </li>
                       <li className="flex items-start">
                         <span className="text-red-600 font-bold text-lg mr-3">•</span>
                         <span>Treat staff and fellow shoppers with respect</span>
                       </li>
                       <li className="flex items-start">
                         <span className="text-red-600 font-bold text-lg mr-3">•</span>
                         <span>Aggressive or disruptive behavior leads to removal</span>
                       </li>
                     </ul>
                   </div>
                 </div>
               </div>
             </section>

            {/* FAQ Section */}
            <section className="mb-24">
              <div className="flex items-center justify-center mb-16">
                <InformationCircleIcon className="w-10 h-10 text-red-600 mr-4" />
                <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-red-600 leading-tight">Frequently Asked Questions</h2>
              </div>
              <div className="max-w-5xl mx-auto">
                <FaqItem question="What kinds of products do you sell?" icon={<MagnifyingGlassIcon className="w-6 h-6" />}>
                  <p>Almost everything Amazon offers—electronics, home, toys, fashion, crafts, and more. Our inventory changes weekly, so you never know what treasures you'll discover!</p>
                </FaqItem>
                <FaqItem question="Are products new or used?" icon={<CheckCircleIcon className="w-6 h-6" />}>
                  <p>Most are new or like-new; some may have open packaging. Sold as-is, so inspect before buying. This model allows us to keep prices incredibly low for everyone.</p>
                </FaqItem>
                <FaqItem question="How does the daily pricing work?" icon={<ClockIcon className="w-6 h-6" />}>
                  <p>Every item is the same price that day—no size or value differences. Prices start at $19.99 on Saturday and drop to $1.99 by Friday. It's a flat rate per item, regardless of original value.</p>
                </FaqItem>
                <FaqItem question="Can prices be negotiated or items held?" icon={<XCircleIcon className="w-6 h-6" />}>
                  <p>No, all prices are fixed and everything is first-come, first-served. We can't hold items or negotiate prices—it's all part of the treasure hunt experience!</p>
                </FaqItem>
                <FaqItem question="What is your return/exchange policy?" icon={<XCircleIcon className="w-6 h-6" />}>
                  <p>All sales are final—no returns, exchanges, or warranties. This allows us to offer such incredible prices. Make sure to inspect items before purchasing.</p>
                </FaqItem>
                <FaqItem question="What payment methods are accepted?" icon={<CheckCircleIcon className="w-6 h-6" />}>
                  <p>We accept cash, debit cards, and all major credit cards. No checks or payment plans—it's cash-and-carry for the best deals.</p>
                </FaqItem>
                <FaqItem question="Do you accept credit cards?" icon={<CheckCircleIcon className="w-6 h-6" />}>
                  <p>Yes, we accept all major credit cards, debit cards, and cash. No checks or payment plans—it's cash-and-carry for the best deals.</p>
                </FaqItem>
                <FaqItem question="Can I test electronics before buying?" icon={<XCircleIcon className="w-6 h-6" />}>
                  <p>Unfortunately, due to the nature of our business, we cannot offer a testing station. All items are sold as-is. This model allows us to keep prices incredibly low for everyone.</p>
                </FaqItem>
              </div>
            </section>

            {/* Section Divider */}
            <div className="border-t border-gray-200 mb-24"></div>

            {/* Call to Action */}
            <section className="text-center">
              <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-lg shadow-lg p-8 text-white">
                <h2 className="text-3xl font-bold mb-4">Ready to Start Shopping?</h2>
                <p className="text-xl text-red-100 mb-6">
                  Join thousands of happy customers who have discovered amazing deals at Moez Binz.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="/product"
                    className="bg-white text-red-600 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Browse Products
                  </a>
                  <a
                    href="/signup"
                    className="border-2 border-white text-white font-semibold py-3 px-8 rounded-lg hover:bg-white hover:text-red-600 transition-colors"
                  >
                    Create Account
                  </a>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default HowItWorks;
