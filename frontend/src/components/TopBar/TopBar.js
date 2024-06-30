import React from 'react'
import { useState, useEffect, useRef } from 'react'
import './TopBar.css'
import Icon from '../../assets/Icon/icons'
import { avatars } from '../../assets/assets'
import NotificationItem from './NotificationItem'
import NoitfictaionData from '../../assets/NotificationData'
import axios from 'axios'
import SearchItem from './SearchItem'

const TopBar = () => {
  const [showNotif, setNotif] = useState(false)
  const [showSearch, setSearch] = useState(false)
  const dropdownRef = useRef(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

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
      if (query.length > 0) {
          const fetchResults = async () => {
              try {
                  const response = await axios.get(`http://localhost:8000/user_management/search/?q=${query}`);
                  setResults(response.data);
              } catch (error) {
                  console.error('Error fetching search results:', error);
              }
          };
          fetchResults();
      } else {
          setResults([]);
      }
  }, [query]);

  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  return (
    <div className='topbar-container'>
      <div className='topbar-search'>
        <Icon name='search' className='topbar-search-icon'/>
        <input placeholder='Search' value={query}  type='text' onChange={handleChange}/>
          <div className={results.length > 0 ? "search-dropDwon searchActiv" : "search-dropDwon"}>
            {results.map((result) => (
              <SearchItem key={result.id} result={result}/>
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
          <span>Perdoxii_noyat</span>
        </div>
      </div>
    </div>
  )
}

export default TopBar