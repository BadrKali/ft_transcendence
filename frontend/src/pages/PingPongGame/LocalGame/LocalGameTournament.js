import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import useFetch from '../../../hooks/useFetch';
import LocalGameLogic from './LocalGameLogic';
import Loading from '../components/Loading';
import hell from "../asstes/hell.png";
import forest from "../asstes/forest.png";
import graveyard from "../asstes/graveyard.png";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const backgroundImages = {
  hell,
  forest,
  graveyard
};

const LocalGameTournament = () => {
    const location = useLocation();
    const gameRoomId = location.state?.gameRoomId;
    const { data: gameRoom, isLoading: isLoadingGameRoom, error: gameRoomError } = useFetch(`${BACKEND_URL}/api/game/local-game-room/${gameRoomId}`);
    const [background, setBackground] = useState(null);

    // useEffect(() => {
    //     if (gameSettings) {
    //         setBackground(backgroundImages[gameSettings.background] || null);
    //     }
    // }, [gameSettings]);

    if (isLoadingGameRoom) {
        return <Loading />;
    }

    if (gameRoomError) {
        return <div>Error: {gameRoomError}</div>;
    }

    if (!gameRoom) {
        return <div>No data available</div>;
    }

    return (
        <div className="pingponggame-container" style={{ backgroundImage: `url(${hell})` }}>
            <LocalGameLogic 
                player1Id={gameRoom.player1.id} 
                player2Id={gameRoom.player2.id}
            />
        </div>
    );
};

export default LocalGameTournament;