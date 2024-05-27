import React from 'react'
import './App.css'
import SideBar from './components/SideBar/SideBar'
import TopBar from './components/TopBar/TopBar'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import DashBoard from './pages/Dashboard/DashBoard';
import Game from './pages/Game/Game';
import Chat from './pages/Chat/Chat';
import Tournament from './pages/Tournament/Tournament';
import LeaderBoard from './pages/LeaderBoard/LeaderBoard';
import Setting from './pages/Setting/Setting';
import Auth from './pages/Auth/Auth';


const routes = [
  { path: '/', element: <DashBoard /> },
  { path: '/game', element: <Game /> },
  { path: '/chat', element: <Chat /> },
  { path: '/tournament', element: <Tournament /> },
  { path: '/leaderboard', element: <LeaderBoard /> },
  { path: '/setting', element: <Setting /> },

];

const router = createBrowserRouter(routes);

const App = () => {
  const currentPath = window.location.pathname;
  return (
    <div className='app'>
      {currentPath === '/auth' ? <Auth/> :
      <>
        <SideBar/>
        <main className='main'>
          <TopBar/>
          <div className='page-content'>
            <div className='content'>
              <RouterProvider router={router}/> 
            </div>
          </div>
        </main>
      </>
      }

    </div>
  )
}





export default App