import React, { useState } from 'react';

// Placeholder for product data
const productCategories = [
    { name: 'Electronics', image: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?q=80&w=1964&auto=format&fit=crop', description: 'Gadgets, devices, and accessories.' },
    { name: 'Home Goods', image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?q=80&w=2070&auto=format&fit=crop', description: 'Everything you need for your home.' },
    { name: 'Apparel', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2071&auto=format&fit=crop', description: 'Clothing, shoes, and accessories.' },
    { name: 'Toys & Games', image: 'https://images.unsplash.com/photo-1566576912319-1d8754242412?q=80&w=2070&auto=format&fit=crop', description: 'Fun for all ages.' },
    { name: 'Tools & Hardware', image: 'https://images.unsplash.com/photo-1555120282-576a59124233?q=80&w=2070&auto=format&fit=crop', description: 'For your DIY projects.' },
    { name: 'Sporting Goods', image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=1935&auto=format&fit=crop', description: 'Get active with our gear.' },
];

const ProductsPage: React.FC = () => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    return (
        <main className="bg-white py-16 sm:py-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight">
                        Our Product Categories
                    </h1>
                    <p className="mt-4 text-lg text-gray-600">
                        While our inventory changes weekly, these are the types of treasures you can expect to find in our bins.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {productCategories.map((category) => (
                        <div key={category.name} className="group relative overflow-hidden rounded-2xl shadow-lg border border-gray-100 transform hover:-translate-y-2 transition-transform duration-300">
                            <img 
                                src={category.image} 
                                alt={category.name} 
                                className="h-64 w-full object-cover transition-transform duration-300 group-hover:scale-105 cursor-pointer" 
                                onClick={() => setSelectedImage(category.image)}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/10"></div>
                            <div className="absolute bottom-0 left-0 p-6">
                                <h2 className="text-2xl font-bold text-white">{category.name}</h2>
                                <p className="mt-1 text-gray-200">{category.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-16 text-center bg-gray-50 p-8 rounded-2xl border border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900">The Ultimate Treasure Hunt</h2>
                    <p className="mt-4 max-w-2xl mx-auto text-gray-600">
                        Remember, what you see here is just a glimpse! The only way to know what's in store is to visit us. Our bins are restocked with new and exciting items every single week. Happy hunting!
                    </p>
                </div>
            </div>

            {/* Image Modal */}
            {selectedImage && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
                    onClick={() => setSelectedImage(null)}
                >
                    <div className="relative max-w-4xl max-h-full">
                        <button
                            onClick={() => setSelectedImage(null)}
                            className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
                        >
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <img
                            src={selectedImage}
                            alt="Category"
                            className="max-w-full max-h-full object-contain rounded-lg"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                </div>
            )}
        </main>
    );
};

export default ProductsPage;
