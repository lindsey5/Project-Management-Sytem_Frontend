import { useLocation } from "react-router-dom"
import Button from "../button"
import Dropdown from "../dropdown"
import { useEffect, useState } from "react";
import { getProjects } from "../../services/ProjectService";

const SideBar = () => {
    const pathname = useLocation().pathname;
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        const fetchProjects = async () => {
            const response = await getProjects();
            if(response.success){
                setProjects(response.projects.map(p => ({title: p.title})))    
            }
        }

        fetchProjects();
    }, [])


    return <aside className="w-56 fixed top-0 left-0 bottom-0 border-r border-gray-300 py-4 bg-white">
        <img className="h-[48px] cursor-pointer mb-8" src="/logo.png" alt="" />
        <div className="px-2 flex flex-col gap-1">
            <h1 className="text-gray-600">Menu</h1>
            <Button 
                label="Home"  
                iconPath="/home.png"
                className={`${pathname === '/home' && 'bg-gray-100'}`}
            />
            <Dropdown 
                label="Projects"
                iconPath="/briefcase.png"
                items={projects}
                onClick={() => window.location.href="/projects"}
            />
        </div>
    </aside>
}

export default SideBar