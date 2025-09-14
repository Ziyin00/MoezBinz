import React from 'react';

const deals = [
  { day: 'Smart Sunday', price: '$15.00' },
  { day: 'Smashing Saturday', price: '$19.99' },
  { day: 'Freak-out Friday', price: '$1.99' },
  { day: 'Thrifty Tuesday', price: '$8.99' },
  { day: 'Wow Wednesday', price: '$6.99' },
  { day: 'Treasure Thursday', price: '$4.99' },
  { day: 'Mega Monday', price: '$11.99' },
];

const DealHuntingDays: React.FC = () => {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
            Moez Binz Deal Hunting Days
          </h2>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-600">
            Every item in our bins – big or small, high-value or basic – has the same flat price each day. We stock fresh bins every Saturday: $19.99 per item on stock day, down to a jaw-dropping $1.99 on Fridays. Inventory moves fast and great deals are waiting to be discovered.
          </p>
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-4 sm:gap-6">
          {deals.map((deal) => (
            <div
              key={deal.day}
              className="bg-red-600 rounded-xl text-white p-6 w-40 h-40 flex flex-col justify-center items-center text-center shadow-lg transform hover:scale-105 transition-transform duration-300 ease-out cursor-pointer"
            >
              <p className="font-semibold">{deal.day}</p>
              <p className="text-4xl font-bold mt-2">{deal.price}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DealHuntingDays;
