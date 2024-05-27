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

const App = () => {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <DashBoard/>
    },
    {
      path: '/game',
      element: <Game />
    },
    {
      path: '/Chat',
      element: <Chat />
    },
    {
      path: '/Tournament',
      element: <Tournament />
    },
    {
      path: '/LeaderBoard',
      element: <LeaderBoard />
    },
    {
      path: '/Setting',
      element: <Setting />
    },
  ])
  return (
    <div className='app'>
      <SideBar/>
      <main className='main'>
        <TopBar/>
        <div className='page-content'>
          <div className='content'>
            <RouterProvider router={router}/> 
          </div>
        </div>
      </main>
    </div>
  )
}





export default App