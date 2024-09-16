import React, { useEffect, useState } from 'react'
import './Auth.css'
import { assets } from '../../assets/assets'
import SignUp from './Components/SignUp/SignUp'
import SignIn from './Components/SignIn/SignIn'
import TwoFa from './Components/TwoFa/TwoFa'
import useAuth from '../../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import useRefresh from '../../hooks/useRefresh'

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [isTwoFa, setIsTwoFa] = useState(false)
  const [TwoFaUser, setTwoFaUser] = useState(null)
  const { auth, setAuth } = useAuth()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const refresh = useRefresh()

  // useEffect(() => {
  //   const checkToken = async () => {
  //     try {
  //       await refresh()
  //     } catch (e) {
  //       console.log(e)
  //     } finally {
  //       setIsLoading(false)
  //     }
  //   }
  //   if(!auth?.accessToken) {
  //     checkToken()
  //   }
  // }, [])

  const handleTwoFaSuccess = () => {
    navigate('/')
    console.log("2FA successful, navigate to home page")
  }

  // useEffect(() => {
  //   if (auth?.accessToken && !isLoading) {
  //     navigate('/')
  //   }
  // }, [auth, isLoading, navigate])

  // if (isLoading) {
  //   return <div>Loading khawa dyali</div>
  // }

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
      <div className='auth-right-section'>
        {/* <img src={assets.loginBackground} alt="Login Background" /> */}
      </div>
    </div>
  )
}

export default Auth