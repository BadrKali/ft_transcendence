import React from 'react'
import './TournamentBracket.css'
import TournamentsItem from './TournamentsItem'
import Icon from '../../../../assets/Icon/icons'
import EightPlayer from '../../../../assets/TournamentEightPlayer'
import FourPlayer from '../../../../assets/TournamentFourPlayers'
import TwoPlayer from '../../../../assets/TournamentTwoPlayers'

function TournamentBracket() {
  const four_lines = new Array(4).fill(null);
  const two_lines = new Array(2).fill(null);
  const one_lines = new Array(1).fill(null);

  return (
    <div className='bracket-container'>
        {/* <div className="first-eight-players">
            <div className="player-items">
                {EightPlayer.map((players) => (
                  <TournamentsItem key={players.id} players={players}/>
                ))}
            </div>
            <div className="eight-lines">
                 {four_lines.map((_, index) => (
                    <div className="two-lines" key={index}>
                      <div className="first-line"></div>
                    </div>
                  ))}
            </div>
            <div className="last-line">
                {four_lines.map((_, index) => (
                    <div className="t-lines" key={index}>
                    </div>
                  ))}
            </div>
        </div> */}
        <div className="second-four-player">
            <div className="player-items">
                  {FourPlayer.map((players) => (
                    <TournamentsItem key={players.id} players={players}/>
                  ))}
              </div>
              <div className="four-lines">
                  {two_lines.map((_, index) => (
                    <div className="two-lines" key={index}>
                      <div className="first-line"></div>
                    </div>
                  ))}
              </div>
              <div className="last-line">
                  {two_lines.map((_, index) => (
                    <div className="t-lines" key={index}>
                    </div>
                  ))}
              </div>
        </div>
        <div className="final-game-players">
              <div className="player-items">
                  {TwoPlayer.map((players) => (
                    <TournamentsItem key={players.id} players={players}/>
                  ))}
              </div>
              <div className="final-lines">
                  {one_lines.map((_, index) => (
                    <div className="one-lines" key={index}>
                      <div className="first-line"></div>
                    </div>
                  ))}
              </div>
              <div className="last-line">
                  {one_lines.map((_, index) => (
                    <div className="t-lines" key={index}>
                    </div>
                  ))}
              </div>
        </div>
        <div className="winner">
         <Icon name='TournamentWin' className='tournament-win' />
        </div>
    </div>
  )
}

export default TournamentBracket