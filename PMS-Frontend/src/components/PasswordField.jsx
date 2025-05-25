import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { IconButton, TextField } from "@mui/material";
import { useState } from 'react';

const PasswordField = ({ onChange, label }) => {
    const [show, setShow] = useState(false);

    return <div className="relative">
        <IconButton 
            size="md"
            onClick={() => setShow(!show)}
            sx={{ 
                zIndex: 2,
                position: 'absolute',
                top: '50%',
                right: 5,
                transform: "translateY(-50%)"
            }}>
            {show ? <VisibilityOffIcon fontSize="inherit"/> : <VisibilityIcon fontSize="inherit"/>}
        </IconButton>
        <TextField 
            type={show ? "text" : "password"}
            label={label}
            required
            fullWidth
            onChange={onChange} 
        />
    </div>
}

export default PasswordField