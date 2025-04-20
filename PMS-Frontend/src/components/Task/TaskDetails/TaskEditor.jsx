import MembersAutocomplete from "../../AutoComplete";
import { priority, status } from "../../../data/taskData";
import StatusSelect from "../../Select";
import dayjs from "dayjs";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { Box, TextField, Stack, Card, Button, Typography, Avatar} from "@mui/material";
import { useEffect } from "react";
import useTaskReducer from "../../../hooks/taskReducer";
import { useState } from "react";
import { formatDateTime, convertToAsiaTime, timeAgo } from "../../../utils/utils";
import { updateTask } from "../../../services/TaskService";
import { updateAssignees } from "../../../services/AssigneeService";

const TaskEditor = ({ members, role, task}) => {
    const [savedAssignees, setSavedAssignees] = useState([]);
    const [currentValue, setCurrentValue] = useState([]);
    const { state, dispatch } = useTaskReducer();

    useEffect(() => {
        setSavedAssignees(task.assignees.map(t => ({...t.member, assigneeId: t.id})));
        setCurrentValue(task.assignees.map(t => ({...t.member})));
        dispatch({ type: "SET_TASK", payload: {
            task_name: task.task_Name,
            description: task.description,
            priority: task.priority,
            status: task.status,
            due_date: convertToAsiaTime(task.due_date),
        } })

         return () => {
            setSavedAssignees([]);
            setCurrentValue([]);
            dispatch({type: 'CLEAR'});
         }
    }, [])

    const handleSave = async () => {
            const assigneesToRemove = savedAssignees
                .filter(a => !currentValue.some(cur => cur.id == a.id))
                .map(a => ({ id: a.assigneeId, member_Id: a.id, task_Id: task.id}))
    
            const assigneesToAdd = currentValue
                .filter(a => !savedAssignees.some(saved => saved.id == a.id))
                .map(a => ({ member_Id: a.id, task_Id: task.id}));
    
            const assigneesToUpdate = {
                assigneesToAdd,
                assigneesToRemove
            }
    
            await updateTask(task.id, {
                task_name: state.task_name,
                description: state.description,
                priority: state.priority,
                status: state.status,
                due_date: new Date(state.due_date)
            })
    
            await updateAssignees(task.id, assigneesToUpdate)
            window.location.reload();
            
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
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                border: role != 'Admin' && 'none',
                            },
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
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                border: role != 'Admin' && 'none',
                            },
                        },
                    }} 
                    onChange={(e) => dispatch({type: "SET_DESCRIPTION", payload: e.target.value})}
                />
                <Stack direction="row" gap={2}>
                    <StatusSelect 
                        label="Status"
                        item={status}
                        value={state.status}
                        handleChange={(e) => dispatch({ type: "SET_STATUS", payload: e.target.value})}
                    />
                    <StatusSelect 
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
                        label="Due date"
                        value={dayjs(state.due_date)}
                        readOnly={role != 'Admin'}
                        slotProps={{
                            input: {
                            readOnly: role != 'Admin',
                            },
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    border: role != 'Admin' && 'none',
                                },
                            },
                        }}
                        onChange={(newValue) => dispatch({type: "SET_DUE_DATE", payload: newValue.$d})}
                    />
                    </DemoContainer>
                </LocalizationProvider>
                <MembersAutocomplete 
                    members={members} 
                    handleChange={(e, value) => setCurrentValue(value)} 
                    value={currentValue}
                    readOnly={role != 'Admin'}
                />
                </Box>
                <Stack direction={"column"} justifyContent={"space-between"} gap={2} flex={1}>
                <Card variant="outlined" sx={{ padding: 1.5}}>
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
                    <Button variant="contained" onClick={handleSave}>
                        Save
                    </Button>
                </Stack>
    </Box>
}

export default TaskEditor