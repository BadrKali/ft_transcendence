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
            <div className='Arena-container'>
                <h4>{t('Arena')}</h4>
                <p>{t('Select default arena theme')}</p>
                <div className='maps-tournomant'>
                    <div
                        className={`undergroundHell underground ${selectedMap === 'hell' ? 'selectedUnderground' : ''}`}
                        onClick={() => handleMapSelection('hell')}
                        >
                            <img src={Hell} alt="Forest" />

                        </div>
                    <div
                        className={`undergroundForest underground ${selectedMap === 'forest' ? 'selectedUnderground' : ''}`}
                        onClick={() => handleMapSelection('forest')}
                        >
                            <img src={Forest} alt="Forest" />

                        </div>
                    <div
                        className={`undergroundGraveyard underground ${selectedMap === 'graveyard' ? 'selectedUnderground' : ''}`}
                        onClick={() => handleMapSelection('graveyard')}
                        >
                            <img src={Grave} alt="Forest" />

                        </div>
                </div>
                {MapError && <p className="error-message">No map selected{t('FRIENDS')}</p>}
            </div>
            <div className='selectTitle-container'>
                <h4>{t('Tournament Title')}</h4>
                <p>{t('Type your tournament title')}</p>
                <div className='selectNameInput'>
                            <input
                                placeholder={t('tournament title')} 
                                type='text'
                                value={tournamentTitle}
                                onChange={handleTitleChange}
                            />
                            <Icon name='inputTournamant' className='inputTournamant-icon' />
                </div>
                {NameError && <p className="error-message"> {t('You need to choice a Title')}</p>}

            </div>
            <div className='selectPlayer-container '>
                <h4>{t('Select Players')}</h4>
                <p>{t('Select Players for your tournament')}</p>
                <div className='displayPlayers'>
                    <div className='playerselectedOwner'>
                        <div className='slectedPlayerItemOwner'>
                            <div className='imagePlayerSelectedOwner'>
                                <img src={`${BACKEND_URL}${userData.avatar}`}/>
                            </div>
                            <p>{userData.username}</p>
                        </div>
                    </div>
                    <div className='playerselected'>
                        {players.map((player, index) => (
                            <PlayerSelectedItem key={index} player={player} onRemove={() => handleRemovePlayer(index)} />
                        ))
                    }
                    </div>
                </div>
                <div className='selectNameInput'>
                            <input
                                placeholder={t('username')}
                                type='text'
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                disabled={players.length >= 3}
                            />
                            <p className="AddClick"onClick={handleAddPlayer}>ADD{t('FRIENDS')}</p>
                </div>
            </div>
            <div className='tournamentButton-container'>
                    <div className='CreatTournamentButton'>
                        <MainButton type="submit" functionHandler={handleCreateTournament} content="Creat" />
                    </div>
            </div>
            {PlayersError && <p className="error-message">{t('Player selected must be 4 in Total')}</p>}

        </div>
    )
}

export default NoTournament