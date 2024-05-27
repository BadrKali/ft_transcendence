import React from 'react'
import './App.css'
import SideBar from './components/SideBar/SideBar'
import TopBar from './components/TopBar/TopBar'


const App = () => {
  return (
    <div className='app'>
      <SideBar/>
      <main className='main'>
        <TopBar/>
        <div className='test'>
          <div className='content'>
            jojo
          </div>
        </div>
      </main>
    </div>
  )
}

export default App