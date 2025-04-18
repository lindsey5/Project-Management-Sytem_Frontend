import { StatusChip } from "../../chip"
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import { useContext, useState } from "react";
import { ProjectContext } from "../../../layouts/ProjectLayout";
import { Card, Stack, Typography } from "@mui/material";
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined';
import { formatDateTime } from "../../../utils/utils";
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import { updateTask } from "../../../services/TaskService";

const statusType = {
    "To Do" : " #951ff7",
    "In Progress" : " #e2f069",
    "In Review" : " #194bd3",
    "Completed" : " #10B981",
    "Error" : " #F87171" 
}

const lightPriorityColor = {
    "High" : "red",    
    "Medium" : "orange" , 
    "Low": "green"   
}


const StatusHeader = ({showCreate, currentStatus, ...rest}) => {
    return <div className="flex items-center justify-between flex-1" {...rest}>
        <StatusChip 
            label={currentStatus}
            color={statusType[currentStatus]}
            sx={{fontSize: '15px', fontWeight: 'bold', textTransform: 'uppercase', backgroundColor: 'white'}}
        />
        <IconButton size="small" onClick={() => showCreate(currentStatus)}>
            <AddIcon fontSize="medium" sx={{ color: '#2328ff'}}/>
        </IconButton>
    </div>
}

const Kanban = ({ showCreate, tasks, setTasks }) => {
    const [loading, setLoading] = useState(false); 
    const { role } = useContext(ProjectContext);

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
        status: newStatus
      })

      if(response.success) {
        setTasks(tasks.map(task => 
          task.id === taskToUpdate.id ? { ...task, status: newStatus } : task
        ));
      }
      
      setLoading(false); 
    };
  
    const statuses = ['To Do', 'In Progress', 'In Review', 'Error', 'Completed'];
  
    return (
      <div className="p-3 min-w-[1440px] relative">
        <div className="grid grid-cols-5 gap-3 border-b-1 border-gray-300 py-3">
          {statuses.map(status => (
            <StatusHeader key={status} currentStatus={status} showCreate={showCreate}/>
          ))}
        </div>
        <div className="grid grid-cols-5 py-3 gap-3 box-border">
          {statuses.map(status => {


            return <div 
                      key={status}
                      className="min-h-[200px]"
                      onDragOver={role === 'Admin' ? handleDragOver : undefined}
                      onDrop={(e) => role === 'Admin' ? handleDrop(e, status) : undefined}
                    >
                      {tasks && tasks.length > 0 && tasks
                        .filter(task => task.status === status)
                        .map(task => (
                            <Card
                              key={task.id}
                              variant="outlined"
                              sx={{ borderRadius: '20px', ':hover' : { backgroundColor: '#F9FAFB'}}}
                              className={`shadow-xl flex flex-col gap-3 items-start px-2 py-4 bg-white m-3 ${role === 'Admin' && 'cursor-pointer'}`}
                              draggable={!loading && role === 'Admin'}
                              onDragStart={(e) => role === 'Admin' ? handleDragStart(e, task.id) : undefined}
                          >
                            <StatusChip 
                              color={lightPriorityColor[task.priority]}
                              label={task.priority}
                            />
                            <Typography variant="h6">
                              {task.task_Name}
                            </Typography>
                            <Typography variant="subtitle1" fontSize={'14px'} color="gray">
                              Due: {formatDateTime(task.due_date)}
                            </Typography>
                            {task.attachments.find(a => a.type.includes('image/')) && 
                              <img 
                                src={`data:image/jpeg;base64,${task.attachments.find(a => a.type.includes('image/')).content}`}
                                className="bg-gray-100 rounded-lg w-full h-[100px]"
                              />
                            }
                            <Stack direction="row" justifyContent={"space-between"} width="100%">
                              <Stack direction="row" gap={1}>
                                <IconButton size="small">
                                  <ChatBubbleOutlineOutlinedIcon fontSize="inherit" />
                                </IconButton>
                                <IconButton size="small">
                                  <AttachFileOutlinedIcon fontSize="inherit" />
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
                        ))
                      }
                    </div>
          })}
        </div>
      </div>
    );
};

export default Kanban