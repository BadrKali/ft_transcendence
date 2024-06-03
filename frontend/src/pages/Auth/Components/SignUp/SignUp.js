import React, { useEffect, useState } from 'react'
import './SignUp.css'
import { assets, avatars } from '../../../../assets/assets'
import AuthInput from '../AuthInput/AuthInput';


const SignUp = (props) => {
    const [activeAvatar, setActiveAvatar] = useState(0);
    const [signUpValues, setSignUpvalues] = useState({
        avatar: activeAvatar,
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    })
    
    function handleLoginClick() {
        props.setIsLogin(true)
    }
    
    function handleSignUpSubmit(e) {
        e.preventDefault(); 
    }
    
    function handleInputChange(e) {
        setSignUpvalues({...signUpValues,[e.target.name]: e.target.value})
    }
    console.log(signUpValues);
    
    useEffect(() => {
        setSignUpvalues(prevValues => ({
                ...prevValues,
                avatar: activeAvatar,
            }));
        }, [activeAvatar]);

  return (
    <div className='signup-container'>
        <h1>Create Account</h1>
        <div className='signup-avatar-section'>
            <h3>Avatar</h3>
            <div className='signup-avatar-list'>
                <img src={avatars[0].img} className={activeAvatar === 0 ? 'active-avatar' : ''} onClick={() => {
                    setActiveAvatar(0);
                }}/>
                <img src={avatars[1].img} className={activeAvatar === 1 ? 'active-avatar' : ''} onClick={() => {
                    setActiveAvatar(1);
                }}/>
                <img src={avatars[2].img} className={activeAvatar === 2 ? 'active-avatar' : ''} onClick={() => {
                    setActiveAvatar(2);
                }}/>
                <img src={avatars[3].img} className={activeAvatar === 3 ? 'active-avatar' : ''} onClick={() => {
                    setActiveAvatar(3);
                }}/>
                <img src={avatars[4].img} onClick={() => alert('ta sir ghayerha tangado l back ')}/>
            </div>
            <form className='signup-input-section' onSubmit={handleSignUpSubmit}>
                    <AuthInput name="username" placeholder="User Name" type="text"  value={setSignUpvalues["username"] } onChange={handleInputChange}/>
                    <AuthInput name="email" placeholder="Email" type="email" value={setSignUpvalues["email"] } onChange={handleInputChange}/>
                    <AuthInput name="password" placeholder="Password" type="password" value={setSignUpvalues["password"] } onChange={handleInputChange}/>
                    <AuthInput name="confirm password" placeholder="Confirm Password" type="password" value={setSignUpvalues["confirmPassword"] } onChange={handleInputChange}/>
                    <button className="signup-switch">Create Account</button>
            </form>
            <button className="signup-switch" onClick={handleLoginClick} >Sign In</button>
        </div>
    </div>
  )
}

export default SignUp