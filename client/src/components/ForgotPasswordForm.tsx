import React, { useState } from 'react';
import InputField from './InputField';
import { MailIcon } from './Icons';
import { passwordResetService } from '../services/passwordResetService';

const ForgotPasswordForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const isFormValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isFormValid) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      await passwordResetService.forgotPassword({ email });
      setIsSubmitted(true);
    } catch (error: any) {
      console.error('Error sending password reset:', error);
      setError(error.response?.data?.message || 'Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
        <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-lg border border-gray-100 w-full max-w-lg mx-auto text-center animate-fade-in-up">
             <MailIcon />
             <h2 className="text-2xl font-bold text-gray-900 mb-2">Check your email</h2>
             <p className="text-gray-600 mb-6">We've sent a password reset link to <br/><span className="font-semibold text-gray-800">{email}</span>.</p>
             <a href="/login" className="font-medium text-sm text-red-600 hover:text-red-500">
                &larr; Back to Log in
             </a>
        </div>
    );
  }

  return (
    <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-lg border border-gray-100 w-full max-w-lg mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Reset password</h2>
      <form onSubmit={handleSubmit} noValidate>
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <div className="space-y-5">
          <InputField
            id="email"
            name="email"
            label="Email"
            type="email"
            placeholder="test@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoFocus={true}
          />
        </div>

        <div className="mt-6">
          <button
            type="submit"
            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-red-400 disabled:cursor-not-allowed transition-all"
            disabled={!isFormValid || isLoading}
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              'Send reset link'
            )}
          </button>
        </div>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Remembered it?{' '}
        <a href="/login" className="font-medium text-red-600 hover:text-red-500">
          Back to log in
        </a>
      </p>
    </div>
  );
};

export default ForgotPasswordForm;