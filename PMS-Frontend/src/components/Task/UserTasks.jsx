import CustomizedTable from "../table"
import { IconButton, TableRow } from "@mui/material"
import { StyledTableCell, StyledTableRow } from "../table"
import { convertToAsiaTime, formatDateTime } from "../../utils/utils"
import { statusConfig } from "../config"
import CircleIcon from '@mui/icons-material/Circle';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useEffect, useState, useMemo, useContext } from "react"
import TaskDetails from "./TaskDetails/TaskDetails"
import StatusSelect from "../Select"
import { status } from "../../data/taskData"
import { UserContext } from "../../context/userContext"

const UserTasks = ({ allTasks }) => {
    const [selectedTask, setSelectedTask] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState('All');
    const { user } = useContext(UserContext);

    const filteredTasks = useMemo(() => {
        if(selectedStatus === 'All'){
            return tasks
        }else{
            return tasks.filter(task => task.status === selectedStatus)
        }
        
    },[selectedStatus, tasks])
    

    useEffect(() => {
        if(allTasks){
            console.log(allTasks.filter(task => task.assignees.find(a => a.member.user.email === user.email)))
            setTasks(allTasks.filter(task => task.assignees.find(a => a.member.user.email === user.email)));
        }
    }, [allTasks])
    

    return <main className="w-full h-full py-10 px-4">
        <TaskDetails closeModal={() => setSelectedTask(null)} open={selectedTask != null} task={selectedTask}/>
        <div className="flex mb-4 w-full">
            <StatusSelect 
                sx={{ height: '45px'}}
                width={'150px'}
                label="Status"
                handleChange={(e) => setSelectedStatus(e.target.value)} 
                item={[{ name: 'All', color: 'rgb(174, 172, 175)'}, ...status]} 
                value={selectedStatus}
            />
        </div>
        
        <CustomizedTable
            cols={<TableRow>
                        <StyledTableCell align="center">Task name</StyledTableCell>
                        <StyledTableCell align="center">Due date</StyledTableCell>
                        <StyledTableCell align="center">Priority</StyledTableCell>
                        <StyledTableCell align="center">Status</StyledTableCell>
                        <StyledTableCell align="center">Created At</StyledTableCell>
                        <StyledTableCell align="center">Updated At</StyledTableCell>
                        <StyledTableCell align="center">Creator</StyledTableCell>
                        <StyledTableCell align="center">Action</StyledTableCell>
                    </TableRow>}

            rows={filteredTasks.length > 0 && filteredTasks.map((task, i) => {
                            return <StyledTableRow key={i}>
                                <StyledTableCell align="center">{task.task_Name}</StyledTableCell>
                                <StyledTableCell align="center">{formatDateTime(convertToAsiaTime(task.due_date))}</StyledTableCell>
                                <StyledTableCell align="center">
                                    <div className="flex items-center gap-2">
                                        <CircleIcon sx={{ color: statusConfig[task.priority]}} fontSize="small"/>
                                        {task.priority}
                                    </div></StyledTableCell>
                                <StyledTableCell align="center">
                                    <div className="flex items-center gap-2">
                                        <CircleIcon sx={{ color: statusConfig[task.status]}} fontSize="small"/>
                                        {task.status}
                                    </div>
                                </StyledTableCell>
                                <StyledTableCell align="center">{formatDateTime(convertToAsiaTime(task.created_At))}</StyledTableCell>
                                <StyledTableCell align="center">{formatDateTime(convertToAsiaTime(task.updated_At))}</StyledTableCell>
                                <StyledTableCell align="center">{task.member.user.firstname} {task.member.user.lastname}</StyledTableCell>
                                <StyledTableCell align="center">
                                    <IconButton onClick={() => setSelectedTask(task)}>
                                        <VisibilityIcon />
                                    </IconButton>
                                </StyledTableCell>
                                
                            </StyledTableRow>
                        })}
        />
    </main>

}

export default UserTasks