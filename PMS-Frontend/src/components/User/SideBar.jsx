import { useLocation } from "react-router-dom"
import { useState, useContext, useEffect } from "react";
import { UserContext } from "../../context/userContext";
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import IconButton from '@mui/material/IconButton';
import FolderCopyOutlinedIcon from '@mui/icons-material/FolderCopyOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import TaskOutlinedIcon from '@mui/icons-material/TaskOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import { Badge, Tooltip } from "@mui/material";
import ProjectSearch from "../Project/ProjectSearch";
import { SignalContext } from "../../context/signalContext";
import { getNotifications } from '../../services/NotificationService';
import { toast } from "react-toastify";

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
    const [count, setCount] = useState(0);

    const { connection } = useContext(SignalContext)

    useEffect(() => {
        const fetchData = async () => {
            const response = await getNotifications(1);
            setCount(response.unreadNotifications);
        }

        fetchData()

        if(connection){
            connection.on("ReceiveTaskNotification", async (count, newNotification) => {
                setCount(prev => prev + count)
            })
        }

    }, [connection])

    return <aside className="flex z-50 px-4 py-10 fixed top-0 left-0 bottom-0 bg-white flex-col gap-3 border-r-1 border-gray-200">
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
            <Tooltip title="Tasks" placement="left-end" arrow>
                <IconButton size="medium" sx={ (!showSearch && pathname === '/tasks') ? bg : undefined } onClick={() => window.location.href = '/tasks'}>
                    <TaskOutlinedIcon sx={{ fontSize: 28 }}/>
                </IconButton>
            </Tooltip>
            <Tooltip title="Settings" placement="left-end" arrow>
                <IconButton size="medium" sx={ (!showSearch && pathname === '/settings') ? bg : undefined } onClick={() => window.location.href = '/settings'}>
                    <SettingsOutlinedIcon sx={{ fontSize: 28 }}/>
                </IconButton>
            </Tooltip>
            <Tooltip title="Notifications" placement="left-end" arrow>
                    <IconButton size="medium" sx={ (!showSearch && pathname === '/notifications') ? bg : undefined } onClick={() => window.location.href = '/notifications'}>
                        <Badge badgeContent={count} color="primary">
                            <NotificationsNoneOutlinedIcon sx={{ fontSize: 28 }}/>
                        </Badge>
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