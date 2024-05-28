import React from 'react'
import './SettingInput.css'




const SettingInput = (props) => {
  return (
    <div className='setting-input-container'>
            <span>{props.label}</span>
            <input type={props.type} placeholder={props.placeholder}/>
    </div>
  )
}

export default SettingInput