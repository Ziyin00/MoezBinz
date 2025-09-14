import React from 'react';
import Hero from '../components/Hero';
import Header from '../components/Navbar';
import DealHuntingDays from '../components/DealHuntingDays';
import TreasuredFinds from '../components/TreasuredFinds';
import LatestPosts from '../components/LatestPosts';
import CustomerStories from '../components/CustomerStories';
import SubmitFind from '../components/SubmitFind';
import BargainHuntBanner from '../components/BargainHuntBanner';
import AboutPage from '../components/AboutPage';
import HowItWorksPage from '../components/HowItWorks';
import ProductsPage from '../components/ProductsPage';
import VisitUsPage from '../components/VisitUsPage';

const HomePage: React.FC = () => {
    return (
        <main>
            <Header/>
            <Hero />
            <DealHuntingDays />
            <TreasuredFinds />
            <LatestPosts />
            <CustomerStories />
            <SubmitFind />
            <BargainHuntBanner />
            <AboutPage />
            <HowItWorksPage />
            <ProductsPage />
            <VisitUsPage/>
        </main>
    );
};

export default HomePage;