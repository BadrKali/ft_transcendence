import React from 'react'
import { useEffect, useState } from 'react';
import useFetch from '../../hooks/useFetch';
import useAuth from '../../hooks/useAuth';
import './listBlockedItem.css'

function ListBlockedItem({user}) {
  const {data ,isLoading, error} = useFetch(`http://localhost:8000/user/stats/${user.id}`)
  const [profilData, setProfilData] = useState([]);
  const { auth }  = useAuth()


  useEffect(() => {
    if (data) {
      setProfilData(data);
    }
  }, [data]);

    const handleUnblock = async () => {
        const url = `http://localhost:8000/user/${user.id}/block-unblock/`;
        try {
            const response = await fetch(url, {
                method:'DELETE' ,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.accessToken}`,
                },
            });

            if (response.ok) {
                alert(`User has been unblocked successfully.`);
            } else {
                const data = await response.json();
                alert(data.error || 'An error occurred.');
            }
        } catch (error) {
            console.error(`Error unblocking user:`, error);
            alert('An error occurred.');
        }
    };
    
    return (
        <div className='listBlockerItem'>
            <div className='blockedImageName'>
                <img src={`http://127.0.0.1:8000${profilData.avatar}`} alt="profil_pic" />
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