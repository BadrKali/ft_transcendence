import React from 'react'
import { useState, useEffect, useContext } from 'react'
import useAuth from '../../../../hooks/useAuth'
import useFetch from '../../../../hooks/useFetch'
import Icon from '../../../../assets/Icon/icons'
import { avatars } from '../../../../assets/assets'
import './joinedTournament.css'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import MainButton from '../../../../components/MainButton/MainButton'
import { UserContext } from '../../../../context/UserContext'
import { useTranslation } from 'react-i18next'
import { clientSocketContext } from '../../../Chat/usehooks/ChatContext';
import { ErrorToast } from '../../../../components/ReactToastify/ErrorToast'
// import { clientSocketContext } from '../../pages/Chat/usehooks/ChatContext';



const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;


function JoinedTournamentOnline({TournamentData}) {
    const { auth }  = useAuth()
    const [joinedOwner, setjoinedOwner] = useState(false);
    const [profilData, setProfilData] = useState([]);
    const {userData, updatetounament} = useContext(UserContext)
    const [progress, setProgress] = useState(0);
    const [tournamentFinished, setTournamentFinished] = useState(false);
    const { t } = useTranslation();
    const [player1, setPlayer1] = useState();
    const [player2, setPlayer2] = useState();
    const [player3, setPlayer3] = useState();
    const [player4, setPlayer4] = useState();
    const { stateValue: clientSocket } = useContext(clientSocketContext);
    const [ifPlayed, setIfPlayed] = useState(false);
    const date = new Date(TournamentData.tournament_date);
    const {data ,isLoading, error} = useFetch(`${BACKEND_URL}/api/user/stats/${TournamentData.tournament_creator}`)

    useEffect(() => {
        if (userData.user_id === TournamentData.tournament_creator)
            setjoinedOwner(true)
    },[userData]);

 
    const formattedDate = date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
    });

    const formattedTime = date.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
    });

    useEffect(() => {
        if (data) {
          setProfilData(data);
        }

      }, [data]);
      
    useEffect(() => {
        const fetchData = async () => {
            const TournamentResponse = await fetch(`${BACKEND_URL}/api/user/tournament/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.accessToken}`
                }
            });

            if (!TournamentResponse.ok) {
                throw new Error('Failed to fetch the tournament data');
            }
            const updatedTournamentData = await TournamentResponse.json();
    
            updatetounament(updatedTournamentData);
        }
        fetchData();
    },[])

      useEffect(() => {
        setTimeout(() => {
          setProgress(profilData.rank_progress);
        }, 500); 
      }, []);
      
   
    useEffect(() => {
        const fetchBracket = async () => {
        try {
            const response = await fetch(`${BACKEND_URL}/api/user/tournament/${TournamentData.tournament_stage}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth.accessToken}`
            }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch the tournament data');
            }
            
            const data = await response.json();
            if (Array.isArray(data) && data.length > 0) {
                
                setIfPlayed(TournamentData.all_notified)
                if (data[0].matchStage === "SEMI-FINALS"){
                    
                    setPlayer1(data[0].player1)
                    setPlayer2(data[0].player2)
                    
                    setPlayer3(data[1].player1)
                    setPlayer4(data[1].player2)
                    
                }else if(data[0].matchStage === "FINALS"){
                    setPlayer1(data[0].player1)
                    setPlayer2(data[0].player2)
                    if (data[0].winner){
                        setTournamentFinished(true);
                    }
                }
            }
        } catch (error) {
            console.error("Error fetching tournament data:", error.message);
        }
        };
        if (TournamentData.tournament_stage)
            fetchBracket();
    }, [TournamentData.tournament_stage, auth.accessToken]);

    const handleNotify = async () => {
        let playersToNotify = [];
        setIfPlayed(true);
    
        if (TournamentData.tournament_stage === "SEMI-FINALS") {
            playersToNotify = [
                [player1, player2],
                [player3, player4],
            ];
        } else if (TournamentData.tournament_stage === "FINALS") {
            playersToNotify = [
                [player1, player2], 
            ];
        }
    
        
        playersToNotify.forEach(pair => {
            clientSocket.send(JSON.stringify({ type: '_warn_tournament_users_', messageData: pair }));
        });

        const response = await fetch(`${BACKEND_URL}/api/user/tournament/set_notified/${TournamentData.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth.accessToken}`
            }
        });
        
        if (response.ok) {
            const data = await response.json();
        } else {
            const errorData = await response.json();
        }
    };
    
      const handleStartTournament = async () => {
        const TournamentResponse = await fetch(`${BACKEND_URL}/api/user/tournament/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth.accessToken}`
            }
        });

        if (!TournamentResponse.ok) {
            throw new Error('Failed to fetch the tournament data');
        }
        const updatedTournamentData = await TournamentResponse.json();

        if (!updatedTournamentData.all_notified){
            ErrorToast(t("Players not notified yet"));
            setIfPlayed(false);
            return;
        }


        try {
            const response = await fetch(`${BACKEND_URL}/api/user/tournament/start/`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth.accessToken}`
              },
            });
            
            if (response.ok) {
              const data = await response.json();

           
            } else {
              const errorData = await response.json();
              console.error('Failed to start tournament:', errorData);
              
            }
          } catch (error) {
            console.error('Error starting tournament:', error);
          
          }
      }

    

    
      const handleDeleteTournament = async () => {
        try {
          const response = await fetch(`${BACKEND_URL}/api/user/tournament/`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${auth.accessToken}`

            },
          });
      
          if (response.ok) {
            const data = await response.json();
            const TournamentResponse = await fetch(`${BACKEND_URL}/api/user/tournament/`, {
                method: 'GET',
                    headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.accessToken}`
                    }
                });
                
                if (!TournamentResponse.ok) {
                    throw new Error('Network response was not ok');
                }
                const updatedTournamentData = await TournamentResponse.json();
                updatetounament(updatedTournamentData);
          
    
          } else {
            const errorData = await response.json();
            console.error('Failed to delete tournament:', errorData);

          }
        } catch (error) {
          console.error('Error deleting tournament:', error);
   
        }
      };

      const renderMainActionButton = () => {
        if (!ifPlayed) {
            return (
                <MainButton
                    type="button"
                    functionHandler={handleNotify}
                    content={t('Notify')}
                />
            );
            
        }
        if (tournamentFinished) {
            return (
                <MainButton
                    type="submit"
                    functionHandler={handleDeleteTournament}
                    content={t('Finish')}
                />
            );
        }
        return (
            <MainButton
                type="submit"
                functionHandler={handleStartTournament}
                content={t('Start')}
            />
        );
    };
      
  return (
    <div className="joined-tournament">
       <h1 className='tournament-title'>{TournamentData.tournament_name} </h1>
       
       <div className={`tournament-info-container ${TournamentData.tournament_map}`}>
            <div className='tournament-info-item'>
                <Icon name='chump_cup' className="tournament-info-icon"/>
                <div className='tournament-info-item-txt'>
                    <p>{TournamentData.tournament_prize}</p>
                    <span>{t('Total Prize Pool')}</span>
                </div>
            </div>
            <div className='tournament-info-item'>
                <Icon name='calendar' className="tournament-info-icon"/>
                <div className='tournament-info-item-txt'>
                    <p>{`${formattedDate} ${formattedTime}`}</p>
                    <span>{t('Tournament Start')}</span>
                </div>
            </div>
            <div className='tournament-info-item'>
                <Icon name='game_mode' className="tournament-info-icon"/>
                <div className='tournament-info-item-txt'>
                    <p>{t('Game Mode')}</p>
                    <span>{t('Online')}</span>
                </div>
            </div>
            <div className='tournament-info-item'>
                <Icon name='location' className="tournament-info-icon"/>
                <div className='tournament-info-item-txt'>
                    <p>{t('Map')}</p>
                    <span>{TournamentData.tournament_map}</span>
                </div>
            </div>
            <div className='tournament-subscribers'>
                <div className='tournament-subscribers-avatars'>
                {TournamentData.tournament_participants && TournamentData.tournament_participants.map((player, index) => (
                    <img key={index} className={`image${index + 1}`} src={`${BACKEND_URL}${player.avatar}`} alt={`Player ${index + 1}`} />
               
                ))}
                </div>
                <span className='tournament-subscribers-counter'>
                    {TournamentData.tournament_participants && TournamentData.tournament_participants.length}/4 Joined
                </span>
            </div>
        </div>
        <div className='tournament-desc'>
            <div className='tournament-desc-rules'>
                <div className='tournament-desc-rules-top'>
                    <h1>{t('Attention Pongers')}</h1>
                    <p>{t('Get ready to showcase your skills! Make sure you are available for all your matches, as missing a game might lead to disqualification. Ensure you read all rules carefully before participating.')}</p>
                </div>
                <div className='tournament-desc-rules-top'>
                    <h1>{t('How Does It work ?')}</h1>
                    <p>{t('Players will compete in a series of matches. Winners will advance to the next round, and the tournament will continue until a champion is crowned. Stay tuned for match updates and ensure you are prepared for each round!')}</p>
                </div>
            </div>
        
                   
             
            
        </div>
        <div className='JoinedTournomanentButoon'>
            {joinedOwner && (
                <div className='TournamentTwoButton'> 

                    <div className='disapledButton'
                        style={{
                            display: 'inline-block',
                            pointerEvents: TournamentData.tournament_participants && TournamentData.tournament_participants.length < 4 ? 'none' : 'auto',
                            opacity: TournamentData.tournament_participants && TournamentData.tournament_participants.length < 4 ? 0.5 : 1
                        }}
                    >
                         {renderMainActionButton()}                 
                    </div>
                    <MainButton type="submit"  functionHandler={handleDeleteTournament} content={t('Cancel')} />
                </div>
            )}
        </div>
    </div>
  )
}

export default JoinedTournamentOnline