import { Outlet } from "react-router-dom"
import SettingsHeader from "../pages/User/Settings/SettingsHeader"

const SettingsLayout = () => {
    return <main className="h-screen flex flex-col">
        <SettingsHeader />
        <Outlet />
    </main>
}

export default SettingsLayout