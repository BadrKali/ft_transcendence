import React from 'react'

const AuthInput = (props) => {
  return (
    <div className='signup-input'>
        {/* <label>User Name</label> */}
        <input name={props.name} placeholder={props.placeholder} type={props.type} onChange={props.onChange}/>
    </div>
  )
}

export default AuthInput