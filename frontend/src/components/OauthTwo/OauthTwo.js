import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from '../../api/axios'
import useAuth from '../../hooks/useAuth'

const AuthTwo = () => {
    const location = useLocation()
    const navigate = useNavigate();
    const {setAuth} = useAuth()
    
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const code = searchParams.get('code');
        console.log(code)
        if (code) {
            axios.post("/auth/callback/", { code }, {
                withCredentials: true
            })
                .then(response => {
                    const accessToken = response.data.access;
                    setAuth({ accessToken });
                    console.log(accessToken)
                    navigate('/');
                })
                .catch(error => {
                    console.error('Error during authentication', error);
                    navigate('/auth');
                    // setErrorMsg("Failed to authenticate with 42 School.");
                });
        }
    }, []);
}

export default AuthTwo