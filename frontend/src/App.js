import React from 'react';
import './index.css';
import SideBar from './components/SideBar/SideBar';
import TopBar from './components/TopBar/TopBar';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import './App.css'
import Notification from './components/Notification/Notification';


const AppLayout = () => {
  return (
      <div className='app'>
        <SideBar/>
        <main className='main'>
          <TopBar/>
          <div className='page-content'>
            <div className='content'>
              {/* <Notification/> */}
              <Outlet/>
            </div>
          </div>
        </main>
    </div>
  )
}


export default AppLayout