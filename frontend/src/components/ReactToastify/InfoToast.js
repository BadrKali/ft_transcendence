import React from 'react';
import { ToastContainer as ReactToastifyContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const InfoToast = () => {
    toast.info('You have a new notification!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Slide,
        });
}

export default InfoToast