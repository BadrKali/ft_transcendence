import React, { useState, useEffect } from 'react';
import useAuth from '../../../hooks/useAuth';
import Icon from '../../../assets/Icon/icons';
import { InfoToast } from '../../../components/ReactToastify/InfoToast';
import { ErrorToast } from '../../../components/ReactToastify/ErrorToast';
import { SuccessToast } from '../../../components/ReactToastify/SuccessToast';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;



const BlockUnblockButton = ({ blockedId ,isBlockedMe }) => {
    const [isBlocked, setIsBlocked] = useState(false);
    const { auth }  = useAuth()



    useEffect(() => {
        const fetchBlockStatus = async () => {
            const url = `${BACKEND_URL}/user/${blockedId}/block-unblock/`;
            try {
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${auth.accessToken}`,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setIsBlocked(data.is_blocked);
                } else {
                    console.error('Error fetching block status:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching block status:', error);
            }
        };

        fetchBlockStatus();
    }, [blockedId]);

    const handleBlockUnblock = async () => {
        const url = `${BACKEND_URL}/user/${blockedId}/block-unblock/`;
        try {
            const response = await fetch(url, {
                method: isBlocked ? 'DELETE' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.accessToken}`,
                },
            });

            if (response.ok) {
                setIsBlocked(!isBlocked);
                SuccessToast(`User has been ${isBlocked ? 'unblocked' : 'blocked'} successfully.`);
                // alert(`User has been ${isBlocked ? 'unblocked' : 'blocked'} successfully.`);
            } else {
                const data = await response.json();
                ErrorToast(data.error || 'An error occurred.');
                // alert(data.error || 'An error occurred.');
            }
        } catch (error) {
            console.error(`Error ${isBlocked ? 'unblocking' : 'blocking'} user:`, error);
            ErrorToast('An error occurred.');
            // alert('An error occurred.');
        }
    };


    return (
        <div className={`BlockFriend-button profil-button ${isBlockedMe ? 'disabled' : ''}`} onClick={handleBlockUnblock}>
            <Icon name="BlockFriend" className='Block-Friend profil-icon' />
            <p>{isBlocked ? 'Unblock' : 'Block'}</p>
        </div>
    );
};

export default BlockUnblockButton;
