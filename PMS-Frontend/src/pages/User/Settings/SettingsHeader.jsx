import { Tabs, Tab } from "@mui/material"
import { useNavigate, useLocation } from "react-router-dom"

const SettingsHeader = () => {
    const navigate = useNavigate();
    const pathname = useLocation().pathname;

    const handleChange = (e, value) => {
        navigate(value)
    }

    return <header className="px-6 pt-10 flex flex-col border-b-1 border-gray-200">
        <h1 className="text-3xl font-bold mb-6">Account Settings</h1>
        <Tabs 
            onChange={handleChange}
            value={pathname}
            variant="scrollable"
            scrollButtons="auto" 
            aria-label="scrollable tabs"
        >
            <Tab label="General" value="/settings" />
            <Tab label="Security" value="/settings/security" />
            <Tab label="Your Projects" value="/settings/projects" />
        </Tabs>
    </header>
}

export default SettingsHeader