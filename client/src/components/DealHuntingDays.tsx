import React from 'react';

const deals = [
  { 
    day: 'SMART SUNDAYS', 
    price: '$15.99',
    description: 'Grab it before it\'s gone',
    icon: '🧠💰'
  },
  { 
    day: 'MEGA MONDAYS', 
    price: '$11.99',
    description: 'Fresh stock madness',
    icon: '📦✨'
  },
  { 
    day: 'THRIFTY TUESDAYS', 
    price: '$8.99',
    description: 'Bargain-hunting sweet spot',
    icon: '🎯👜'
  },
  { 
    day: 'WOW WEDNESDAYS', 
    price: '$6.99',
    description: 'Low prices, surprising finds',
    icon: '😲🎁'
  },
  { 
    day: 'TREASURE THURSDAYS', 
    price: '$4.99',
    description: 'New restock, crazy deals',
    icon: '🌱📦'
  },
  { 
    day: 'FREAK-OUT FRIDAYS', 
    price: '$1.99',
    description: 'Everything goes prices',
    icon: '🎉🔥'
  },
];

const DealHuntingDays: React.FC = () => {
  // Get current day of the week in Canada timezone
  const getCurrentDay = () => {
    // Use Canada's timezone (Eastern Time - Toronto)
    const today = new Date().toLocaleString("en-US", {timeZone: "America/Toronto"});
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayIndex = new Date(today).getDay();
    return dayNames[dayIndex];
  };

  const currentDay = getCurrentDay();

  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Layout - Split into two sections */}
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Section - White Background with Text */}
          <div className="lg:w-1/3">
            <div className="space-y-6">
              {/* Title */}
              <h2 className="text-4xl lg:text-6xl font-bold text-red-600 leading-tight">
                Moez Binz Deal<br />
                <span className="">Hunting Days</span>
              </h2>
              
              {/* Text Content */}
              <div className="space-y-4 text-gray-800">
                <p className="text-md leading-relaxed">
                  Every item in our bins - big or small, high-value or basic - has the same flat price each day.
                </p>
                <p className="text-md leading-relaxed">
                  We stock fresh bins every Saturday: $19.99 per item on stock day, down to a jaw-dropping $1.99 on Fridays.
                </p>
                <p className="text-md leading-relaxed">
                  Our unique model ensures inventory moves fast and great deals are just waiting to be discovered.
                </p>
              </div>
            </div>
          </div>

          {/* Right Section - Red Background with Deals */}
          <div className="lg:w-2/3">
            <div >
              {/* Smashing Saturday Banner */}
              <div 
                className={`relative h-46 mb-6 cursor-pointer  ${
                  currentDay === 'Saturday' ? 'ring-4 ring-yellow-400 ring-opacity-75  shadow-2xl' : ''
                }`}
                style={{ perspective: '1000px' }}
              >
                {/* Card Container with 3D Flip Effect */}
                <div 
                  className="relative w-full h-full transition-transform duration-700 ease-in-out"
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
                    className="absolute inset-0 w-full h-full bg-red-600 text-white p-6 flex flex-col justify-center items-center text-center shadow-lg"
                    style={{ backfaceVisibility: 'hidden' }}
                  >
                    <h3 className="text-2xl lg:text-5xl font-bold text-white uppercase mb-2">
                      SMASHING SATURDAYS
                    </h3>
                    <div className="text-6xl lg:text-7xl font-bold text-yellow-300 mb-2">
                      $19.99
                    </div>
                    <p className="text-white text-lg">per item</p>
                  </div>
                  
                  {/* Back Side - Description Card */}
                  <div 
                    className="absolute inset-0 w-full h-full bg-white text-gray-800 p-6 flex flex-col justify-center items-center text-center shadow-lg border-2 border-red-200"
                    style={{ 
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)'
                    }}
                  >
                    <div className="text-5xl lg:text-6xl mb-4">🛒💥</div>
                    <p className="font-semibold text-xl lg:text-2xl leading-tight text-center">
                      Fresh finds, big-ticket items
                    </p>
                  </div>
                </div>
                
                {/* Today indicator */}
                {currentDay === 'Saturday' && (
                  <div className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded-full shadow-lg animate-pulse">
                    TODAY
                  </div>
                )}
              </div>

              {/* Daily Deals Grid */}
              <div className="grid grid-cols-3 gap-4">
                {deals.map((deal) => {
                  const isToday = deal.day.includes(currentDay.toUpperCase());
                  return (
                  <div 
                    key={deal.day} 
                    className={`relative h-40 cursor-pointer ${
                      isToday ? 'ring-4 ring-yellow-400 ring-opacity-75 shadow-2xl' : ''
                    }`}
                    style={{ perspective: '1000px' }}
                  >
                    {/* Card Container with 3D Flip Effect */}
                    <div 
                      className="relative w-full h-full transition-transform duration-700 ease-in-out"
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
                        className="absolute inset-0 w-full h-full bg-red-600 text-white p-8 flex flex-col justify-center items-center text-center shadow-lg"
                        style={{ backfaceVisibility: 'hidden' }}
                      >
                        <h4 className="text-xl lg:text-3xl font-bold text-white uppercase mb-2">
                          {deal.day}
                        </h4>
                        <div className="text-3xl lg:text-4xl font-bold text-yellow-300 mb-1">
                          {deal.price}
                        </div>
                        <p className="text-white text-sm">per item</p>
                      </div>
                      
                      {/* Back Side - Description Card */}
                      <div 
                        className="absolute inset-0 w-full h-full bg-white  text-gray-800 p-4 flex flex-col justify-center items-center text-center shadow-lg border-2 border-red-200"
                        style={{ 
                          backfaceVisibility: 'hidden',
                          transform: 'rotateY(180deg)'
                        }}
                      >
                        <div className="text-3xl lg:text-4xl mb-2">{deal.icon}</div>
                        <p className="font-semibold text-sm lg:text-base leading-tight text-center">{deal.description}</p>
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

            </div>
              {/* Special Product Section - Yellow Banner */}
              <div className="mt-6 bg-yellow-300 p-6 text-center">
                <h3 className="text-xl lg:text-2xl font-bold text-red-600 uppercase mb-2">
                  SPECIAL PRODUCT SECTION
                </h3>
                <p className="text-lg font-bold text-black">
                  Super $$$$$ high value items at $ fraction of the market price
                </p>
              </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DealHuntingDays;
