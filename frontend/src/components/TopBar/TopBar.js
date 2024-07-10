import React from 'react'
import { useState, useEffect, useRef } from 'react'
import './TopBar.css'
import Icon from '../../assets/Icon/icons'
import { avatars } from '../../assets/assets'
import NotificationItem from './NotificationItem'
import NoitfictaionData from '../../assets/NotificationData'
import axios from 'axios'
import SearchItem from './SearchItem'
import useFetch from '../../hooks/useFetch'
import { useNavigate } from 'react-router-dom';

const TopBar = () => {
  const [showNotif, setNotif] = useState(false)
  const [showSearch, setSearch] = useState(false)
  const dropdownRef = useRef(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [profilData, setProfilData] = useState([]);
  const [queryEndpoint, setQueryEndpoint] = useState(`http://localhost:8000/user/search/?q=${query}`)
  const response1 = useFetch('http://localhost:8000/user/stats/')
  const navigate = useNavigate();

  useEffect(() => {
    if (response1.data) {
      setProfilData(response1.data);
    }
  }, [response1.data]);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setNotif(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
 

  useEffect(() => {
    setQueryEndpoint(`http://localhost:8000/user/search/?q=${query}`)
  }, [query])


  const response = useFetch(queryEndpoint)
  useEffect(() => {
    if (response.data) {
      setResults(Array.isArray(response.data) ? response.data : []);
    }
  }, [response.data]);
  
  const handleChange = (e) => {
    setQuery(e.target.value);
  };
  const handleItemClick = (result) => {
    console.log('Clicked user:', result);
    navigate(`/user/${result.title}`);
  };

  return (
    <div className='topbar-container'>
      <div className='topbar-search'>
        <Icon name='search' className='topbar-search-icon'/>
        <input placeholder='Search' value={query}  type='text' onChange={handleChange}/>
        <div className={results.length > 0 ? "search-dropDwon searchActiv" : "search-dropDwon"}>
        {results.map((result) => (
            <div 
              key={result.id} 
              onClick={() => handleItemClick(result)}
            >
              <SearchItem result={result} />
            </div>
          ))}
        </div>
      </div>
      <div className='topbar-profile'>
        <div ref={dropdownRef} className="icon-container"  onClick={() => setNotif(!showNotif)}>
          <Icon  name='notification' className={showNotif ? 'topbar-notification-icon active-icon' : 'topbar-notification-icon' }/>
          <div  className={showNotif ? "dropDwon active" : "dropDwon"}>
                  {NoitfictaionData.map((notif) => (
                    <NotificationItem key={notif.id} notif={notif} />
                  ))}
          </div>
        </div>
        <div className='profile-pic-container'>
          <div className='profile-pic'>
            {/* <div className='topbar-online-status'></div> */}
            <img src={avatars[0].img}/>
          </div>
          <span>{profilData.username}</span>
        </div>
      </div>
    </div>
  )
}

export default TopBar