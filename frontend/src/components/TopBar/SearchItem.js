import React from 'react'
import './searchItem.css'

function SearchItem({result}) {
  // ALSO
  return (
    <div className='SearchItem-container'> 
        <div className="search-image">
            <img src={`http://127.0.0.1:8000${result.avatar}`}/> 
        </div>
        <div className="search-name">
            <p>{result.username}</p>
        </div>
    </div>
  )
}

export default SearchItem