import { Outlet } from "react-router-dom"
import HomeHeader from "../components/Home/Header"
export default function HomeLayout() {

    return <>
        <HomeHeader />
        <Outlet />
    </>
            
}