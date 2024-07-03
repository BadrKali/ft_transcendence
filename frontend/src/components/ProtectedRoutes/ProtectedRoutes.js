import React from 'react'
import useAuth from '../../hooks/useAuth'
import { useLocation, Navigate, Outlet } from 'react-router-dom'
import AppLayout from '../../index'
const ProtectedRoutes = () => {
    const {auth} = useAuth()
    const location = useLocation()
    return (
        auth?.username ? <AppLayout/> : <Navigate to='/auth' state={{from:location}} replace/>
    )
}

export default ProtectedRoutes