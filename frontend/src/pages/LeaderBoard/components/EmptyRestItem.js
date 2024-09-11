import React from 'react'
import './restItem.css'
import { avatars } from '../../../assets/assets';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;


function EmptyRestItem({ index}) {
    const ifOdd = index % 2 ? true : false;
  const unknownAvatar = avatars[4].img;

    console.log(index)
    return (
        <div className={ifOdd ? 'listPlayerContainer' : 'listPlayerContainer Odd'}   style={{ animationDelay: `${index * 0.1}s` }} >
            <div className='number'>
                <p>{index}</p>
            </div>
            <div className='listPlayerInfo'>
                <div className='PlayerImageName'>
                    <div className='playerImage'>
                        <img src={unknownAvatar}/>
                    </div>
                    <div className='PlayerName'>
                        <p>uknown player</p>
                    </div>
                </div>
                
                <div className='PlayerTotal'>
                    <p>0</p>
                </div>
                <div className='PlayerWin'>
                    <p>0%</p>
                </div>
                <div className='PlayerLoss'>
                    <p>0%</p>
                </div>
                <div className='PlayerRank'>
                    <p>none</p>
                </div>
    
            </div>
        </div>
    )
}

export default EmptyRestItem