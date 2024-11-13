import React, { useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import useFetch from '../../../hooks/useFetch';
import LocalGameLogic from './LocalGameLogic';
import Loading from '../components/Loading';
import hell from "../asstes/hell.png";
import forest from "../asstes/forest.png";
import graveyard from "../asstes/graveyard.png";
import useAuth from '../../../hooks/useAuth';
import LocalGameMatchResult from '../components/LocalGameMatchResult';

import axios from "axios";
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const backgroundImages = {
  hell,
  forest,
  graveyard
};

const LocalGameTournament = () => {
    const navigate = useNavigate();

    const location = useLocation();
    const { auth } = useAuth();
    const gameRoomId = location.state?.gameRoomId;
    const tournamentId = location.state?.tournamentId;
    const [showWinner, setShowWinner] = useState(false);
    const [winner, setWinner] = useState("");
    const [loser, setLoser] = useState(""); 
    const { data: gameRoom, isLoading: isLoadingGameRoom, error: gameRoomError } = useFetch(`${BACKEND_URL}/api/game/local-game-room/${gameRoomId}`);
    const { data: tournament, isLoading: isLoadingTournament, error: tournamentError } = useFetch(`${BACKEND_URL}/user/local-tournament`);
    // const { data: tournament, isLoading: isLoadingTournament, error: tournamentError } = useFetch(`${BACKEND_URL}/api/user/local-tournament`); //URL
    const [background, setBackground] = useState(null);
    
    const [map, setMap] = useState("");
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
      
        } catch (error) {
          console.error('Error ending match:', error);
        }
        setWinner(winner);
        setLoser(loser);
        setShowWinner(true);
      }, [tournamentId, gameRoom, auth.accessToken]);
    
      useEffect(() => {
      
      
        switch (tournament?.tournament_map) {
          case "hell":
            setMap(hell);
            break;
          case "forest":
            setMap(forest);
            break;
          case "graveyard":
            setMap(graveyard);
            break;
          default:
            setMap("");
        }
      }, [tournament]);
    
    useEffect(() => {
        if (gameRoom && gameRoom.player1 && gameRoom.player2) {
            handleEndMatch();
        }
    }, [handleEndMatch, gameRoom]);

    if (isLoadingGameRoom || isLoadingTournament) {
        return <Loading />;
    }

    if (gameRoomError || tournamentError) {
        return <div>Error: {gameRoomError}</div>;
    }

    if (!gameRoom || !tournament) {
        return <div>No data available</div>;
    }
    const handleBackToLobby = () => {
      setShowWinner(false);
      navigate('/tournament', { replace:true })
    }
    return (
        <div className="pingponggame-container" style={{ backgroundImage: `url(${map})` }}>
            <LocalGameLogic
                player1Id={gameRoom.player1.id}
                player2Id={gameRoom.player2.id}
                handleEndMatch={handleEndMatch}
            />
            {showWinner && (
                <LocalGameMatchResult
                    winner={winner}
                    winnerAvatar={hell}
                    onBack={handleBackToLobby}
                />
            )}
        </div>
    );
};

export default LocalGameTournament;