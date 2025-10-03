import React from 'react';

const VisitUsPage: React.FC = () => {
    return (
        <main className="bg-white">
            

            {/* Hero Image Section with Mobile/Desktop Versions */}
            <section className="relative w-full h-[50vh] sm:h-[55vh] md:h-[50vh] lg:h-[55vh] xl:h-[60vh] overflow-hidden">
              {/* Desktop Image */}
              <img 
                src="/Visit Us Visual.jpg"
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
              
             
            </section>

            {/* Additional Hero Text Section */}
            <section className="py-8 bg-white">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
               {/* Hero Content */}
              <div className=" z-20 flex items-center justify-center">
                <div className="text-center  px-4 max-w-4xl">
                  <h1 className="text-3xl text-red-600 sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                    Visit Our Store
                  </h1>
                  <p className="text-lg sm:text-xl md:text-2xl text-gray-800 max-w-3xl mx-auto mb-10">
                    Come experience the thrill of treasure hunting at our North York location. Find amazing deals on quality items every day.
                  </p>
                </div>
              </div>
                 
                </div>
              </div>
            </section>
            
            <section className="py-16 sm:py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-12 lg:gap-6 items-start " >
                        {/* Left Column: Info */}
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <h2 className="text-3xl font-bold text-black mb-8 text-center">
                                Moez Binz - Your Treasure Awaits
                            </h2>
                            <div className="space-y-2 text-lg text-black">
                                <div className="bg-white rounded-lg ">
                                    <h3 className="font-bold text-black text-xl">
                                        📍 Address
                                    </h3>
                                    <p className="text-black leading-relaxed">5 - 1150 Sheppard Avenue West<br/>North York, ON M3K 2B5</p>
                                </div>
                                <div className="bg-white rounded-lg ">
                                    <h3 className="font-bold text-black text-xl">
                                        🕒 Store Hours
                                    </h3>
                                    <ul className="space-y-2">
                                        <li className="flex items-center"><span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span><strong>Saturday:</strong> 9 AM - 8 PM </li>
                                        <li className="flex items-center"><span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span><strong>Sunday:</strong> 10 AM - 6 PM</li>
                                        <li className="flex items-center"><span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span><strong>Monday - Thursday:</strong> 10 AM - 7 PM</li>
                                        <li className="flex items-center"><span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span><strong>Friday:</strong> 10 AM - 9 PM </li>
                                        <li className="flex items-center text-sm"><span className="w-2 h-2 bg-gray-500 rounded-full mr-3"></span><strong>Closed: </strong> For restocking on select days. Check social media for updates!</li>
                                    </ul>
                                </div>
                                <div className="bg-white rounded-lg ">
                                    <h3 className="font-bold text-black text-xl mb-3">
                                        📞 Contact Us
                                    </h3>
                                    <p className="">Email: <a href="mailto:Thebinzstore23@gmail.com" className="text-red-600 hover:text-red-700 font-semibold hover:underline transition-colors">Thebinzstore23@gmail.com</a></p>
                                    <p>Follow us: <span className="text-red-600 font-bold">@Moezbinzstore</span></p>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Map */}
                         <div className="bg-white p-4 rounded-2xl  shadow-lg border border-gray-100 opacity-0 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
                        <div className="relative h-[470px] rounded-lg overflow-hidden">
                             <iframe
                                src="https://maps.google.com/maps?width=100%25&amp;height=450&amp;hl=en&amp;q=1150%20Sheppard%20Avenue%20West,%20North%20York,%20ON%20M3K%202B5+(Moez%20Binz%20Store)&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
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
            </section>
        </main>
    );
};

export default VisitUsPage;
