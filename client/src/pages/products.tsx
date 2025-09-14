// FIX: Replaced placeholder content with a functional ProductsPage component.
import React from 'react';
import ProductPage from '../components/ProductPage';
import ProductCategoryPage from '../components/ProducCategoryPage';
import Header from '../components/Navbar';

const Product: React.FC = () => {
    // Get category from URL hash (e.g., #/products/electronics)
    const hash = window.location.hash;
    const categoryMatch = hash.match(/#\/products\/(.+)/);
    const category = categoryMatch ? categoryMatch[1] : null;

    return (
        <>
            <Header/>
        {category ? (
            <ProductCategoryPage category={category} />
        ) : (
            <ProductPage />
        )}
        </>
    );
};

export default Product;
