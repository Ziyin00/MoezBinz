import React from 'react';
import Header from '../components/Navbar';

const HowItWorks: React.FC = () => {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="relative h-[50vh] bg-black">
          <img 
            src= "How it Works Banner.jpg"
            alt="Shopping process and how it works"
            className="absolute inset-0 w-full h-full object-cover opacity-70"
          />
          {/* <div className="absolute inset-0 bg-black opacity-30"></div> */}
          
          {/* <div className="relative h-full flex flex-col justify-center items-center text-center text-white px-4 z-10">
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight animate-fade-in-up">
              What is the Store Concept All About?
            </h1>
            <p className="mt-4 text-lg sm:text-xl max-w-3xl animate-fade-in-up animation-delay-200">
              Discover our unique daily-decreasing price model and start your treasure hunt today
            </p>
          </div> */}
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-6xl mx-auto">
            {/* Dig, Discover, Save! */}
            <section className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Dig, Discover, Save!</h2>
              <div className="bg-white rounded-lg shadow-lg p-8">
                <p className="text-lg text-gray-700 leading-relaxed">
                  Our store runs on a daily-decreasing price model. We stock fresh bins every Saturday: $19.99 per item on stock day, down to a jaw-dropping $1.99 on Friday. No matter the size or the original value, every item is up for grabs. It's cash-and-carry, no returns, no fuss - just real, accessible deals.
                </p>
              </div>
            </section>

            {/* The Daily Pricing Model */}
            <section className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">The Daily Pricing Model</h2>
              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                    <h3 className="text-lg font-bold text-red-600 mb-2">Smashing Saturday</h3>
                    <p className="text-2xl font-bold text-gray-900">$19.99</p>
                    <p className="text-sm text-gray-600">per item</p>
                  </div>
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
                    <h3 className="text-lg font-bold text-orange-600 mb-2">Smart Sunday</h3>
                    <p className="text-2xl font-bold text-gray-900">$15.00</p>
                    <p className="text-sm text-gray-600">per item</p>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                    <h3 className="text-lg font-bold text-yellow-600 mb-2">Mega Monday</h3>
                    <p className="text-2xl font-bold text-gray-900">$11.99</p>
                    <p className="text-sm text-gray-600">per item</p>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                    <h3 className="text-lg font-bold text-green-600 mb-2">Thrifty Tuesday</h3>
                    <p className="text-2xl font-bold text-gray-900">$8.99</p>
                    <p className="text-sm text-gray-600">per item</p>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                    <h3 className="text-lg font-bold text-blue-600 mb-2">Wow Wednesday</h3>
                    <p className="text-2xl font-bold text-gray-900">$6.99</p>
                    <p className="text-sm text-gray-600">per item</p>
                  </div>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
                    <h3 className="text-lg font-bold text-purple-600 mb-2">Treasure Thursday</h3>
                    <p className="text-2xl font-bold text-gray-900">$4.99</p>
                    <p className="text-sm text-gray-600">per item</p>
                  </div>
                  <div className="bg-pink-50 border border-pink-200 rounded-lg p-4 text-center">
                    <h3 className="text-lg font-bold text-pink-600 mb-2">Freak-out Friday</h3>
                    <p className="text-2xl font-bold text-gray-900">$1.99</p>
                    <p className="text-sm text-gray-600">per item</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Store Rules & Shopping Guidelines */}
            <section className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Store Rules & Shopping Guidelines</h2>
              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">General Rules</h3>
                    <ul className="text-gray-700 space-y-2">
                      <li>• No returns, exchanges, or refunds</li>
                      <li>• Items must be purchased and taken same day</li>
                      <li>• Fixed daily prices, no negotiation</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Safety & Conduct</h3>
                    <ul className="text-gray-700 space-y-2">
                      <li>• No running or rough play</li>
                      <li>• Adult supervision for all children under 16</li>
                      <li>• Treat staff and fellow shoppers with respect</li>
                      <li>• Aggressive or disruptive behavior leads to removal</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* FAQ Section */}
            <section className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Q: What kinds of products do you sell?</h3>
                    <p className="text-gray-700">
                      A: Almost everything Amazon offers—electronics, home, toys, fashion, crafts, and more.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Q: Are products new or used?</h3>
                    <p className="text-gray-700">
                      A: Most are new or like-new; some may have open packaging. Sold as-is, so inspect before buying.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Q: How does the daily pricing work?</h3>
                    <p className="text-gray-700">
                      A: Every item is the same price that day—no size or value differences.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Q: Can prices be negotiated or items held?</h3>
                    <p className="text-gray-700">
                      A: No, all prices are fixed and everything is first-come, first-served.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Q: What is your return/exchange policy?</h3>
                    <p className="text-gray-700">
                      A: All sales are final—no returns, exchanges, or warranties.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Q: What payment methods are accepted?</h3>
                    <p className="text-gray-700">
                      A: Cash, debit, and credit cards.
                    </p>
                  </div>
                </div>
              </div>
            </section>

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
