import React, {useEffect} from 'react';
import Navbar from '../../components/hotelOwner/Navbar';
import SideBar from '../../components/hotelOwner/SideBar';
import {Outlet} from 'react-router-dom';
import {useAppContext} from '../../context/AppContext';

const Layout = () => {
  const {isOwner, navigate} = useAppContext();
  useEffect(() => {
    if (!isOwner) {
      navigate('/');
    }
  }, [isOwner]);

  return (
    <div className="flex h-screen flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <SideBar />
        <main className="flex-1 overflow-y-auto px-4 pb-6 pt-10 md:px-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
