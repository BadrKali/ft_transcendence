import React, { useState } from 'react';
import { useEffect} from 'react';
import Select from 'react-select';
import './creatTournamentPopUp.css';
import History from '../../../../assets/MatchHistoryData';
import Icon from '../../../../assets/Icon/icons';
import PlayerSelectedItem from './PlayerSelectedItem';


const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;


const CreatTournamentPopUp = ({ isOpen, onClose})=> {

    const [selectedPlayers, setSelectedPlayers] = useState([]);
    const [selectedMap, setSelectedMap] = useState('');

    const handleMapSelection = (mapName) => {
        setSelectedMap(mapName);
    };

    const playerOptions = History.match_history.map((history) => ({
        value: history.id,
        label: history.player_name,
        image: history.image
    }));

    const handlePlayerSelection = (selectedOptions) => {
        setSelectedPlayers(selectedOptions || []);
    };

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

    const [blockedUsers, setBlockedUsers] = useState([]);

    console.log(isOpen)
    if (!isOpen) {
        return null;
    }
  return (
    <div className="modal-creatTournament">
      <div className="modal-creatTournamentPopup">
        <button className="modal-close-button" onClick={onClose}>&times;</button>
        <div className='sections-container'>
            <div className='Arena-container'>
                <h4>Arena</h4>
                <p>Select default arena theme</p>
                <div className='maps-tournomant'>
                    <div
                        className={`undergroundHell mapBox ${selectedMap === 'undergroundHell' ? 'selected' : ''}`}
                        onClick={() => handleMapSelection('undergroundHell')}
                    ></div>
                    <div
                        className={`undergroundForest mapBox ${selectedMap === 'undergroundForest' ? 'selected' : ''}`}
                        onClick={() => handleMapSelection('undergroundForest')}
                    ></div>
                    <div
                        className={`undergroundGraveyard mapBox ${selectedMap === 'undergroundGraveyard' ? 'selected' : ''}`}
                        onClick={() => handleMapSelection('undergroundGraveyard')}
                    ></div>
                </div>
            </div>
            <div className='selectTitle-container'>
                <h4>Tournament Title</h4>
                <p>Type your tournament title</p>
                <div className='selectNameInput'>
                    <input placeholder='tournament title'  type='text' />
                    <Icon name='inputTournamant' className='inputTournamant-icon'/>
                </div>
            </div>
            <div className='selectPlayer-container '>
                <h4>Select Players</h4>
                <p>Select Players for your tournament</p>
                <div className='playerselected'>
                    {selectedPlayers.map((player) => (
                        <PlayerSelectedItem key={player.id} player={player}/>
                    ))

                    }
                </div>
                 <Select
                    isMulti
                    options={playerOptions}
                    value={selectedPlayers}
                    onChange={handlePlayerSelection}
                    className='playerSelect'
                    styles={customStyles}
                    placeholder="Select players..."
                />
            </div>
        </div>
      </div>
    </div>
  );
};

export default CreatTournamentPopUp;