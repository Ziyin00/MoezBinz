import React, { useState, useEffect, useCallback } from 'react';

const stories = [
  {
    quote: "As a broke student, Moez Binz is literally my survival kit 😂. I've found headphones, USB hubs, even a Kindle! Every time I go, it feels like a game — what gadget will I score today? My friends can't believe I set up my study corner for less than the cost of one textbook.",
    author: "Alex",
    location: "York University Student",
    platform: "Google",
    rating: 5
  },
  {
    quote: "We just moved to Canada, and Moez Binz has been a blessing. Setting up a home from scratch on a budget felt impossible… until we found this store. We got kitchen appliances, decor, even a vacuum - all at prices we could actually afford. It's become our Saturday ritual, and honestly, we look forward to it more than going to the mall.",
    author: "Priya & Raj",
    location: "Newcomer Family",
    platform: "Trustpilot",
    rating: 5
  },
  {
    quote: "I have two kids, which means I'm invited to 20+ birthday parties every year 🥳. Moez Binz is my secret weapon. I can grab fun toys, games, and even cool gadgets at prices so low, nobody guesses I didn't spend a fortune. Honestly, it's saved me hundreds of dollars - and my kids think I'm the coolest mom ever.",
    author: "Sophie",
    location: "Mother of 2",
    platform: "Yelp",
    rating: 5
  },
  {
    quote: "I'm obsessed with tools, and Moez Binz is like a treasure chest for me 🔧. I've scored drill sets, measuring tools, even a high-end tool kit for the price of a pizza. The fun is in the hunt — you never know what's in the bins, and that's addictive. It's where my weekend starts, every single time.",
    author: "Hernandez",
    location: "Tools & Hardware Geek",
    platform: "Google",
    rating: 5
  },
  {
    quote: "With two kids who outgrow clothes every season, shopping can get expensive fast. Moez Binz is my lifesaver. I've picked up jackets, shoes, and everyday outfits at prices that don't hurt my wallet. The best part? My kids actually love what I bring home. It's affordable, fun, and addictive — I never leave with just one bag!",
    author: "Tatiana",
    location: "A young mother",
    platform: "Trustpilot",
    rating: 5
  }
];

const CustomerStories: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextStory = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex === stories.length - 1 ? 0 : prevIndex + 1));
  }, []);

  const prevStory = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? stories.length - 1 : prevIndex - 1));
  }, []);

  const goToStory = (index: number) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    const storyInterval = setInterval(nextStory, 6000);
    return () => clearInterval(storyInterval);
  }, [nextStory]);

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  const getPlatformLogo = (platform: string) => {
    switch (platform) {
      case 'Google':
        return (
          <div className="flex items-center gap-2">
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="text-sm font-medium text-gray-600">Google</span>
          </div>
        );
      case 'Yelp':
        return (
          <div className="flex items-center gap-2">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#FF1A1A">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <span className="text-sm font-medium text-gray-600">Yelp</span>
          </div>
        );
      case 'Trustpilot':
        return (
          <div className="flex items-center gap-2">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#00B67A">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            <span className="text-sm font-medium text-gray-600">Trustpilot</span>
          </div>
        );
      default:
        return <span className="text-sm font-medium text-gray-600">{platform}</span>;
    }
  };

  return (
    <section className="bg-gradient-to-br from-pink-50 via-white to-yellow-50 py-20 sm:py-24">
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Side - Header and Ratings */}
          <div className="text-left">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight mb-4">
              In their words
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-md">
              What people say about how we helped them to that sweet, sweet closing day.
            </p>
            
           
          </div>

          {/* Right Side - Review Carousel */}
          <div className="relative">
            <div className="relative h-80 overflow-hidden">
              {stories.map((story, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-all duration-500 ease-in-out ${
                    index === currentIndex 
                      ? 'opacity-100 translate-x-0' 
                      : index < currentIndex 
                        ? 'opacity-0 -translate-x-full' 
                        : 'opacity-0 translate-x-full'
                  }`}
                >
                  <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 h-full flex flex-col">
                    {/* Platform and Rating */}
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-2">
                        {getPlatformLogo(story.platform)}
                      </div>
                      <div className="flex">
                        {renderStars()}
                      </div>
                    </div>
                    
                    {/* Review Text */}
                    <blockquote className="text-lg text-gray-800 leading-relaxed flex-1 mb-6">
                      "{story.quote}"
                    </blockquote>
                    
                    {/* Author */}
                    <div className="text-gray-600 font-medium">
                      <span className="text-gray-900 font-semibold">{story.author}</span> in {story.location}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Navigation Arrows */}
            <button
              onClick={prevStory}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors duration-200"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button
              onClick={nextStory}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors duration-200"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            
            {/* Pagination Dots */}
            <div className="flex justify-center items-center mt-8 space-x-3">
              {stories.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToStory(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    currentIndex === index 
                      ? 'bg-pink-500 scale-125' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to review ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomerStories;