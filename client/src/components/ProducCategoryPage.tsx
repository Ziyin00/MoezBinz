// FIX: Replaced invalid placeholder content with a valid React component to resolve syntax errors.
import React from 'react';

// Mock data for products
const allProducts: Record<string, { id: number; name: string; image: string; }[]> = {
    electronics: [
        { id: 1, name: 'Wireless Headphones', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop' },
        { id: 2, name: 'Smartwatch', image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=1964&auto=format&fit=crop' },
        { id: 3, name: 'Portable Speaker', image: 'https://images.unsplash.com/photo-1589996448606-2e69835f29c4?q=80&w=1955&auto=format&fit=crop' },
        { id: 4, name: 'Digital Camera', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1964&auto=format&fit=crop' },
    ],
    'home-goods': [
        { id: 5, name: 'Espresso Machine', image: 'https://images.unsplash.com/photo-1565452344049-a2c273972922?q=80&w=1887&auto=format&fit=crop' },
        { id: 6, name: 'Air Fryer', image: 'https://images.unsplash.com/photo-1605298815833-254425a5d134?q=80&w=1887&auto=format&fit=crop' },
        { id: 7, name: 'Decorative Vase', image: 'https://images.unsplash.com/photo-1578916244247-7a54b3879d74?q=80&w=1887&auto=format&fit=crop' },
    ],
    apparel: [
        { id: 8, name: 'Designer Handbag', image: 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=1887&auto=format&fit=crop' },
        { id: 9, name: 'Running Shoes', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop' },
        { id: 10, name: 'Leather Jacket', image: 'https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?q=80&w=1887&auto=format&fit=crop' },
        { id: 11, name: 'Denim Jeans', image: 'https://images.unsplash.com/photo-1602293589914-9e19577a756b?q=80&w=1887&auto=format&fit=crop' },
        { id: 12, name: 'Winter Coat', image: 'https://images.unsplash.com/photo-1515734674582-290e5273595e?q=80&w=1887&auto=format&fit=crop' },
    ],
    'toys-games': [],
    'sporting-goods': [],
    'books-media': [],
};

interface ProductCategoryPageProps {
  category: string;
}

const ProductCategoryPage: React.FC<ProductCategoryPageProps> = ({ category }) => {
    const products = allProducts[category] || [];
    const categoryName = category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    return (
        <div className="bg-white py-16 sm:py-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-left mb-16">
                    <a href="#/products" className="text-sm text-gray-600 hover:text-gray-900 inline-flex items-center mb-6">
                        &larr; <span className="ml-2">Back to Categories</span>
                    </a>
                    <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight">
                        {categoryName}
                    </h1>
                    <p className="mt-4 text-xl text-gray-600">
                        Some of the amazing finds in our {categoryName.toLowerCase()} bins.
                    </p>
                </div>
                {products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {products.map((product) => (
                            <div key={product.id} className="group block rounded-2xl overflow-hidden shadow-lg border border-gray-100">
                                <div className="relative">
                                    <img 
                                        src={product.image} 
                                        alt={product.name} 
                                        className="w-full h-64 object-cover"
                                    />
                                </div>
                                <div className="p-4 bg-white">
                                    <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
                                    <p className="text-sm text-gray-500 mt-1">Found on a lucky day!</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                         <h2 className="text-2xl font-bold text-gray-800">No finds to show for this category yet!</h2>
                         <p className="mt-2 text-gray-600">Check back next week for new treasures.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductCategoryPage;