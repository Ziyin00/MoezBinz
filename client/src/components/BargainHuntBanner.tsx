import React from 'react';

const BargainHuntBanner: React.FC = () => {
  return (
    <section className="bg-white pb-16 sm:pb-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-red-600 rounded-2xl p-8 sm:p-12 text-white">
          <div className="max-w-4xl">
            <h2 className="text-2xl sm:text-3xl font-bold">
              Join the bargain hunt of your lifetime
            </h2>
            <p className="mt-3 text-base sm:text-lg text-red-100">
              Follow @Moezbinzstore on Facebook, Instagram, and TikTok for live restock videos, customer finds, deal alerts, and more!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BargainHuntBanner;
