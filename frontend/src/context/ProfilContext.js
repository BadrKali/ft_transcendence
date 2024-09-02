import React, { createContext, useState, useEffect } from 'react';
import useFetch from '../hooks/useFetch';
import useAuth from '../hooks/useAuth';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const ProfileContext = createContext();

export const ProfileProvider = ({ children, userId }) => {
    const { auth }  = useAuth()
    const [profilData, setProfileData] = useState(null);
    const [profileDataLoading, setProfileDataLoading] = useState(true);
    const [profileAchievements, setProfileAchievements] = useState(null);
    const [profileAchievementsLoading, setProfileAchievementsLoading] = useState(true);
    const [profileFriends, setProfileFriends] = useState(null);
    const [profileFriendsLoading, setProfileFriendsLoading] = useState(true);
    const [profileMatchHistory, setProfileMatchHistory] = useState(null);
    const [profileMatchHistoryLoading, setProfileMatchHistoryLoading] = useState(true);
    const [profilisBlocked, setIsBlocked] = useState(false);
    const [isBlockedMe, setIsBlockedMe] = useState(false);
    const [isBlockingHim, setIsBlocking] = useState(false); 

    useEffect(() => {
        const fetchBlockStatus = async () => {
            const url = `${BACKEND_URL}/user/${userId}/block-unblock/`;
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
    }, [userId, auth.accessToken]);


    useEffect(() => {
        const fetchProfileData = async () => {
            const url = `${BACKEND_URL}/user/stats/${userId}`;
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
                    setProfileData(data);
                    setIsBlockedMe(data.is_blocked);
                    setIsBlocking(data.is_blocking);

                } else {
                    console.error('Error fetching profile data:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching profile data:', error);
            } finally {
                setProfileDataLoading(false);
            }
        };

        fetchProfileData();
    }, [userId, auth.accessToken]);

    useEffect(() => {
        const fetchProfileAchievements = async () => {
            const url = `${BACKEND_URL}/user/${userId}/achievements/`;
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
                    setProfileAchievements(data);
                } else {
                    console.error('Error fetching profile achievements:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching profile achievements:', error);
            } finally {
                setProfileAchievementsLoading(false);
            }
        };

        fetchProfileAchievements();
    }, [userId, auth.accessToken]);

    useEffect(() => {
        const fetchProfileFriends = async () => {
            const url = `${BACKEND_URL}/user/${userId}/friends/list/`;
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
                    setProfileFriends(data);
                } else {
                    console.error('Error fetching profile friends:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching profile friends:', error);
            } finally {
                setProfileFriendsLoading(false);
            }
        };

        fetchProfileFriends();
    }, [userId, auth.accessToken]);

    useEffect(() => {
        const fetchProfileMatchHistory = async () => {
            const url = `${BACKEND_URL}/user/${userId}/game-history/`;
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
                    setProfileMatchHistory(data);
                } else {
                    console.error('Error fetching profile match history:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching profile match history:', error);
            } finally {
                setProfileMatchHistoryLoading(false);
            }
        };

        fetchProfileMatchHistory();
    }, [userId, auth.accessToken]);

  




    const updateProfileData = (newData) => {
        setProfileData((prevData) => ({
            ...prevData,
            ...newData,
        }));
    };

    const updateProfileAchievements = (newAchievements) => {
        setProfileAchievements((prevAchievements) => ({
            ...prevAchievements,
            ...newAchievements,
        }));
    };

    const updateProfileFriends = (newFriends) => {
        setProfileFriends(newFriends);
    };

    const updateProfileMatchHistory = (newMatches) => {
        setProfileMatchHistory((prevMatches) => ({
            ...prevMatches,
            ...newMatches,
        }));
    };

    return (
        <ProfileContext.Provider value={{
            profilData,

            profileAchievements,

            profileFriends,
    
            profileMatchHistory,
            profilisBlocked,
            isBlockedMe,
            isBlockingHim,
            // profileMatchHistoryError,
            updateProfileData,
            updateProfileAchievements,
            updateProfileFriends,
            updateProfileMatchHistory,
            setIsBlocked,
            setIsBlockedMe,
            setIsBlocking,

    

        }}>
            {children}
        </ProfileContext.Provider>
    );
};
