import React from 'react';
import ForgotPasswordForm from '../components/ForgotPasswordForm';

const ForgotPasswordPage: React.FC = () => {
  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
      <div className="grid md:grid-cols-2 gap-16 items-center">
        <div className="text-center md:text-left opacity-0 animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
                Forgot your password?
            </h1>
            <p className="mt-4 text-lg text-gray-600">
                Enter the email linked to your account and we’ll send a reset link.
            </p>
        </div>
        <div className="opacity-0 animate-fade-in-up animation-delay-200">
          <ForgotPasswordForm />
        </div>
      </div>
    </main>
  );
};

export default ForgotPasswordPage;