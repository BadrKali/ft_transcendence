import React, { useState } from 'react';
import Style from './Setting.module.css';
import AvatarSelect from './components/AvatarSelect/AvatarSelect';
import SettingInput from './components/SettingInput/SettingInput';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useAuth from '../../hooks/useAuth';
import axios from '../../api/axios';



const SETTING_ENDPOINT = "http://127.0.0.1:8000/auth/user/me/"


const Setting = () => {
  const { auth }  = useAuth()
  const [activeAvatar, setActiveAvatar] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);

  
  const [updatedvalues, setUpdatedvalues] = useState({
    username : "",
    email : "",
    old_password : "",
    new_password : "",
  })

  const successNotify = () => {
    toast.success('Profile updated successfully!', {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      });
  }

  const errorNotify = () => {
    toast.error('Failed to update settings. Please try again.', {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      });
  }

  const handleTwoFaClick = (e) => {
    e.preventDefault();
    // 2FA setup logic will be added here
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (const key in updatedvalues) {
      if(updatedvalues[key] !== "") {
        formData.append(key, updatedvalues[key])
      }
    }
    if(avatarFile) {
      formData.append('avatar', avatarFile)
    }
    else if (activeAvatar) {
      formData.append('avatar_type', activeAvatar)
    }
    try {
      const response = await axios.patch(SETTING_ENDPOINT, formData, {
        headers : {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${auth.accessToken}`,
        }
    });
    successNotify()
    } catch(e) {
      errorNotify()
    } finally {
      // console.log("clear data")
    }
  }

  const handleInputChange = (e) => {
    setUpdatedvalues({ ...updatedvalues, [e.target.name]: e.target.value });
};

  return (
    <>
      <div className={Style.SettingContainer}>
        <h1>Settings</h1>
        <div className={Style.AvatarContainer}>
          <div className={Style.SettingInfo}>
            <h3>Profile Picture</h3>
            <p>Update your information about you and details here</p>
          </div>
          <div className={Style.Avatars}>
            <AvatarSelect setActiveAvatar={setActiveAvatar} setAvatarFile={setAvatarFile} activeAvatar={activeAvatar} avatarFile={avatarFile}/>
          </div>
        </div>
        <form className={Style.form} onSubmit={handleFormSubmit}>
          <div className={Style.SettingSep}>
          </div>
          <div className={Style.SettingSection}>
            <div className={Style.SettingInfo}>
              <h3>Personal Informations</h3>
              <p>Update your information about you and details here</p>
            </div>
            <div className={Style.InputSection}>
              <SettingInput label="User Name" name='username' placeholder='Perdoxii_noyat' type='text' onChange={handleInputChange} />
              <SettingInput label="Email" name='email' placeholder='perdoxi@admin.com' type='email' onChange={handleInputChange}/>
            </div>
          </div>
          <div className={Style.SettingSep}></div>
          <div className={Style.SettingSection}>
            <div className={Style.SettingInfo}>
              <h3>Security</h3>
              <p>Update your information about you and details here</p>
            </div>
            <div className={Style.InputSection}>
              <SettingInput label='Current Password' name="old_password" placeholder='********************' type='password' onChange={handleInputChange}/>
              <SettingInput label='New Password' name="new_password" placeholder='********************' type='password' onChange={handleInputChange}/>
            </div>
          </div>
          <div className={Style.SettingSep}></div>
          <div className={Style.TwoFactorContainer}>
            <div className={Style.SettingInfo}>
              <h3>Two-factor Authenticator App <span>Enabled</span></h3>
              <p>Use an Authenticator App as your two-factor authentication (2FA). When you sign in you'll be asked to use the security code provided by your Authenticator.</p>
            </div>
            <button type="button" onClick={handleTwoFaClick}>Set Up</button>
          </div>
          {/* <button type="submit" onClick={handleFormSubmit} className={Style.SubmitButton}>Update</button> */}
          <div className={Style.buttonContainer}>
            <div className={Style.SubmitContainer}>
                <button type="submit" onClick={handleFormSubmit} className={Style.SubmitButtonPrimary}>Update</button>
            </div>
          </div>
        </form>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </>
  );
}

export default Setting;


















// const Setting = () => {
//   return (
//     <div className='setting-container'>
//         <div className='page-title'>
//           <h1>Settings</h1>
//         </div>
//         <div className='setting-content'>
//           <div className='user-avatar-setting'>
//               <div className='user-setting-info'>
//                 <h3>Profile Picture</h3>
//                 <span>Update your information about you an d details here</span>
//               </div>
//               <div className='setting-update-section'>
//                 <AvatarSelect/>
//               </div>
//           </div>
//         </div>
//         <div className='setting-seperator'></div>
//         <div className='user-personal-info-setting'>
//             <div className='user-setting-info'>
//               <h3>Personal Informations </h3>
//               <span>Update your information about you and details here</span>
//             </div>
//             <div className='setting-update-section' >
//               <div className='setting-input-section'>
//                 <SettingInput label='NickName' placeholder='Perdoxii_noyat' type='text'/>
//                 <SettingInput label='Full Name' placeholder='Badr Eddine Elkalai' type='text'/>
//                 <SettingInput label='Email' placeholder='perdoxi@admin.com' type='email'/>
//               </div>
//             </div>
//         </div>
//         <div className='setting-seperator'></div>
//         <div className='user-personal-info-setting'>
//             <div className='user-setting-info'>
//               <h3>Personal Informations </h3>
//               <span>Update your information about you and details here</span>
//             </div>
//             <div className='setting-update-section' >
//               <div className='setting-input-section'>
//                 <SettingInput label='Password' placeholder='********************' type='password'/>
//                 <SettingInput label='Confirm Password' placeholder='********************' type='password'/>
//               </div>
//             </div>
//         </div>
//         <div className='submit-setting-button'>
//           <button>Update</button>
//         </div>
//     </div>
//   )
// }