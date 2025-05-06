import { Modal, TextField } from "@mui/material"
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import IconButton from "@mui/material/IconButton";
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import { useEffect, useState, useContext } from "react";
import { getMembers } from "../../../../services/MemberService";
import { useNavigate, useSearchParams } from "react-router-dom";
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { ProjectContext } from "../../../../layouts/ProjectLayout";
import MembersAutocomplete from "../../../../components/AutoComplete";
import FileUploadBtn from "../../../../components/FileUploadBtn";
import useTaskReducer from "../../../../hooks/taskReducer";
import { Chip } from "@mui/material";
import { CustomButton } from "../../../../components/button";
import { createTask } from "../../../../services/TaskService";
import { createTaskAttachment } from "../../../../services/TaskAttachmentService";
import StatusSelect from "../../../../components/Select";
import { status, priority } from '../../../../data/taskData';
import { openFile } from "../../../../utils/utils";
import { toast } from "react-toastify";

const style = {
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: '10px',
    width: '90%',
    maxWidth: '450px',
    height: '95%',
    overflowY: 'auto'
};

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
    const navigate = useNavigate();

    const handleSubmit = async (data) => {
        setError('');
        if(!data.task_name) setError('Task name is required.')
        else if(!data.priority) setError('Set priority.')
        else if(!data.status) setError('Set status.')
        else if(!data.due_date) setError('Due date is required.')
        else {
            setLoading(true);
            const response = await createTask({
                ...data,
                project_id: project.id
            })
            console.log(response)
            if(response.success) {
                
                files.forEach(async (file) => {
                    await createTaskAttachment(response.task.id, file);
                })
                  
                navigate(`/project/tasks?c=${project.project_code}`, { replace: true });
                window.location.reload();
            }else{
                toast.error(response.message)
            }

            setLoading(false)
        }
    }

    const handleFiles = (e) => {
        setLoading(true)
        const selectedFiles = Array.from(e.target.files)
        if(selectedFiles === 0) return
        setFiles(prev => [...prev, ...selectedFiles]);
        setLoading(false)
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

    useEffect(() => {
        const fetchMembers = async() => {
            const response = await getMembers(project_code)
            setMembers(response.members)
        }

        fetchMembers()
    }, [])

    const handleStatus = (e) => {
        handleChange(e.target.value, "SET_STATUS")
    }

    const handlePriority = (e) => {
        handleChange(e.target.value, "SET_PRIORITY")
    }

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
                    <StatusSelect 
                        width={"100%"}
                        label="Priority"
                        handleChange={handlePriority}
                        item={priority}
                        value={state.priority}
                    />
                    <StatusSelect 
                        width={"100%"}
                        label="Status"
                        handleChange={handleStatus} 
                        item={status} 
                        value={state.status}
                    />
                </Stack>
                <MembersAutocomplete members={members} handleChange={(e, values) => handleChange(values.map(value => value.id), "SET_ASSIGNEES")}/>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DateTimePicker']}>
                    <DateTimePicker
                        label="Start date"
                        value={dayjs(state.start_date)}
                        minDate={today}
                        onChange={(newValue) => handleChange(newValue.$d, "SET_START_DATE")}
                    />
                    </DemoContainer>
                </LocalizationProvider>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DateTimePicker']}>
                    <DateTimePicker
                        label="Due date"
                        value={dayjs(state.due_date)}
                        minDate={dayjs(state.start_date)}
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