import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import DashBoard from './pages/Dashboard/DashBoard';
import Game from './pages/Game/Game';
import Chat from './pages/Chat/Chat';
import Tournament from './pages/Tournament/Tournament';
import LeaderBoard from './pages/LeaderBoard/LeaderBoard';
import Setting from './pages/Setting/Setting';
import SideBar from './components/SideBar/SideBar';
import TopBar from './components/TopBar/TopBar'
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import './App.css'

const AppLayout = () => {
  return (
    <div className='app'>
    <SideBar/>
    <main className='main'>
      <TopBar/>
      <div className='page-content'>
        <div className='content'>
          <Outlet/>
        </div>
      </div>
    </main>
</div>
  )
}

export default AppLayout



const routes = [
  { 
    element: <AppLayout />,
    children: [
      { path: '/', element: <DashBoard /> },
      { path: 'game', element: <Game /> },
      { path: 'chat', element: <Chat /> },
      { path: 'tournament', element: <Tournament /> },
      { path: 'leaderboard', element: <LeaderBoard /> },
      { path: 'setting', element: <Setting /> },
    ]
  }
];

const router = createBrowserRouter(routes);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router}/> 
  </React.StrictMode>
);
