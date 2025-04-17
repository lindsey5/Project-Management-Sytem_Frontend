import Autocomplete from "@mui/material/Autocomplete";
import { TextField, Box, Avatar } from "@mui/material";

const MembersAutocomplete = ({ members, handleChange }) => {
    return <Autocomplete
                multiple
                limitTags={2}
                onChange={handleChange}
                id="multiple-limit-tags"
                options={members}
                getOptionLabel={(option) => `${option.firstname} ${option.lastname}`}
                renderOption={(props, option) => {
                    const { key, ...optionProps } = props;
                    return <Box
                        key={key}
                        component="li"
                        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                        {...optionProps}
                        >
                        <Avatar
                            src={`data:image/jpeg;base64,${option.profile_pic}`}
                            sx={{ width: 25, height: 25 }}
                        />
                        {`${option.firstname} ${option.lastname}`}
                    </Box>
                }}
                renderInput={(params) => (
                    <TextField {...params} label="Assignees" placeholder="Assignees" />
                )}
            />
}

export default MembersAutocomplete