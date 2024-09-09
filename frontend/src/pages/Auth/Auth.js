import React, { useState } from 'react'
import './Auth.css'
import { assets } from '../../assets/assets'
import SignUp from './Components/SignUp/SignUp'
import SignIn from './Components/SignIn/SignIn'
import TwoFa from './Components/TwoFa/TwoFa'
import useAuth from '../../hooks/useAuth'
import {useNavigate } from 'react-router-dom';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [isTwoFa, setIsTwoFa] = useState(false)
  const {setAuth} = useAuth()
  const navigate = useNavigate();

  const handleTwoFaSuccess = () => {
    navigate('/')
    console.log("2FA successful, navigate to home page")
  }

  return (
    <div className='auth-container'>
      <div className='auth-left-section'>
        <div className='auth-logo-container'>
          <img src={assets.logo} alt="Logo"/>
        </div>
        <div className={`auth-content ${isLogin ? 'slide' : 'exit'}`}>
          {!isLogin && <SignUp isLogin={isLogin} setIsLogin={setIsLogin}/>}
          {isLogin && !isTwoFa && 
            <SignIn 
              className={isLogin ? 'slide' : 'exit'} 
              isLogin={isLogin} 
              setIsLogin={setIsLogin} 
              setIsTwoFa={setIsTwoFa}
              setAuth={setAuth}
            />
          }
          {isTwoFa && 
            <TwoFa 
              setAuth={setAuth}
              onSuccess={handleTwoFaSuccess}
            />
          }
        </div>
      </div>
      <div className='auth-right-section'>
        {/* <img src={assets.loginBackground} alt="Login Background" /> */}
      </div>
    </div>
  )
}

export default Auth