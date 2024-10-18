import React from 'react';
import { FiPhone } from 'react-icons/fi';

export default function RingingIcon(){
  return (
    <div className="flex items-center justify-center">
      <div className="relative">
        <FiPhone className="text-green-500 text-6xl animate-bounce" />
        <span className="absolute top-0 left-0 w-full h-full rounded-full bg-green-200 opacity-50 animate-ping"></span>
      </div>
    </div>
  );
};

