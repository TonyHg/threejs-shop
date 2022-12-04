import React from 'react';

interface LandingProps {
  listRef: React.RefObject<HTMLDivElement>;
}
const Landing: React.FC<LandingProps> = ({ listRef }) => {
  return (
    <div className="flex h-full w-full justify-center items-center uppercase text-7xl relative select-none">
      <div className="uppercase flex flex-col font-bold justify-center items-center">
        <span className="text-base">Welcome to the</span>
        <h1>
          <span className="text-neon">Black</span> <span className="text-neon-delay">Market</span>
        </h1>
      </div>
      <button
        onClick={() => {
          listRef.current?.scrollTo({ left: window.innerWidth, behavior: 'smooth' });
        }}
        className="absolute right-16 top-1/2 flex flex-col justify-center items-center gap-2 animate-pulse">
        <img src="/icons/icon_right.svg" alt="scroll right" className="w-16" />
        <span className="uppercase text-2xl font-bold">Scroll</span>
      </button>
    </div>
  );
};

export default Landing;
