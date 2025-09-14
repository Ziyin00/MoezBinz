import React from 'react';

interface PasswordStrengthIndicatorProps {
  strengthPercentage: number;
}

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ strengthPercentage }) => {
  const getStrengthInfo = () => {
    if (strengthPercentage === 0) return { color: 'bg-gray-200', textColor: 'text-gray-500', text: '' };
    if (strengthPercentage <= 10) return { color: 'bg-red-500', textColor: 'text-red-500', text: 'Weak' };
    if (strengthPercentage <= 25) return { color: 'bg-red-500', textColor: 'text-red-500', text: 'Weak' };
    if (strengthPercentage <= 65) return { color: 'bg-yellow-500', textColor: 'text-yellow-500', text: 'Medium' };
    if (strengthPercentage <= 99) return { color: 'bg-green-400', textColor: 'text-green-500', text: 'Good' };
    return { color: 'bg-green-500', textColor: 'text-green-600', text: 'Strong' };
  };

  const { color, textColor, text } = getStrengthInfo();

  return (
    <div className="flex items-center gap-3 mt-2">
      <div className="w-full bg-gray-200 rounded-full h-1.5 flex-grow">
        <div
          className={`h-1.5 rounded-full transition-all duration-300 ${color}`}
          style={{ width: `${strengthPercentage}%` }}
          role="progressbar"
          aria-valuenow={strengthPercentage}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Password strength: ${text}`}
        ></div>
      </div>
      <p className={`text-xs font-semibold w-14 text-right transition-colors ${textColor}`}>{text}</p>
    </div>
  );
};

export default PasswordStrengthIndicator;
