import { Chip, Box } from "@mui/material";

export const StatusChip = ({ label, color, sx }) => {

  return (
    <Chip
      label={label}
      icon={
        <Box
          sx={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            backgroundColor: color,
          }}
        />
      }
      sx={{
        pl: '4px',
        pr: '10px',
        '& .MuiChip-icon': {
          marginLeft: '6px',
          marginRight: '0px',
        },
        backgroundColor: '#f3f4f6',
        ...sx
      }}
    />
  );
};