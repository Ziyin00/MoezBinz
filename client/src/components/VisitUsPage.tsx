import React from 'react';

const VisitUsPage: React.FC = () => {
    return (
        <main className="bg-white">
            {/* Hero Section */}
               

            <div className="bg-gray-50 py-16 sm:py-24">
                 <div className="relative h-full flex mb-10 flex-col justify-center items-center text-center px-4 z-10">
                    <h1 className="text-4xl text-red-600 sm:text-5xl font-bold tracking-tight animate-fade-in-up">
                        Plan Your Visit to Moez Binz
                    </h1>
                      <p className="mt-4 text-lg text-gray-700 sm:text-xl max-w-3xl animate-fade-in-up animation-delay-200">
                        Come experience the thrill of treasure hunting at our North York location. Find amazing deals on quality items every day.
                    </p>

                   
                </div>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
                    {/* Location & Hours Card */}
                    <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 opacity-0 animate-fade-in-up animation-delay-200">
                        <h2 className="text-3xl font-bold text-red-600 mb-6">Location & Hours</h2>
                        <div className="space-y-4 text-gray-700">
                            <div>
                                <h3 className="font-bold text-gray-800">Address:</h3>
                                <p>5 - 1150 Sheppard Avenue West, North York, ON M3K 2B5, Canada</p>
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800">Open 7 days a week:</h3>
                                <ul className="mt-1 space-y-1 pl-2">
                                    <li><span className="font-semibold w-24 inline-block">Mon–Wed:</span> 10am–7pm</li>
                                    <li><span className="font-semibold w-24 inline-block">Thu:</span> 10am–8pm</li>
                                    <li><span className="font-semibold w-24 inline-block">Fri:</span> 10am–4pm</li>
                                    <li><span className="font-semibold w-24 inline-block">Sat–Sun:</span> 10am–7pm</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800">Parking:</h3>
                                <p>Free parking available in front and behind store</p>
                            </div>
                        </div>
                    </div>

                    {/* Map Card */}
                    <div className="bg-white p-4 rounded-2xl  shadow-lg border border-gray-100 opacity-0 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
                        <div className="relative h-[350px] rounded-lg overflow-hidden">
                             <iframe
                                src="https://maps.google.com/maps?q=1150%20Sheppard%20Avenue%20West%20North%20York%20ON%20M3K%202B5%20Canada&t=&z=15&ie=UTF8&iwloc=&output=embed"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen={true}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="w-full h-full"
                                title="Location of Moez Binz - 5 - 1150 Sheppard Avenue West, North York, ON M3K 2B5"
                            ></iframe>
                        </div>
                    </div>
                </div>
                </div>
            </div>
        </main>
    );
};

export default VisitUsPage;
