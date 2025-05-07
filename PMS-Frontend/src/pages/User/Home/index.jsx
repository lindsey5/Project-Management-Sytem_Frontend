import { useContext, useEffect, useMemo, useState } from "react"
import { UserContext } from "../../../context/userContext"
import { DashboardCard } from "../../../components/Card";
import { getAllUserTasks } from "../../../services/TaskService";
import TaskOutlinedIcon from '@mui/icons-material/TaskOutlined';
import { convertToAsiaTime, formatDateTime } from "../../../utils/utils";
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import QueryBuilderOutlinedIcon from '@mui/icons-material/QueryBuilderOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import { Card, Typography, TableRow, Box } from "@mui/material";
import { StyledTableCell, StyledTableRow } from "../../../components/table";
import { PieChart } from '@mui/x-charts/PieChart';
import { statusConfig } from "../../../components/config";
import CustomizedTable from "../../../components/table";
import StatusSelect from "../../../components/Select";
import { status as statusData} from '../../../data/taskData'
import CircleIcon from '@mui/icons-material/Circle';

const Home = () => {
    const { user } = useContext(UserContext);
    const [tasksDetails, setTasksDetails] = useState(); 
    const [pieChartData, setPieChartData] = useState([]);
    const [status, setStatus] = useState('All');

    useEffect(() => {
        const fetchData = async () => {
            const response = await getAllUserTasks();
            
            const totalTasks = response.tasks.filter(task => task.project.status === "Active").length

            const activeTasks = response.tasks
                .filter(task => task.status !== 'Completed' && task.project.status === "Active").length

            const tasksDueSoon = response.tasks.filter(task => 
                new Date(convertToAsiaTime(task.due_date)) > new Date() 
                && task.status !== 'Completed' && task.project.status === "Active").length;

            const overDueTask = response.tasks.filter(task => task.status !== 'Completed' && 
                new Date(convertToAsiaTime(task.due_date)) < new Date() &&
                task.project.status === "Active").length
            
            const completedTasks = response.tasks.filter(task => {
                return new Date(convertToAsiaTime(task.due_date)).getMonth() === new Date().getMonth() &&
                new Date(convertToAsiaTime(task.due_date)).getFullYear() === new Date().getFullYear() &&
                task.status === 'Completed' && task.project.status === "Active"
            }).length;

            // Set Pie Chart data
            const tasksStatus = [...new Set(response.tasks
                .filter(task =>  task.project.status === "Active")
                .map(task => task.status))];
            
            setPieChartData(tasksStatus.map(status => {
                const numberOfTask = response.tasks.filter(task => task.project.status === "Active" && task.status == status).length
                return { value: numberOfTask, percentage: (( numberOfTask / totalTasks) * 100).toFixed(2), label: status, color: statusConfig[status]}
            }))

            setTasksDetails({
                allTasks: response.tasks.filter(task => task.project.status === "Active" && task.status !== "Completed"),
                activeTasks,
                overDueTask,
                completedTasks,
                tasksDueSoon, 
                totalTasks
            })
        } 
        fetchData();
    }, [])

    const tasks = useMemo(() => {
        if(status === 'All'){
            return tasksDetails?.allTasks
        }else{
            return tasksDetails?.allTasks.filter(task => task.status === status)
        }

    },[status, tasksDetails?.allTasks])

    return <main className="pt-10 pb-6 px-10">
        <h1 className="font-bold text-4xl mb-12">Welcome {user && user.firstname}!</h1>
        <div className="flex md:grid grid-cols-4 wrap gap-16">
            <DashboardCard 
                label={"My tasks"}
                value={tasksDetails?.activeTasks}
                color={"rgb(39, 75, 194)"}
                icon={<AssignmentOutlinedIcon sx={{ color: 'white'}} />}
            />
            <DashboardCard 
                label={"Overdue tasks"}
                value={tasksDetails?.overDueTask}
                color={"rgb(241, 94, 94)"}
                icon={<QueryBuilderOutlinedIcon sx={{ color: 'white'}} />}
            />
            <DashboardCard 
                label={"Tasks due soon"}
                value={tasksDetails?.tasksDueSoon}
                color={"rgb(248, 172, 101)"}
                icon={<CalendarTodayOutlinedIcon sx={{ color: 'white'}} />}
            />
            <DashboardCard 
                label={"Completed this month"}
                value={tasksDetails?.completedTasks}
                color={" #46a818"}
                icon={<TaskOutlinedIcon sx={{ color: 'white'}} />}
            />
        </div>
        <div
            className="mt-[50px] md:grid md:grid-cols-[2fr_1fr] gap-5"
        >
            <Card className="border-1 border-gray-200 h-[500px] border-box px-5 py-10 gap-5 flex flex-col" sx={{ boxShadow: '2px 8px 8px 3px rgb(221, 221, 221)'}} >
                <Typography variant="h5">Assigned Tasks</Typography>
                <Box className="flex">
                    <StatusSelect 
                        width={'200px'}
                        sx={{ height: '35px'}}
                        item={[{ name: 'All', color: 'rgb(174, 172, 175)'}, ...statusData]}
                        value={status}
                        handleChange={(e) => setStatus(e.target.value)}
                    />
                </Box>
                <CustomizedTable 
                    cols={<TableRow>
                            <StyledTableCell align="center">Task name</StyledTableCell>
                            <StyledTableCell align="center">Project title</StyledTableCell>
                            <StyledTableCell align="center">Status</StyledTableCell>
                            <StyledTableCell align="center">Start date</StyledTableCell>
                            <StyledTableCell align="center">Due date</StyledTableCell>
                    </TableRow>}

                    rows={tasks?.map(task => 
                        <StyledTableRow key={task.id}>
                            <StyledTableCell align="center">{task?.task_Name}</StyledTableCell>
                            <StyledTableCell align="center">{task?.project.title}</StyledTableCell>
                            <StyledTableCell align="center">
                                <div className="flex items-center gap-2">
                                    <CircleIcon sx={{ color: statusConfig[task.status]}} fontSize="small"/>
                                {task.status}
                                </div>
                            </StyledTableCell>
                            <StyledTableCell align="center">{formatDateTime(convertToAsiaTime(task?.start_date))}</StyledTableCell>
                            <StyledTableCell align="center">{formatDateTime(convertToAsiaTime(task?.due_date))}</StyledTableCell>
                        </StyledTableRow>
                    )}
                />
            </Card>
            <Card className="h-[500px] md:mt-0 mt-20 flex flex-col border-1 border-gray-200" sx={{ padding: 3, boxShadow: '2px 8px 8px 3px rgb(221, 221, 221)'}}>
                    <Typography variant="h6">Tasks Overview</Typography>
                    <Typography variant="subtitle1">Total tasks: {tasksDetails?.totalTasks}</Typography>
                    <PieChart
                        sx={{ marginTop: '30px'}}
                        height={250}
                        width={250}
                        series={[
                            {
                                arcLabel: (item) => `${item.percentage}%`,
                                data: pieChartData,
                                innerRadius: 90,
                                arcLabelMinAngle: 20,
                            },
                        ]}
                    />
            </Card>
        </div>
    </main>

}

export default Home