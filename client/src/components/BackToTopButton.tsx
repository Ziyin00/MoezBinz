// FIX: Implemented a functional "Back to Top" button.
import React, { useState, useEffect } from 'react';
import { ArrowUpIcon } from './Icons';

const BackToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 cursor-pointer right-8 z-50 bg-red-600 text-white rounded-full p-3 shadow-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-opacity duration-300 animate-fade-in-up"
          aria-label="Go to top"
        >
          <ArrowUpIcon />
        </button>
      )}
    </>
  );
};

export default BackToTopButton;
