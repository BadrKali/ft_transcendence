import React, { useEffect, useRef, useState } from 'react'
import './TwoFa.css'
import MainButton from '../../../../components/MainButton/MainButton'
import useAuth from '../../../../hooks/useAuth';




const veryfyOtp = async (otpCode, token) => {
    try {
        console.log(token)
        const response = await fetch('http://localhost:8000/auth/enable2fa/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({otp: otpCode})
          });
          if (response.ok) {
              console.log('OTP verified successfully');
              return true;
            }
            return false;
    } catch(error) {
        console.log('Error verifying OTP: ', error);
        return false;
    }

}


const TwoFa = (props) => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const inputRefs = useRef([]);
    const {auth} = useAuth();
    const [verificationStatus, setVerificationStatus] = useState('idle');

    useEffect(() => {
        inputRefs.current[0].focus();
      }, []);

    const handleChange = (element, index) => {
        if (isNaN(element.value)) return false;
        const newOtp = [...otp.map((d, idx) => (idx === index ? element.value : d))];
        setOtp(newOtp);

        if (element.nextSibling) {
            element.nextSibling.focus();
          }
          if (newOtp.every(data => data !== '')) {
            const otpCode = newOtp.join('');
            const status = veryfyOtp(otpCode, auth.accessToken);
            if(status) {
                console.log('2FA enabled successfully');
                setVerificationStatus('success');
            }
          }

    }
    const handleBackspace = (e, index) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
          inputRefs.current[index - 1].focus();
        }
      };


  return (
    <div className='AuthTwoFaConatiner'>
        <div className='AuthTwoFaHeader'>
            <h1>Welcome back ! Belkala153 </h1>
            <p>entre 6-digit code from your two factor authentication APP.</p>
        </div>
        <div className='AuthOtpCard'>
            {otp.map((data, index) => {
              return (
                <input
                  type="text"
                  maxLength="1"
                  key={index}
                  value={data}
                  onChange={e => handleChange(e.target, index)}
                  onKeyDown={e => handleBackspace(e, index)}
                  ref={input => inputRefs.current[index] = input}
                />
              );
            })}
        </div>
        <div className='AuthTwoFaAction'>
            <button className='AuthTwoFaButton' onClick={props.handleTwoFaSuccess}>Continue</button>
            <button className="AuthTwoFaBackButton">&larr; Back to login</button>

        </div>
    </div>
  )
}

export default TwoFa