import React, { useState, useContext } from 'react';
import { useEffect} from 'react';
import useAuth from '../../../../hooks/useAuth';
import useFetch from '../../../../hooks/useFetch';
import Select from 'react-select';
import './creatTournamentPopUp.css';
import History from '../../../../assets/MatchHistoryData';
import Icon from '../../../../assets/Icon/icons';
import PlayerSelectedItem from './PlayerSelectedItem';
import MainButton from '../../../../components/MainButton/MainButton';
import { UserContext } from '../../../../context/UserContext';
import { useTranslation } from 'react-i18next'
import Forest from '../../../Game/Game-assets/forest.png';
import Hell from '../../../Game/Game-assets/hell.png';
import Grave from '../../../Game/Game-assets/graveyard.png'
import { clientSocketContext } from '../../../Chat/usehooks/ChatContext';
import PlayerSelectedItemOnline from './PlayerSelectedItemOnline';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;


const CreatTournamentOnline = ({onClose}) => {
    const { auth }  = useAuth()
    const [selectedPlayers, setSelectedPlayers] = useState([]);
    const [selectedMap, setSelectedMap] = useState('');
    const [tournamentTitle, setTournamentTitle] = useState('');
    const [listFriend, setListFriend] = useState([]);
    const {data ,isLoading, error} = useFetch(`${BACKEND_URL}/api/user/friends/list/`)
    const [MapError, setMapError] = useState(false);
    const [NameError, setNameError] = useState(false);
    const [PlayersError, setPlayersError] = useState(false);
    const {updatetounament , userData} = useContext(UserContext)
    const { t } = useTranslation();
    const {stateValue: clientSocket} = useContext(clientSocketContext);



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


    const handleTitleChange = (event) => {
        setTournamentTitle(event.target.value);
        setNameError(false)
    };


    const handleCreateTournament = async () => {


        const postData = {
            tournament_name: tournamentTitle,
            tournament_map: selectedMap,
            invitedUsers: selectedPlayers.map(player => player.value),
        };
        // ADDED BY CanisLupus just to test Backend and It work as entended 
        // clientSocket.send(JSON.stringify({type: '_warn_tournament_users_', messageData : [2] }))
        
        if (!selectedMap){
            setMapError(true)
            return;
        }else{
            setMapError(false)
        }

        if (!tournamentTitle){
            setNameError(true)
            return;
        }else{
            setNameError(false)
        }

        if (selectedPlayers.length !== 3){
            setPlayersError(true)
            return;
        }else{
            setPlayersError(false)
        }

        try {
            const response = await fetch(`${BACKEND_URL}/api/user/tournament/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.accessToken}`,
                    
                },
                body: JSON.stringify(postData)
            });
            if (response.ok) {
           
                const TournamentResponse = await fetch(`${BACKEND_URL}/api/user/tournament/`, {
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
            }
        } catch (error) {

            console.error('Error creating tournament:', error);
        } 
    };

    const playerOptions = listFriend.map((player) => ({
        value: player.id,
        label: player.username,
        avatar: player.avatar
    }));


    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            backgroundColor: '#1C1E27',
            borderColor: state.isFocused ? '#555' : '#1C1E27',
            color: '#FFF',
            boxShadow: state.isFocused ? '0 0 0 1px #555' : 'none',
            '&:hover': {
                borderColor: '#555',
            },
        }),
        menu: (provided) => ({
            ...provided,
            backgroundColor: '#1C1E27',
            color: '#FFF',
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isFocused ? '#555' : '#1C1E27',
            color: '#FFF',
            '&:hover': {
                backgroundColor: '#555',
            },
        }),
        multiValue: (provided) => ({
            ...provided,
            backgroundColor: '#333',
            color: '#FFF',
        }),
        multiValueLabel: (provided) => ({
            ...provided,
            color: '#FFF',
        }),
        multiValueRemove: (provided) => ({
            ...provided,
            color: '#FFF',
            '&:hover': {
                backgroundColor: '#555',
                color: '#FFF',
            },
        }),
        placeholder: (provided) => ({
            ...provided,
            color: '#AAA',
        }),
        singleValue: (provided) => ({
            ...provided,
            color: '#FFF',
        }),
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
                {MapError && <p className="error-message">{t('No map selected')}</p>}
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
                {NameError && <p className="error-message">{t('You need to choice a Title')} </p>}

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
                        {selectedPlayers.map((player) => (
                            <PlayerSelectedItemOnline key={player.value} player={player}/>
                        ))
                    }
                    </div>
                </div>
                 <Select
                    isMulti
                    options={playerOptions}
                    value={selectedPlayers}
                    onChange={handlePlayerSelection}
                    className='playerSelect'
                    styles={customStyles}
                    placeholder={t('Select players...')}
                    isDisabled={selectedPlayers.length >= 3}
                />
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

export default CreatTournamentOnline