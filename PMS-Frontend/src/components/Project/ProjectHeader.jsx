import { useContext, useEffect, useState } from "react"
import { ProjectContext } from "../../layouts/ProjectLayout"
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import { useLocation } from "react-router-dom";
import { StatusChip } from "../chip";

const ProjectHeader = () => {
    const { project, code } = useContext(ProjectContext);
    const pathname = useLocation().pathname;
    
    return <header className="sticky left-0 bg-white z-1 pt-10 px-6 items-start flex flex-col gap-3">
        <div className="flex gap-2 items-center">
            <h1 className="text-3xl font-bold">{project?.title}</h1>
            <StatusChip 
                label={project?.status}
                color={(project?.status === 'Active' && '#22C55E') || (project?.status == 'Closed' && '#DC2626')}
            />
        </div>
        <p className="text-gray-400">{project?.category}</p>
        <Box sx={{ width: '100%', typography: 'body1' }}>
        <TabContext value={pathname}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList onChange={pathname} >
                    <Tab label="Tasks" value="/project/tasks" />
                    <Tab label="Team" value="/project/team" />
                    <Tab label="Overview" value="3" />
                    <Tab label="Requests" value="3" />
                    <Tab label="Settings" value="3" />
                </TabList>
            </Box>
        </TabContext>
        </Box>

    </header>

} 

export default ProjectHeader