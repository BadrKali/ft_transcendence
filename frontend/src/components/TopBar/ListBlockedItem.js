import React from 'react'
import { useEffect, useState, useContext } from 'react';
import useFetch from '../../hooks/useFetch';
import useAuth from '../../hooks/useAuth';
import './listBlockedItem.css'
import { ErrorToast } from '../ReactToastify/ErrorToast';
import { SuccessToast } from '../ReactToastify/SuccessToast';
import { InfoToast } from '../ReactToastify/InfoToast';
import { UserContext } from '../../context/UserContext';


const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;


function ListBlockedItem({user}) {
  const {data ,isLoading, error} = useFetch(`${BACKEND_URL}/user/stats/${user.id}`)
  const [profilData, setProfilData] = useState([]);
  const { auth }  = useAuth()
  const {updateListBlocked} = useContext(UserContext)


    useEffect(() => {
        if (data) {
        setProfilData(data);
        }
    }, [data]);

    const handleUnblock = async () => {
        const url = `${BACKEND_URL}/user/${user.id}/block-unblock/`;
        try {
            const response = await fetch(url, {
                method:'DELETE' ,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.accessToken}`,
                },
            });

            if (response.ok) {
                SuccessToast(`User has been unblocked successfully.`);
        
            } else {
                const data = await response.json();
                ErrorToast(data.error || 'An error occurred.');

            }
        } catch (error) {
            console.error(`Error unblocking user:`, error);
            ErrorToast('An error occurred.');
         
        }
    };
    
    return (
        <div className='listBlockerItem'>
            <div className='blockedImageName'>
                <img src={`${BACKEND_URL}${profilData.avatar}`} alt="profil_pic" />
                <div className='blockedName'>
                    {profilData.username}
                </div>
            </div>
            <div className='unblockUserButton' onClick={handleUnblock}>
                <button>Unblock</button>
            </div>
        </div>
    )
}

export default ListBlockedItem