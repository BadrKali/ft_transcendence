import React from 'react'
import './searchItem.css'

function SearchItem({result}) {
  return (
    <div>
        <div className="search-image">
            <img src=''/> 
        </div>
        <div className="search-name">
            <p>{result.title}</p>
        </div>
    </div>
  )
}

export default SearchItem