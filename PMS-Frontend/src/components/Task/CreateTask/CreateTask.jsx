import { Modal, TextField } from "@mui/material"
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import IconButton from "@mui/material/IconButton";
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from '@mui/material/FormControl';
import CircleIcon from '@mui/icons-material/Circle';
import InputLabel from "@mui/material/InputLabel";
import { useEffect, useState, useContext } from "react";
import { getMembers } from "../../../services/MemberService";
import { useSearchParams } from "react-router-dom";
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { ProjectContext } from "../../../layouts/ProjectLayout";
import MembersAutocomplete from "./AutoComplete";
import FileUploadBtn from "./FileUploadBtn";
import useTaskReducer from "../../../hooks/taskReducer";
import { Chip } from "@mui/material";
import { CustomButton } from "../../button";
import { createTask } from "../../../services/TaskService";
import { createTaskAttachment } from "../../../services/TaskAttachmentService";

const style = {
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: '10px',
    width: '90%',
    maxWidth: '450px'
};

const status = [
    { name: "To Do", color: '#951ff7'},
    { name: "In Progress", color: "#e2f069"},
    { name: "In Review", color: "#194bd3"},
    { name: "Completed", color: "#10B981"},
    { name: "Error", color: "#F87171"}
]

const priority = [
    { name: "High", color: "red"},
    { name: "Medium", color: "orange"},
    { name: "Low", color: "green"}
]

const today = dayjs();

const CreateTask = ({open, close, currentStatus}) => {
    const [searchParams] = useSearchParams();
    const project_code = searchParams.get('c');
    const [members, setMembers] = useState([]);
    const { state, dispatch } = useTaskReducer();
    const [files, setFiles] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { project } = useContext(ProjectContext);

    const handleSubmit = async (data) => {
        setError('');
        if(!data.task_name) setError('Task name is required.')
        else if(!data.priority) setError('Set priority.')
        else if(!data.status) setError('Set status.')
        else if(data.assigneesMemberId.length < 0) setError('Choose atleast 1 assignee')
        else {
            setLoading(true);
            const response = await createTask({
                ...data,
                project_id: project.id
            })
            if(response.success) {
                for(const file in files){
                    await createTaskAttachment(response.task.id, file)
                }

                window.location.reload();
            }
            files.forEach(async (file) => {
              await createTaskAttachment(response.task.id, file);
            })

            setLoading(false)
        }
    }

    const handleFiles = (e) => {
        const selectedFiles = Array.from(e.target.files)
        setFiles(prev => [...prev, ...selectedFiles]);
    };

    useEffect(() => {
       if(currentStatus)  handleChange(currentStatus, "SET_STATUS")
    }, [currentStatus])

    const closeModal = () => {
        close()
        dispatch({type: "CLEAR"})
        setFiles([]);
        setError('');
    }

    const handleChange = (value, type) => {
        dispatch({type, payload: value});
    }

    const deleteFile = (index) => {
        setFiles(prev => prev.filter((f, i) => i !== index))
    }

    const openFile = (file) => {
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL);
    }

    useEffect(() => {
        const fetchMembers = async() => {
            const response = await getMembers(project_code)
            const fetchedMembers = response.members.map(m => {
                const { user,  ...details } = m; 
                const { id, ...rest} = user
                return {...details , ...rest}
            })

            setMembers([...fetchedMembers])
        }

        fetchMembers()
    }, [])

    return <Modal
            open={open}
            onClose={closeModal}
            aria-labelledby="parent-modal-title"
            aria-describedby="parent-modal-description"
            sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', overflowY: 'auto'}}
        >
        <Card variant="outlined" sx={{ ...style }}>
            <Box sx={{ p: 2 }}>
                <Stack
                direction="row"
                sx={{ justifyContent: 'space-between' }}
                >
                <Typography gutterBottom variant="h5">
                    Create Task
                </Typography>
                <IconButton aria-label="delete" onClick={closeModal}>
                    <CloseIcon />
                </IconButton>
                </Stack>
            </Box>
            <Divider />
            <Stack direction="column" gap={3} p={3}>
                {error && <Typography color="red" variant="subtitle1">{error}</Typography>}
                <TextField 
                    label="Task name" 
                    value={state.task_name}
                    onChange={(e) => handleChange(e.target.value, "SET_TASK_NAME") }
                    inputProps={{ maxLength: 50 }}
                />
                <TextField 
                    label="Description" 
                    multiline 
                    maxRows={5}
                    value={state.description}
                    inputProps={{ maxLength: 500 }}
                    onChange={(e) => handleChange(e.target.value, "SET_DESCRIPTION") }
                />
                <Stack sx={{ width: '100%'}} direction="row" gap={3}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Priority</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            label="Priority"
                            value={state.priority}
                            onChange={(e) => handleChange(e.target.value, "SET_PRIORITY") }
                        >
                        {priority.map(p => <MenuItem value={p.name}>
                                <Box display="flex" alignItems="center" gap={1}>
                                    <CircleIcon sx={{ color: p.color, fontSize: 14 }} />
                                    {p.name}
                                </Box>
                            </MenuItem>)}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Status</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            label="Status"
                            value={state.status}
                            onChange={(e) => handleChange(e.target.value, "SET_STATUS") }
                        >
                            {status.map(s => <MenuItem value={s.name}>
                                <Box display="flex" alignItems="center" gap={1}>
                                    <CircleIcon sx={{ color: s.color, fontSize: 14 }} />
                                    {s.name}
                                </Box>
                            </MenuItem>)}
                        </Select>
                    </FormControl>
                </Stack>
                <MembersAutocomplete members={members} handleChange={(e, values) => handleChange(values.map(value => value.id), "SET_ASSIGNEES")}/>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DateTimePicker']}>
                    <DateTimePicker
                        label="Due date"
                        value={dayjs(state.due_date)}
                        minDate={today}
                        onChange={(newValue) => handleChange(newValue.$d, "SET_DUE_DATE")}
                    />
                    </DemoContainer>
                </LocalizationProvider>
                <FileUploadBtn handleFiles={handleFiles}/>
                {files && files.length > 0 && <Stack direction="row" flexWrap="wrap" gap={1}>
                    {files.map((file, index) => {
                        return <Chip
                            label={file.name}
                            onClick={() => openFile(file)}
                            onDelete={() => deleteFile(index)}
                            sx={{ maxWidth: '150px', cursor: 'pointer'}}
                        />

                    })}
                </Stack>}
                <CustomButton 
                    onClick={() => handleSubmit(state)}
                    icon={<AddIcon />}
                    sx={{ borderRadius: '10px', height: '50px'}}
                    disabled={loading}
                >
                    CREATE
                </CustomButton>
            </Stack>
        </Card>
    </Modal>
}

export default CreateTask