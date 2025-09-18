// src/features/auth/LoginForm.tsx
import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import useUIStore from '../store/zustandStore';
import { EyeIcon, EyeOffIcon } from './Icons';
import InputField from './InputField';
import { clearError, loginUser } from '../store/authSlice';
import { useToast } from '../contexts/ToastContext';


const LoginForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const setGlobalLoading = useUIStore(state => state.setGlobalLoading);
  const { isLoading, error } = useAppSelector((s) => s.auth);
  const { error: showError } = useToast();
  

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

 const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setGlobalLoading(true);
      const result = await dispatch(loginUser({ email, password })).unwrap();
      console.log('Login successful:', result);
      window.location.href = '/';
    } catch (err) {
      console.error('Login failed:', err);
      const errorMessage = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || (err as Error)?.message || 'Unknown error';
      showError('Login failed', errorMessage);
    } finally {
      setGlobalLoading(false);
    }
  };

  const handleClearError = () => dispatch(clearError());

  return (
    <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-lg border border-gray-100 w-full max-w-lg mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Log in to your account</h2>
      <form onSubmit={handleSubmit} noValidate>
        <div className="space-y-5">
          <InputField
            id="email"
            name="email"
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoFocus={true}
          />
          <InputField
            id="password"
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="········"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={showPassword ? <EyeOffIcon /> : <EyeIcon />}
            onIconClick={() => setShowPassword(!showPassword)}
          />
        </div>
        
        <div className="flex items-center justify-between mt-6">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
              Remember me
            </label>
          </div>
          <div className="text-sm">
            <a href="/forgot-password" className="font-medium text-[#BB2C22] hover:text-red-500">
              Forget password?
            </a>
          </div>
        </div>

        {error && (
            <div className="mt-4 border border-red-300 bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm transition-all animate-fade-in-up">
                {error}
                <button 
                  onClick={handleClearError}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  ×
                </button>
            </div>
        )}

              
        <div className="mt-6">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center cursor-pointer items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#BB2C22] hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-red-400 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : 'Log in'}
          </button>
        </div>
      </form>
      
      <p className="mt-8 text-center text-sm text-gray-600">
        New to Moez Binz?{' '}
        <a href="/signup" className="font-medium text-red-600 hover:text-red-500">
          Create an account
        </a>
      </p>

      <p className="mt-6 text-center text-xs text-gray-500">
        By continuing, you agree to our Terms and Privacy Policy.
      </p>
    </div>
  );
};

export default LoginForm;
