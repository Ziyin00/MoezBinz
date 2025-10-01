import React from 'react';

const VisitUsPage: React.FC = () => {
    return (
        <main className="bg-white">
            {/* Hero Banner Section - Similar to About Us Page */}
            <section className="bg-gradient-to-br from-red-50 via-white to-red-50 pb-2 pt-4 px-4">
              <div className="container mx-auto text-center max-w-4xl">
                <div className="flex items-center justify-center md:gap-2 text-sm md:text-lg font-semibold text-gray-700">
                  <span className="text-red-600">Welcome to</span>
                  <span className="text-red-600 bg-clip-text bg-gradient-to-r font-bold">
                    Moez Binz
                  </span>
                </div>
                <h1 className="text-xl md:text-2xl lg:text-5xl font-bold text-gray-900 mb-1 md:mb-3 leading-tight">
                  More than just a{' '}
                  <span className="bg-clip-text bg-gradient-to-r text-red-600">
                    Discount Store
                  </span>
                  , it's the{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-800">
                    Ultimate Treasure Hunt
                  </span>
                </h1>
              </div>
            </section>

            {/* Hero Image Section with Mobile/Desktop Versions */}
            <section className="relative w-full h-[50vh] sm:h-[55vh] md:h-[50vh] lg:h-[55vh] xl:h-[60vh] overflow-hidden">
              {/* Desktop Image */}
              <img 
                src="/Visit Us Visual.jpeg"
                alt="Visit Moez Binz - Our Store Location"
                className="hidden sm:block w-full h-full object-cover object-center"
                loading="eager"
                decoding="async"
                sizes="100vw"
              />
              
              {/* Mobile Image */}
              <img 
                src="/Visit Us Visual-Mobile.jpg"
                alt="Visit Moez Binz - Our Store Location"
                className="block sm:hidden w-full h-full object-cover object-center"
                loading="eager"
                decoding="async"
                sizes="100vw"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/30 z-10"></div>
              
              {/* Hero Content */}
              <div className="absolute inset-0 z-20 flex items-center justify-center">
                <div className="text-center text-white px-4 max-w-4xl">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                    Plan Your Visit to Moez Binz
                  </h1>
                  <p className="text-lg sm:text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
                    Come experience the thrill of treasure hunting at our North York location. Find amazing deals on quality items every day.
                  </p>
                </div>
              </div>
            </section>

            {/* Additional Hero Text Section */}
            <section className="py-8 bg-white border-b-2 border-red-500">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto text-center">
                  <h2 className="text-2xl md:text-3xl font-bold text-red-600 mb-4">
                    Premium Brand Goods at{' '}
                    <span className="text-red-600 bg-clip-text bg-gradient-to-r">
                      Throwaway Prices
                    </span>
                    {' '}– New Deals Every Day!
                  </h2>
                  <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                    Discover deeply discounted Amazon returns and overstock items in every category: 
                    <span className="font-semibold"> home goods</span>, 
                    <span className="font-semibold"> electronics</span>, 
                    <span className="font-semibold"> fashion</span>, 
                    <span className="font-semibold"> arts & crafts</span>, 
                    and more. Every visit is a treasure hunt with daily-changing prices!
                  </p>
                </div>
              </div>
            </section>

            <div className="bg-gray-50 py-16 sm:py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
                    {/* Location & Hours Card */}
                    <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 opacity-0 animate-fade-in-up animation-delay-200">
                        <h2 className="text-3xl font-bold text-red-600 mb-6">Location & Hours</h2>
                        <div className="space-y-4 text-gray-700">
                            <div>
                                <h3 className="font-bold text-gray-800">Address:</h3>
                                <p>5 - 1150 Sheppard Avenue West, North York, ON M3K 2B5, Canada</p>
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800">Open 7 days a week:</h3>
                                <ul className="mt-1 space-y-1 pl-2">
                                    <li><span className="font-semibold w-24 inline-block">Mon–Wed:</span> 10am–7pm</li>
                                    <li><span className="font-semibold w-24 inline-block">Thu:</span> 10am–8pm</li>
                                    <li><span className="font-semibold w-24 inline-block">Fri:</span> 10am–4pm</li>
                                    <li><span className="font-semibold w-24 inline-block">Sat–Sun:</span> 10am–7pm</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800">Parking:</h3>
                                <p>Free parking available in front and behind store</p>
                            </div>
                        </div>
                    </div>

                    {/* Map Card */}
                    <div className="bg-white p-4 rounded-2xl  shadow-lg border border-gray-100 opacity-0 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
                        <div className="relative h-[350px] rounded-lg overflow-hidden">
                             <iframe
                                src="https://maps.google.com/maps?q=1150%20Sheppard%20Avenue%20West%20North%20York%20ON%20M3K%202B5%20Canada&t=&z=15&ie=UTF8&iwloc=&output=embed"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen={true}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="w-full h-full"
                                title="Location of Moez Binz - 5 - 1150 Sheppard Avenue West, North York, ON M3K 2B5"
                            ></iframe>
                        </div>
                    </div>
                </div>
                </div>
            </div>
        </main>
    );
};

export default VisitUsPage;
