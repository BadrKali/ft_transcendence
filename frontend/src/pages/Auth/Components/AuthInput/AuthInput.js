import React from 'react'

const AuthInput = (props) => {
    return (
          <div className='signup-input'>
            <input
              name={props.name}
              placeholder={props.placeholder}
              type={props.type}
              onChange={props.onChange}
              pattern={props.pattern}
              required
              />
              <span>{props.errorMessage}</span>
          </div>
      );
}

export default AuthInput