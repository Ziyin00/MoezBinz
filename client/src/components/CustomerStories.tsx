import React, { useState, useEffect, useCallback } from 'react';

const stories = [
  {
    quote: "“As a broke student, Moez Binz is literally my survival kit 😂...”",
    author: "— Alex, York University Student"
  },
  {
    quote: "“Found a brand new KitchenAid mixer for less than the price of a coffee. Unbelievable finds every single week!”",
    author: "— Samantha B., Avid Baker"
  },
  {
    quote: "“The Saturday morning rush is a vibe. The thrill of finding something amazing for a few bucks is just addictive.”",
    author: "— David L., Treasure Hunter"
  }
];

const CustomerStories: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextStory = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex === stories.length - 1 ? 0 : prevIndex + 1));
  }, []);

  const goToStory = (index: number) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    const storyInterval = setInterval(nextStory, 5000);
    return () => clearInterval(storyInterval);
  }, [nextStory]);

  return (
    <section className="bg-gray-50 py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-left mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
            Customer Stories
          </h2>
        </div>

        <div className="relative h-48 md:h-36">
          {stories.map((story, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
              aria-hidden={index !== currentIndex}
            >
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 h-full flex items-start gap-6">
                <div className="w-1.5 h-full bg-red-600 rounded-full"></div>
                <div className="flex flex-col justify-center h-full">
                  <blockquote className="text-xl md:text-2xl text-gray-800">
                    {story.quote}
                  </blockquote>
                  <p className="mt-4 text-gray-600 font-medium">{story.author}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Pagination Dots */}
        <div className="flex justify-center items-center mt-8 space-x-3">
            {stories.map((_, index) => (
                <button
                    key={index}
                    onClick={() => goToStory(index)}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${currentIndex === index ? 'bg-red-600 scale-125' : 'bg-gray-300 hover:bg-gray-400'}`}
                    aria-label={`Go to story ${index + 1}`}
                    aria-current={currentIndex === index}
                ></button>
            ))}
        </div>

      </div>
    </section>
  );
};

export default CustomerStories;