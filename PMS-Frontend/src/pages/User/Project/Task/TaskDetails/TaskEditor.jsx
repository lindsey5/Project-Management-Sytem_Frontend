import MembersAutocomplete from "../../../../../components/AutoComplete";
import { priority, status } from "../../../../../data/taskData";
import StatusSelect from "../../../../../components/Select";
import dayjs from "dayjs";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { Box, TextField, Stack, Card, Button, Typography, Avatar} from "@mui/material";
import { memo, useContext, useEffect } from "react";
import useTaskReducer from "../../../../../hooks/taskReducer";
import { useState } from "react";
import { formatDateTime, convertToAsiaTime, timeAgo } from "../../../../../utils/utils";
import { updateTask } from "../../../../../services/TaskService";
import { updateAssignees } from "../../../../../services/AssigneeService";
import { ProjectContext } from "../../../../../layouts/ProjectLayout";
import { toast } from "react-toastify";
import { ConfirmDialog } from "../../../../../components/dialog";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../../../context/userContext";

const CreatorCard = memo(({ task }) => {
    return <Card variant="outlined" sx={{ padding: 1.5}}>
    <Typography variant="subtitle2">Creator</Typography>
    <Stack direction={"row"} justifyContent={"space-between"} alignItems="end">
        <Stack direction="row" gap={2} marginTop={1} alignItems="center">
            <Avatar 
                src={`data:image/jpeg;base64,${task?.member?.user?.profile_pic}`} 
                sx={{ width: 42, height: 42 }}
            />
            <Box>
                <Typography variant="h6" fontSize="18px">{task?.member?.user?.firstname} {task?.member?.user?.lastname}</Typography>
                <Typography variant="subtitle2" color="gray">{task?.created_At && formatDateTime(convertToAsiaTime(task.created_At))}</Typography>               
            </Box>
        </Stack>
        <Typography variant="subtitle2">
                {`Updated ${timeAgo(new Date(task?.updated_At), new Date())}`}      
        </Typography> 
    </Stack>
    </Card> 
})

const TaskEditor = ({ members, role, task}) => {
    const [assignees, setAssignees] = useState({
        saved: task?.assignees.map(t => ({...t.member, assigneeId: t.id})) || [],
        current: task?.assignees.map(t => ({...t.member})) || []
    });
    const { user } = useContext(UserContext);
    const { state, dispatch } = useTaskReducer();
    const { project } = useContext(ProjectContext);
    const [openDelete, setOpenDelete] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        dispatch({ type: "SET_TASK", payload: {
            task_name: task.task_Name,
            description: task.description,
            priority: task.priority,
            status: task.status,
            start_date: convertToAsiaTime(task.start_date),
            due_date: convertToAsiaTime(task.due_date),
        } })

         return () => {
            dispatch({type: 'CLEAR'});
         }
    }, [task])

    const handleSave = async () => {
        if(new Date(state.start_date) < new Date(state.due_date)){
            const assigneesToRemove = assignees.saved.filter(a => !assignees.current.some(cur => cur.id == a.id))
                .map(a => ({ id: a.assigneeId, member_Id: a.id, task_Id: task.id}))
    
            const assigneesToAdd = assignees.current.filter(a => !assignees.saved.some(saved => saved.id == a.id))
                .map(a => ({ member_Id: a.id, task_Id: task.id}));
    
            const assigneesToUpdate = {
                assigneesToAdd,
                assigneesToRemove
            }
    
            const updateResponse = await updateTask(task.id, {
                task_name: state.task_name,
                description: state.description,
                priority: state.priority,
                status: state.status,
                start_date: new Date(state.start_date),
                due_date: new Date(state.due_date)
            })
            if(updateResponse.success){
                const updateAssigneeResponse = await updateAssignees(task.id, assigneesToUpdate)

                if(updateAssigneeResponse.success){
                    window.location.reload();
                }else{
                    toast.error("Error please try again.");
                }
            }
        }else{
            toast.error("Start date should be earlier than the due date.")
        }
    }

    const handleDelete = async () => {
        const response = await updateTask(task.id, {
            task_name: state.task_name,
            description: state.description,
            priority: state.priority,
            status: 'Deleted',
            start_date: new Date(state.start_date),
            due_date: new Date(state.due_date)
        })

        if(response.success) {
            navigate(`/project/tasks?c=${project.project_code}`, { replace: true });
            window.location.reload();
        }
    }

    return <Box padding={2} flex={1} display={"flex"} flexDirection={"column"} overflow={"auto"}>
                <Box display="flex" boxSizing={"border-box"} flexDirection={"column"} gap={3} marginBottom={2}>
                <TextField 
                    label="Task name"
                    value={state?.task_name}
                    slotProps={{
                        input: {
                        readOnly: role != 'Admin',
                        },
                    }}
                    onChange={(e) => dispatch({type: "SET_TASK_NAME", payload: e.target.value})}
                />
                <TextField 
                    label="Description"
                    maxRows={5}
                    multiline
                    value={state?.description}
                    slotProps={{
                        input: {
                        readOnly: role != 'Admin',
                        },
                    }}
                    onChange={(e) => dispatch({type: "SET_DESCRIPTION", payload: e.target.value})}
                />
                <Stack direction="row" gap={2}>
                    <StatusSelect 
                        width={"100%"}
                        label="Status"
                        item={status}
                        value={state.status}
                        handleChange={(e) => dispatch({ type: "SET_STATUS", payload: e.target.value})}
                    />
                    <StatusSelect 
                        width={"100%"}
                        label="Priority"
                        item={priority}
                        value={state.priority}
                        slotProps={{
                            input: {
                            readOnly: role != 'Admin',
                            },
                        }}
                        handleChange={(e) => dispatch({ type: "SET_PRIORITY", payload: e.target.value})}
                    />
                </Stack>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DateTimePicker']}>
                    <DateTimePicker
                        label="Start date"
                        value={dayjs(state.start_date)}
                        readOnly={role != 'Admin'}
                        slotProps={{
                            input: {
                            readOnly: role != 'Admin',
                            },
                        }}
                        onChange={(newValue) => dispatch({type: "SET_START_DATE", payload: newValue.$d})}
                    />
                    </DemoContainer>
                </LocalizationProvider>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DateTimePicker']}>
                    <DateTimePicker
                        label="Due date"
                        value={dayjs(state.due_date)}
                        minDate={dayjs(state.start_date)}
                        readOnly={role != 'Admin'}
                        slotProps={{
                            input: {
                            readOnly: role != 'Admin',
                            },
                        }}
                        onChange={(newValue) => dispatch({type: "SET_DUE_DATE", payload: newValue.$d})}
                    />
                    </DemoContainer>
                </LocalizationProvider>
                <MembersAutocomplete 
                    members={members} 
                    handleChange={(e, value) => setAssignees({...assignees, current: value})} 
                    value={assignees.current}
                    readOnly={role != 'Admin'}
                />
                </Box>
                <Stack direction={"column"} justifyContent={"space-between"} gap={2} flex={1}>
                    <CreatorCard task={task}/>
                    <ConfirmDialog 
                        handleAgree={handleDelete}
                        isOpen={openDelete}
                        text={"Are you sure do you want to delete the task?"}
                        title={"Delete"}
                        handleClose={() => setOpenDelete(false)}
                        variant="error"
                    />
                    <Stack flexDirection={"row"} justifyContent={"flex-end"} gap={3}>
                        {role === 'Admin' && <Button variant="contained" color="error" onClick={() => setOpenDelete(true)} disabled={project.status !== "Active"}>
                            Delete Task
                        </Button>}
                        <Button 
                            variant="contained" 
                            onClick={handleSave} 
                            disabled={project.status !== "Active" || (role !== 'Admin' && !task.assignees.some(a => a.member.user.email === user.email))}>
                            Save
                        </Button>
                    </Stack>
                </Stack>
    </Box>
}

export default memo(TaskEditor)