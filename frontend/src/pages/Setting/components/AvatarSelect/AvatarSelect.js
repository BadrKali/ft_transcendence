import React, { useState } from 'react'
import './AvatarSelect.css'
import { avatars } from '../../../../assets/assets'
import { assets } from '../../../../assets/assets'


const AvatarSelect = () => {
    const [avatarNum, setAvatarNum] = useState(0);
  return (
    <div className='avatar-select'>
        <img src={avatars[avatarNum].img} className='selected-avatar'/>
        <img src={avatars[0].img} className={`avatar-item ${avatarNum === 0 ? 'active' : ''}`} onClick={() => {
            setAvatarNum(0)
        }}/>
        <img src={avatars[1].img} className={`avatar-item ${avatarNum === 1 ? 'active' : ''}`} onClick={() => {
            setAvatarNum(1)
        }}/>
        <img src={avatars[2].img} className={`avatar-item ${avatarNum === 2 ? 'active' : ''}`} onClick={() => {
            setAvatarNum(2)
        }}/>
        <img src={avatars[3].img} className={`avatar-item ${avatarNum === 3 ? 'active' : ''}`} onClick={() => {
            setAvatarNum(3)
        }}/>
        <img src={assets.addAvatar} className={`avatar-item ${avatarNum === 4 ? 'active' : ''}`} onClick={()=> {
            alert('ghayerha a weldi')
        }}/>
    </div>
  )
}

export default AvatarSelect