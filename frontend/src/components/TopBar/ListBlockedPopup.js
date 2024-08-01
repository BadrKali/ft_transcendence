import React, { useState } from 'react';
import { useEffect} from 'react';
import useAuth from '../../hooks/useAuth';
import './listBlockedPopup.css'
import ListBlockedItem from './ListBlockedItem';

const ListBlockedPopup = ({ isOpen, onClose})=> {
    const { auth }  = useAuth()
    const [blockedUsers, setBlockedUsers] = useState([]);

    useEffect(() => {
        const fetchRequestStatus = async () => {
            const url = `http://localhost:8000/user/block-unblock/`;
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
                    setBlockedUsers(data.
                        blocked_users)
                    
                } else {
                    console.error('Error fetching block status:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching block status:', error);
            }
        };
        
        fetchRequestStatus();
    }, [isOpen]);

    if (!isOpen) {
        return null;
    }
  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="modal-close-button" onClick={onClose}>&times;</button>
        <h2>List Blocked</h2>
        <div className='listBlocked'>
            {blockedUsers.length > 0 ? (
                blockedUsers.map((user) => (
                    <ListBlockedItem key={user.id} user={user}/>
                ))
            ) : (
                <p>No blocked users found.</p>
            )}
        </div>
      </div>
    </div>
  );
};

export default ListBlockedPopup;