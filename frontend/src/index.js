import React from "react";
import ReactDOM from "react-dom/client";
import DashBoard from "./pages/Dashboard/DashBoard";
import Profil from "./pages/Profil/Profil";
import Game from "./pages/Game/Game";
import Chat from "./pages/Chat/Chat";
import Tournament from "./pages/Tournament/Tournament";
import LeaderBoard from "./pages/LeaderBoard/LeaderBoard";
import Setting from "./pages/Setting/Setting";
import Bot from "./pages/PingPongGame/Bot/Bot";
import Random from "./pages/PingPongGame/Random/Random";
import LocalGame from "./pages/PingPongGame/LocalGame/LocalGame";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import Auth from "./pages/Auth/Auth";
import { AuthProvider } from "./context/Auth/AuthProvider";
import ProtectedRoutes from "./components/ProtectedRoutes/ProtectedRoutes";
import PersistLogin from "./components/PersistLogin/PersistLogin";
import OauthTwo from "./components/OauthTwo/OauthTwo";
import { NotificationProvider } from "./components/Notification/NotificationContext";
import AppLayout from "./App";
import RealTimeProvider from "./context/RealTimeProvider";
import { SocketClientProvider } from "./pages/Chat/usehooks/ChatContext";
import { BlockPopUpProvider } from "./pages/Chat/usehooks/ChatContext";
import { CurrentUserProvider } from "./pages/Chat/usehooks/ChatContext";
import Invite from './pages/PingPongGame/Invite/Invite';
import { UserProvider } from "./context/UserContext";
import Design from "./pages/Design/Design";


const routes = [
  {
    element: <Auth />,
    path: "/auth",
  },
  {
    element: <OauthTwo />,
    path: "/42_api",
  },
  {
    element: <PersistLogin />,
    children: [
      {
        element: <ProtectedRoutes />,
        children: [
          {
            element:     
                  <UserProvider>
                    <RealTimeProvider>
                      <SocketClientProvider>
                              <AppLayout />
                      </SocketClientProvider>
                    </RealTimeProvider>
                  </UserProvider>,
            children: [
              { path: "/", element: <DashBoard /> },
              { path: "game", element: <Game /> },
              { path: "chat", element: <CurrentUserProvider> 
                                              <BlockPopUpProvider >
                                                        <Chat />
                                              </BlockPopUpProvider>
                                       </CurrentUserProvider> },
              { path: "tournament", element: <Tournament /> },
              { path: "leaderboard", element: <LeaderBoard /> },
              { path: "setting", element: <Setting /> },
              { path: "/user/:nameOfUser", element: <Profil /> },
            ],
          },
        ],
      },
    ],
  },
  { path: "design", element: <Design /> },
  {path: 'bot-game', element: <Bot />},
  {path: 'local-game', element: <LocalGame />},
  {path: 'random-game', element: <Random/>},
  {path: 'invite-game', element: <Invite/>},
];

const router = createBrowserRouter(routes);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AuthProvider>
          <RouterProvider router={router} />
  </AuthProvider>
);
