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
            src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
            alt="Shopping process and how it works"
            className="absolute inset-0 w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-black opacity-30"></div>
          
          <div className="relative h-full flex flex-col justify-center items-center text-center text-white px-4 z-10">
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight animate-fade-in-up">
              How It Works
            </h1>
            <p className="mt-4 text-lg sm:text-xl max-w-3xl animate-fade-in-up animation-delay-200">
              Discover amazing deals in three simple steps and start your treasure hunt today
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-6xl mx-auto">
            {/* Steps */}
            <section className="mb-16">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Step 1 */}
                <div className="bg-white rounded-lg shadow-lg p-8 text-center relative">
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                      1
                    </div>
                  </div>
                  <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Browse & Discover</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Explore our curated collection of premium products at unbeatable prices. Use our filters to find exactly what you're looking for.
                  </p>
                </div>

                {/* Step 2 */}
                <div className="bg-white rounded-lg shadow-lg p-8 text-center relative">
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                      2
                    </div>
                  </div>
                  <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Add to Cart</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Found something you love? Add it to your cart and continue shopping or proceed to checkout for a seamless purchasing experience.
                  </p>
                </div>

                {/* Step 3 */}
                <div className="bg-white rounded-lg shadow-lg p-8 text-center relative">
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                      3
                    </div>
                  </div>
                  <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Enjoy Your Purchase</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Receive your order quickly and safely. Enjoy your new treasures knowing you got an incredible deal on quality products.
                  </p>
                </div>
              </div>
            </section>

            {/* Features */}
            <section className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Why Choose Moez Binz?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Best Prices</h3>
                  <p className="text-gray-600 text-sm">Unbeatable deals on quality products</p>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Quality Guaranteed</h3>
                  <p className="text-gray-600 text-sm">Every product meets our high standards</p>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Fast Shipping</h3>
                  <p className="text-gray-600 text-sm">Quick and reliable delivery</p>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">24/7 Support</h3>
                  <p className="text-gray-600 text-sm">Always here to help you</p>
                </div>
              </div>
            </section>

            {/* Shopping Tips */}
            <section className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Pro Shopping Tips</h2>
              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">💡 Check Back Regularly</h3>
                    <p className="text-gray-700 mb-6">
                      New deals are added frequently. Bookmark our site and check back often to catch the best offers before they're gone.
                    </p>

                    <h3 className="text-xl font-semibold text-gray-900 mb-4">📱 Follow Our Social Media</h3>
                    <p className="text-gray-700 mb-6">
                      Get notified about flash sales and exclusive deals by following us on Facebook, Instagram, and TikTok.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">🛒 Act Fast on Great Deals</h3>
                    <p className="text-gray-700 mb-6">
                      The best deals don't last long. When you see something you love at an amazing price, don't hesitate!
                    </p>

                    <h3 className="text-xl font-semibold text-gray-900 mb-4">📧 Sign Up for Updates</h3>
                    <p className="text-gray-700 mb-6">
                      Create an account to get personalized recommendations and early access to new arrivals and special promotions.
                    </p>
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
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">How do you offer such low prices?</h3>
                    <p className="text-gray-700">
                      We work directly with suppliers and manufacturers, cutting out middlemen to bring you the best prices. Our efficient operations and bulk purchasing power allow us to pass the savings directly to you.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Is the quality of your products guaranteed?</h3>
                    <p className="text-gray-700">
                      Absolutely! Every product we sell meets our strict quality standards. We thoroughly vet all our suppliers and products to ensure you receive only the best.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">How fast is your shipping?</h3>
                    <p className="text-gray-700">
                      We offer fast and reliable shipping options. Most orders are processed within 1-2 business days and delivered within 3-7 business days, depending on your location.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">What if I'm not satisfied with my purchase?</h3>
                    <p className="text-gray-700">
                      We stand behind our products with a satisfaction guarantee. If you're not completely happy with your purchase, contact our customer service team and we'll make it right.
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
