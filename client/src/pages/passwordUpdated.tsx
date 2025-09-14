import React from 'react';
import PasswordUpdatedConfirmation from '../components/PasswordUpdatedConfirmation';

const PasswordUpdatedPage: React.FC = () => {
  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24 flex items-center justify-center">
      <div className="w-full max-w-lg opacity-0 animate-fade-in-up">
        <PasswordUpdatedConfirmation />
      </div>
    </main>
  );
};

export default PasswordUpdatedPage;
