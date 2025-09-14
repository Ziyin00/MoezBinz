
import React from 'react';
import SignUpForm from '../components/SignUpForm';
import Logo from '../components/Logo';


const SignUpPage: React.FC = () => {
  return (
    <div className="bg-white min-h-screen font-sans">
      <header className="border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Logo />
        </div>
      </header>
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="text-center md:text-left opacity-0 animate-fade-in-up animation-delay-200">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
              Create your account
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Join the hunt—set up your profile in a minute.
            </p>
          </div>
          <div className='opacity-0 animate-fade-in-up animation-delay-200'>
            <SignUpForm />
          </div>
        </div>
      </main>
    </div>
  );
};

export default SignUpPage;
