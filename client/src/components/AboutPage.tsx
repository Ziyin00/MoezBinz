import React, { useEffect } from 'react';
// import { UsersIcon, SparklesIcon, TagIcon } from './Icons';
// import BargainHuntBanner from './BargainHuntBanner';

const AboutPage: React.FC = () => {
    
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up-visible');
                }
            });
        }, { threshold: 0.1 });

        const elements = document.querySelectorAll('.fade-in-up-on-scroll');
        elements.forEach(el => observer.observe(el));

        return () => elements.forEach(el => observer.unobserve(el));
    }, []);

    return (
        <main id="about" className="bg-white">
            {/* Hero Section */}
            <style>{`
                .fade-in-up-on-scroll {
                    opacity: 0;
                    transform: translateY(30px);
                    transition: opacity 0.6s ease-out, transform 0.6s ease-out;
                }
                .fade-in-up-visible {
                    opacity: 1;
                    transform: translateY(0);
                }
            `}</style>
            <section className="relative h-[50vh] bg-black">
                <img 
                    src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                    alt="A diverse group of people shopping"
                    className="absolute inset-0 w-full h-full object-cover opacity-40"
                />
                <div className="relative h-full flex flex-col justify-center items-center text-center text-white px-4">
                    <h1 className="text-4xl sm:text-6xl font-bold tracking-tight animate-fade-in-up">
                        About Moez Binz
                    </h1>
                    <p className="mt-4 text-lg sm:text-xl max-w-3xl animate-fade-in-up animation-delay-200">
                        Every visit is a new adventure in savings. We’re a community-driven liquidation store where everyone can discover quality goods at prices that make life easier—and a lot more fun.
                    </p>
                </div>
            </section>

            {/* Story Section */}
            <section className="py-16 sm:py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center fade-in-up-on-scroll">
                        <div className="order-2 md:order-1">
                            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">Dig, Discover, Save!</h2>
                            <p className="mt-4 text-lg text-gray-600">
                                Founded with one clear goal — to help people live smarter and better — Moez Binz is here to stretch every dollar. Our unique bins-store model brings an ever-changing selection of home goods, fashion, gadgets, and more at a fraction of regular retail prices.
                            </p>
                        </div>
                        <div className="order-1 md:order-2 group overflow-hidden rounded-2xl">
                             <img 
                                src="https://images.unsplash.com/photo-1556742111-a301076d9d18?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                                alt="A person finding a treasure in a bin"
                                className="w-full h-full object-cover rounded-2xl shadow-xl transition-transform duration-500 group-hover:scale-105"
                            />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center mt-16 sm:mt-24 fade-in-up-on-scroll">
                        <div className="group overflow-hidden rounded-2xl">
                             <img 
                                src="https://images.unsplash.com/photo-1556742111-a301076d9d18?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                                alt="Friendly store staff helping a customer"
                                className="w-full h-full object-cover rounded-2xl shadow-xl transition-transform duration-500 group-hover:scale-105"
                            />
                        </div>
                        <div>
                            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">More Than a Discount Store</h2>
                            <p className="mt-4 text-lg text-gray-600">
                                Our friendly team knows regulars by name, welcomes newcomers with warm smiles, and celebrates the diversity of our community. Whether furnishing a new home, shopping for campus life, or just looking for life’s little surprises, customers feel right at home here.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* Commitment Section */}
            {/* <section className="bg-gray-50 py-16 sm:py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight fade-in-up-on-scroll">Our Commitment</h2>
                    <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="p-8 fade-in-up-on-scroll">
                            <div className="bg-red-100 text-red-600 rounded-full p-4 inline-flex mb-4">
                                <UsersIcon />
                            </div>
                            <h3 className="text-xl font-bold">To Community</h3>
                            <p className="mt-2 text-gray-600">We believe everyone deserves comfort and possibility. We make quality goods affordable, build real relationships, and support our neighbourhood's diverse mix of cultures.</p>
                        </div>
                        <div className="p-8 fade-in-up-on-scroll" style={{transitionDelay: '150ms'}}>
                             <div className="bg-red-100 text-red-600 rounded-full p-4 inline-flex mb-4">
                                <TagIcon />
                            </div>
                            <h3 className="text-xl font-bold">To Value</h3>
                            <p className="mt-2 text-gray-600">Our unique pricing model ensures that the deals get better every single day. It's smart shopping, redefined. Discover the true meaning of getting more for less.</p>
                        </div>
                        <div className="p-8 fade-in-up-on-scroll sm:col-span-2 lg:col-span-1" style={{transitionDelay: '300ms'}}>
                             <div className="bg-red-100 text-red-600 rounded-full p-4 inline-flex mb-4">
                                <SparklesIcon />
                            </div>
                            <h3 className="text-xl font-bold">To the Thrill</h3>
                             <p className="mt-2 text-gray-600">Come see what’s new in the bins this week — there’s always a surprise waiting. The thrill of the find is what makes the Moez Binz family special.</p>
                        </div>
                    </div>
                </div>
            </section> */}
            
        </main>
    );
};

export default AboutPage;
