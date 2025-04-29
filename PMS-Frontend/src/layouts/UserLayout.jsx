import SideBar from "../components/User/SideBar"
import { Navigate, Outlet } from "react-router-dom"
import { UserContextProvider } from "../context/userContext"
import { SignalContextProvider } from "../context/signalContext"

const UserLayout = () => {
    if(!localStorage.getItem("token")) {
        return <Navigate to="/login" replace />
    }
    return <UserContextProvider>    
            <SignalContextProvider>
                <div className="pl-19">
                    <SideBar />
                    <Outlet />
                </div>
            </SignalContextProvider>
        </UserContextProvider>
}

export default UserLayout