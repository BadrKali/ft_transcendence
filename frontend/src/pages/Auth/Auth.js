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

const Auth = (props) => {
  const [isLogin, setIsLogin] = useState(true)
  const [isTwoFa, setIsTwoFa] = useState(false)
  const [TwoFaUser, setTwoFaUser] = useState(null)
  const { auth, setAuth } = useAuth()
  const navigate = useNavigate()

  const handleTwoFaSuccess = () => {
    navigate('/')
    console.log("2FA successful, navigate to home page")
  }

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
            />
          }
          {isTwoFa && 
            <TwoFa
              username={TwoFaUser}
              setAuth={setAuth}
              onSuccess={handleTwoFaSuccess}
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