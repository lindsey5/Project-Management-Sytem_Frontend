import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';
import TableRowsOutlinedIcon from '@mui/icons-material/TableRowsOutlined';
import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined';
import { Box, Button } from '@mui/material';
import { useState } from 'react';
import Kanban from '../../../components/Project/Kanban';

const Tasks = () => {
    const [alignment, setAlignment] = useState('Kanban');

    const CustomButton = ({label, value, icon}) => {
        return <Button
        variant="contained"
        size='sm'
        startIcon={icon}
        sx={{ 
            borderRadius: '20px',
            backgroundColor: alignment === value ? 'black' : '#f3f4f6',
            color: alignment === value ? 'white' : 'black',
            textTransform: 'none',
            '&:hover': {
            backgroundColor: alignment === value ? '#6b7280' : '#e5e7eb'
            },
            boxShadow: 'none',
        }}
            onClick={() => handleChange(value)}
        >
        {label}
        </Button>
    }

    const handleChange = (newAlignment) => {
        setAlignment(newAlignment)
    };

    return <div className='pt-6 pb-3 px-3 bg-white gap-2'>
        <Box sx={{ display: 'flex', gap: 2}}>
            <CustomButton 
                label="Kanban"
                value="Kanban"
                icon={<GridViewOutlinedIcon />}
            />
            <CustomButton 
                label="Table"
                value="Table"
                icon={<TableRowsOutlinedIcon />}
            />
            <CustomButton 
                label="Your Task"
                value="Your Task"
                icon={<AssignmentTurnedInOutlinedIcon />}
            />
        </Box>
        <Kanban />
    </div>
}

export default Tasks