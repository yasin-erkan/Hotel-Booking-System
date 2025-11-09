import React from 'react';
import {Link} from 'react-router-dom';
import {assets} from '../../assets/assets';
import {UserButton} from '@clerk/clerk-react';
const Navbar = () => {
  return (
    <div className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-200 bg-white/95 px-4 py-3 shadow-[0_20px_45px_-35px_rgba(15,23,42,0.75)] backdrop-blur-md transition-all duration-300 md:px-8">
      <Link to="/">
        <img
          src={assets.logo}
          alt="logo"
          className="h-9 w-auto md:h-10 invert opacity-85"
        />
      </Link>
      <UserButton />
    </div>
  );
};

export default Navbar;
