import React, { useState, useContext } from 'react'
import './SignIn.css'
import Icon from '../../../../assets/Icon/icons'
import { assets } from '../../../../assets/assets'
import AuthContext from '../../../../context/Auth/AuthProvider'
import axios from '../../../../api/axios'
import { useNavigate } from 'react-router-dom';
import useAuth from '../../../../hooks/useAuth'

const SIGNIN_URL = "/auth/token/"

const SignIn = (props) => {
    const {setAuth} = useAuth( )
    const navigate = useNavigate();
    const [signInValues, setSignInValues] = useState({
        username: "",
        password: ""
    })
    const [errorMsg, setErrorMsg] = useState("")
    function handleSignUpClick() {
        props.setIsLogin(false)
      }

    const handleSignInSubmit = async (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('username', signInValues.username);
        formData.append('password', signInValues.password);
        // console.log(formData)
        try {
            const response = await axios.post(SIGNIN_URL, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true
            });
            const accessToken = response?.data?.access;
            setAuth({username:signInValues.username, accessToken: accessToken})
            navigate('/leaderboard');
        } catch(err) {
            console.log(err)
        } finally {
            console.log("yay")
        }   
    }

    function handleInputChange(e) {
        setSignInValues({ ...signInValues, [e.target.name]: e.target.value });
    }
    const [isHidden, setIsHidden] = useState('hide_pass')
  return (
    <div className='signin-container'>
        <div className='signin-header'>
            <h1>Sign In</h1>
            <p>Welcome back! Sign in to access your account and dive into the world of gaming excitement.</p>
        </div>
        <form onSubmit={handleSignInSubmit} >
            <div className='signin-input-section'>
                <div className='signin-input'>
                    <Icon name='at' className='signin-icon'/>
                    <input name='username' placeholder='Email' type='text' onChange={handleInputChange}/>
                </div>
                <div className='signin-password'>
                    <div className='signin-input'>
                        <Icon name='lock' className='signin-icon'/>
                        <input name='password' placeholder='Password' type={isHidden === 'hide_pass' ? 'password' : 'text'} onChange={handleInputChange}/>
                    </div>
                    <div className='show_pass' onClick={() => {
                        if(isHidden === 'hide_pass')
                            setIsHidden('show_pass')
                        else
                            setIsHidden('hide_pass')
                    }}>
                        <Icon name={isHidden} className='signin-icon'/>
                    </div>
                </div>
            </div>
            <div className='signin-submit-section'>
                <button>Sign In</button>
            </div>
        </form>

        <div className='signin-sep'>
            <div className='signin-sep-s'></div>
            <div>Or</div>
            <div className='signin-sep-s'></div>
        </div>
        <div className='school_auth'>
            <img src={assets.SchoolIcon}/>
        </div>
        <div className='signin-text-bottom'>
            <p>Don’t have an account ? <span onClick={handleSignUpClick}>Sign Up here</span></p>
        </div>
    </div>
  )
}

export default SignIn