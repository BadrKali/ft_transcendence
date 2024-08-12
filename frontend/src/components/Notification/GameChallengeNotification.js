import React from "react";
import './GameChallengeNotification.css';
import challenge from  "../../assets/Icon/challangefriend.svg"
import accept from  "../../assets/Icon/accept.png"
import reject from  "../../assets/Icon/reject.png"
const GameChallengeNotification = ({notif, message, onAccept, onReject}) => {
    return (
        <div className="game-challenge-notification">
            <div className="notification-content">
                <img src={challenge} alt="" className="challenge"/>
                <p className="challenge-message">{message}</p>
                <div className="notification-actions">
                    <img src={accept} alt="" className="action" onClick={() => onAccept(notif.sender_id)} />
                    <img src={reject} alt="" className="action" onClick={() => onReject(notif.sender_id)} />
                </div>
            </div>
        </div>
    );
}
 
export default GameChallengeNotification;