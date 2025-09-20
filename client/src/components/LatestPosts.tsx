import React, { useState } from 'react';
import { PlayIcon, XMarkIcon } from './Icons';

const videos = [
  {
    id: 1,
    title: "Saturday Restock - New Arrivals",
    thumbnail: 'https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    videoUrl: 'story-1.MP4',
    duration: '0:20',
    description: 'See what new treasures arrived this Saturday!'
  },
  {
    id: 2,
    title: "Customer Finds & Success Stories",
    thumbnail: 'https://images.unsplash.com/photo-1589128793011-b3b47285b6b1?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    videoUrl: "story-2.MP4",
    duration: '0:18',
    description: 'Amazing finds from our customers this week!'
  },
  {
    id: 3,
    title: "Behind the Scenes - How We Stock",
    thumbnail: 'https://images.unsplash.com/photo-1594132337992-996459dfa207?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    videoUrl: "story-3.MP4",
    duration: '0:16',
    description: 'Take a look at how we prepare our bins!'
  },
  {
    id: 4,
    title: "Friday Steals - Best Deals",
    thumbnail: 'https://images.unsplash.com/photo-1549468057-5b7fa1a41d7a?q=80&w=1943&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    videoUrl: "story-4.MP4",
    duration: '0:31',
    description: 'Don\'t miss these incredible Friday deals!'
  },
];

const LatestPosts: React.FC = () => {
  const [selectedVideo, setSelectedVideo] = useState<typeof videos[0] | null>(null);

  const openVideo = (video: typeof videos[0]) => {
    setSelectedVideo(video);
  };

  const closeVideo = () => {
    setSelectedVideo(null);
  };

  return (
    <>
      <section className="bg-white py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-left mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
              The Latest at Moez Binz
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Watch our latest videos to see new arrivals, customer finds, and behind-the-scenes content!
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {videos.map((video) => (
              <button
                key={video.id}
                onClick={() => openVideo(video)}
                className="group block relative aspect-[9/16] overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <video
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                  muted
                  loop
                  playsInline
                >
                  <source src={video.videoUrl} type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                
                {/* Video Info */}
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white font-semibold text-sm mb-1 line-clamp-2">
                    {video.title}
                  </h3>
                  <p className="text-white/80 text-xs mb-2 line-clamp-1">
                    {video.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-white/90 text-xs font-medium">
                      {video.duration}
                    </span>
                    <div className="bg-red-600 rounded-full p-2 text-white transition-transform duration-300 ease-in-out group-hover:scale-110">
                      <PlayIcon className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {selectedVideo && (
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
                key={selectedVideo.id}
                controls
                autoPlay
                className="w-full h-auto max-h-[70vh]"
              >
                <source src={selectedVideo.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>

            {/* Video Info */}
            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {selectedVideo.title}
              </h3>
              <p className="text-gray-600 mb-4">
                {selectedVideo.description}
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>Duration: {selectedVideo.duration}</span>
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

export default LatestPosts;