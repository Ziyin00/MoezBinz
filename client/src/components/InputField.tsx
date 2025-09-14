import React from 'react';

interface InputFieldProps {
  id: string;
  name: string;
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: React.ReactNode;
  onIconClick?: () => void;
  autoFocus?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({ id, name, label, type, placeholder, value, onChange, icon, onIconClick, autoFocus = false }) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
      </label>
      <div className="relative">
        <input
          type={type}
          id={id}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoFocus={autoFocus}
          className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-500 sm:text-sm pr-10 transition-all"
          aria-label={label}
        />
        {icon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <button
              type="button"
              onClick={onIconClick}
              className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-500 rounded-full p-1 transition-colors"
              aria-label={label.toLowerCase().includes('password') ? 'Toggle password visibility' : `Icon for ${label}`}
            >
              {icon}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InputField;
