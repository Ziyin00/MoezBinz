import React from 'react';

const VisitUsPage: React.FC = () => {
    return (
        <main className="bg-white">
            <section className="relative h-[50vh] bg-black">
                <img 
                    src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                    alt="Store interior and shopping experience"
                    className="absolute inset-0 w-full h-full object-cover opacity-40"
                />
                <div className="absolute inset-0 bg-black opacity-30"></div>
                <div className="relative h-full flex flex-col justify-center items-center text-center text-white px-4 z-10">
                    <h1 className="text-4xl sm:text-6xl font-bold tracking-tight animate-fade-in-up">
                        Visit Our Store
                    </h1>
                    <p className="mt-4 text-lg sm:text-xl max-w-3xl animate-fade-in-up animation-delay-200">
                        Come experience the thrill of treasure hunting at our North York location. Find amazing deals on quality items every day.
                    </p>
                </div>
            </section>
            
            <section className="py-16 sm:py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-start">
                        {/* Left Column: Info */}
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">
                                Moez Binz - Your Treasure Awaits
                            </h2>
                            <div className="space-y-6 text-lg text-gray-700">
                                <div>
                                    <h3 className="font-semibold text-gray-900">Address</h3>
                                    <p>5 - 1150 Sheppard Avenue West<br/>North York, ON M3K 2B5</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">Store Hours</h3>
                                    <ul className="list-disc list-inside mt-2">
                                        <li><strong>Saturday:</strong> 9 AM - 8 PM (Restock Day!)</li>
                                        <li><strong>Sunday:</strong> 10 AM - 6 PM</li>
                                        <li><strong>Monday - Thursday:</strong> 10 AM - 7 PM</li>
                                        <li><strong>Friday:</strong> 10 AM - 9 PM (Last Chance!)</li>
                                        <li><strong>Closed:</strong> For restocking on select days. Check social media for updates!</li>
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">Contact Us</h3>
                                    <p>Email: <a href="mailto:Thebinzstore23@gmail.com" className="text-red-600 hover:underline">Thebinzstore23@gmail.com</a></p>
                                    <p>Follow us: @Moezbinzstore</p>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Map */}
                         <div className="bg-white p-4 rounded-2xl  shadow-lg border border-gray-100 opacity-0 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
                        <div className="relative h-[450px] rounded-lg overflow-hidden">
                             <iframe
                                src="https://maps.google.com/maps?width=100%25&amp;height=450&amp;hl=en&amp;q=1150%20Sheppard%20Avenue%20West,%20North%20York,%20ON%20M3K%202B5+(Moez%20Binz%20Store)&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
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
            </section>
        </main>
    );
};

export default VisitUsPage;
