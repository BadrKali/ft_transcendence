import React, { createContext, useState, useEffect } from 'react';
import useFetch from '../hooks/useFetch';
import useAuth from '../hooks/useAuth';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [userData, setUserData] = useState(null);
    const [userDataLoading, setUserDataLoading] = useState(true);
    const [userAchievements, setUserAchievements] = useState(null);
    const [userAchievementsLoading, setUserAchievementsLoading] = useState(true);
    const [userFriends, setUserFriends] = useState(null);
    const [userFriendsLoading, setUserFriendsLoading] = useState(true);
    const [matchHistory, setMatchHistory] = useState(null);
    const [matchHistoryLoading, setMatchHistoryLoading] = useState(true);
    const [notifications, setNotifications] = useState(null);
    const [TounamentData, setTounamentData] = useState(null);
    const [TounamenrLoading, setTournamentLoading] = useState(true);
    const [blockedUsers, setBlockedUsers] = useState([]);





    const { data: userDataFetch, isLoading: userLoading, isError: userDataError } = useFetch(`${BACKEND_URL}/user/stats/`);
    const { data: userAchievementsFetch, isLoading: achievementsLoading, isError: userAchievementsError } = useFetch(`${BACKEND_URL}/api/game/achievements/me`);
    const { data: userFriendsFetch, isLoading: friendsLoading, isError: userFriendsError } = useFetch(`${BACKEND_URL}/user/friends/list/`);
    const { data: matchHistoryFetch, isLoading: matchHistoryLoadingFetch, isError: matchHistoryError } = useFetch(`${BACKEND_URL}/api/game/game-history/`);
    const { data: NotificationFetch, isLoading: NotificationLoadingFetch, isError: NotificationError } = useFetch(`${BACKEND_URL}/user/notifications/`);
    const {data : TounamentFetch ,isLoading: TournamentisLoading, error : TournamentError} = useFetch(`${BACKEND_URL}/user/tournament/`)
    const {data : blockedUsersFetch ,isLoading: blockedUsersisLoading, error : blockedUsersError} = useFetch(`${BACKEND_URL}/user/block-unblock/`)
  
    useEffect(() => {
        if (userDataFetch) {
            setUserData(userDataFetch);
            setUserDataLoading(false);
        }
    }, [userDataFetch]);


    useEffect(() => {
        if (TounamentFetch) {
            setTounamentData(TounamentFetch);
            setTournamentLoading(false)
        }
    }, [TounamentFetch]);

    useEffect(() => {
        if (blockedUsersFetch) {
            setBlockedUsers(blockedUsersFetch);
        }

    }, [blockedUsersFetch]);

    useEffect(() => {
        if (NotificationFetch) {
            setNotifications(NotificationFetch);
        
        }
    }, [NotificationFetch]);

    useEffect(() => {
        if (userAchievementsFetch) {
            setUserAchievements(userAchievementsFetch);
            setUserAchievementsLoading(false);
        }
    }, [userAchievementsFetch]);

    useEffect(() => {
        if (userFriendsFetch) {
            setUserFriends(userFriendsFetch);
            setUserFriendsLoading(false);
        }
    }, [userFriendsFetch]);

    useEffect(() => {
        if (matchHistoryFetch) {
            setMatchHistory(matchHistoryFetch);
            setMatchHistoryLoading(false);
        }
    }, [matchHistoryFetch]);

    const updateUserData = (newData) => {
        setUserData((prevData) => ({
            ...prevData,
            ...newData,
        }));
    };

    const updateUserAchievements = (newAchievements) => {
        setUserAchievements((prevAchievements) => ({
            ...prevAchievements,
            ...newAchievements,
        }));
    };

    const updateUserFriends = (newFriends) => {
        setUserFriends(newFriends);
    };

    const updatetounament = (newTournament) => {
        setTounamentData(newTournament);
    };

    const updateBlockedList = (newBlockedList) => {
        setBlockedUsers(newBlockedList);
    };


    const updateUserNotification = (newNotifcation) => {
        setNotifications(newNotifcation);
    };


    const updateMatchHistory = (newMatches) => {
        setMatchHistory((prevMatches) => ({
            ...prevMatches,
            ...newMatches,
        }));
    };

    return (
        <UserContext.Provider value={{
            userData, 
            userDataLoading, 
            userDataError, 
            userAchievements, 
            userAchievementsLoading, 
            userAchievementsError,
            userFriends,
            userFriendsLoading,
            userFriendsError,
            matchHistory,
            matchHistoryLoading,
            matchHistoryError,
            notifications,
            TounamentData,
            TounamenrLoading,
            blockedUsers,
            updateUserData, 
            updateUserAchievements,
            updateUserFriends,
            updateMatchHistory,
            updateUserNotification,
            setNotifications,
            updatetounament,
            updateBlockedList,
            
        }}>
            {children}
        </UserContext.Provider>
    );
};