import React from 'react';
import { IoChatbubbleEllipses } from 'react-icons/io5';
import { FaUserPlus } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';

function SideBar() {
  return (
    <div className='w-full h-full'>
      <div className='bg-slate-100 w-12 h-full rounded-tr-lg rounded-br-lg py-5 text-slate-600'>
        <NavLink
          to="/chat"
          className={({ isActive }) =>
            `w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded ${
              isActive ? 'bg-slate-200' : ''
            }`
          }
          title='Chat'
        >
          <IoChatbubbleEllipses size={25} />
        </NavLink>

        <NavLink
          to="/add-user"
          className={({ isActive }) =>
            `w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded ${
              isActive ? 'bg-slate-200' : ''
            }`
          }
          title='Add User'
        >
          <FaUserPlus size={25} />
        </NavLink>
      </div>
    </div>
  );
}

export default SideBar;
