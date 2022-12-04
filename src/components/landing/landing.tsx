import React from 'react';

const Landing: React.FC = () => {
  return (
    <div className="flex h-full w-full justify-center items-center uppercase text-7xl relative">
      dolor sit amet
      <div className="absolute right-16 top-1/2 flex flex-col justify-center items-center gap-2 animate-pulse">
        <img src="/icons/icon_right.svg" alt="scroll right" className="w-16" />
        <span className="text-2xl font-bold">SCROLL</span>
      </div>
    </div>
  );
};

export default Landing;
