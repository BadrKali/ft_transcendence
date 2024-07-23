import ScoreBoard from "../components/ScoreBoard";
import avatar1 from '../asstes/avatar1.png';
import avatar2 from '../asstes/avatar2.png';

const GameLogic = ({player1, player2, socket}) => {
    return (
        <div className="game-logic-container">
            {player1 && player2 &&
                <ScoreBoard user1Score={0} user2Score={0} user1Name={player1.username} user2Name={player2.username} user1Avatar={avatar1} user2Avatar={avatar2}/>
            }
        </div>
    );
}
 
export default GameLogic;