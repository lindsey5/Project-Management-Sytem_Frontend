import SideBar from "../components/User/SideBar"
import { Navigate, Outlet } from "react-router-dom"
import { UserContextProvider } from "../context/userContext"

const UserLayout = () => {
    if(!localStorage.getItem("token")) {
        return <Navigate to="/login" replace />
    }
    return <UserContextProvider>
            <div className="sm:pl-19">
                <SideBar />
                <Outlet />
            </div>
        </UserContextProvider>
}

export default UserLayout