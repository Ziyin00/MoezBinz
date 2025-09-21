import React from 'react';
import Hero from '../components/Hero';
import Header from '../components/Navbar';
import DealHuntingDays from '../components/DealHuntingDays';
import TreasuredFinds from '../components/TreasuredFinds';
import LatestPosts from '../components/LatestPosts';
import CustomerStories from '../components/CustomerStories';
import SubmitFind from '../components/SubmitFind';
import BargainHuntBanner from '../components/BargainHuntBanner';
// import AboutPage from '../components/AboutPage';
import HowItWorksPage from '../components/HowItWorks';
// import ProductsPage from '../components/ProductsPage';
import VisitUsPage from '../components/VisitUsPage';

const HomePage: React.FC = () => {
    return (
        <main>
            <Header/>
            
            {/* Hero Banner Text */}
            <section className="bg-gradient-to-br from-red-50 via-white to-red-50 pb-2 pt-4 px-4">
                <div className="container mx-auto text-center max-w-4xl">
                    <h1 className="text-xl md:text-xl lg:text-2xl font-bold text-gray-900 mb-3 leading-tight">
                        More than just a{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-800">
                            Discount Store
                        </span>
                        , it's the{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-800">
                            Ultimate Treasure Hunt
                        </span>
                    </h1>
                    <div className="flex items-center justify-center gap-2 text-base md:text-lg font-semibold text-gray-700">
                        <span className="text-red-600">Welcome to</span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-800 font-bold">
                            Moez Binz
                        </span>
                    </div>
                </div>
            </section>

            <Hero />
              <section 
              className={` bottom-0 left-0 right-0 z-20 flex justify-center items-end p-4 md:p-6 lg:p-8 transition-opacity duration-1000 ease-in-out `}
            >
              <div className="max-w-7xl mx-auto text-center">
                <div className="bg-black/50 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-white/20">
                  <h2 className="text-lg md:text-2xl lg:text-3xl font-bold text-white mb-2">
                    Premium Brand Goods at{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                      Throwaway Prices
                    </span>
                    {' '}– New Deals Every Day!
                  </h2>
                  <p className="text-sm md:text-base text-gray-200 leading-relaxed">
                    Discover deeply discounted Amazon returns and overstock items in every category: 
                    <span className="font-semibold text-yellow-400"> home goods</span>, 
                    <span className="font-semibold text-yellow-400"> electronics</span>, 
                    <span className="font-semibold text-yellow-400"> fashion</span>, 
                    <span className="font-semibold text-yellow-400"> arts & crafts</span>, 
                    and more. Every visit is a treasure hunt with daily-changing prices!
                  </p>
                </div>
              </div>
            </section>

            <DealHuntingDays />
            <TreasuredFinds />
            <LatestPosts />
            <CustomerStories />
            <SubmitFind />
            <BargainHuntBanner />
            {/* <AboutPage /> */}
            <HowItWorksPage />
            {/* <ProductsPage /> */}
            <VisitUsPage/>
        </main>
    );
};

export default HomePage;