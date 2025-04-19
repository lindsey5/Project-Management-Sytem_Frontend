import { Box } from "@mui/material";

export const EllipsisText = ({text}) => {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', overflow: 'hidden', width: '100%' }}>
        <Box
          component="span"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            display: 'inline-block',
            minWidth: 0,
            flexShrink: 1,
          }}
        >
          {text.replace(/\.[^/.]+$/, '')}
        </Box>
        <Box component="span" sx={{ flexShrink: 0, marginLeft: '2px' }}>
          {text.match(/\.[^/.]+$/)?.[0]}
        </Box>
      </Box>
    );
  };
