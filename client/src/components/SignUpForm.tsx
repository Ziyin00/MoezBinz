import React, { useState, useEffect, useMemo, type FormEvent } from 'react';

import useUIStore from '../store/zustandStore';
import InputField from './InputField';
import PasswordStrengthIndicator from './PasswordStrengthIndicator';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { clearError, signupUser } from '../store/authSlice';

const EyeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
);

const EyeOffIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" /><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" /><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" /><line x1="2" x2="22" y1="2" y2="22" /></svg>
);

const CheckCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
);

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface ValidationState {
  minLength: boolean;
  hasUpperAndLower: boolean;
  hasNumber: boolean;
}

const SignUpForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const setGlobalLoading = useUIStore(state => state.setGlobalLoading);
  const { isLoading, error } = useAppSelector((s) => s.auth);
  
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [validation, setValidation] = useState<ValidationState>({
    minLength: false,
    hasUpperAndLower: false,
    hasNumber: false,
  });

  useEffect(() => {
    const { password, confirmPassword } = formData;
    setValidation({
      minLength: password.length >= 8,
      hasUpperAndLower: /[A-Z]/.test(password) && /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
    });

    if (password && confirmPassword && password !== confirmPassword) {
      setPasswordError('Passwords do not match');
    } else {
      setPasswordError(null);
    }
  }, [formData.password, formData.confirmPassword]);

  const passwordStrength = useMemo(() => {
    if (!formData.password) return 0;
    const score = Object.values(validation).filter(Boolean).length;
    if (score === 1) return 25;
    if (score === 2) return 66;
    if (score === 3) return 100;
    return 10;
  }, [formData.password, validation]);

  const isFormValid = useMemo(() => {
    return (
      formData.firstName.trim() !== '' &&
      formData.lastName.trim() !== '' &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
      Object.values(validation).every(Boolean) &&
      formData.password === formData.confirmPassword &&
      agreedToTerms
    );
  }, [formData, validation, agreedToTerms]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isFormValid) return;

    try {
      setGlobalLoading(true);
      await dispatch(signupUser({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      })).unwrap();
      window.location.href = '/';
    } catch (err) {
      // handled via slice error
      console.error('Signup failed', err);
    } finally {
      setGlobalLoading(false);
    }
  };

  const handleClearError = () => dispatch(clearError());

  const PasswordCriteria: React.FC<{criteria: ValidationState}> = ({criteria}) => (
    <ul className="text-xs text-gray-500 mt-3 space-y-1.5 pl-1">
      <li className={`flex items-center transition-colors ${criteria.minLength ? 'text-green-600' : 'text-gray-500'}`}>
        <CheckCircleIcon className="mr-2" /> Use 8 or more characters
      </li>
      <li className={`flex items-center transition-colors ${criteria.hasUpperAndLower ? 'text-green-600' : 'text-gray-500'}`}>
        <CheckCircleIcon className="mr-2" /> Mix of uppercase & lowercase letters
      </li>
      <li className={`flex items-center transition-colors ${criteria.hasNumber ? 'text-green-600' : 'text-gray-500'}`}>
        <CheckCircleIcon className="mr-2" /> At least one number
      </li>
    </ul>
  );

  return (
    <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-lg border border-gray-100 w-full max-w-lg mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Sign up</h2>
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <InputField
            id="firstName"
            name="firstName"
            label="First name"
            type="text"
            placeholder="Alex"
            value={formData.firstName}
            onChange={handleChange}
            autoFocus
          />
          <InputField
            id="lastName"
            name="lastName"
            label="Last name"
            type="text"
            placeholder="Hernandez"
            value={formData.lastName}
            onChange={handleChange}
          />
        </div>
        <InputField
          id="email"
          name="email"
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={formData.email}
          onChange={handleChange}
        />
        <div>
          <InputField
            id="password"
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Create a strong password"
            value={formData.password}
            onChange={handleChange}
            icon={showPassword ? <EyeOffIcon /> : <EyeIcon />}
            onIconClick={() => setShowPassword(!showPassword)}
          />
          <PasswordStrengthIndicator strengthPercentage={passwordStrength} />
          <PasswordCriteria criteria={validation} />
        </div>
        <InputField
          id="confirmPassword"
          name="confirmPassword"
          label="Confirm password"
          type={showConfirmPassword ? 'text' : 'password'}
          placeholder="Repeat your password"
          value={formData.confirmPassword}
          onChange={handleChange}
          icon={showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
          onIconClick={() => setShowConfirmPassword(!showConfirmPassword)}
        />

        <div className="mt-6 flex items-center">
          <input
            id="terms"
            name="terms"
            type="checkbox"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
          />
          <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
            I agree to the Terms and Privacy Policy
          </label>
        </div>

        {(passwordError || error) && (
          <div className="mt-4 border border-red-300 bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm transition-all animate-fade-in-up">
            {passwordError || error}
            {error && (
              <button onClick={handleClearError} className="ml-2 text-red-500 hover:text-red-700">×</button>
            )}
          </div>
        )}

        <div className="mt-6">
          <button
            type="submit"
            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#BB2C22] hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-red-400 disabled:cursor-not-allowed transition-all"
            disabled={!isFormValid || isLoading}
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : 'Create account'}
          </button>
        </div>
      </form>

      <p className="mt-8 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <a href="/login" className="font-medium text-red-600 hover:text-red-500">Log in</a>
      </p>
    </div>
  );
};

export default SignUpForm;
