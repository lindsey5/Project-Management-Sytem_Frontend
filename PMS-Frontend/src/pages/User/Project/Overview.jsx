import { lazy, Suspense, useContext, useEffect, useState } from "react"
import { ProjectContext } from "../../../layouts/ProjectLayout"
import { Box, Card, Stack, Typography, Tooltip, Avatar } from "@mui/material";
import { getTasks } from "../../../services/TaskService";
import { convertToAsiaTime, formatDate } from "../../../utils/utils";
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import TaskOutlinedIcon from '@mui/icons-material/TaskOutlined';
import { PieChart } from '@mui/x-charts/PieChart';
import { statusConfig } from "../../../components/config";
import { getMembers } from "../../../services/MemberService";
import { DashboardCard } from "../../../components/Card";
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import QueryBuilderOutlinedIcon from '@mui/icons-material/QueryBuilderOutlined';
import { BarChart } from '@mui/x-charts/BarChart';
import { priority } from "../../../data/taskData";

const ProjectActivity = lazy(() => import('../Home/ProjectActivity'))

const Overview = () => {
    const { project } = useContext(ProjectContext);
    const [tasksData, setTasksData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await getTasks(project.id);
            const totalTask = response.tasks.length

            const priorityData = priority.map(p => {
                return response.tasks.filter(task => task.priority === p.name).length
            })

            // Set Pie Chart data
            const tasksStatus = [...new Set(response.tasks.map(task => task.status))];

            const pieChartData = tasksStatus.map(status => {
                const numberOfTask = response.tasks.filter(task => task.status == status).length
                return { value: numberOfTask, percentage: (( numberOfTask / totalTask) * 100).toFixed(2), label: status, color: statusConfig[status]}
            })
            
            // Set data on cards
            const completedTasks = response.tasks.filter(task => task.status == "Completed").length;

            const overDueTasks = response.tasks.filter(task => 
                task.status !== 'Completed' && 
                new Date(convertToAsiaTime(task.due_date)) < new Date()).length;

            const tasksDueSoon = response.tasks.filter(task => new Date(convertToAsiaTime(task.due_date)) > new Date() && task.status !== 'Completed').length;
            
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
                    percentage: numberOfTask > 0 ? ((numberOfTask / totalTask) * 100).toFixed(2) : 0 }
            }).sort((a, b) => b.percentage - a.percentage )

            setTasksData({
                completedTasks,
                overDueTasks,
                tasksDueSoon,
                tasksToday,
                totalTask,
                priorityData,
                pieChartData,
                workloads: distribution
            })
        }
        if(project.id) fetchData()

    }, [project.id])

    return <main className="w-full p-5 bg-gray-100">
        <div className="grid lg:grid-cols-4 gap-20 grid-cols-2">
            <DashboardCard 
                label={"Today tasks"}
                value={tasksData?.tasksToday}
                icon={<AssignmentOutlinedIcon sx={{ color: 'white'}} />}
                color={"rgb(90, 106, 158)"}
            />
            <DashboardCard 
                label={"Completed tasks"}
                value={tasksData?.completedTasks}
                icon={<TaskOutlinedIcon sx={{ color: 'white'}} />}
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
                icon={<QueryBuilderOutlinedIcon sx={{ color: 'white'}} />}
                color={"rgb(241, 94, 94)"}
            />
        </div>
        <div
            className="mt-[50px] md:grid md:grid-cols-[2fr_1fr] gap-5"
        >
            <Card sx={{ height: '400px', padding: 3, boxShadow: '2px 8px 8px 3px rgb(221, 221, 221)'}}>
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
                <Stack direction={"row"}>
                    <Typography variant="subtitle1" width={"35%"}>Assignee</Typography>
                    <Typography variant="subtitle1" width={"70%"}>Work Distribution</Typography>
                </Stack>
                {tasksData?.workloads && tasksData?.workloads.map((workload, i) => {
                    return <Box key={i} width={"100%"} display={"flex"} alignItems={"center"} gap={3}>
                        <div className="flex w-[30%] gap-3 items-center">
                            <Avatar src={`data:image/jpeg;base64,${workload.picture}`}/>
                            <Typography width={"100%"}>{workload.assignee}</Typography>
                        </div>
                        <div className="w-[70%] relative bg-gray-200 h-[30px] rounded-lg">
                        <Tooltip 
                            title={`${workload.percentage}% (${workload.numberOfTask}/ ${tasksData.totalTask} task)`} 
                            followCursor 
                            placement="right"
                        >
                            {workload.percentage > 0 && <Box className='rounded-lg bg-gray-500 h-full absolute px-3 py-1 text-white cursor-pointer'
                                style={{ width: `${workload.percentage}%` }}
                            >
                            {workload.percentage}%
                            </Box>}
                        </Tooltip>
                        </div>
                    </Box>
                })}
                </Box>
            </Card>
            
            <Card className="h-[400px] md:mt-0 mt-20" sx={{ padding: 3, boxShadow: '2px 8px 8px 3px rgb(221, 221, 221)'}}>
                <Typography variant="h6">Status overview</Typography>
                <Typography variant="subtitle1">Total tasks: {tasksData?.totalTask}</Typography>
                <PieChart
                    sx={{ marginTop: '30px'}}
                    height={250}
                    width={250}
                    series={[
                        {
                            arcLabel: (item) => `${item.percentage}%`,
                            data: tasksData?.pieChartData || [],
                            innerRadius: 90,
                            arcLabelMinAngle: 20,
                        },
                    ]}
                />
            </Card>
            <Card sx={{ 
                display: 'flex',
                flexDirection: 'column', 
                height: '400px', 
                padding: 3,
                gap: 3,
                 boxShadow: '2px 8px 8px 3px rgb(221, 221, 221)'}}
            >
                <Typography variant="h6">Recent Activity</Typography>
                <Suspense fallback={<div>Loading...</div>}>
                <ProjectActivity />
                </Suspense>
            </Card>
            <Card sx={{ height: '400px', padding: 3, boxShadow: '2px 8px 8px 3px rgb(221, 221, 221)'}}>
                <Typography variant="h6" sx={{ marginBottom: '20px'}}>Priority Overview</Typography>
                {tasksData.priorityData && <BarChart
                    height={300}
                    series={[
                        { data: tasksData?.priorityData },
                    ]}
                    xAxis={[{ data: priority.map(p => p.name), scaleType: 'band' }]}
                    yAxis={[{ width: 50 }]}
                    />}
            </Card>
                
        </div>
    </main>
}

export default Overview