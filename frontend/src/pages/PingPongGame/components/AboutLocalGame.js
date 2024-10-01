import React, {useState, useEffect} from "react";
import "./aboutlocalgame.css"
import avatar1 from "../../../assets/avatar1.png"
import avatar2 from "../../../assets/avatar2.png"
import { useTranslation } from 'react-i18next'

const AboutLocalGame = ({player1, player2}) => {
    const [timer, setTimer] = useState(7);
    const { t } = useTranslation();

    const rules = {
        1: t("1- Victory Condition: The game is won by the first player to score 11 points."),
        2: t("2- Paddle Movement: Control your paddle using the keys you've chosen:"),
        3: t(`   • ${player1?.username} W to move up, S to move down.`),
        4: t(`   • ${player2?.username} Arrow Up to move up, Arrow Down to move down.`),
        5: t("3- Stay Focused: You’re in a fierce competition—keep your cool and don’t lose!"),
        6: t("4- This is local game, so no match history will be saved, and no XP will pe udpated"),
    }

    useEffect(() => {
        if (timer === 0) {
            // setIsGameStarting(true);
            // onStartGame(true);
            return;
        }

        const interval = setInterval(() => {
            setTimer(prev => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [timer]);

    return (
        <div className="about-local-game-container">
            <div className="local-players">
                <div className="player">
                    <img src={avatar1} alt="" className="player-avatar"/>
                    <h1 className="player-username">mhabib-a</h1>
                </div>
                <h1 className="timer">{timer}</h1>
                <div className="player">
                    <img src={avatar2} alt="" className="player-avatar"/>
                    <h1 className="player-username">youlhafi</h1>
                </div>
            </div>
            <div className="game-info-container">
                <h1 className="game-info-title">{t('ABOUT THE GAME')}</h1>
                <ul className="rules-container">
                    {Object.values(rules).map((rule, index) => (
                        <li key={index} className="rule-item">{rule}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
 
export default AboutLocalGame;