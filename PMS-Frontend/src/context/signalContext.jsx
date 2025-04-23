import { createContext, useContext, useEffect, useState } from "react";
import { UserContext } from "./userContext";
import * as signalR from '@microsoft/signalr';

export const SignalContext = createContext();

export const SignalContextProvider = ({ children }) => {
    const [connection, setConnection] = useState(null);
    const { user } = useContext(UserContext);
    
    useEffect(() => {
        if(user?.email){
            const newConnection = new signalR.HubConnectionBuilder()
            .withUrl(`http://localhost:5046/notifhub?email=${user?.email}`)
            .withAutomaticReconnect()
            .build();
        
            newConnection.start()
            .then(() => {
                console.log("Connected!");
            })
            .catch(e => console.log("Connection failed:", e));
        
            setConnection(newConnection);
        }
      }, [user?.email]);
    
      const sendRequestNotification = async (project_id) => {
        if (connection) {
          await connection.invoke("SendRequestNotification", project_id);
        }
      };

  
    return (
        <SignalContext.Provider value={{ connection, sendRequestNotification }}>
            {children}
        </SignalContext.Provider>
    )
};