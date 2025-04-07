
import React from 'react';

const Logo = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded flex justify-center items-center">
        <div className="w-4 h-4 bg-white rounded-sm transform rotate-45"></div>
      </div>
      <span className="font-bold text-xl">IT Log Book Application</span>
    </div>
  );
};

export default Logo;
