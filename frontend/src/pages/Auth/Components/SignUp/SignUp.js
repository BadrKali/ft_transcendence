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
    
    // const errorMsg = ["Username cannot contain special characters or spaces.","Email address must follow the format user@example.com.","Password is too weak. Please choose a more complex password to ensure account security."]
    const errorMsg = [
        {
            id: 0,
            msg: "Username cannot contain special characters or spaces.",
            pattern: "^[A-Za-z][A-Za-z0-9_]{7,29}$"
        },
        {
            id: 1,
            msg: "Email address must follow the format user@example.com.",
            pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
        },
        {
            id: 2,
            msg: "Password is too weak. Please choose a more complex password to ensure account security.",
            pattern: "^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).*$"
        },
        {
            id: 3,
            msg: "Oops! Looks like your passwords don't match. Please try again.",
            pattern: signUpValues.password
        }
        
    ]
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
            {/* To Do : this need to be on an object with everything we want to pass as a prop to the input componenet */}
            <form className='signup-input-section' onSubmit={handleSignUpSubmit}>
                    <AuthInput name="username" placeholder="User Name" type="text"  value={setSignUpvalues["username"] } onChange={handleInputChange} errorMessage={errorMsg[0].msg} pattern={errorMsg[0].pattern}/>
                    <AuthInput name="email" placeholder="Email" type="email" value={setSignUpvalues["email"] } onChange={handleInputChange} errorMessage={errorMsg[1].msg} pattern={errorMsg[1].pattern}/>
                    <AuthInput name="password" placeholder="Password" type="password" value={setSignUpvalues["password"] } onChange={handleInputChange} errorMessage={errorMsg[2].msg} pattern={errorMsg[2].pattern}/>
                    <AuthInput name="confirmPassword" placeholder="Confirm Password" type="password" value={setSignUpvalues["confirmPassword"] } onChange={handleInputChange} errorMessage={errorMsg[3].msg} pattern={errorMsg[3].pattern}/>
                    <button className="signup-switch">Create Account</button>
            </form>
            <button className="signup-switch" onClick={handleLoginClick} >Sign In</button>
        </div>
    </div>
  )
}

export default SignUp