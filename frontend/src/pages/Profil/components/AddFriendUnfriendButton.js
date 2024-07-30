import React, { useState, useEffect } from 'react'
import useAuth from '../../../hooks/useAuth';
import Icon from '../../../assets/Icon/icons'

function AddFriendUnfriendButton({ FriendId }) {
    const { auth }  = useAuth()
    const [isRequest, setIsRequst] = useState('Friend request does not exist.')

    useEffect(() => {
        const fetchRequestStatus = async () => {
            const url = `http://localhost:8000/user/friends-request/${FriendId}/`;
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
                    setIsRequst(data.message)
                    console.log(data.message);
                } else {
                    console.error('Error fetching block status:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching block status:', error);
            }
        };

        fetchRequestStatus();
    }, [FriendId]);

    const handleAddFriend = async () => {
        try {
            const response = await fetch(`http://localhost:8000/user/friends-request/${FriendId}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth.accessToken}`,
            },
            body: JSON.stringify({})
            });

            if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'An error occurred while sending the friend request.');
            }

            const data = await response.json();
            alert(data.message);
            setIsRequst('Friend request already exists.');

        } catch (error) {
            alert(error.message);
        }
    };

    const handleCancelRequest = async () => {
        try {
            const response = await fetch(`http://localhost:8000/user/friends-request/${FriendId}/`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth.accessToken}`,
            },
            body: JSON.stringify({})
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'An error occurred while sending the friend request.');
            }

            const data = await response.json();
            alert(data.message);
            setIsRequst('Friend request does not exist.');
        } catch (error) {
            alert(error.message);
        }
    };

    const handleUnfriend = async () => {
        try {
            const response = await fetch(`http://localhost:8000/user/friend/${FriendId}/`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.accessToken}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'An error occurred while unfriending the user.');
            }

            const data = await response.json();
            alert(data.message);
            setIsRequst('Friend request does not exist.');
        } catch (error) {
            alert(error.message);
        }
    };
    
    const getButtonAction = () => {
        switch (isRequest) {
            case 'Friend request does not exist.':
                return { text: 'Add Friend', action: handleAddFriend };
            case 'Friend request exists.':
                return { text: 'Cancel Request', action: handleCancelRequest };
            case 'Friends':
                return { text: 'Unfriend', action: handleUnfriend };
            default:
                return { text: 'Add Friend', action: handleAddFriend };
        }
    };

    const { text, action } = getButtonAction();
    return (
        <div className='AddFriend-button profil-button' onClick={action}>
            <Icon name='AddFriend' className='Add-Friend profil-icon' />
            <p>{text}</p>
        </div>
    )
}

export default AddFriendUnfriendButton