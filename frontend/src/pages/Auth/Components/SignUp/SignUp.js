import React, { useEffect, useState } from 'react'
import './SignUp.css'
import { assets, avatars } from '../../../../assets/assets'
import AuthInput from '../AuthInput/AuthInput';
import axios from '../../../../api/axios';

const SIGNUP_URL = '/auth/user/register/'

const SignUp = (props) => {
    const [activeAvatar, setActiveAvatar] = useState(0);
    const [avatarFile, setAvatarFile] = useState(null);
    const [signUpValues, setSignUpValues] = useState({
        username: "",
        email: "",
        password: "",
        confirm_password: ""
    });

    const handleFileChange = (event) => {
        setAvatarFile(event.target.files[0]);
        setActiveAvatar(null); 
    };

    const handleAvatarSelection = (index) => {
        setActiveAvatar(index);
        setAvatarFile(null);
    };

    const handleInputChange = (e) => {

        setSignUpValues({ ...signUpValues, [e.target.name]: e.target.value });
        console.log(signUpValues)
    };

    const handleSignUpSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('username', signUpValues.username);
        formData.append('email', signUpValues.email);
        formData.append('password', signUpValues.password);
        formData.append('confirm_password', signUpValues.confirm_password);
        if (avatarFile) {
            formData.append('avatar', avatarFile);
        } else {
            formData.append('avatar_type', activeAvatar);
        }

        try {
            const response = await axios.post(SIGNUP_URL, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            console.log(response.data);
            props.setIsLogin(true);
        } catch (err) {
            console.error(err);
        }
    };

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
    ];

    return (
        <div className='signup-container'>
            <h1>Create Account</h1>
            <div className='signup-avatar-section'>
                <h3>Avatar</h3>
                <div className='signup-avatar-list'>
                    {avatars.map((avatar, index) => (
                        <img
                            key={index}
                            src={avatar.img}
                            className={activeAvatar === index ? 'active-avatar' : ''}
                            onClick={() => handleAvatarSelection(index)}
                        />
                    ))}
                    <label>
                        <input
                            type="file"
                            name="avatar"
                            id='uploadBtn'
                            className='upload-input'
                            onChange={handleFileChange}
                            accept="image/*"
                        />
                        <label htmlFor="uploadBtn">
                            <img src={assets.addAvatar} alt="Upload Avatar" />
                        </label>
                    </label>
                </div>
                <form className='signup-input-section' onSubmit={handleSignUpSubmit}>
                    <AuthInput name="username" placeholder="User Name" type="text" value={signUpValues.username} onChange={handleInputChange} errorMessage={errorMsg[0].msg} pattern={errorMsg[0].pattern} />
                    <AuthInput name="email" placeholder="Email" type="email" value={signUpValues.email} onChange={handleInputChange} errorMessage={errorMsg[1].msg} pattern={errorMsg[1].pattern} />
                    <AuthInput name="password" placeholder="Password" type="password" value={signUpValues.password} onChange={handleInputChange} errorMessage={errorMsg[2].msg} pattern={errorMsg[2].pattern} />
                    <AuthInput name="confirm_password" placeholder="Confirm Password" type="password" value={signUpValues.confirm_password} onChange={handleInputChange} errorMessage={errorMsg[3].msg} pattern={errorMsg[3].pattern} />
                    <button className="signup-switch" type="submit">Create Account</button>
                    <button className="signup-switch" type="button" onClick={props.setIsLogin}>Sign In</button>
                </form>
            </div>
        </div>
    );
};

export default SignUp;
