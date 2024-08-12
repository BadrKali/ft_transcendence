import React from 'react'
import { useState } from 'react';
import CreatTournamentPopUp from './CreatTournamentPopUp'
import './noTournament.css'
import MainButton from '../../../../components/MainButton/MainButton';

function NoTournament() {
    const [modalCreat, setModalCreat] = useState(false);

    const handleCreatTournament = () => {
        setModalCreat(true);
    }

    const handleClosePopup = () => {
        setModalCreat(false)
    }
  return (
    <div className="no-tournament">
        <div className="tournament-page">
            <div className="how-it-works-section">
                <h1>Welcome to the Tournament Creator</h1>
                <h2>How It Works</h2>
                <div className="steps-container">
                <div className="step">
                    <div className="icon">🏓</div>
                    <h3>Step 1</h3>
                    <p>Choose Your Tournament Name and Format</p>
                </div>
                <div className="step">
                    <div className="icon">📅</div>
                    <h3>Step 2</h3>
                    <p>Set the Date, Time, and Player Count</p>
                </div>
                <div className="step">
                    <div className="icon">🔗</div>
                    <h3>Step 3</h3>
                    <p>Share the Invite and Let the Fun Begin!</p>
                </div>
                </div>
            </div>

  
            <div className="why-create-section">
                <h2>Why Create Your Own Tournament</h2>
                <div className="benefits-container">
                <div className="benefits">
                    <ul>
                    <li>✅ Full Control: Customize everything</li>
                    <li>✅ Easy Management: Track scores easily</li>
                    <li>✅ Social Interaction: Engage with players</li>
                    </ul>
                </div>
            
                </div>
            </div>

            <div className="examples-section">
                <h2>Popular Tournaments</h2>
                <div className="examples-container">
                <div className="example undergroundHell">
                    {/* <img src="tournament1.jpg" alt="Summer Ping Pong Slam" /> */}
                    <h3>Summer Ping Pong Slam</h3>
                    <p>A fun tournament with friends!</p>
                </div>
                <div className="example undergroundForest">
                    {/* <img src="tournament2.jpg" alt="Weekend Warriors’ Tournament" /> */}
                    <h3>Weekend Warriors’ Tournament</h3>
                    <p>Compete over the weekend!</p>
                </div>
                <div className="example undergroundGraveyard">
                    {/* <img src="tournament3.jpg" alt="Office Showdown" /> */}
                    <h3>Office Showdown</h3>
                    <p>Who’s the best in the office?</p>
                </div>
                </div>
            </div>

        </div>
        <div className='CreatYourTournament'>
            <h2>Your Tournament, Your Rules – Ready to Get Started?</h2>
            <div className='StartedTournamentButton'>

                <MainButton type="submit" functionHandler={handleCreatTournament} content="Started"/>
                {/* <button onClick={handleCreatTournament}>Creat Tournament</button> */}
                </div>
                <CreatTournamentPopUp isOpen={modalCreat} onClose={handleClosePopup}/>
        </div>
    </div>
  )
}

export default NoTournament