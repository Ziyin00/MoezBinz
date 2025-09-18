import React from 'react';

const VisitUsPage: React.FC = () => {
    return (
        <main className="bg-white">
            <section className="relative h-[40vh] md:h-[50vh] bg-gray-900">
                <img 
                    src="https://images.unsplash.com/photo-1563461661138-167853909778?q=80&w=2070&auto=format&fit=crop" 
                    alt="Interior of a store"
                    className="w-full h-full object-cover opacity-50"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                    <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight text-center">
                        Visit Our Store
                    </h1>
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
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2882.251412574241!2d-79.4883592237893!3d43.74601454645053!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882b3174243a75a5%3A0x869a88e1e78a221d!2s1150%20Sheppard%20Ave%20W%2C%20North%20York%2C%20ON%20M3K%202B5%2C%20Canada!5e0!3m2!1sen!2sus!4v1716491795325!5m2!1sen!2sus"
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
