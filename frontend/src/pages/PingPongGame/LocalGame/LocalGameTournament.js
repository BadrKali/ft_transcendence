import React, { useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import useFetch from '../../../hooks/useFetch';
import LocalGameLogic from './LocalGameLogic';
import Loading from '../components/Loading';
import hell from "../asstes/hell.png";
import forest from "../asstes/forest.png";
import graveyard from "../asstes/graveyard.png";
import useAuth from '../../../hooks/useAuth';
import axios from "axios";
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const backgroundImages = {
  hell,
  forest,
  graveyard
};

const LocalGameTournament = () => {
    const location = useLocation();
    const { auth } = useAuth();
    const gameRoomId = location.state?.gameRoomId;
    const tournamentId = location.state?.tournamentId;
    const { data: gameRoom, isLoading: isLoadingGameRoom, error: gameRoomError } = useFetch(`${BACKEND_URL}/api/game/local-game-room/${gameRoomId}`);
    const [background, setBackground] = useState(null);
    
    const handleEndMatch = useCallback(async (winner, loser) => {
        if (!winner || !loser) return;
        try {
          const response = await axios.post(
            `${process.env.REACT_APP_BACKEND_URL}/user/tournament-match-result`,
            {
              tournamentId: tournamentId,
              winner: winner,
              loser: loser,
            },
            {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth.accessToken}`
              }
            }
          );
          console.log('Match ended successfully:', response.data);
        } catch (error) {
          console.error('Error ending match:', error);
        }
      }, [tournamentId, gameRoom, auth.accessToken]);
    
    useEffect(() => {
        if (gameRoom && gameRoom.player1 && gameRoom.player2) {
            handleEndMatch();
        }
    }, [handleEndMatch, gameRoom]);

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
                handleEndMatch={handleEndMatch}
            />
        </div>
    );
};

export default LocalGameTournament;