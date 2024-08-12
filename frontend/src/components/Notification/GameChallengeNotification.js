import React, {useState, useEffect} from "react";
import './GameChallengeNotification.css';
import challenge from  "../../assets/Icon/challangefriend.svg"
import accept from  "../../assets/Icon/accept.png"
import reject from  "../../assets/Icon/reject.png"
const GameChallengeNotification = ({notif, message, onAccept, onReject}) => {

    const [timeLeft, setTimeLeft] = useState(10);

    useEffect(() => {
        if (timeLeft === 0) {
            onReject(notif.sender_id);
            return;
        }

        const intervalId = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(intervalId);
    }, [timeLeft, onReject, notif.sender_id]);

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
            <div className="notification-timer">
                <div
                    className="timer-bar"
                    style={{ width: `${(timeLeft / 10) * 100}%` }}
                ></div>
            </div>
        </div>
    );
}
 
export default GameChallengeNotification;