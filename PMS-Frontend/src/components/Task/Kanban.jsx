import { StatusChip } from "../chip"
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import { lazy, Suspense, useContext, useState } from "react";
import { ProjectContext } from "../../layouts/ProjectLayout";
import { Card, Stack, Typography } from "@mui/material";
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined';
import { convertToAsiaTime, formatDateTime } from "../../utils/utils";
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import { updateTask } from "../../services/TaskService";
import Badge from '@mui/material/Badge';
import { UserContext } from "../../context/userContext";
import TaskDetails from "./TaskDetails";
import { statusConfig } from "../config";

const StatusHeader = ({showCreate, currentStatus, showButton, ...rest}) => {
    return <div className="flex items-center justify-between flex-1" {...rest}>
        <StatusChip 
            label={currentStatus}
            size="medium"
            color={statusConfig[currentStatus]}
            sx={{ fontWeight: 'bold', textTransform: 'uppercase', backgroundColor: 'white'}}
        />
        {showButton && <IconButton size="small" onClick={() => showCreate(currentStatus)}>
            <AddIcon fontSize="medium" sx={{ color: '#2328ff'}}/>
        </IconButton>}
    </div>
}

const Kanban = ({ showCreate, tasks, setTasks }) => {
    const [loading, setLoading] = useState(false); 
    const { user } = useContext(UserContext);
    const { role } = useContext(ProjectContext);
    const [selectedTask, setSelectedTask] = useState(null);

    const handleDragStart = (e, task_id) => {
      e.dataTransfer.setData('task_id', task_id);
    };
  
    const handleDragOver = (e) => {
      e.preventDefault();
    };
  
    const handleDrop = async (e, newStatus) => {
      e.preventDefault();
      const task_id = parseInt(e.dataTransfer.getData('task_id'));
      const taskToUpdate = tasks.find(task => task.id == task_id);
      setLoading(true); 

      const response = await updateTask(taskToUpdate.id, {
        ...taskToUpdate,
        status: newStatus,
      })

      if(response.success) {
        setTasks(tasks.map(task => 
          task.id === taskToUpdate.id ? { ...task, status: newStatus,  updated_At: new Date() } : task
        ));
      }
      
      setLoading(false); 
    };
  
    const statuses = ['To Do', 'In Progress', 'In Review', 'Error', 'Completed'];
  
    return (
      <div className="w-full p-3 min-w-[1000px]">
        <TaskDetails closeModal={() => setSelectedTask(null)} open={selectedTask} task={selectedTask}/>
        <div className="grid grid-cols-5 gap-3 border-b-1 border-gray-300 py-3">
          {statuses.map(status => (
            <StatusHeader key={status} currentStatus={status} showCreate={showCreate} showButton={role === "Admin"}/>
          ))}
        </div>
        <div className="grid grid-cols-5 py-3 gap-3 box-border">
          {statuses.map(status => {
            return <div 
                      key={status}
                      className="min-h-[200px]"
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, status)}
                    >
                      {tasks && tasks.length > 0 && tasks
                        .filter(task => task.status === status)
                        .map(task => {
                          const index = task.assignees.findIndex(a => a.member.user.email == user.email);
                          if (index > -1) {
                              const [item] = task.assignees.splice(index, 1);
                              task.assignees.unshift(item);
                          }
                            return <Card
                              key={task.id}
                              variant="outlined"
                              sx={{ borderRadius: '20px', ':hover' : { backgroundColor: '#F9FAFB'}}}
                              className="shadow-xl flex flex-col gap-3 items-start px-2 py-4 bg-white m-3 cursor-pointer"
                              draggable={!loading}
                              onDragStart={(e) => handleDragStart(e, task.id)}
                              onClick={() => setSelectedTask(task)}
                          >
                            <StatusChip 
                              color={statusConfig[task.priority]}
                              label={task.priority}
                            />
                            <Typography variant="h6">
                              {task.task_Name}
                            </Typography>
                            <Typography sx={{ 
                                color: new Date(convertToAsiaTime(task.due_date)) <= new Date() && 
                                task.status != "Completed" ? "red" : "gray",
                              }} 
                                variant="subtitle1" 
                                fontSize={'14px'}
                            >
                              Due: {formatDateTime(convertToAsiaTime(task.due_date))}
                            </Typography>
                            {task.attachments.find(a => a.type.includes('image/')) && 
                              <img 
                                src={`data:image/jpeg;base64,${task.attachments.find(a => a.type.includes('image/')).content}`}
                                className="bg-gray-100 rounded-lg w-full"
                              />
                            }
                            <Stack direction="row" justifyContent={"space-between"} width="100%">
                              <Stack direction="row" gap={1}>
                                <IconButton size="small">
                                  <ChatBubbleOutlineOutlinedIcon fontSize="inherit" />
                                </IconButton>
                                  <IconButton size="small">
                                    <Badge badgeContent={task.attachments.length} color="primary">
                                      <AttachFileOutlinedIcon fontSize="inherit" />
                                    </Badge>
                                  </IconButton>
                              </Stack>
                              <AvatarGroup 
                                max={3} 
                                spacing="medium"
                                sx={{
                                  '& .MuiAvatar-root': {
                                    width: 30,
                                    height: 30,
                                    fontSize: 12,
                                  },
                                }}
                              >
                                {task.assignees.map(task => <Avatar sx={{ width: 30, height: 30 }} src={`data:image/jpeg;base64,${task.member.user.profile_pic}`} />)}
                              </AvatarGroup>
                            </Stack>
                          </Card>
          })
                      }
                    </div>
          })}
        </div>
      </div>
    );
};

export default Kanban