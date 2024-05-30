import React, { useState } from 'react'
import './SignUp.css'
import { assets, avatars } from '../../../../assets/assets'


const SignUp = (props) => {
    const [avtiveAvatar, setActiveAvatar] = useState(0);
    function handleLoginClick() {
        props.setIsLogin(true)
      }
  return (
    <div className='signup-container'>
        <h1>Create Account</h1>
        <div className='signup-avatar-section'>
            <h3>Avatar</h3>
            <div className='signup-avatar-list'>
                <img src={avatars[0].img} className={avtiveAvatar === 0 ? 'active-avatar' : ''} onClick={() => {
                    setActiveAvatar(0);
                }}/>
                <img src={avatars[1].img} className={avtiveAvatar === 1 ? 'active-avatar' : ''} onClick={() => {
                    setActiveAvatar(1);
                }}/>
                <img src={avatars[2].img} className={avtiveAvatar === 2 ? 'active-avatar' : ''} onClick={() => {
                    setActiveAvatar(2);
                }}/>
                <img src={avatars[3].img} className={avtiveAvatar === 3 ? 'active-avatar' : ''} onClick={() => {
                    setActiveAvatar(3);
                }}/>
                <img src={avatars[4].img} onClick={() => alert('ta sir ghayerha tangado l back ')}/>
            </div>
            <div className='signup-input-section'>
                <div className='signup-input'>
                    <input placeholder='Nick Name' type='text'/>
                </div>
                <div className='signup-input'>
                    <input placeholder='Email' type='email'/>
                </div>
                <div className='signup-input'>
                    <input placeholder='Password' type='password'/>
                </div>
            </div>
            <div className='signup-submit-section'>
                <button>Create Account</button>
                <button onClick={handleLoginClick} >Sign In</button>
            </div>
        </div>
    </div>
  )
}

export default SignUp