import React from 'react';
import LoginForm from '../components/LoginForm';
import Logo from '../components/Logo';

const LoginPage: React.FC = () => {
    return (
      
        <div className="bg-white min-h-screen font-sans">
      <header className="border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Logo />
        </div>
      </header>
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
       
      <div className="grid md:grid-cols-2 gap-16 items-center">
        <div className="text-center md:text-left opacity-0 animate-fade-in-up">
            <a href="/" className="text-sm text-gray-600 hover:text-gray-900 inline-flex items-center mb-6">
                &larr; <span className="ml-2">Back to Store</span>
            </a>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
                Log in
            </h1>
            <p className="mt-4 text-lg text-gray-600">
                Welcome back! Enter your details to continue the treasure hunt.
            </p>
        </div>
        <div className="opacity-0 animate-fade-in-up animation-delay-200">
          <LoginForm />
        </div>
      </div>
            </main>
        </div>
            
  );
};

export default LoginPage;
