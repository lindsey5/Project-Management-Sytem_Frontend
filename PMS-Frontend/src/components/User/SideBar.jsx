import { useLocation } from "react-router-dom"
import { useEffect, useState, useContext } from "react";
import { UserContext } from "../../context/userContext";
import { getProjects } from "../../services/ProjectService";
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import IconButton from '@mui/material/IconButton';
import FolderCopyOutlinedIcon from '@mui/icons-material/FolderCopyOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import TaskOutlinedIcon from '@mui/icons-material/TaskOutlined';
import ProjectSearch from "../Project/ProjectSearch";

const gradientColor = { 
    default: "linear-gradient(45deg, rgba(59,173,227,1) 0%, rgba(87,111,230,1) 25%, rgba(152,68,183,1) 51%, rgba(255,53,127,1) 100%)",
    hover: "linear-gradient(45deg, rgba(71,207,255,1) 0%, rgba(120,140,255,1) 25%, rgba(183,90,213,1) 51%, rgba(255,90,150,1) 100%)"
  }

const bg = {
    background: gradientColor.default,
    '&:hover': {
        background: gradientColor.hover,
    },
    boxShadow: '0px 7px 10px rgb(69, 36, 189)',
    color: 'white',
}

const SideBar = () => {
    const pathname = useLocation().pathname;
    const { user } = useContext(UserContext);
    const [showSearch, setShowSearch] = useState(false);

    console.log(user)


    return <aside className="z-50 px-4 py-3 fixed top-0 left-0 bottom-0 bg-gray-100 flex flex-col justify-between gap-3 border-r-1 border-gray-200">
        {showSearch && <ProjectSearch close={() => setShowSearch(false)}/>}
        <div className="flex flex-col gap-3">
            <IconButton size="medium" sx={!showSearch && pathname === '/home' && bg} onClick={() => window.location.href = '/home'}>
                <DashboardOutlinedIcon sx={{ fontSize: 28 }}/>
            </IconButton>
            <IconButton size="medium" sx={(showSearch || pathname === '/projects') && bg} onClick={() => setShowSearch(!showSearch)}>
                <FolderCopyOutlinedIcon sx={{ fontSize: 28 }}/>
            </IconButton>
            <IconButton size="medium">
                <TaskOutlinedIcon sx={{ fontSize: 28 }}/>
            </IconButton>
            <IconButton size="medium" sx={!showSearch && pathname === '/settings' && bg} onClick={() => window.location.href = '/settings'}>
                <SettingsOutlinedIcon sx={{ fontSize: 28 }}/>
            </IconButton>
            <IconButton size="medium">
                <NotificationsNoneOutlinedIcon sx={{ fontSize: 28 }}/>
            </IconButton>
        </div>
        <div className="flex flex-col gap-3">
            <IconButton size="medium">
                <SearchIcon sx={{ fontSize: 28 }}/>
            </IconButton>
            <button className="w-10 cursor-pointer">
                <img className="rounded-full" src={user && user.profile_pic} alt="" />
            </button>
        </div>
    </aside>
}

export default SideBar