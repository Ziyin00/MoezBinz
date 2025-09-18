import React from 'react';
import Header from '../components/Navbar';
import Footer from '../components/Footer';

const About: React.FC = () => {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-br from-red-600 via-red-700 to-red-800 text-white py-20 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}></div>
          </div>
          
          {/* Floating Elements */}
          <div className="absolute top-10 left-10 w-20 h-20 bg-white bg-opacity-10 rounded-full animate-pulse"></div>
          <div className="absolute top-32 right-20 w-16 h-16 bg-white bg-opacity-5 rounded-full animate-bounce"></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-white bg-opacity-15 rounded-full animate-pulse"></div>
          <div className="absolute bottom-32 right-1/3 w-8 h-8 bg-white bg-opacity-20 rounded-full animate-bounce"></div>
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-5xl mx-auto text-center">
              {/* Badge */}
              <div className="inline-flex items-center px-4 py-2 bg-white bg-opacity-20 rounded-full text-sm font-medium mb-8 backdrop-blur-sm">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                Trusted by 10,000+ Customers
              </div>
              
              {/* Main Heading */}
              <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
                <span className="block text-white">About</span>
                <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                  Moez Binz
                </span>
              </h1>
              
              {/* Subtitle */}
              <p className="text-xl md:text-2xl text-red-100 leading-relaxed mb-8 max-w-3xl mx-auto">
                The ultimate treasure hunt for premium brand goods at throwaway prices
              </p>
              
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">10K+</div>
                  <div className="text-red-200 text-sm uppercase tracking-wide">Happy Customers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">50K+</div>
                  <div className="text-red-200 text-sm uppercase tracking-wide">Products Sold</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">99%</div>
                  <div className="text-red-200 text-sm uppercase tracking-wide">Satisfaction Rate</div>
                </div>
              </div>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
                <a
                  href="/product"
                  className="inline-flex items-center px-8 py-4 bg-white text-red-600 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  Shop Now
                </a>
                <a
                  href="/how-it-works"
                  className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-red-600 transition-all duration-300 transform hover:scale-105"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Learn How
                </a>
              </div>
            </div>
          </div>
          
          {/* Bottom Wave */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg className="w-full h-16 text-gray-50" viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" fill="currentColor"></path>
            </svg>
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
      <Footer />
    </>
  );
};

export default About;
