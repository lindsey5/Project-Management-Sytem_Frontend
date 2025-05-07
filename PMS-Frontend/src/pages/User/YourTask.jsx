import { useEffect, useState, useMemo, useContext } from "react"
import { getUserTasks } from "../../services/TaskService";
import { Card, Pagination, TextField } from "@mui/material";
import CustomizedTable, { StyledTableCell, StyledTableRow} from "../../components/table";
import { TableRow } from "@mui/material";
import { formatDateTime, convertToAsiaTime } from "../../utils/utils";
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import InputAdornment from '@mui/material/InputAdornment';
import CircleIcon from '@mui/icons-material/Circle';
import { statusConfig } from "../../components/config";
import StatusSelect from "../../components/Select";
import { status } from "../../data/taskData";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";

const items = [
    { name: 'All', color: '#808080' },      
    { name: 'Active', color: '#4CAF50' },   
    { name: 'On hold', color: '#FFC107' },  
    { name: 'Closed', color: '#F44336' }   
  ];

const YourTasks = () => {
    const { user } = useContext(UserContext);
    const [tasks, setTasks] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState('All');
    const [selectedProjectStatus, setSelectedProjectStatus] = useState('Active');
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const [totalPages, setTotalPages] = useState(0);
    const [page, setPage] = useState(1);

    const handleClick = (project_code, id) => {
        navigate(`/project/tasks?c=${project_code}`, { state: { task : id } });
    }

    useEffect(() => {
        const getTasksAsync = async () => {
            const response = await getUserTasks(page, searchTerm, selectedStatus, selectedProjectStatus);
            setTasks(response.tasks)
            setTotalPages(response.totalPages)
        }

        const delayDebounce = setTimeout(() => {
                getTasksAsync();
          }, 300); 
        
        return () => clearTimeout(delayDebounce);
    }, [page, searchTerm, selectedStatus, selectedProjectStatus]);

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            setPage(1)
        }, 300); 
        return () => clearTimeout(delayDebounce);
    }, [searchTerm, selectedStatus, selectedProjectStatus])

    return <main className="p-10 flex flex-col gap-5 h-full">
        <h1 className="text-3xl font-bold">Your Tasks</h1>
        <div className="w-full flex justify-between">
            <TextField
                id="input-with-icon-textfield"
                placeholder='Search'
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{
                    '& .MuiOutlinedInput-root': {
                    borderRadius: '20px'
                } }}
                slotProps={{
                    input: {
                        startAdornment: (
                        <InputAdornment position="start">
                            <SearchOutlinedIcon sx={{ fontSize: 25, color: 'black'}}/>
                        </InputAdornment>
                        ),
                    },
                }}
                variant='outlined'
                size='small'
                />
            <div className="flex gap-10 ">
                <StatusSelect 
                    sx={{ height: '45px'}}
                    width={'150px'}
                    label="Status"
                    handleChange={(e) => setSelectedStatus(e.target.value)} 
                    item={[{ name: 'All', color: 'rgb(174, 172, 175)'}, ...status]} 
                    value={selectedStatus}
                />
                <StatusSelect 
                    sx={{ height: '45px'}}
                    width={'150px'}
                    label="Project status"
                    handleChange={(e) => setSelectedProjectStatus(e.target.value)} 
                    item={items} 
                    value={selectedProjectStatus}
                />
            </div>
        </div>
        <div className="flex-grow min-h-0 overflow-y-auto">
            <CustomizedTable
                cols={<TableRow>
                    <StyledTableCell align="center">Task name</StyledTableCell>
                    <StyledTableCell align="center">Project title</StyledTableCell>
                    <StyledTableCell align="center">Project status</StyledTableCell>
                    <StyledTableCell align="center">Start date</StyledTableCell>
                    <StyledTableCell align="center">Due date</StyledTableCell>
                    <StyledTableCell align="center">Priority</StyledTableCell>
                    <StyledTableCell align="center">Status</StyledTableCell>
                    <StyledTableCell align="center">Created At</StyledTableCell>
                    <StyledTableCell align="center">Updated At</StyledTableCell>
                    <StyledTableCell align="center">Creator</StyledTableCell>
                </TableRow>}

                rows={tasks.length > 0 && tasks.map((task, i) => {
                    return <StyledTableRow key={i} style={{ cursor: 'pointer'}} onClick={() => handleClick(task.project.project_code, task.id) }>
                        <StyledTableCell align="center">{task.task_Name}</StyledTableCell>
                        <StyledTableCell align="center">{task.project.title}</StyledTableCell>
                        <StyledTableCell align="center">{task.project.status}</StyledTableCell>
                        <StyledTableCell align="center">{formatDateTime(convertToAsiaTime(task.start_date))}</StyledTableCell>
                        <StyledTableCell align="center">{formatDateTime(convertToAsiaTime(task.due_date))}</StyledTableCell>
                        <StyledTableCell align="center">
                            <div className="flex items-center gap-2">
                                <CircleIcon sx={{ color: statusConfig[task.priority]}} fontSize="small"/>
                                {task.priority}
                            </div>
                        </StyledTableCell>
                        <StyledTableCell align="center">
                            <div className="flex items-center gap-2">
                                <CircleIcon sx={{ color: statusConfig[task.status]}} fontSize="small"/>
                                {task.status}
                            </div>
                        </StyledTableCell>
                        <StyledTableCell align="center">{formatDateTime(convertToAsiaTime(task.created_At))}</StyledTableCell>
                        <StyledTableCell align="center">{formatDateTime(convertToAsiaTime(task.updated_At))}</StyledTableCell>
                        <StyledTableCell align="center">{task.member.user.email === user.email ? "You" : `${task.member.user.firstname} ${task.member.user.lastname}`}</StyledTableCell>      
                    </StyledTableRow>
                })}
            />
        </div>
        <Pagination
                count={totalPages} 
                page={page} 
                onChange={(e, value) => setPage(value)} 
            />
    </main>
}

export default YourTasks