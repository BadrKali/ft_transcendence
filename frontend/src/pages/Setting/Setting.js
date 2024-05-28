import React from 'react'
import './Setting.css'
import AvatarSelect from './components/AvatarSelect/AvatarSelect'
import SettingInput from './components/SettingInput/SettingInput'


const Setting = () => {
  return (
    <div className='setting-container'>
        <div className='page-title'>
          <h1>Settings</h1>
        </div>
        <div className='setting-content'>
          <div className='user-avatar-setting'>
              <div className='user-setting-info'>
                <h3>Profile Picture</h3>
                <span>Update your information about you an d details here</span>
              </div>
              <div className='setting-update-section'>
                <AvatarSelect/>
              </div>
          </div>
        </div>
        <div className='setting-seperator'></div>
        <div className='user-personal-info-setting'>
            <div className='user-setting-info'>
              <h3>Personal Informations </h3>
              <span>Update your information about you and details here</span>
            </div>
            <div className='setting-update-section' >
              <div className='setting-input-section'>
                <SettingInput label='NickName' placeholder='Perdoxii_noyat' type='text'/>
                <SettingInput label='Full Name' placeholder='Badr Eddine Elkalai' type='text'/>
                <SettingInput label='Email' placeholder='perdoxi@admin.com' type='email'/>
              </div>
            </div>
        </div>
        <div className='setting-seperator'></div>
        <div className='user-personal-info-setting'>
            <div className='user-setting-info'>
              <h3>Personal Informations </h3>
              <span>Update your information about you and details here</span>
            </div>
            <div className='setting-update-section' >
              <div className='setting-input-section'>
                <SettingInput label='Password' placeholder='********************' type='password'/>
                <SettingInput label='Confirm Password' placeholder='********************' type='password'/>
              </div>
            </div>
        </div>
        <div className='submit-setting-button'>
          <button>Update</button>
        </div>
    </div>
  )
}

export default Setting