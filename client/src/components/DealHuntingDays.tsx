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
  // Get current day of the week
  const getCurrentDay = () => {
    const today = new Date();
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return dayNames[today.getDay()];
  };

  const currentDay = getCurrentDay();

  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl sm:text-5xl font-bold text-red-600 tracking-tight">
            Moez Binz Deal Hunting Days
          </h2>
          <p className="mt-4 max-w-3xl mx-auto text-md text-gray-600">
            Discover deeply discounted Amazon returns and overstock items in every category: home goods, electronics, fashion, arts & crafts, and more. Every visit is a treasure hunt with daily-changing prices!          </p>
          
        </div>

        <div className="mt-14 flex flex-wrap justify-center gap-5 sm:gap-6 lg:gap-7">
          {deals.map((deal) => {
            const isToday = deal.day.includes(currentDay);
            return (
            <div
              key={deal.day}
              className={`relative w-36 h-36 sm:w-40 sm:h-40 lg:w-52 lg:h-52 cursor-pointer hover:scale-105 transition-transform duration-300 ${
                isToday ? 'ring-4 ring-yellow-400 ring-opacity-75 rounded-2xl shadow-2xl' : ''
              }`}
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
                  className={`absolute inset-0 w-full h-full rounded-xl text-white p-5 sm:p-6 lg:p-7 flex flex-col justify-center items-center text-center shadow-lg hover:shadow-xl transition-shadow duration-300 ${
                    isToday ? 'bg-gradient-to-br from-red-600 to-red-800' : 'bg-red-600'
                  }`}
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <p className="font-bold text-base sm:text-2xl lg:text-3xl leading-tight uppercase">{deal.day}</p>
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
                  <p className="font-semibold text-lg sm:text-xl lg:text-2xl leading-tight text-center">{deal.description}</p>
                </div>
              </div>
              
              {/* Today indicator */}
              {isToday && (
                <div className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded-full shadow-lg animate-pulse">
                  TODAY
                </div>
              )}
            </div>
            );
          })}
        </div>

        {/* Special Product Section Banner */}
        <div className="mt-16 bg-yellow-300 py-8 px-6 rounded-2xl shadow-md">
          <div className="text-center">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-red-600 mb-2">
              SPECIAL PRODUCT SECTION
            </h3>
            <p className="text-lg sm:text-xl lg:text-2xl font-bold text-black">
              Super $$$$$ high value items at $ fraction of the market price
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DealHuntingDays;
