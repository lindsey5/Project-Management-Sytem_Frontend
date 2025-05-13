import { createContext, useEffect, useState } from "react";
import { getUserDetails } from "../services/UserService";

export const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
    const [user, setUser] = useState();
    
    useEffect(() => {
        const getUser = async () => {
            const details = await getUserDetails()
            if(details) setUser(details) 
            else{
                 localStorage.removeItem('token');
                 window.location.href = '/'
            }
        }
        getUser();
    }, [])
  
    return (
        <UserContext.Provider value={{ user }}>
            {children}
        </UserContext.Provider>
    )
};