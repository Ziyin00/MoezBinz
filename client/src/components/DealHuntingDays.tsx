import React from 'react';

const deals = [
  { 
    day: 'Smashing Saturday', 
    price: '$19.99',
    description: 'Fresh finds, big-ticket items',
    icon: '🛒💥'
  },
  { 
    day: 'Smart Sunday', 
    price: '$15.00',
    description: 'Grab it before it\'s gone',
    icon: '🧠💰'
  },
  { 
    day: 'Mega Monday', 
    price: '$11.99',
    description: 'Fresh stock madness',
    icon: '📦✨'
  },
  { 
    day: 'Thrifty Tuesday', 
    price: '$8.99',
    description: 'Bargain-hunting sweet spot',
    icon: '🎯👜'
  },
  { 
    day: 'Wow Wednesday', 
    price: '$6.99',
    description: 'Low prices, surprising finds',
    icon: '😲🎁'
  },
  { 
    day: 'Treasure Thursday', 
    price: '$4.99',
    description: 'New restock, crazy deals',
    icon: '🌱📦'
  },
  { 
    day: 'Freak-out Friday', 
    price: '$1.99',
    description: 'Everything goes prices',
    icon: '🎉🔥'
  },
];

const DealHuntingDays: React.FC = () => {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl sm:text-5xl font-bold text-red-600 tracking-tight">
            Moez Binz Deal Hunting Days
          </h2>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-600">
            Every item in our bins – big or small, high-value or basic – has the same flat price each day. We stock fresh bins every Saturday: $19.99 per item on stock day, down to a jaw-dropping $1.99 on Fridays. Inventory moves fast and great deals are waiting to be discovered.
          </p>
          <p className="mt-2 text-sm text-gray-500 italic">
            💡 Hover over each day to see what makes it special!
          </p>
        </div>

        <div className="mt-14 flex flex-wrap justify-center gap-5 sm:gap-6 lg:gap-7">
          {deals.map((deal) => (
            <div
              key={deal.day}
              className="relative w-36 h-36 sm:w-40 sm:h-40 lg:w-52 lg:h-52 cursor-pointer hover:scale-105 transition-transform duration-300"
              style={{ perspective: '1000px' }}
            >
              {/* Card Container with 3D Flip Effect */}
              <div 
                className="relative w-full h-full transition-transform duration-700 ease-in-out group"
                style={{ 
                  transformStyle: 'preserve-3d',
                  transform: 'rotateY(0deg)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'rotateY(180deg)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'rotateY(0deg)';
                }}
              >
                {/* Front Side - Price Card */}
                <div 
                  className="absolute inset-0 w-full h-full bg-red-600 rounded-xl text-white p-5 sm:p-6 lg:p-7 flex flex-col justify-center items-center text-center shadow-lg hover:shadow-xl transition-shadow duration-300"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <p className="font-bold text-base sm:text-lg lg:text-xl leading-tight">{deal.day}</p>
                  <p className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-2 sm:mt-3 text-yellow-300">{deal.price}</p>
                  <p className="text-xs sm:text-sm lg:text-base mt-1 opacity-90">per item</p>
                </div>
                
                {/* Back Side - Description Card */}
                <div 
                  className="absolute inset-0 w-full h-full bg-white rounded-xl text-gray-800 p-5 sm:p-6 lg:p-7 flex flex-col justify-center items-center text-center shadow-lg border-2 border-red-200 hover:shadow-xl transition-shadow duration-300"
                  style={{ 
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)'
                  }}
                >
                  <div className="text-3xl sm:text-4xl lg:text-5xl mb-2 sm:mb-3">{deal.icon}</div>
                  <p className="font-semibold text-sm sm:text-base lg:text-lg leading-tight text-center">{deal.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DealHuntingDays;
