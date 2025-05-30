import Autocomplete from "@mui/material/Autocomplete";
import { TextField, Box, Avatar } from "@mui/material";
import { useContext } from "react";
import { UserContext } from "../context/userContext";

const MembersAutocomplete = ({ members, handleChange, value, readOnly }) => {
    const { user } = useContext(UserContext);

    return (
        <Autocomplete
            multiple
            limitTags={4}
            id="members-autocomplete"
            options={members}
            value={value}
            onChange={readOnly ? undefined : handleChange}
            readOnly={readOnly}
            disableCloseOnSelect
            getOptionLabel={(option) =>
                `${option.user.firstname} ${option.user.lastname} ${option.user.email === user.email ? '(You)' : ''}`
            }
            isOptionEqualToValue={(option, value) => option.user_Id === value.user_Id}
            renderOption={(props, option) => (
                <Box
                    component="li"
                    sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                    {...props}
                >
                    <Avatar
                        src={`data:image/jpeg;base64,${option.user.profile_pic}`}
                        sx={{ width: 25, height: 25 }}
                    />
                    {`${option.user.firstname} ${option.user.lastname} ${option.user.email === user.email ? '(You)' : ''}`}
                </Box>
            )}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Assignees"
                    placeholder="Assignees"
                    InputProps={{
                        ...params.InputProps,
                        readOnly: readOnly,
                    }}
                />
            )}
        />
    );
};

export default MembersAutocomplete