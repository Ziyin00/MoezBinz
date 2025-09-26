import React from 'react';
import Header from '../components/Navbar';

const About: React.FC = () => {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="relative h-[50vh] bg-black">
          <img 
            src="/About Us Visual.jpeg"
            alt="A diverse group of people shopping"
            className="absolute inset-0 w-full h-full object-cover opacity-70"
          />
        </div>

        {/* Hero Text Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-red-600 mb-6">
                About Moez Binz
              </h1>
              <p className="text-lg sm:text-xl text-gray-700 leading-relaxed">
                At Moez Binz, every visit is a new adventure in savings. We're a community-driven liquidation store where newcomers, students, and families can discover quality Amazon returns at prices that make life in Canada easier—and a lot more fun.
              </p>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-4xl mx-auto">
            {/* Our Story and Purpose */}
            <section className="mb-16">
              <h2 className="text-3xl font-bold text-red-600  mb-8 text-center">Our Story and Purpose</h2>
              <div className="bg-white rounded-lg shadow-lg p-8">
                <p className="text-lg text-center text-gray-700 leading-relaxed">
                  Founded with one clear goal - to help people live smarter and better - Moez Binz is here to stretch every dollar. Our unique bins-store model means you get access to an ever-changing selection of home goods, fashion, gadgets, and everything in between, all at a fraction of regular retail prices.
                </p>
              </div>
            </section>

            {/* More Than a Discount Store */}
            <section className="mb-16">
              <h2 className="text-3xl font-bold text-red-600  mb-8 text-center">More Than a Discount Store</h2>
              <div className="bg-white rounded-lg shadow-lg p-8">
                <p className="text-lg text-center text-gray-700 leading-relaxed">
                  Moez Binz isn't just about bargains. Our friendly team knows regulars by name, welcomes newcomers with warm smiles, and celebrates the diversity of our community. Whether furnishing a new home, shopping for campus life, or just looking for life's little surprises, customers feel right at home here.
                </p>
              </div>
            </section>

            {/* Our Commitment to Community */}
            <section className="mb-16">
              <h2 className="text-3xl font-bold text-red-600  mb-8 text-center">Our Commitment to Community</h2>
              <div className="bg-white rounded-lg shadow-lg p-8">
                <p className="text-lg text-center text-gray-700 leading-relaxed">
                  We believe everyone deserves the comfort and possibility of a well-equipped home. That's why we work every day to make quality goods affordable, build real relationships, and support our neighbourhood's diverse mix of cultures and stories.
                </p>
              </div>
            </section>

            {/* Join the Moez Binz Family */}
            <section className="mb-16">
              <h2 className="text-3xl font-bold text-red-600  mb-8 text-center">Join the Moez Binz Family</h2>
              <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                <p className="text-lg text-gray-700 leading-relaxed">
                  Come see what's new in the bins this week - there's always a surprise waiting. Discover the true meaning of smart shopping, right here in North York.
                </p>
              </div>
            </section>

            {/* Call to Action */}
            <section className="text-center">
              <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-lg shadow-lg p-8 text-white">
                <h2 className="text-3xl font-bold mb-4">Ready to Start Your Treasure Hunt?</h2>
                <p className="text-xl text-red-100 mb-6">
                  Join thousands of satisfied customers who have discovered amazing deals at Moez Binz.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="/product"
                    className="bg-white text-red-600 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Shop Now
                  </a>
                  <a
                    href="/visit"
                    className="border-2 border-white text-white font-semibold py-3 px-8 rounded-lg hover:bg-white hover:text-red-600 transition-colors"
                  >
                    Visit Our Store
                  </a>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
