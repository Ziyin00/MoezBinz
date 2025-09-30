import React, { useState } from 'react';
import {  XMarkIcon } from './Icons';

const TreasuredFinds: React.FC = () => {
  const [showVideo, setShowVideo] = useState(false);

  

  const closeVideo = () => {
    setShowVideo(false);
  };

  return (
    <>
      <section className="bg-red-600  py-20 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 lg:gap-20 items-center">
            
            {/* Left Column: Images & Video */}
            <div className="mb-16 lg:mb-0">
              <h2 className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-6">
                Some of Our Most Treasured Finds
              </h2>
              <p className="text-xl text-white leading-relaxed mb-10">
                Check out a few of the treasures waiting in our bins – new surprises arrive every Saturday.
              </p>
              <div className="grid grid-cols-2 gap-6 h-[400px]">
                {/* First Image */}
                <div className="col-span-1 h-full">
                   <div className="group relative overflow-hidden rounded-3xl shadow-2xl bg-gradient-to-br h-full">
                      <div className="relative overflow-hidden rounded-2xl h-full">
                        <img 
                          src="deal-1.jpg" 
                          alt="Open for shop" 
                          className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:rotate-1" 
                        />
                        {/* Overlay with gradient and content */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="absolute bottom-4 left-4 right-4 text-white">
                            <h4 className="text-lg font-bold mb-1">Store Opening</h4>
                            <p className="text-sm opacity-90">Fresh finds every Saturday</p>
                          </div>
                        </div>
                        {/* Floating badge */}
                        <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg transform rotate-12 group-hover:rotate-0 transition-transform duration-300">
                          NEW!
                        </div>
                      </div>
                   </div>
                </div>
                
                {/* Second Image */}
                <div className="col-span-1 h-full">
                  <div className="group relative overflow-hidden rounded-3xl shadow-2xl bg-gradient-to-br h-full">
                    <div className="relative overflow-hidden rounded-2xl h-full">
                      <img 
                        src="deal-2.jpg" 
                        alt="Happy customers" 
                        className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:-rotate-1" 
                      />
                      {/* Overlay with gradient and content */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-4 left-4 right-4 text-white">
                          <h4 className="text-lg font-bold mb-1">Happy Customers</h4>
                          <p className="text-sm opacity-90">Amazing deals found</p>
                        </div>
                      </div>
                      {/* Floating badge */}
                      <div className="absolute top-4 right-4 bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold shadow-lg transform -rotate-12 group-hover:rotate-0 transition-transform duration-300">
                        SALE!
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Third Image */}
                <div className="col-span-1 h-full">
                  <div className="group relative overflow-hidden rounded-3xl shadow-2xl bg-gradient-to-br h-full">
                    <div className="relative overflow-hidden rounded-2xl h-full">
                      <img 
                        src="deal-3.jpg" 
                        alt="Treasure hunt" 
                        className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:rotate-1" 
                      />
                      {/* Overlay with gradient and content */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-4 left-4 right-4 text-white">
                          <h4 className="text-lg font-bold mb-1">Treasure Hunt</h4>
                          <p className="text-sm opacity-90">Find your perfect deal</p>
                        </div>
                      </div>
                      {/* Floating badge */}
                      <div className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg transform rotate-12 group-hover:rotate-0 transition-transform duration-300">
                        HOT!
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Fourth Image */}
                <div className="col-span-1 h-full">
                  <div className="group relative overflow-hidden rounded-3xl shadow-2xl bg-gradient-to-br h-full">
                    <div className="relative overflow-hidden rounded-2xl h-full">
                      <img 
                        src="deal-4.jpeg" 
                        alt="Amazing deals" 
                        className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:-rotate-1" 
                      />
                      {/* Overlay with gradient and content */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-4 left-4 right-4 text-white">
                          <h4 className="text-lg font-bold mb-1">Amazing Deals</h4>
                          <p className="text-sm opacity-90">Incredible savings daily</p>
                        </div>
                      </div>
                      {/* Floating badge */}
                      <div className="absolute top-4 right-4 bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg transform -rotate-12 group-hover:rotate-0 transition-transform duration-300">
                        DEAL!
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          {/* Right Column: Info Boxes */}
          <div className="space-y-10 ">
            <div className="bg-white p-8 xl:p-9 rounded-3xl shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
              <h2 className="text-xl sm:text-3xl font-bold text-gray-900 mb-6">Why Shop at Moez Binz?</h2>
              <ul className="space-y-4 text-lg text-gray-600">
                <li className="flex items-start gap-3">
                  <span className="text-red-600 font-bold text-xl">•</span>
                  <span>Flat, falling prices each day – $1.99 to $19.99</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-600 font-bold text-xl">•</span>
                  <span>New pallets restocked every Saturday</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-600 font-bold text-xl">•</span>
                  <span>All sizes, one fixed price per day</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-600 font-bold text-xl">•</span>
                  <span>Big-name brands for a fraction of retail</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-600 font-bold text-xl">•</span>
                  <span>Family-friendly, thrill-of-the-find shopping</span>
                </li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-yellow-500 to-yellow-500 p-8 xl:p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <h2 className="text-xl sm:text-3xl font-bold text-white mb-6">Pro Tips for Bargain Hunters</h2>
              <ul className="space-y-4 text-lg text-white">
                <li className="flex items-start gap-3">
                  <span className="text-white font-bold text-xl">•</span>
                  <span>Go early on Saturday for top brands</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-white font-bold text-xl">•</span>
                  <span>Come midweek for steady price drops</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-white font-bold text-xl">•</span>
                  <span>Fridays = lowest prices and final reductions</span>
                </li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </section>

    {/* Video Modal */}
    {showVideo && (
      <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
        <div className="relative w-full max-w-4xl bg-white rounded-2xl overflow-hidden shadow-2xl">
          {/* Close Button */}
          <button
            onClick={closeVideo}
            className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>

          {/* Video Player */}
          <div className="relative">
            <video
              controls
              autoPlay
              className="w-full h-auto max-h-[70vh]"
              poster="https://images.unsplash.com/photo-1593062334882-297f642a8b9a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            >
              <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>

          {/* Video Info */}
          <div className="p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Moez Binz Store Tour
            </h3>
            <p className="text-gray-600 mb-4">
              Take a virtual tour of our store and see what treasures await in our bins!
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>Duration: 2:45</span>
              <span>•</span>
              <span>Moez Binz Official</span>
            </div>
          </div>
        </div>
      </div>
    )}
  </>
  );
};

export default TreasuredFinds;