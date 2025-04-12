import UserHeader from "../components/User/Header"
import SideBar from "../components/User/SideBar"
import { Navigate, Outlet } from "react-router-dom"

const UserLayout = () => {
    if(!localStorage.getItem("token")) {
        return <Navigate to="/login" replace />
    }
    return <div className="pl-56 min-w-screen min-h-screen">
        <SideBar />
        <UserHeader />
        <Outlet />
    </div>
}

export default UserLayout