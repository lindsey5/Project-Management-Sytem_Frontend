import { useContext, useEffect, useState } from "react"
import { ProjectContext } from "../../layouts/ProjectLayout"
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Tab from '@mui/material/Tab';
import { Stack, Tabs } from "@mui/material";
import { useLocation } from "react-router-dom";
import { StatusChip } from "../chip";
import { getMembers } from "../../services/MemberService";
import { UserContext } from "../../context/userContext";

const ProjectHeader = () => {
    const { project, code, role } = useContext(ProjectContext);
    const pathname = useLocation().pathname;
    const [members, setMembers] = useState([]);
    const { user } = useContext(UserContext);

    useEffect(() => {
        const fetchMembers = async () => {
            const response = await getMembers(code);
            const index = response.members.findIndex(m => m.user.email == user.email);
            if (index > -1) {
                const [item] = response.members.splice(index, 1);
                response.members.unshift(item);
            }
            setMembers(response.members);
        }

        fetchMembers()
    }, [])

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
            <Stack width="100%" direction='row' justifyContent="space-between" borderBottom={1} borderColor="divider">
                <Tabs 
                    onChange={handleChange} 
                    value={pathname} 
                    variant="scrollable"
                    scrollButtons="auto" 
                    aria-label="scrollable tabs"
                >
                    <Tab label="Tasks" value="/project/tasks" />
                    <Tab label="Team" value="/project/team" />
                    <Tab label="Overview" value="/project/overview" />
                    {role === "Admin" && <Tab label="Requests" value="/project/requests" />}
                    {role == "Admin" && <Tab label="Settings" value="/project/settings" />}
                </Tabs>
                <AvatarGroup 
                    max={3} 
                    spacing="medium"
                    sx={{
                        '& .MuiAvatar-root': {
                        width: 35,
                        height: 35,
                        fontSize: 12,
                        },
                        cursor: 'pointer'
                    }}
                    onClick={() => window.location.href = `/project/team?c=${code}`}
                >
                {members.map(member => <Avatar sx={{ width: 35, height: 35 }} src={`data:image/jpeg;base64,${member.user.profile_pic}`} />)}
                </AvatarGroup>
            </Stack>
    </header>

} 

export default ProjectHeader