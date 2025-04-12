import UserHeader from "../components/User/Header"
import SideBar from "../components/User/SideBar"
import { Navigate, Outlet } from "react-router-dom"
import { UserContextProvider } from "../context/userContext"

const UserLayout = () => {
    if(!localStorage.getItem("token")) {
        return <Navigate to="/login" replace />
    }
    return <div className="pl-56 min-w-screen min-h-screen">
        <UserContextProvider>
            <SideBar />
            <UserHeader />
            <Outlet />
        </UserContextProvider>
    </div>
}

export default UserLayout