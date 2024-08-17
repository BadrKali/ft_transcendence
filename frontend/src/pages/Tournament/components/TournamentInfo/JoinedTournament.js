import React from 'react'
import { useState, useEffect } from 'react'
import useFetch from '../../../../hooks/useFetch'
import Icon from '../../../../assets/Icon/icons'
import { avatars } from '../../../../assets/assets'
import './joinedTournament.css'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import MainButton from '../../../../components/MainButton/MainButton'

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;


function JoinedTournament({TournamentData}) {
    const [joinedOwner, setjoinedOwner] = useState(true);
    const [profilData, setProfilData] = useState([]);
    const date = new Date(TournamentData.tournament_date);
    const {data ,isLoading, error} = useFetch(`${BACKEND_URL}/user/stats/${TournamentData.tournament_creator}`)


    const formattedDate = date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
    });

    const formattedTime = date.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
    });

    useEffect(() => {
        if (data) {
          setProfilData(data);
        }
      }, [data]);
      
    console.log(TournamentData)

  return (
    <div className="joined-tournament">
       <h1 className='tournament-title'>{TournamentData.tournament_name}</h1>
       
       <div className={`tournament-info-container ${TournamentData.tournament_map}`}>
            <div className='tournament-info-item'>
                <Icon name='chump_cup' className="tournament-info-icon"/>
                <div className='tournament-info-item-txt'>
                    <p>{TournamentData.tournament_prize}</p>
                    <span>Total Prize Pool</span>
                </div>
            </div>
            <div className='tournament-info-item'>
                <Icon name='calendar' className="tournament-info-icon"/>
                <div className='tournament-info-item-txt'>
                    <p>{`${formattedDate} ${formattedTime}`}</p>
                    <span>Tournament Start</span>
                </div>
            </div>
            <div className='tournament-info-item'>
                <Icon name='game_mode' className="tournament-info-icon"/>
                <div className='tournament-info-item-txt'>
                    <p>Game Mode</p>
                    <span>1 v 1 li mat khser</span>
                </div>
            </div>
            <div className='tournament-info-item'>
                <Icon name='location' className="tournament-info-icon"/>
                <div className='tournament-info-item-txt'>
                    <p>Map</p>
                    <span>{TournamentData.tournament_map}</span>
                </div>
            </div>
            <div className='tournament-subscribers'>
                <div className='tournament-subscribers-avatars'>
                {TournamentData.tournament_participants.map((player, index) => (
                    <img key={index} className={`image${index + 1}`} src={`${BACKEND_URL}${player.avatar}`} alt={`Player ${index + 1}`} />
               
                ))}
                </div>
                <span className='tournament-subscribers-counter'>
                    {TournamentData.tournament_participants.length}/4 Joined
                </span>
            </div>
        </div>
        <div className='tournament-desc'>
            <div className='tournament-desc-rules'>
                <div className='tournament-desc-rules-top'>
                    <h1>Attention Pongers</h1>
                    <p>simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled</p>
                </div>
                <div className='tournament-desc-rules-top'>
                    <h1>How Does It work ?</h1>
                    <p>simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled</p>
                </div>
            </div>
            <div className='tournament-top-player-container'>
                <div className='tournament-top-player'>
                    <div className='tournament-top-player-avatar'>
                        <img src={avatars[0].img}/>
                        <div className='nameRank'>
                            <span>{profilData.username}</span>
                            <span>Rank : {profilData.rank}</span>
                        </div>
                    </div>
                    <div className='tournament-top-player-stats'>
                        <div className='ownerWinRate'>
                            <CircularProgressbar
                                value={75}
                                text={`${75}%`}
                                styles={buildStyles({
                                    pathColor: '#F62943',
                                    textColor: '#F62943',
                                    trailColor: '#A9A6A6',
                                    backgroundColor: '#11141B',
                                })}
                            />
                            <p>WinRate</p>
                        </div>
                        <div className='ownerWinRate'>

                            <CircularProgressbar
                                value={30}
                                text={`${30}%`}
                                styles={buildStyles({
                                    pathColor: '#F62943',
                                    textColor: '#F62943',
                                    trailColor: '#A9A6A6',
                                    backgroundColor: '#11141B',
                                })}
                            />
                            <p>WinRate</p>

                            </div>
                            <div className='ownerWinRate'>

                            <CircularProgressbar
                                value={92}
                                text={`${92}%`}
                                styles={buildStyles({
                                    pathColor: '#F62943',
                                    textColor: '#F62943',
                                    trailColor: '#A9A6A6',
                                    backgroundColor: '#11141B',
                                })}
                            />
                            <p>WinRate</p>

                            </div>
                    </div>
                    
                </div>
                
            </div>
            
        </div>
        <div className='JoinedTournomanentButoon'>
            {joinedOwner ? (
                <div> 

                    <div
                        style={{
                            display: 'inline-block',
                            pointerEvents: TournamentData.tournament_participants.length < 4 ? 'none' : 'auto',
                            opacity: TournamentData.tournament_participants.length < 4 ? 0.5 : 1
                        }}
                    >
                        <MainButton type="submit" content="Start"/>
                    </div>
                    <MainButton type="submit" content="Cancle"/>
                </div>
            ) : (
                <div className='leaveTournomantButton'>
                    <MainButton type="submit" content="Leave"/>
                </div>
            )}
        </div>
    </div>
  )
}

export default JoinedTournament