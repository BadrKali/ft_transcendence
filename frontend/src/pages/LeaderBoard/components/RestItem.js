import React from 'react'
import './restItem.css'

function RestItem({players}) {
    const ifOdd = players.id % 2 ? true : false;

    return (
        <div className={ifOdd ? 'listPlayerContainer' : 'listPlayerContainer Odd'}>
            <div className='number'>
                <p>{players.id}</p>
            </div>
            <div className='listPlayerInfo'>
                <div className='PlayerImageName'>
                    <div className='playerImage'>
                        <img src={players.image}/>
                    </div>
                    <div className='PlayerName'>
                        <p>{players.username}</p>
                    </div>
                </div>
                
                <div className='PlayerTotal'>
                    <p>{players.total_games}</p>
                </div>
                <div className='PlayerWin'>
                    <p>{players.wins}%</p>
                </div>
                <div className='PlayerLoss'>
                <p>{players.losses}%</p>
                </div>
                <div className='PlayerRank'>
                <p>{players.rank}</p>
                </div>
    
            </div>
        </div>
    )
}

export default RestItem