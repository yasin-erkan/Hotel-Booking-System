import React from 'react';
import {Link} from 'react-router-dom';
import {assets} from '../../assets/assets';
import {NavLink} from 'react-router-dom';
const SideBar = () => {
  const sidebarLinks = [
    {
      name: 'Dashboard',
      path: '/owner/dashboard',
      icon: assets.dashboardIcon,
    },
    {
      name: 'Add Room',
      path: '/owner/add-room',
      icon: assets.addIcon,
    },
    {
      name: 'List Room',
      path: '/owner/list-room',
      icon: assets.listIcon,
    },
  ];
  return (
    <div className="md:w-64 w-20 border-r border-slate-200 h-full text-base pt-6 flex flex-col gap-2 bg-white/80 backdrop-blur-sm transition-all duration-300 shadow-sm">
      <div className="hidden md:flex flex-col gap-1 px-8 pb-4 border-b border-slate-100">
        <span className="text-sm uppercase tracking-wide text-slate-400">
          Owner Panel
        </span>
        <span className="text-xl font-semibold text-slate-800">
          Hotel Console
        </span>
      </div>
      {sidebarLinks.map((item, index) => (
        <NavLink
          to={item.path}
          key={index}
          end
          title={item.name}
          className={({isActive}) =>
            `group relative flex items-center py-3 px-4 md:px-6 gap-4 rounded-r-full transition-all duration-200 ease-out ${
              isActive
                ? 'bg-blue-50 text-blue-600 md:border-l-4 border-blue-600 shadow-[0_4px_18px_rgba(37,99,235,0.15)]'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/80'
            }`
          }>
          {({isActive}) => (
            <>
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-inner'
                    : 'bg-blue-100 text-blue-500 group-hover:bg-blue-500 group-hover:text-white'
                }`}>
                <img
                  src={item.icon}
                  alt={item.name}
                  className="h-4 w-4 transition-transform duration-200 group-hover:scale-110"
                />
              </span>
              <div className="hidden md:flex flex-col">
                <p className="font-medium text-sm tracking-wide">{item.name}</p>
                <span
                  className={`text-xs transition-opacity duration-200 ${
                    isActive
                      ? 'text-blue-500/90 opacity-100'
                      : 'text-slate-400 opacity-0 group-hover:opacity-100'
                  }`}>
                  {isActive ? 'Currently viewing' : 'Navigate'}
                </span>
              </div>
            </>
          )}
        </NavLink>
      ))}
    </div>
  );
};

export default SideBar;
