import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import DashBoard from './pages/Dashboard/DashBoard';
import Profil from './pages/Profil/Profil';
import Game from './pages/Game/Game';
import Chat from './pages/Chat/Chat';
import Tournament from './pages/Tournament/Tournament';
import LeaderBoard from './pages/LeaderBoard/LeaderBoard';
import Setting from './pages/Setting/Setting';
import SideBar from './components/SideBar/SideBar';
import TopBar from './components/TopBar/TopBar';
import PingPongGame from './pages/PingPongGame/PingPongGame';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import './App.css'
import Auth from './pages/Auth/Auth';
import { AuthProvider } from './context/Auth/AuthProvider';
import ProtectedRoutes from './components/ProtectedRoutes/ProtectedRoutes';
import AchievementsPopup from './components/AchievementsPopup/AchievementsPopup';


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
    element: <Auth/>,
    path: '/auth'
  },
  {
    element:<ProtectedRoutes><AppLayout /></ProtectedRoutes>,
    children: [
      { path: '/', element: <DashBoard /> },
      { path: '/user/:userId', element: <Profil />},
      { path: 'game', element: <Game /> },
      { path: 'chat', element: <Chat /> },
      { path: 'tournament', element: <Tournament /> },
      { path: 'leaderboard', element: <LeaderBoard /> },
      { path: 'setting', element: <Setting /> },
    ]
  },
  {
    element: <PingPongGame />,
    path: 'pingponggame'
  },
];

const router = createBrowserRouter(routes);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router}/>
    </AuthProvider>
  </React.StrictMode>
);
