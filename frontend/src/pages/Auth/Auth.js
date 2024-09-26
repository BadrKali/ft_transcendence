import React, { useEffect, useState } from 'react'
import './Auth.css'
import { assets } from '../../assets/assets'
import SignUp from './Components/SignUp/SignUp'
import SignIn from './Components/SignIn/SignIn'
import TwoFa from './Components/TwoFa/TwoFa'
import useAuth from '../../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import useRefresh from '../../hooks/useRefresh'
import { SuccessToast } from '../../components/ReactToastify/SuccessToast'
import ToastContainer from '../../components/ReactToastify/ToastContainer'
import axios from 'axios';


const Auth = (props) => {
  const [isLogin, setIsLogin] = useState(true)
  const [isTwoFa, setIsTwoFa] = useState(false)
  const [TwoFaUser, setTwoFaUser] = useState(null)
  const [accessToken, setAccessToken] = useState(null)
  const { auth, setAuth } = useAuth()
  const navigate = useNavigate()
  

  const handleTwoFaSuccess = () => {
    navigate('/')
    console.log("2FA successful, navigate to home page")
  }



  const handleBackToLogin = async () => {
    console.log('Back to login');
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/auth/logout/`, {}, {
        headers: {
          'Authorization': `Bearer ${accessToken}`, 
        },
        withCredentials: true,
      });
      if (response.status === 205) {
        console.log('Logged out successfully');
        setIsTwoFa(false)
        setAuth(null)
      }
    }
    catch (error) {
      console.error('Error logging out:', error.response ? error.response.data : error.message);
    }
  };

  useEffect(() => {
    if (auth?.accessToken) {
      navigate('/')
    }
  }, [])

  return (
    <div className='auth-container'>
      <div className='auth-left-section'>
        <div className='auth-logo-container'>
          <img src={assets.logo} alt="Logo" />
        </div>
        <div className={`auth-content ${isLogin ? 'slide' : 'exit'}`}>
          {!isLogin && <SignUp isLogin={isLogin} setIsLogin={setIsLogin} />}
          {isLogin && !isTwoFa && 
            <SignIn 
              className={isLogin ? 'slide' : 'exit'} 
              isLogin={isLogin} 
              setIsLogin={setIsLogin} 
              setIsTwoFa={setIsTwoFa}
              setAuth={setAuth}
              setTwoFaUser={setTwoFaUser}
              setAccessToken={setAccessToken}
            />
          }
          {isTwoFa && 
            <TwoFa
              username={TwoFaUser}
              setAuth={setAuth}
              onSuccess={handleTwoFaSuccess}
              accessToken={accessToken}
              handleBackToLogin={handleBackToLogin}
            />
          }
        </div>
      </div>
      <div className='auth-right-section'></div>
      <ToastContainer />
    </div>
  )
}

export default Auth