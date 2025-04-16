import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';
import TableRowsOutlinedIcon from '@mui/icons-material/TableRowsOutlined';
import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined';
import { Box } from '@mui/material';
import { useState } from 'react';
import Kanban from '../../../components/Task/Kanban';
import { CustomButton } from '../../../components/button';

const Tasks = () => {
    const [alignment, setAlignment] = useState('Kanban');
    const [showCreate, setShowCreate] = useState();

    const handleChange = (newAlignment) => {
        setAlignment(newAlignment)
    };

    return <div className='pt-6 pb-3 px-3 bg-white gap-2'>
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
            />
            <CustomButton 
                label="Table"
                icon={<TableRowsOutlinedIcon fontSize='small'/>}
                sx={{
                    backgroundColor: alignment === "Table" ? 'black' : '#f3f4f6',
                    color: alignment == "Table" ? 'white' : 'black',
                    '&:hover': { backgroundColor: alignment ==="Table" ? '#6b7280' : '#e5e7eb'} 
                }}
                onClick={() => handleChange("Table")}
            />
            <CustomButton 
                label="Your Task"
                value="Your Task"
                icon={<AssignmentTurnedInOutlinedIcon fontSize='small'/>}
                sx={{
                    backgroundColor: alignment === "Your Task" ? 'black' : '#f3f4f6',
                    color: alignment == "Your Task" ? 'white' : 'black',
                    '&:hover': { backgroundColor: alignment === "Your Task" ? '#6b7280' : '#e5e7eb'} 
                }}
                onClick={() => handleChange("Your Task")}
            />

        </Box>
        <Kanban />
    </div>
}

export default Tasks