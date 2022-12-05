import React from 'react';

interface LandingProps {
  listRef: React.RefObject<HTMLDivElement>;
}
const Landing: React.FC<LandingProps> = ({ listRef }) => {
  return (
    <div className="flex h-full w-full justify-center items-center uppercase relative select-none">
      <header>
        <div className="absolute top-10 left-10 button-neon-slow">
          <a
            href="https://www.epita.fr/diplome-ingenieur/cycle-ingenieur/les-majeures/"
            target="_blank"
            rel="noreferrer">
            <img src="/images/mti.svg" className="w-24" alt="Epita MTI 2023" />
          </a>
        </div>
      </header>
      <div className="uppercase flex flex-col font-bold justify-center items-center">
        <span className="text-base subtext-neon z-10">Welcome to</span>
        <h1 className="text-7xl">
          <span className="text-neon">coruscent</span>
          <span className="text-3xl subtext-neon">in</span>
          <span className="text-neon-delay">Tenebris</span>
        </h1>
        <span className="text-xl subtext-neon">Black Market</span>
      </div>
      <button
        onClick={() => {
          listRef.current?.scrollTo({ left: window.innerWidth, behavior: 'smooth' });
        }}
        className="absolute right-16 top-1/2 transform -translate-y-1/2 flex flex-col justify-center items-center gap-2 button-neon-fast">
        <img src="/icons/icon_right.svg" alt="scroll right" className="w-16" />
        <span className="uppercase text-2xl font-bold">Scroll</span>
      </button>
      <footer>
        <a
          className="absolute left-10 bottom-10 flex flex-col gap-2"
          href="https://github.com/TonyHg/threejs-shop"
          target="_blank"
          rel="noreferrer">
          <div className="flex gap-2 justify-start items-center text-xs">
            <img src="/icons/github.svg" alt="github" className="w-4 button-neon-default" />
            <h2 className="text-xs font-bold text-neon">GitHub</h2>
          </div>
          <img src="/images/authors.png" alt="Authors: Tony Heng, Melchior Lozé" className="w-24" />
        </a>
      </footer>
      <div className="absolute right-0 h-full border-4 border-transparent button-neon-slow z-50"></div>
    </div>
  );
};

export default Landing;
