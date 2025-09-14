import React, { useState } from 'react';
import { PlayIcon, XMarkIcon } from './Icons';

const TreasuredFinds: React.FC = () => {
  const [showVideo, setShowVideo] = useState(false);

  const openVideo = () => {
    setShowVideo(true);
  };

  const closeVideo = () => {
    setShowVideo(false);
  };

  return (
    <>
      <section className="bg-gray-50 py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 lg:gap-16 items-start">
            
            {/* Left Column: Images & Video */}
            <div className="mb-12 lg:mb-0">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
                Some of Our Most Treasured Finds
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Check out a few of the treasures waiting in our bins – new surprises arrive every Saturday.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                   <div className="group overflow-hidden rounded-2xl shadow-lg">
                      <img 
                        src="https://images.unsplash.com/photo-1543987094-a32f80a43924?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                        alt="Open for shop" 
                        className="aspect-[3/4] w-full object-cover transition-transform duration-300 group-hover:scale-105" 
                      />
                   </div>
                </div>
                <div className="col-span-2 sm:col-span-1 space-y-4">
                  {/* Video Thumbnail */}
                  <div className="group relative overflow-hidden rounded-2xl shadow-lg cursor-pointer" onClick={openVideo}>
                    <img 
                      src="https://images.unsplash.com/photo-1593062334882-297f642a8b9a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                      alt="Store tour video" 
                      className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-105" 
                    />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-300"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-red-600 rounded-full p-4 text-white transition-transform duration-300 group-hover:scale-110 shadow-lg">
                        <PlayIcon className="h-8 w-8" />
                      </div>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-white font-semibold text-sm mb-1">Store Tour</h3>
                      <p className="text-white/80 text-xs">See what's inside our bins!</p>
                    </div>
                  </div>
                  
                  <div className="group overflow-hidden rounded-2xl shadow-lg">
                    <img 
                      src="https://images.unsplash.com/photo-1576185248593-55113114a0fe?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                      alt="Woman with shopping bags" 
                      className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105" 
                    />
                  </div>
                </div>
              </div>
            </div>

          {/* Right Column: Info Boxes */}
          <div className="space-y-8">
            <div className="bg-gray-100 p-8 rounded-2xl border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900">Why Shop at Moez Binz?</h3>
              <ul className="mt-4 space-y-2 text-gray-600 list-disc list-inside">
                <li>Flat, falling prices each day – $1.99 to $19.99</li>
                <li>New pallets restocked every Saturday</li>
                <li>All sizes, one fixed price per day</li>
                <li>Big-name brands for a fraction of retail</li>
                <li>Family-friendly, thrill-of-the-find shopping</li>
              </ul>
            </div>
            <div className="bg-yellow-300 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold text-gray-900">Pro Tips for Bargain Hunters</h3>
              <ul className="mt-4 space-y-2 text-gray-800 list-disc list-inside">
                <li>Go early on Saturday for top brands</li>
                <li>Come midweek for steady price drops</li>
                <li>Fridays = lowest prices and final reductions</li>
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