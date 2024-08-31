import React, { useEffect, useState , useContext} from 'react'
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './profil.css'
import DashProfil from './components/DashProfil'
import MatchHistory from './components/MatchHistory'
import Achievments from './components/Achievments'
import Friends from './components/Friends'
import useFetch from '../../hooks/useFetch'
import Icon from '../../assets/Icon/icons'
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import useAuth from '../../hooks/useAuth'
import { useLocation } from 'react-router-dom';
import BlockUnblockButton from './components/BlockUnblockButton'
import AddFriendUnfriendButton from './components/AddFriendUnfriendButton'
import ChatFriendButton from './components/ChatFriendButton'
import ChallangefriendButton from './components/ChallangefriendButton'
import LineChart from '../Dashboard/components/LineChart'
import { UserContext } from '../../context/UserContext';


const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;



const Profil = () => {
  const { userId } = useParams();
  const [profilData, setProfilData] = useState([]);
  const navigate = useNavigate();
  const { auth }  = useAuth()
  const location = useLocation();
  const { nameOfUser } = useParams();
  const {userData} =  useContext(UserContext)
  const {data ,isLoading, error} = useFetch(`${BACKEND_URL}/user/stats/username/${nameOfUser}`)
  const [isBlockedMe, setIsBlocked] = useState(false);
  const [isBlockingHim, setIsBlocking] = useState(false); 


  useEffect(() => {
    if (data) {
      setProfilData(data);
      setIsBlocked(data.is_blocked);
      setIsBlocking(data.is_blocking);
    }
  }, [data]);
  
  const isOwnProfile = userData.username === nameOfUser

  return (
    <TransitionGroup className="profilTransition">
      <CSSTransition key={profilData.user_id}  classNames="fade">
        <div className='dashboard-contianer'>
          <div className='profil-icons'>
              {!isOwnProfile && (
                <div className='profil-buttons'>
                    <AddFriendUnfriendButton FriendId={profilData.user_id} isBlockingHim={isBlockingHim} isBlockedMe={isBlockedMe} />
                    <ChatFriendButton profilData={profilData} isBlockingHim={isBlockingHim} isBlockedMe={isBlockedMe} />
                    <ChallangefriendButton  isBlockingHim={isBlockingHim} isBlockedMe={isBlockedMe} />
                    <BlockUnblockButton blockedId={profilData.user_id} isBlockingHim={isBlockingHim} isBlockedMe={isBlockedMe}/>
                </div>
              )}
          </div>
          <div className="dashboard-profil">
              <div className="profilHistoryAcgievmeants-container-profil">
                  <div className="profil-container-profil">
                    <DashProfil profil={profilData} isBlockingHim={isBlockingHim} isBlockedMe={isBlockedMe}/>
                  </div>
                  <div className="historyAchievments-container-profil">
                    <div className="history-container-profil">
                    <MatchHistory profil={profilData}/> 
                    </div>
                    <div className="achievments-container-profil">
                    <Achievments userId={profilData.user_id}/>
                    </div>
                  </div>
                  <div className='lineChart-container'>
                    <h2>Graph Growth</h2>
                    <LineChart />
                  </div>
              </div>
          </div>

        </div>
      </CSSTransition>
    </TransitionGroup>
  )
}

export default Profil