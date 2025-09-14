import React from 'react';

const PasswordUpdatedConfirmation: React.FC = () => {
  return (
    <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-lg border border-gray-100 w-full max-w-lg mx-auto text-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Password updated</h2>
      <p className="text-gray-600 mb-6">Your password has been changed successfully.</p>
      
      <a
        href="/login"
        className="w-full inline-block text-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#BB2C22] hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all"
      >
        Log in
      </a>

      <p className="mt-8 text-sm text-gray-600">
        Having trouble?{' '}
        <a href="#" className="font-medium text-[#BB2C22] hover:text-red-500">
          Contact support
        </a>
      </p>
    </div>
  );
};

export default PasswordUpdatedConfirmation;
