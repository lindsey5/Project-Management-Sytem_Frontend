import { Card, Box, Typography } from "@mui/material"

export const DashboardCard = ({ label, value, icon, color}) => {
    return <Card sx={{ 
        paddingX: 2, 
        paddingY: 3, 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'start',
        boxShadow: '2px 8px 8px 3px rgb(221, 221, 221)'
    }}>
        <Box 
            bgcolor={color} 
            borderRadius={"50%"} 
            padding={2}
        >
        {icon}
        </Box>
        <Typography 
            variant="subtitle2" 
            fontSize={"16px"} 
            color="rgb(160, 160, 160)"
            marginTop={"20px"}
        >
            {label}
        </Typography>
        <Typography variant="h4" fontWeight={"bold"}>{value}</Typography>
    </Card>
}