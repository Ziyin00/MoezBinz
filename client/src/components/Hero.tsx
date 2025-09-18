import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from './Icons';

const slides = [
  {
    image: '/hero-1.jpeg',
    title: "More than just a Discount Store, it's the Ultimate Treasure Hunt — Welcome to Moez Binz",
    subtitle: 'Premium Brand Goods at Throwaway Prices – New Deals Every Day!',
    description: 'Discover deeply discounted returns and overstock items across every category.',
  },
  {
    image: '/hero-2.jpeg',
    title: 'Unbeatable Deals on High-End Electronics',
    subtitle: 'Upgrade Your Tech for Less – Limited Time Offers!',
    description: 'From smartphones to smart homes, find top brands at prices you won’t believe.',
  },
  {
    image: '/hero-3.jpeg',
    title: 'Revamp Your Wardrobe with Designer Fashion',
    subtitle: 'Style on a Budget – New Arrivals Weekly!',
    description: 'Shop the latest trends in clothing, shoes, and accessories for the whole family.',
  },
  {
    image: '/hero-4.jpeg',
    title: 'Revamp Your Wardrobe with Designer Fashion',
    subtitle: 'Style on a Budget – New Arrivals Weekly!',
    description: 'Shop the latest trends in clothing, shoes, and accessories for the whole family.',
  },
  {
    image: '/hero-5.jpeg',
    title: 'Revamp Your Wardrobe with Designer Fashion',
    subtitle: 'Style on a Budget – New Arrivals Weekly!',
    description: 'Shop the latest trends in clothing, shoes, and accessories for the whole family.',
  },
  
];

const Hero: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex === slides.length - 1 ? 0 : prevIndex + 1));
  }, []);

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? slides.length - 1 : prevIndex - 1));
  };
  
  const goToSlide = (slideIndex: number) => {
    setCurrentIndex(slideIndex);
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  useEffect(() => {
    const slideInterval = setInterval(nextSlide, 5000);
    return () => clearInterval(slideInterval);
  }, [nextSlide]);

  // Handle image loading
  const handleImageLoad = () => {
    setIsLoading(false);
  };

  return (
    <section 
      id="home" 
      className="relative w-full h-[60vh] sm:h-[60vh] md:h-[70vh] lg:h-[80vh] xl:h-[85vh] overflow-hidden" 
      aria-roledescription="carousel" 
      aria-label="Promotional content"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-gray-100">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
      )}
      
      <div className="w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100 z-10' : 'opacity-0'}`}
            aria-hidden={index !== currentIndex}
          >
            <div className="absolute inset-0 bg-black/10 z-10"></div>
            <img 
              src={slide.image} 
              alt={`Hero slide ${index + 1}`} 
              className="w-full h-full object-cover object-center"
              loading={index === 0 ? 'eager' : 'lazy'}
              decoding="async"
              sizes="100vw"
              onLoad={index === 0 ? handleImageLoad : undefined}
            />
            
            {/* <div 
              className={`absolute inset-0 z-20 flex flex-col justify-center items-start text-white p-8 md:p-16 lg:p-24 transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
            >
              <div className="max-w-4xl space-y-4 md:space-y-6">
                <h1 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight">
                    {slide.title}
                </h1>
                <p className="text-lg md:text-xl font-semibold text-yellow-400 bg-yellow-400/10 px-3 py-1 rounded inline-block">
                    {slide.subtitle}
                </p>
                <p className="text-base md:text-lg text-gray-200">
                    {slide.description}
                </p>
              </div>
            </div> */}


          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button 
        onClick={prevSlide} 
        className="absolute top-1/2 left-2 sm:left-4 md:left-6 lg:left-8 transform -translate-y-1/2 z-30 bg-white/80 hover:bg-white rounded-full p-1.5 sm:p-2 md:p-3 transition-all duration-200 text-gray-800 shadow-lg hover:shadow-xl"
        aria-label="Previous slide"
      >
        <ChevronLeftIcon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
      </button>
      <button 
        onClick={nextSlide} 
        className="absolute top-1/2 right-2 sm:right-4 md:right-6 lg:right-8 transform -translate-y-1/2 z-30 bg-white/80 hover:bg-white rounded-full p-1.5 sm:p-2 md:p-3 transition-all duration-200 text-gray-800 shadow-lg hover:shadow-xl"
        aria-label="Next slide"
      >
        <ChevronRightIcon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
      </button>

      {/* Pagination Dots */}
      <div className="absolute bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 z-30 flex space-x-2 sm:space-x-3" role="group" aria-label="Slide indicator">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all duration-300 ${currentIndex === index ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/75'}`}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={currentIndex === index}
          ></button>
        ))}
      </div>
    </section>
  );
};

export default Hero;