import { Navigate, Outlet } from "react-router-dom"
import HomeHeader from "../components/Home/Header"
export default function HomeLayout() {
    if(localStorage.getItem("token")){
        return <Navigate to="/home" replace/>
    }
    return <>
        <HomeHeader />
        <Outlet />
    </>
            
}