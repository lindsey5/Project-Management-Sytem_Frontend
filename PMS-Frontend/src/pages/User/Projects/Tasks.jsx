import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';
import TableRowsOutlinedIcon from '@mui/icons-material/TableRowsOutlined';
import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined';
import { Box } from '@mui/material';
import { useContext, useState } from 'react';
import Kanban from '../../../components/Task/Kanban';
import { CustomButton } from '../../../components/button';
import AddIcon from '@mui/icons-material/Add';
import { ProjectContext } from '../../../layouts/ProjectLayout';
import CreateTask from '../../../components/Task/CreateTask/CreateTask';

const Tasks = () => {
    const [alignment, setAlignment] = useState('Kanban');
    const { role } = useContext(ProjectContext)
    const [showCreate, setShowCreate] = useState(false);
    const [status, setStatus] = useState(null);

    const handleChange = (newAlignment) => {
        setAlignment(newAlignment)
    };

    const showCreateWithStatus = (status) => {
        setStatus(status)
        setShowCreate(true)
    }

    return <div className='pt-6 pb-3 px-3 bg-white gap-2'>
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
                onClick={() => setShowCreate(true)}
            >New Task</CustomButton>}

        </Box>
        <Kanban showCreate={showCreateWithStatus}/>
    </div>
}

export default Tasks