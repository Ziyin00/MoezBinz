import React from 'react';

const VisitUsPage: React.FC = () => {
    return (
        <main className="bg-gray-50 py-16 sm:py-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16 opacity-0 animate-fade-in-up">
                    <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight">
                        Plan Your Visit to Moez Binz
                    </h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
                    {/* Location & Hours Card */}
                    <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 opacity-0 animate-fade-in-up animation-delay-200">
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">Location & Hours</h2>
                        <div className="space-y-4 text-gray-700">
                            <div>
                                <h3 className="font-bold text-gray-800">Address:</h3>
                                <p>1100 Sheppard Ave W, Unit 5 & 6, North York, ON M3K 2B5, Canada</p>
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
                        <div className=" h-[450px]  rounded-lg overflow-hidden">
                             <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2882.251412574241!2d-79.4883592237893!3d43.74601454645053!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882b3174243a75a5%3A0x869a88e1e78a221d!2s1100%20Sheppard%20Ave%20W%20%235%2C%20North%20York%2C%20ON%20M3K%202B5%2C%20Canada!5e0!3m2!1sen!2sus!4v1716491795325!5m2!1sen!2sus"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen={true}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="w-full h-full filter grayscale(1) invert(0.9) hue-rotate(180deg)"
                                title="Location of Moez Binz"
                            ></iframe>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default VisitUsPage;
