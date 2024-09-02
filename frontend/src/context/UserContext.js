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


    const { data: userDataFetch, isLoading: userLoading, isError: userDataError } = useFetch(`${BACKEND_URL}/user/stats/`);
    const { data: userAchievementsFetch, isLoading: achievementsLoading, isError: userAchievementsError } = useFetch(`${BACKEND_URL}/api/game/achievements/me`);
    const { data: userFriendsFetch, isLoading: friendsLoading, isError: userFriendsError } = useFetch(`${BACKEND_URL}/user/friends/list/`);
    const { data: matchHistoryFetch, isLoading: matchHistoryLoadingFetch, isError: matchHistoryError } = useFetch(`${BACKEND_URL}/api/game/game-history/`);

    useEffect(() => {
        if (userDataFetch) {
            setUserData(userDataFetch);
            setUserDataLoading(false);
        }
    }, [userDataFetch]);

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
            updateUserData, 
            updateUserAchievements,
            updateUserFriends,
            updateMatchHistory
        }}>
            {children}
        </UserContext.Provider>
    );
};