import React from 'react';
import Hero from '../components/Hero';
import Header from '../components/Navbar';
import DealHuntingDays from '../components/DealHuntingDays';
import TreasuredFinds from '../components/TreasuredFinds';
import LatestPosts from '../components/LatestPosts';
import CustomerStories from '../components/CustomerStories';
import SubmitFind from '../components/SubmitFind';
// import AboutPage from '../components/AboutPage';
// import HowItWorksPage from '../components/HowItWorks';
// import ProductsPage from '../components/ProductsPage';
import VisitUsPage from '../components/VisitUsPage';

const HomePage: React.FC = () => {
    return (
        <main>
            <Header/>
            
            {/* Hero Banner Text */}
            <section className="bg-gradient-to-br from-red-50 via-white to-red-50 pb-2 pt-4 px-4">
          <div className="container mx-auto text-center max-w-4xl">
             <div className="flex items-center justify-center md:gap-2 text-sm md:text-lg font-semibold text-gray-700">
                        <span className="text-red-600">Welcome to</span>
                        <span className="text-red-600 bg-clip-text bg-gradient-to-r  font-bold">
                            Moez Binz
                        </span>
                    </div>
                    <h1 className="text-xl md:text-2xl lg:text-5xl font-bold text-gray-900 mb-1 md:mb-3 leading-tight">
                        More than just a{' '}
                        <span className=" bg-clip-text bg-gradient-to-r text-red-600">
                            Discount Store
                        </span>
                        , it's the{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-800">
                            Ultimate Treasure Hunt
                        </span>
                    </h1>
                   
                </div>
            </section>

            <Hero />
              <section 
              className={` bottom-0 left-0 right-0 z-20 flex justify-center items-end p-2 md:p-2 lg:p-2  transition-opacity duration-1000 ease-in-out border-b-2 border-red-500 `}
            >
              <div className="max-w-7xl mx-auto text-center">
            <div className=" rounded-xl p-4 md:p-6 border border-white/20">
              
                  <h2 className="text-lg md:text-2xl lg:text-3xl font-bold text-red-600 mb-2">
                    Premium Brand Goods at{' '}
                    <span className="text-red-600 bg-clip-text bg-gradient-to-r">
                      Throwaway Prices
                    </span>
                    {' '}– New Deals Every Day!
                  </h2>
                  <p className="text-sm md:text-base text-gray-900 leading-relaxed">
                    Discover deeply discounted Amazon returns and overstock items in every category: 
                    <span className="font-semibold"> home goods</span>, 
                    <span className="font-semibold "> electronics</span>, 
                    <span className="font-semibold"> fashion</span>, 
                    <span className="font-semibold"> arts & crafts</span>, 
                    and more. Every visit is a treasure hunt with daily-changing prices!
                  </p>
                </div>
              </div>
            </section>

            <div className="border-b-2 border-red-500">
                <DealHuntingDays />
            </div>
            <div className="border-b-2 border-red-500">
                <TreasuredFinds />
            </div>
            <div className="border-b-2 border-red-500">
                <LatestPosts />
            </div>
            
                <CustomerStories />
         
                <SubmitFind />
            {/* <AboutPage /> */}
            {/* <div className="border-b-2 border-red-500">
                <HowItWorksPage />
            </div> */}
            {/* <ProductsPage /> */}
            <div className="border-b-2 border-red-500">
                <VisitUsPage/>
            </div>
        </main>
    );
};

export default HomePage;