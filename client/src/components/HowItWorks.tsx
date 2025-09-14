import React, { useState, useEffect } from 'react';
import { ChevronDownIcon, MagnifyingGlassIcon, PriceTagIcon, ListBulletIcon, ShieldCheckIcon, ChevronRightIcon, CheckCircleIcon } from './Icons';

const InfoCard: React.FC<{ icon: React.ReactNode, title: string, children: React.ReactNode }> = ({ icon, title, children }) => (
    <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full">
        <div className="flex items-center text-red-600 mb-4">
            {icon}
            <h3 className="text-2xl font-bold text-gray-900 ml-3">{title}</h3>
        </div>
        {children}
    </div>
);

const FaqItem: React.FC<{ question: string, children: React.ReactNode }> = ({ question, children }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-gray-200 last:border-b-0 py-2">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center text-left text-lg font-semibold text-gray-800 hover:text-red-600 transition-colors p-4 rounded-md"
            >
                <span>{question}</span>
                <ChevronDownIcon className={`transform transition-transform duration-300 w-5 h-5 ${isOpen ? 'rotate-180 text-red-600' : 'text-gray-400'}`} />
            </button>
            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 mt-1' : 'max-h-0'}`}
            >
                <div className="text-gray-600 pr-8 pl-4 pb-4">
                    {children}
                </div>
            </div>
        </div>
    );
}

const HowItWorksPage: React.FC = () => {
    
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in-up');
                }
            });
        }, { threshold: 0.1 });

        const elements = document.querySelectorAll('.fade-on-scroll');
        elements.forEach(el => observer.observe(el));

        return () => elements.forEach(el => observer.unobserve(el));
    }, []);

    const dailyPrices = [
        { day: 'Smashing Saturday', price: '$19.99' },
        { day: 'Smart Sunday', price: '$15.00' },
        { day: 'Mega Monday', price: '$11.99' },
        { day: 'Thrifty Tuesday', price: '$8.99' },
        { day: 'Wow Wednesday', price: '$6.99' },
        { day: 'Treasure Thursday', price: '$4.99' },
        { day: 'Freak-out Friday', price: '$1.99' },
    ];

    return (
        <main id="how-it-works" className="bg-gradient-to-br from-white to-gray-100">
            <style>{`.fade-on-scroll { opacity: 0; transform: translateY(20px); }`}</style>
            <section className="py-16 sm:py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight fade-on-scroll">
                            What is the Store Concept All About?
                        </h1>
                        <p className="mt-4 text-md font-semibold text-red-600 tracking-widest uppercase fade-on-scroll" style={{ animationDelay: '150ms' }}>How It Works</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="fade-on-scroll" style={{ animationDelay: '300ms' }}>
                           <InfoCard icon={<MagnifyingGlassIcon />} title="Dig, Discover, Save!">
                                <p className="text-gray-600">
                                    We stock fresh bins every Saturday: $19.99 per item on stock day, down to $1.99 on Friday. No matter the size or original value, every item is up for grabs. It’s cash-and-carry, no returns, no fuss — just real, accessible deals.
                                </p>
                            </InfoCard>
                        </div>
                        <div className="fade-on-scroll" style={{ animationDelay: '450ms' }}>
                            <InfoCard icon={<PriceTagIcon />} title="The Daily Pricing Model">
                                <ul className="space-y-3 text-gray-600">
                                    {dailyPrices.map(item => (
                                        <li key={item.day} className="flex justify-between items-center">
                                            <span className="flex items-center">
                                                <ChevronRightIcon className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" />
                                                {item.day}:
                                            </span>
                                            <span className="font-bold text-gray-800">{item.price}</span>
                                        </li>
                                    ))}
                                </ul>
                            </InfoCard>
                        </div>
                         <div className="fade-on-scroll" style={{ animationDelay: '600ms' }}>
                            <InfoCard icon={<ListBulletIcon />} title="Store Rules & Guidelines">
                                 <ul className="space-y-3 text-gray-600">
                                    {[
                                        'All sales are final. No returns or exchanges.',
                                        'Respect staff and fellow shoppers at all times.',
                                        'Large bags/backpacks are not permitted inside.',
                                        'No opening sealed product boxes.'
                                    ].map(rule => (
                                        <li key={rule} className="flex items-start">
                                            <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
                                            <span>{rule}</span>
                                        </li>
                                    ))}
                                </ul>
                            </InfoCard>
                        </div>
                         <div className="fade-on-scroll" style={{ animationDelay: '750ms' }}>
                            <InfoCard icon={<ShieldCheckIcon />} title="Safety & Conduct">
                                <ul className="space-y-3 text-gray-600">
                                    {[
                                        'No running or rough play in the store.',
                                        'Children must be supervised by an adult.',
                                        'Be mindful of your surroundings and other shoppers.'
                                    ].map(rule => (
                                        <li key={rule} className="flex items-start">
                                            <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
                                            <span>{rule}</span>
                                        </li>
                                    ))}
                                </ul>
                            </InfoCard>
                        </div>
                    </div>

                    <div className="mt-16 sm:mt-24 bg-white p-6 sm:p-10 rounded-2xl shadow-lg border border-gray-100 fade-on-scroll" style={{ animationDelay: '900ms' }}>
                        <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">Frequently Asked Questions</h2>
                        <FaqItem question="Are products new or used?">
                            <p>Most of our items are customer returns or overstock from major online retailers like Amazon. This means you’ll find a mix of new, like-new, and open-box items. It's all part of the treasure hunt!</p>
                        </FaqItem>
                         <FaqItem question="What kind of items can I find?">
                            <p>Anything and everything! Our bins are filled with electronics, home goods, kitchenware, toys, clothing, tools, and so much more. The inventory is completely different every single week.</p>
                        </FaqItem>
                         <FaqItem question="Do you accept credit cards?">
                            <p>Yes, we accept all major credit cards, debit cards, and cash.</p>
                        </FaqItem>
                         <FaqItem question="Can I test electronics before buying?">
                            <p>Unfortunately, due to the nature of our business, we cannot offer a testing station. All items are sold as-is. This model allows us to keep prices incredibly low for everyone.</p>
                        </FaqItem>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default HowItWorksPage;