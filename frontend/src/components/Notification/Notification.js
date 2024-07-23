import React, { useEffect } from 'react'
import useAuth from '../../hooks/useAuth'

const Notification = () => {
    const { auth } = useAuth()
    useEffect(()=> {
        const ws = new WebSocket(`ws://localhost:8000/ws/notifications/?token=${auth.accessToken}`)
        ws.onopen = (event) => {
            console.log("socket connected madafaka")
        }
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data)
            console.log(data)
            alert(data.message)
        }

        ws.onclose = (event) => {

        }

        ws.onerror = (event) => {

        }

        return() => {
            ws.close()
        }
        
    },[])
  
    return null
}

export default Notification