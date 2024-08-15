import React from 'react'
import { useState } from 'react'
import Icon from '../../../../assets/Icon/icons'
import { avatars } from '../../../../assets/assets'
import './joinedTournament.css'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import MainButton from '../../../../components/MainButton/MainButton'

function JoinedTournament() {
    const [joinedOwner, setjoinedOwner] = useState(true);
  return (
    <div className="joined-tournament">
       <h1 className='tournament-title'>You are in : Titel of Tournament</h1>
        <div  className='tournament-info-container'>
            <div className='tournament-info-item'>
                <Icon name='chump_cup' className="tournament-info-icon"/>
                <div className='tournament-info-item-txt'>
                    <p>20 000 coin</p>
                    <span>Total Prize Pool</span>
                </div>
            </div>
            <div className='tournament-info-item'>
                <Icon name='calendar' className="tournament-info-icon"/>
                <div className='tournament-info-item-txt'>
                    <p>30 Sep  18:00</p>
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
                    <span>UnderGround Hell</span>
                </div>
            </div>
            <div className='tournament-subscribers'>
                <div className='tournament-subscribers-avatars'>
                    <img className='image1' src={avatars[0].img}/>
                    <img className='image2' src={avatars[1].img}/>
                    <img className='image3' src={avatars[2].img}/>
                    <img className='image4' src={avatars[3].img}/>
                </div>
                <span className='tournament-subscribers-counter'>7/10 Joined</span>
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
                            <span>Perdoxii_noyat</span>
                            <span>Rank : Gold</span>
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

                    <MainButton type="submit" content="Start"/>
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