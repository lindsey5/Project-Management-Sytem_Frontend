import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';
import TableRowsOutlinedIcon from '@mui/icons-material/TableRowsOutlined';
import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { Box } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { CustomButton } from '../../../components/button';
import AddIcon from '@mui/icons-material/Add';
import { ProjectContext } from '../../../layouts/ProjectLayout';
import CreateTask from '../../../components/Task/CreateTask';
import { getTasks } from '../../../services/TaskService';
import { lazy, Suspense } from 'react';
import { getTaskAttachments } from '../../../services/TaskAttachmentService';
import { CircularProgress } from '@mui/material';
import TasksTable from '../../../components/Task/TasksTable';
import UserTasks from '../../../components/Task/UserTasks';
import Calendar from '../../../components/Task/Calendar';
import MyGanttComponent from '../../../components/Task/GantChart';
import ViewTimelineOutlinedIcon from '@mui/icons-material/ViewTimelineOutlined';

const Kanban = lazy(() => import('../../../components/Task/Kanban'));

const Tasks = () => {
    const [alignment, setAlignment] = useState('Kanban');
    const [showCreate, setShowCreate] = useState(false);
    const [status, setStatus] = useState(null);
    const { project, role } = useContext(ProjectContext);
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        const fetchTasks = async () => {
            const response = await getTasks(project.id);

            setTasks(await Promise.all(response.tasks.map(async(t) => {
                const r = await getTaskAttachments(t.id);
                return {...t, attachments: r.attachments}
            })));
        }

        fetchTasks();
    },[])

    const handleChange = (newAlignment) => {
        setAlignment(newAlignment)
    };

    const showCreateWithStatus = (status) => {
        setStatus(status)
        setShowCreate(true)
    }

    return <div className='flex flex-col pt-6 pb-3 px-3 bg-white gap-2 h-full'>
        <CreateTask open={showCreate} currentStatus={status} close={() => setShowCreate(false)}/>
        <Box sx={{ display: 'flex', gap: 3}}>
            <CustomButton 
                label="Kanban"
                icon={<GridViewOutlinedIcon fontSize='small'/>}
                sx={{
                    backgroundColor: alignment === "Kanban" ? 'black' : '#f3f4f6',
                    color: alignment == "Kanban" ? 'white' : 'black',
                    '&:hover': { backgroundColor: alignment ==="Kanban" ? '#6b7280' : '#e5e7eb'} 
                }}
                onClick={() => handleChange("Kanban")}
            >Kanban</CustomButton>

            <CustomButton 
                icon={<TableRowsOutlinedIcon fontSize='small'/>}
                sx={{
                    backgroundColor: alignment === "Table" ? 'black' : '#f3f4f6',
                    color: alignment == "Table" ? 'white' : 'black',
                    '&:hover': { backgroundColor: alignment ==="Table" ? '#6b7280' : '#e5e7eb'} 
                }}
                onClick={() => handleChange("Table")}
            >Table</CustomButton>

            <CustomButton 
                icon={<CalendarMonthIcon fontSize='small'/>}
                sx={{
                    backgroundColor: alignment === "Calendar" ? 'black' : '#f3f4f6',
                    color: alignment == "Calendar" ? 'white' : 'black',
                    '&:hover': { backgroundColor: alignment === "Calendar" ? '#6b7280' : '#e5e7eb'} 
                }}
                onClick={() => handleChange("Calendar")}
            >Calendar</CustomButton>

            <CustomButton 
                icon={<ViewTimelineOutlinedIcon fontSize='small'/>}
                sx={{
                    backgroundColor: alignment === "Timeline" ? 'black' : '#f3f4f6',
                    color: alignment == "Timeline" ? 'white' : 'black',
                    '&:hover': { backgroundColor: alignment === "Timeline" ? '#6b7280' : '#e5e7eb'} 
                }}
                onClick={() => handleChange("Timeline")}
            >Timeline</CustomButton>

            <CustomButton 
                icon={<AssignmentTurnedInOutlinedIcon fontSize='small'/>}
                sx={{
                    backgroundColor: alignment === "Your Task" ? 'black' : '#f3f4f6',
                    color: alignment == "Your Task" ? 'white' : 'black',
                    '&:hover': { backgroundColor: alignment === "Your Task" ? '#6b7280' : '#e5e7eb'} 
                }}
                onClick={() => handleChange("Your Task")}
            >Your Task</CustomButton>

            {role === 'Admin' && <CustomButton 
                sx={{ backgroundColor: '#2263e7', '&:hover' : { backgroundColor: 'rgb(13, 71, 187)' }}}
                icon={<AddIcon fontSize='small' />}
                disabled={project.status !== "Active"}
                onClick={() => setShowCreate(true)}
            >New Task</CustomButton>}
        </Box>
        <Suspense fallback={
            <div className='w-full h-full flex items-center justify-center'>
                <CircularProgress size={60}/>
            </div>
        }>
            {alignment === 'Kanban' && <Kanban showCreate={showCreateWithStatus} tasks={tasks} setTasks={setTasks}/>}
            {alignment === 'Table' && <TasksTable tasks={tasks}/>}
            {alignment === 'Your Task' && <UserTasks allTasks={tasks}/>}
            {alignment === 'Calendar' && <Calendar tasks={tasks}/>}
            {alignment === 'Timeline' && <MyGanttComponent tasks={tasks}/>}
        </Suspense> 
    </div>
}

export default Tasks