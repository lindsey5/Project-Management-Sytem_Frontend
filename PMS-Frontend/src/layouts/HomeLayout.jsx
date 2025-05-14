import { Navigate, Outlet } from "react-router-dom"
import HomeHeader from "../pages/Home/Header"

export default function HomeLayout() {
    if(localStorage.getItem("token")){
        return <Navigate to="/home" replace/>
    }
    return <>
        <HomeHeader />
        <Outlet />
    </>
            
}