import { useLocation } from "react-router-dom"
import { useState, useContext } from "react";
import { UserContext } from "../../context/userContext";
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import IconButton from '@mui/material/IconButton';
import FolderCopyOutlinedIcon from '@mui/icons-material/FolderCopyOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import TaskOutlinedIcon from '@mui/icons-material/TaskOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import { Tooltip } from "@mui/material";
import ProjectSearch from "../Project/ProjectSearch";

const gradientColor = { 
    default: "linear-gradient(45deg, #2328ff, #a1ffaa)",
    hover: "linear-gradient(45deg, #a1ffaa,  #2328ff)"
  }

const bg = {
    background: gradientColor.default,
    '&:hover': {
        background: gradientColor.hover,
    },
    boxShadow: '0px 7px 10px rgb(84, 87, 243)',
    color: 'white',
}

const SideBar = () => {
    const pathname = useLocation().pathname;
    const { user } = useContext(UserContext);
    const [showSearch, setShowSearch] = useState(false);

    return <aside className="hidden sm:flex z-50 px-4 py-10 fixed top-0 left-0 bottom-0 bg-white flex-col gap-3 border-r-1 border-gray-200">
        {showSearch && <ProjectSearch close={() => setShowSearch(false)}/>}
            <button className="w-10 cursor-pointer">
                <img className="rounded-full" src={user && user.profile_pic} alt="" />
            </button>
            <Tooltip title="Home" placement="left-end" arrow>
                <IconButton size="medium" sx={ (!showSearch && pathname === '/home') ? bg : undefined } onClick={() => window.location.href = '/home'}>
                    <DashboardOutlinedIcon sx={{ fontSize: 28 }}/>
                </IconButton>
            </Tooltip>
            <Tooltip title="Projects" placement="left-end" arrow>
                <IconButton size="medium" sx={ (showSearch || pathname.includes('/project')) ? bg : undefined } onClick={() => setShowSearch(!showSearch)}>
                    <FolderCopyOutlinedIcon sx={{ fontSize: 28 }}/>
                </IconButton>
            </Tooltip>
            <Tooltip title="Task" placement="left-end" arrow>
                <IconButton size="medium">
                    <TaskOutlinedIcon sx={{ fontSize: 28 }}/>
                </IconButton>
            </Tooltip>
            <Tooltip title="Settings" placement="left-end" arrow>
                <IconButton size="medium" sx={ (!showSearch && pathname === '/settings') ? bg : undefined } onClick={() => window.location.href = '/settings'}>
                    <SettingsOutlinedIcon sx={{ fontSize: 28 }}/>
                </IconButton>
            </Tooltip>
            <Tooltip title="Notifications" placement="left-end" arrow>
                <IconButton size="medium">
                    <NotificationsNoneOutlinedIcon sx={{ fontSize: 28 }}/>
                </IconButton>
            </Tooltip>
            <Tooltip title="Log out" placement="left-end" arrow>
                <IconButton size="medium" onClick={() => {
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                }}>
                    <LogoutIcon sx={{ fontSize: 28 }}/>
                </IconButton>
            </Tooltip>
    </aside>
}

export default SideBar