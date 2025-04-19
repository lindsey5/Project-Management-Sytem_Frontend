import { Chip, Box } from "@mui/material";

export const StatusChip = ({label, color, ...rest}) => {

  return (
    <Chip
      {...rest}
      label={label}
      size="medium"
      icon={
        color && <Box
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
      }}
    />
  );
};