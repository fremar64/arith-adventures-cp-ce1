
import React from 'react';

const Header = () => {
  return (
    <header className="bg-nightBlue text-white p-3 flex justify-between items-center w-full">
      <img src="/images/ceredis.png" alt="Logo CEREDIS" className="h-12" />
      <h1 className="text-center text-xl md:text-2xl lg:text-3xl font-bold flex-grow mx-2">
        Arithmétique Aventures
      </h1>
      <img src="/images/rp.png" alt="Logo Renouveau Pédagogique" className="h-12" />
    </header>
  );
};

export default Header;
