import { useContext, useEffect, useState } from "react"
import { ProjectContext } from "../../../layouts/ProjectLayout"
import { Box, Card, Stack, Typography, Tooltip, Avatar } from "@mui/material";
import { getTasks } from "../../../services/TaskService";
import { convertToAsiaTime, formatDate } from "../../../utils/utils";
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import TaskOutlinedIcon from '@mui/icons-material/TaskOutlined';
import { PieChart } from '@mui/x-charts/PieChart';
import { statusConfig } from "../../../components/config";
import { getMembers } from "../../../services/MemberService";

const DashboardCard = ({ label, value, icon, color}) => {
    return <Card sx={{ 
        paddingX: 2, 
        paddingY: 3, 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'start',
        boxShadow: '2px 8px 8px 3px rgb(221, 221, 221)'
    }}>
        <Box 
            bgcolor={color} 
            borderRadius={"50%"} 
            padding={2}
        >
        {icon}
        </Box>
        <Typography 
            variant="subtitle2" 
            fontSize={"16px"} 
            color="rgb(160, 160, 160)"
            marginTop={"20px"}
        >
            {label}
        </Typography>
        <Typography variant="h4" fontWeight={"bold"}>{value}</Typography>
    </Card>
}

const Overview = () => {
    const { project } = useContext(ProjectContext);
    const [tasksData, setTasksData] = useState([]);
    const [pieChartData, setPieChartData] = useState([]);
    const [workloads, setWorkloads] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await getTasks(project.id);
            const totalTask = response.tasks.length
            // Set Pie Chart data
            const tasksStatus = [...new Set(response.tasks.map(task => task.status))];

            setPieChartData(tasksStatus.map(status => {
                const numberOfTask = response.tasks.filter(task => task.status == status).length
                return { value: numberOfTask, percentage: ( numberOfTask / totalTask) * 100, label: status, color: statusConfig[status]}
            }))
            
            // Set data on cards
            const completedTasks = response.tasks.filter(task => task.status == "Completed").length;
            const overDueTasks = response.tasks.filter(task => 
                task.status !== 'Completed' && 
                new Date(convertToAsiaTime(task.due_date)) < new Date()).length;
            const tasksDueSoon = response.tasks.filter(task => new Date(convertToAsiaTime(task.due_date)) > new Date()).length;
            const tasksToday = response.tasks.filter(task => 
                formatDate(convertToAsiaTime(task.due_date)) === formatDate(new Date()) && 
                task.status !== "Completed").length;
            const members = await getMembers(project.project_code)

            const distribution = members.members.map(member => {
                const numberOfTask = response.tasks.filter(task => {
                    return task.assignees
                    .filter(assignee => assignee.member.id === member.id).length > 0
                }).length
                return { 
                    assignee: `${member.user.firstname} ${member.user.lastname}`, 
                    picture: member.user.profile_pic,
                    numberOfTask,
                    percentage: (numberOfTask / totalTask) * 100 }
            })

            setWorkloads([...distribution])

            setTasksData({
                completedTasks,
                overDueTasks,
                tasksDueSoon,
                tasksToday,
                totalTask
            })
        }
        if(project) fetchData()

    }, [])

    return <main className="w-full p-5 bg-gray-100">
        <div className="grid lg:grid-cols-4 gap-20 grid-cols-2">
            <DashboardCard 
                label={"Today tasks"}
                value={tasksData?.tasksToday}
                icon={<CalendarTodayOutlinedIcon sx={{ color: 'white'}} />}
                color={"rgb(90, 106, 158)"}
            />
            <DashboardCard 
                label={"Completed tasks"}
                value={tasksData?.completedTasks}
                icon={<CheckCircleOutlinedIcon sx={{ color: 'white'}} />}
                color={" #46a818"}
            />
            <DashboardCard 
                label={"Tasks due soon"}
                value={tasksData?.tasksDueSoon}
                icon={<CalendarTodayOutlinedIcon sx={{ color: 'white'}} />}
                color={"rgb(248, 172, 101)"}
            />
            <DashboardCard 
                label={"Overdue tasks"}
                value={tasksData?.overDueTasks}
                icon={<TaskOutlinedIcon sx={{ color: 'white'}} />}
                color={"rgb(241, 94, 94)"}
            />
        </div>
        <Stack 
            height={'400px'} 
            marginTop='50px' 
            gridTemplateColumns={"1.5fr 1fr"} 
            display={"grid"}
            gap={3}
        >
            <Card sx={{ height: '100%', padding: 3, boxShadow: '2px 8px 8px 3px rgb(221, 221, 221)'}}>
                <Typography variant="h6">Team workload</Typography>
                <Box 
                    marginTop={"30px"} 
                    width={"100%"} 
                    height={"80%"}
                    overflow={"auto"}
                    display={"flex"} 
                    flexDirection={"column"} 
                    gap={2}
                >
                {workloads.map(workload => {
                    return <Box width={"100%"} display={"flex"} alignItems={"center"}>
                        <Avatar src={`data:image/jpeg;base64,${workload.picture}`} sx={{ marginRight: '20px'}}/>
                        <Typography width={"30%"}>{workload.assignee}</Typography>
                        <div className="w-[70%] relative bg-gray-100 h-[30px]">
                        <Tooltip 
                            title={`${workload.percentage}% (${workload.numberOfTask}/ ${tasksData.totalTask} task)`} 
                            followCursor 
                            placement="right"
                        >
                            <Box className='bg-gray-500 h-full absolute px-3 py-1 text-white cursor-pointer'
                                style={{ width: `${workload.percentage}%` }}
                            >
                            {workload.percentage}%
                            </Box>
                        </Tooltip>
                        </div>
                    </Box>
                })}
                </Box>
            </Card>
            <Card sx={{ padding: 3, boxShadow: '2px 8px 8px 3px rgb(221, 221, 221)'}}>
                <Typography variant="h6">Status overview</Typography>
                <Typography variant="subtitle1">Total tasks: {tasksData?.totalTask}</Typography>
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
        </Stack>
    </main>
}

export default Overview