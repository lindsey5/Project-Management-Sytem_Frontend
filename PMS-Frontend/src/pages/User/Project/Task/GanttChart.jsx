import { Gantt, Willow } from "wx-react-gantt";
import "wx-react-gantt/dist/gantt.css";
import { useEffect, useState } from "react";

const MyGanttComponent = ({ tasks }) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        if(tasks?.length > 0){
            setData(tasks.map(task => ({
                id: task.id,
                text: task.task_Name,
                start: task.start_date,
                end: task.due_date,
                type: "narrow",
                lazy: true,
            })))
        }

    }, [])

const scales = [
    { unit: "month", step: 1, format: "MMMM yyy" },
    { unit: "day", step: 1, format: "d" },
  ];

  return <div className="p-10 min-h-0 flex-grow overflow-y-auto">
    <Willow>
        <Gantt tasks={data} scales={scales} zoom={true} readonly={true}/>;
    </Willow>
  </div>
};

export default MyGanttComponent;