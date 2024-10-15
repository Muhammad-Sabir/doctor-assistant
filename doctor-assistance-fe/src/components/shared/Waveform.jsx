import React from 'react';

export default function Waveform() {
  return (
    <div className="flex items-center justify-center space-x-1">
      {Array(5).fill().map((_, index) => (
        <span key={index} className={`w-1 bg-primary animate-wave h-5`} ></span>
      ))}
    </div>
  );
}
