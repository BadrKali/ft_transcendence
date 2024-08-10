import React, {createContext} from "react";
import useFetch from "../../../hooks/useFetch.js";


const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const CurrentUserContext = createContext()

export const CurrentUserProvider = ({children}) =>{
const {data:CurrentUser} = useFetch(`${BACKEND_URL}/user/stats/`)

return (
    <CurrentUserContext.Provider value={CurrentUser}>
        {children}
    </CurrentUserContext.Provider>
)
}
