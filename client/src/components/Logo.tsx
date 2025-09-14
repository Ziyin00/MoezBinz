
import React from 'react';

const Logo: React.FC = () => {
  return (
    <div className="flex items-center">
      <img src="/logo.jpg" alt="Moez Binz Logo" className="h-10 w-auto mr-3" />
      <div className="text-2xl font-bold tracking-wider">
        <span className="text-red-600">MOEZ</span>
        <span className="text-gray-900"> BINZ</span>
      </div>
    </div>
  );
};

export default Logo;
