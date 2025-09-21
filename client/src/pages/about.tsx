import React from 'react';
import Header from '../components/Navbar';

const About: React.FC = () => {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="relative h-[50vh] bg-black">
          <img 
            src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
            alt="A diverse group of people shopping"
            className="absolute inset-0 w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-black opacity-30"></div>
          
          <div className="relative h-full flex flex-col justify-center items-center text-center text-white px-4 z-10">
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight animate-fade-in-up">
              About Moez Binz
            </h1>
            <p className="mt-4 text-lg sm:text-xl max-w-3xl animate-fade-in-up animation-delay-200">
              Every visit is a new adventure in savings. We're a community-driven liquidation store where everyone can discover quality goods at prices that make life easier—and a lot more fun.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-4xl mx-auto">
            {/* Our Story */}
            <section className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Story</h2>
              <div className="bg-white rounded-lg shadow-lg p-8">
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  Moez Binz was born from a simple yet powerful idea: everyone deserves access to premium quality goods without the premium price tag. We believe that luxury and affordability shouldn't be mutually exclusive.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  Founded with the vision of creating a treasure hunt experience for shoppers, we've built a platform where you can discover amazing deals on brand-name products. From electronics to fashion, home goods to accessories, we curate a selection of high-quality items at prices that make sense.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Our mission is to democratize access to quality products while providing an exciting shopping experience that feels like finding hidden gems in your own backyard.
                </p>
              </div>
            </section>

            {/* Our Values */}
            <section className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Values</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Affordable Quality</h3>
                  <p className="text-gray-600">
                    We believe everyone deserves access to quality products without breaking the bank.
                  </p>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Trust & Transparency</h3>
                  <p className="text-gray-600">
                    We maintain complete transparency in our pricing and product information.
                  </p>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Customer First</h3>
                  <p className="text-gray-600">
                    Your satisfaction is our priority. We're here to make your shopping experience exceptional.
                  </p>
                </div>
              </div>
            </section>

            {/* What Makes Us Different */}
            <section className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">What Makes Us Different</h2>
              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">🎯 Curated Selection</h3>
                    <p className="text-gray-700 mb-6">
                      We don't just sell products – we carefully curate each item to ensure it meets our high standards for quality and value.
                    </p>

                    <h3 className="text-xl font-semibold text-gray-900 mb-4">💰 Unbeatable Prices</h3>
                    <p className="text-gray-700 mb-6">
                      Our direct relationships with suppliers and efficient operations allow us to offer prices that are truly unbeatable.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">🚀 Fast & Reliable</h3>
                    <p className="text-gray-700 mb-6">
                      Quick shipping and reliable delivery ensure you get your treasures when you need them.
                    </p>

                    <h3 className="text-xl font-semibold text-gray-900 mb-4">🛡️ Quality Guarantee</h3>
                    <p className="text-gray-700 mb-6">
                      Every product comes with our quality guarantee. If you're not satisfied, we'll make it right.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Our Team */}
            <section className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Meet Our Team</h2>
              <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  Behind Moez Binz is a passionate team of deal hunters, quality experts, and customer service champions. We're united by our love for finding amazing products at incredible prices and sharing them with our community.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  From our buyers who scour the market for the best deals to our customer service team who ensures every interaction is exceptional, we're all committed to making your shopping experience the best it can be.
                </p>
              </div>
            </section>

            {/* Call to Action */}
            <section className="text-center">
              <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-lg shadow-lg p-8 text-white">
                <h2 className="text-3xl font-bold mb-4">Ready to Start Your Treasure Hunt?</h2>
                <p className="text-xl text-red-100 mb-6">
                  Join thousands of satisfied customers who have discovered amazing deals at Moez Binz.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="/product"
                    className="bg-white text-red-600 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Shop Now
                  </a>
                  <a
                    href="/visit"
                    className="border-2 border-white text-white font-semibold py-3 px-8 rounded-lg hover:bg-white hover:text-red-600 transition-colors"
                  >
                    Visit Our Store
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

export default About;
