import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useEffect, useState } from 'react';
import { statusConfig } from '../config';
import { formatDate } from '../../utils/utils';
import TaskDetails from './TaskDetails/TaskDetails';

const Calendar = ({ tasks}) => {
    const [events, setEvents] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);

    useEffect(() => {
       if(tasks?.length > 0){
            setEvents(tasks.map(task => {
                return ({ 
                    title: task.task_Name, 
                    start: formatDate(task.start_date),
                    end: formatDate(task.due_date),
                    backgroundColor: statusConfig[task.status],
                    task
                })
            }))
       }
       
    }, [tasks])

    const handleEventClick = (info) => {
        setSelectedTask(info.event._def.extendedProps.task);
      };

    return <div className='p-5'>
        <TaskDetails closeModal={() => setSelectedTask(null)} open={selectedTask != null} task={selectedTask}/>
        <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={events}
            eventClick={handleEventClick}
        />
    </div>
}

export default Calendar