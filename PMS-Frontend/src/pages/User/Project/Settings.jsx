import { Button, TextField } from "@mui/material"
import { useContext, useEffect, useState } from "react"
import { ProjectContext } from "../../../layouts/ProjectLayout"
import useProjectReducer from "../../../hooks/projectReducer"
import QRCode from "react-qr-code";
import { styled } from '@mui/system';
import { green, grey, red } from "@mui/material/colors";
import Autocomplete, { createFilterOptions} from "@mui/material/Autocomplete";
import StatusSelect from "../../../components/Select";
import dayjs from "dayjs";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import project_types from '../../../../project_types.json';
import { deleteProject, updateProject } from "../../../services/ProjectService";
import { convertToAsiaTime, formatDate, formatDateTime } from "../../../utils/utils";
import { ConfirmDialog } from "../../../components/dialog";
import { UserContext } from "../../../context/userContext";
import { toast } from "react-toastify";

const filter = createFilterOptions();

const GroupHeader = styled('div')(() => ({
    position: 'sticky',
    top: '-8px',
    padding: '4px 10px',
    color: "gray",
    backgroundColor: "white"
  }));
  
  const GroupItems = styled('ul')({
    padding: 0,
  });

const CustomTextField = ({label, value, width, ...rest}) =>{
    return <div className="flex flex-col gap-3" style={{ width }}>
        <p className="text-lg font-bold">{label}</p>
        <TextField 
            sx={{ width: '100%' }}
            value={value || ''} 
            {...rest}
        />
    </div>
}

const ProjectSettings = () => {
    const { project, role } = useContext(ProjectContext);
    const { state, dispatch } = useProjectReducer();
    const { user } = useContext(UserContext);
    const [value, setValue] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [showDelete, setShowDelete] = useState(false);

    useEffect(() => {
        if(project) {
            setValue(project.type);
            dispatch({ type: "SET_PROJECT", payload: {
                title: project.title,
                description: project.description,
                start_date: project.start_date,
                end_date: project.end_date,
                type: project.category,
                status: project.status
            }})
        }
        
    }, [project])

    const deduplicatedOptions = project_types.filter(
        (option, index, self) =>
            index === self.findIndex((o) => o.name === option.name)
    ).sort((a, b) => a.category.localeCompare(b.category));

    const saveUpdate = async () =>{
        const response = await updateProject({  
            ...state,
            id: project.id,
            type: value,
            start_date: formatDate(state.start_date),
            end_date: formatDate(state.end_date)
        })

        if(response.success) window.location.reload();
        else toast.error(response.message)
    }

    const handleDelete = async () => {
        const response = await deleteProject(project.id);
        if(response.success) window.location.reload();
    }
    

    return <main className="px-10 py-6 flex flex-col gap-5 lg:grid grid-cols-[2fr_1fr] gap-10">
            <div className="bg-white flex flex-col gap-10 items-end">
                <CustomTextField 
                    width={"100%"}
                    label="Title" 
                    value={state.title}
                    onChange={(e) => dispatch({ type: "SET_TITLE", payload: e.target.value})} 
                    disabled={role !== 'Admin' || user.email !== project.user.email}
                />
                <CustomTextField
                    width={"100%"}
                    label="Description"
                    value={state.description} 
                    multiline 
                    maxRows={5}
                    inputProps={{ maxLength: 500 }}
                    onChange={(e) => dispatch({ type: "SET_DESCRIPTION", payload: e.target.value})} 
                    disabled={role !== 'Admin' || project.user.email !== user.email}
                />
                <div className="flex flex-col gap-3 w-full">
                    <p className="text-lg font-bold">Project Type</p>
                    <Autocomplete
                        value={value}
                        groupBy={(option) => option.category}
                        onChange={(event, newValue) => {
                            if (typeof newValue === 'string') {
                            setValue({ name: newValue });
                            } else if (newValue && newValue.inputValue) {
                            // Creating a new value
                            setValue({ name: newValue.inputValue });
                            } else {
                            setValue(newValue);
                            }
                        }}
                        filterOptions={(options, params) => {
                            const filtered = filter(options, params);
                            const { inputValue } = params;

                            const isExisting = options.some(
                            (option) => inputValue === option.name
                            );
                            if (inputValue !== '' && !isExisting) {
                            filtered.push({
                                inputValue,
                                name: `Add "${inputValue}"`,
                            });
                            }

                            return filtered;
                        }}
                        disabled={role !== 'Admin' || project.user.email !== user.email}
                        selectOnFocus
                        clearOnBlur
                        handleHomeEndKeys
                        id="free-solo-with-text-demo"
                        options={deduplicatedOptions}
                        getOptionLabel={(option) => {
                            if (typeof option === 'string') {
                            return option;
                            }
                            return option.name;
                        }}
                        renderGroup={(params) => (
                            <li key={params.key}>
                            <GroupHeader>{params.group}</GroupHeader>
                            <GroupItems>{params.children}</GroupItems>
                            </li>
                        )}
                        renderOption={(props, option) => {
                            const { key, ...optionProps } = props;
                            const uniqueKey = `${option.name}-${option.category || 'uncategorized'}`;
                            return (
                            <li key={uniqueKey} {...optionProps}>
                                {option.name}
                            </li>
                            );
                        }}
                        size="medium"
                        sx={{ width: '100%' }}
                        freeSolo
                        renderInput={(params) => (
                            <TextField {...params} label="" />
                        )}
                    />
                </div>
                <div className="w-full grid grid-cols-2 gap-10">
                    <div className="flex flex-col gap-3">
                        <p className="text-lg font-bold">Start Date</p>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker 
                                className="w-full"
                                value={dayjs(state.start_date)}
                                disabled={role !== 'Admin' || project.user.email !== user.email}
                                onChange={(value) => dispatch({type: 'SET_START_DATE', payload: value.$d})}
                            />
                        </LocalizationProvider>
                    </div>
                    <div className="flex flex-col gap-3">
                        <p className="text-lg font-bold">End Date</p>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker 
                                className="w-full"
                                minDate={dayjs(state.start_date)}
                                value={dayjs(state.end_date)}
                                disabled={role !== 'Admin' || project.user.email !== user.email}
                                onChange={(value) => dispatch({type: 'SET_END_DATE', payload: value.$d})}
                            />
                        </LocalizationProvider>
                    </div>
                </div>
                <div className="w-full flex flex-col gap-3">
                    <p className="text-lg font-bold">Status</p>
                    <StatusSelect 
                        width={"100%"}
                        item={[ { name: 'Active', color: green[500]}, { name: 'On Hold', color: grey[500]}, { name: 'Closed', color: red[500]}]}
                        value={state.status}
                        disabled={role !== 'Admin' || project.user.email !== user.email}
                        onChange={(e) => dispatch({ type: "SET_STATUS", payload: e.target.value})}
                    />
                </div>
                <div className="flex gap-3">
                {project.user.email === user.email && 
                <Button 
                    onClick={() => setShowDelete(true)}
                    variant="contained" 
                    color="error"
                >Delete Project</Button>}
                {role === 'Admin'  && <Button 
                    variant="contained"
                    onClick={() => setOpenDialog(true)}
                >
                    Save changes
                </Button>}
                </div>
                <ConfirmDialog 
                    handleAgree={saveUpdate}
                    handleClose={() => setOpenDialog(false)}
                    isOpen={openDialog}
                    text="Are you sure you want to save these changes?"
                    title="Update"
                />
                <ConfirmDialog 
                    handleAgree={handleDelete}
                    handleClose={() => setShowDelete(false)}
                    variant="error"
                    isOpen={showDelete}
                    text="Are you sure you want to delete this project?"
                    title="Delete"
                />
            </div>
            <div className="flex flex-col items-center">
                <h1 className="mt-4">Project code: {project.project_code}</h1>
                <QRCode
                    style={{ width: '50%',  }}

                    value={project.project_code || ''}
                    viewBox={`0 0 256 256`}
                />
                <h1>Created: {formatDateTime(project.created_At)}</h1>
                <h1>Creator: {project.user.firstname} {project.user.lastname}</h1>
            </div>
    </main>
}

export default ProjectSettings