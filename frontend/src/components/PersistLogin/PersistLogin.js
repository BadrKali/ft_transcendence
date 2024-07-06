import React, { useEffect, useState } from 'react'
import useAuth from '../../hooks/useAuth'
import useRefresh from '../../hooks/useRefresh'
import AppLayout from '../../index'
import { Outlet } from 'react-router-dom'
const PersistLogin = () => {
    const [isLoading, setIsLoading] = useState(true);
    const refresh = useRefresh()
    const { auth } = useAuth()

    useEffect(() => {
        const checkToken = async () => {
            try {
                await refresh(); 
            } catch (e) {
                console.log(e)
            } finally {
                setIsLoading(false)
            }
        }
        !auth?.accessToken ?  checkToken() : setIsLoading(false);
    }, [])
    return (
        <>
            {isLoading ? <p>loading</p> : <Outlet />}
        </>
    )
}

export default PersistLogin