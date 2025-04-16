import { Button } from "@mui/material"

export const CustomButton = ({label, icon, sx, ...rest}) => {
    return <Button
        variant="contained"
        startIcon={icon}
        sx={{ 
            borderRadius: '20px',
            backgroundColor: 'black',
            color: 'white',
            textTransform: 'none',
            '&:hover': { backgroundColor: '#6b7280' },
            ...sx
        }}
        {...rest}
    >
    {label}
    </Button>
}