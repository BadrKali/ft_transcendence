import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import useAuth from '../../hooks/useAuth';
import Lottie from 'lottie-react';
import loadingAnimation from './loading-animation.json'; 
import './OauthTwo.css'

const AuthTwo = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { setAuth } = useAuth();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log("i am here niggas")
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
                    console.log(accessToken);
                    navigate('/');
                })
                .catch(error => {
                    console.error('Error during authentication', error);
                    navigate('/auth');
                    // setErrorMsg("Failed to authenticate with 42 School.");
                })
                // .finally(() => {
                //     setLoading(false); 
                // });
        }
    }, []);

    return (
        <div className='oauth-loading'>
            {loading && (
                <Lottie animationData={loadingAnimation} style={{ width: 400, height: 400 }} />
            )}
        </div>
    );
}

export default AuthTwo;
