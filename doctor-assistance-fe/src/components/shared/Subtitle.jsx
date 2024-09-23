import React from 'react';

export default function Subtitle({ subtitle }) {
  return (
    <span className="py-1 px-4 bg-accent rounded-md text-xs font-medium text-primary text-center">
      {subtitle}
    </span>
  );
}