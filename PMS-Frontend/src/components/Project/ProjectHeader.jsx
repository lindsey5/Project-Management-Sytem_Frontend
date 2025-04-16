import { useContext, useEffect, useState } from "react"
import { ProjectContext } from "../../layouts/ProjectLayout"
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import { Tabs } from "@mui/material";
import { useLocation } from "react-router-dom";
import { StatusChip } from "../chip";

const ProjectHeader = () => {
    const { project, code } = useContext(ProjectContext);
    const pathname = useLocation().pathname;

    const handleChange = (e, value) => {
        window.location.href = `${value}?c=${code}`;
    }
    
    return <header className="bg-white z-1 pt-10 px-6 items-start flex flex-col gap-3">
        <div className="flex gap-2 items-center">
            <h1 className="text-3xl font-bold">{project?.title}</h1>
            <StatusChip 
                label={project?.status}
                color={(project?.status === 'Active' && '#22C55E') || (project?.status == 'Closed' && '#DC2626')}
            />
        </div>
        <p className="text-gray-400">{project?.type}</p>
            <Box sx={{ width: '100%', borderBottom: 1, borderColor: 'divider' }}>
                <Tabs 
                    onChange={handleChange} 
                    value={pathname} 
                    variant="scrollable"
                    scrollButtons="auto" 
                    aria-label="scrollable tabs"
                >
                    <Tab label="Tasks" value="/project/tasks" />
                    <Tab label="Team" value="/project/team" />
                    <Tab label="Overview" value="3" />
                    <Tab label="Requests" value="3" />
                    <Tab label="Settings" value="3" />
                </Tabs>
            </Box>
    </header>

} 

export default ProjectHeader