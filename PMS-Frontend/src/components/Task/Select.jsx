import Select from "@mui/material/Select";
import FormControl from '@mui/material/FormControl';
import CircleIcon from '@mui/icons-material/Circle';
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";

const StatusSelect = ({ handleChange, item, value, label, ...rest}) =>{
    return <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">{label}</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label={label}
                    value={value}
                    onChange={handleChange}
                    {...rest}
                >
                    {item.map(i => <MenuItem value={i.name}>
                        <Box display="flex" alignItems="center" gap={1}>
                            <CircleIcon sx={{ color: i.color, fontSize: 14 }} />
                            {i.name}
                        </Box>
                    </MenuItem>)}
                </Select>
            </FormControl>
}

export default StatusSelect