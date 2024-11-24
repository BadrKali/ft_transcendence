import React from 'react'
import { useState, useEffect, useContext } from 'react';
import useAuth from '../../../../hooks/useAuth';
import useFetch from '../../../../hooks/useFetch';
import Icon from '../../../../assets/Icon/icons';
import { ErrorToast } from '../../../../components/ReactToastify/ErrorToast';
import CreatTournamentPopUp from './CreatTournamentPopUp'
import Lottie from 'lottie-react';
import './noTournament.css'
import MainButton from '../../../../components/MainButton/MainButton';
import Select from 'react-select';
import PlayerSelectedItem from './PlayerSelectedItem';
import popularTournaments from '../../../../assets/tournament';
import PopularTournaments from './PopularTournaments';
import sadFace from '../../../../assets/sadFace.json'
import { useTranslation } from 'react-i18next'
import { UserContext } from '../../../../context/UserContext';
import Forest from '../../../Game/Game-assets/forest.png';
import Hell from '../../../Game/Game-assets/hell.png';
import Grave from '../../../Game/Game-assets/graveyard.png'
import CreatTournamentOnline from './CreatTournamentOnline';
import CreatTournamentOffline from './CreatTournamentOffline';


const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function NoTournament({setJoinedTournament}) {
    const { auth }  = useAuth()
    const [selectedPlayers, setSelectedPlayers] = useState([]);
    const [selectedMap, setSelectedMap] = useState('');
    const [tournamentTitle, setTournamentTitle] = useState('');
    const [listFriend, setListFriend] = useState([]);
    const {data ,isLoading, error} = useFetch(`${BACKEND_URL}/api/user/friends/list/`)
    const [MapError, setMapError] = useState(false);
    const [NameError, setNameError] = useState(false);
    const [PlayersError, setPlayersError] = useState(false);
    const {updatetounament, userData} = useContext(UserContext)
    const [username, setUsername] = useState('');
    const [players, setPlayers] = useState([]);
    const [isOnline, setIsOnline] = useState(true);
    const { t } = useTranslation();


    useEffect(() => {
        if (data) {
          setListFriend(data);
        }
      }, [data]);

    const handleMapSelection = (mapName) => {
        setSelectedMap(mapName);
        setMapError(false)
    };

    const handlePlayerSelection = (selectedOptions) => {
        setSelectedPlayers(selectedOptions || []);
        setPlayersError(false)
    };

    const handleAddPlayer = () => {
        if (username.trim() !== '') {
            const newPlayer = { username }; 
            setPlayers((prevPlayers) => [...prevPlayers, newPlayer]);
            setUsername(''); 
            setPlayersError(false)

        }
    };

    const handleTitleChange = (event) => {
        setTournamentTitle(event.target.value);
        setNameError(false)
    };


    const handleCreateTournament = async () => {


        const postData = {
            tournament_name: tournamentTitle,
            tournament_map: selectedMap,
            invitedUsers: players.map(player => player.username),
        };

        if (!selectedMap){
            setMapError(true)
        }else{
            setMapError(false)
        }

        if (!tournamentTitle){
            setNameError(true)
        }else{
            setNameError(false)
        }

        if (players.length === 0 || players.length > 3){
            setPlayersError(true)
        }else{
            setPlayersError(false)
        }
        try {
            const response = await fetch(`${BACKEND_URL}/api/user/local-tournament/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.accessToken}`,
                    
                },
                body: JSON.stringify(postData)
            });
            if (response.ok) {

                const TournamentResponse = await fetch(`${BACKEND_URL}/api/user/local-tournament/`, {
                method: 'GET',
                    headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.accessToken}`
                    }
                });
                
                if (!TournamentResponse.ok) {
                    throw new Error('Network response was not ok');
                }
                const updatedTournamentData = await TournamentResponse.json();
                updatetounament(updatedTournamentData);
            } else {
                const errorData = await response.json();
        
                ErrorToast(t(errorData.invitedUsers[0]));

            }
        } catch (error) {

            console.error('Error creating tournament:', error);
        } 
    };

    const handleRemovePlayer = (indexToRemove) => {
        setPlayers(players.filter((_, index) => index !== indexToRemove));
    };


   


    return (
        <div className='sections-container'>
                 
        <div className='tabsContainer-tornament'>

        <div className="Online-OfflineTabs">
            <button 
            className={isOnline ? 'active' : ''} 
            onClick={() => setIsOnline(true)}
            >
            Online
            </button>
            <button 
            className={!isOnline ? 'active' : ''} 
            onClick={() => setIsOnline(false)}
            >
            Offline
            </button>
        </div>
                </div>
                {isOnline ? 
                <CreatTournamentOnline />
                :
                <CreatTournamentOffline />    
            }

        </div>
    )
}

export default NoTournament