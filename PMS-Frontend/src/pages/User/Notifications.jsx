import { useEffect, useRef, useState, useCallback, useContext, forwardRef } from "react"
import { getNotifications } from "../../services/NotificationService";
import { SignalContext } from "../../context/signalContext";
import { Avatar } from "@mui/material";
import { formatDateTime } from "../../utils/utils";
import CircleIcon from '@mui/icons-material/Circle';
import { updateNotifications } from "../../services/NotificationService";

const NotficationContainer = forwardRef(({ notification }, ref) => {
    var messageType;

    if(notification.type === 'TaskAssigned'){
        messageType = "assigned a task to you";
    }else if(notification.type === 'TaskRemoved'){
        messageType = "removed you in a task"
    }else if(notification.type === 'TaskUpdated'){
        messageType = "updated a task"
    }else if(notification.type === "AttachmentAdded"){
        messageType = "added an attachment";
    }else if(notification.type === "AttachmentRemoved"){
        messageType = "removed an attachment";
    }else if(notification.type === "RemovedToProject"){
        messageType = "removed you in a project";
    }else if(notification.type === "AddedToProject"){
        messageType = "added you in a project"
    }

    return <div 
            onClick={() => window.location.href = `/project/tasks?c=${notification.project.project_code}`}
            ref={ref} 
            className={`hover:bg-purple-50 cursor-pointer flex gap-5 w-full shadow-md 
                p-6 rounded-lg border-1 border-gray-200 ${!notification.isRead && 'font-bold'}`}
        >
        <Avatar src={`data:image/jpeg;base64,${notification.user.profile_pic}`} sx={{ width: '50px', height: '50px'}}/>
        <div className="">
            <h1 className="mb-3 text-md">
                <span className="font-bold">{notification.user.firstname} {notification.user.lastname}</span> {messageType}
                {!notification.isRead && <CircleIcon sx={{ marginLeft: '7px', fontSize: '15px'}} color="error"/>}
            </h1>
            <p className="text-gray-500 text-sm">{formatDateTime(notification.date_time)}</p>
            <div className="mt-6 border-1 border-gray-300 rounded-xl p-3">
                <p className="whitespace-pre-line">{notification.message}</p>
            </div>
        </div>
    </div>
})

const Notifications = () => {
    const [hasMore, setHasMore] = useState(true);
    const observer = useRef();
    const [page, setPage] = useState(1);
    const [notifications, setNotifications] = useState([]);
    const { connection } = useContext(SignalContext);

    const lastItemRef = useCallback((node) => {
        if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                setPage((prevPage) => prevPage + 1);
            }
        });
        if (node) observer.current.observe(node);
        
    },[hasMore]);

    useEffect(() => {
        const fetchData = async () => {
            const fetchedNotifications = await getNotifications(page, 20);
            await updateNotifications();
            if(fetchedNotifications.notifications.length === 0){
                setHasMore(false);
                return;
            }
            setNotifications(fetchedNotifications.notifications);
        }
        fetchData()

    },[])

    useEffect(() => {
        if(connection){
            connection.on("ReceiveTaskNotification", async (count, newNotification) => {
                setNotifications(prev => [newNotification, ...prev])
            })
        }
    }, [connection])

    return <main className="p-10 flex flex-col h-screen">
        <h1 className="text-3xl font-bold mb-10">Notifications</h1>
        <div className="py-3 flex flex-col gap-5">
            {notifications.map((notification, i) => <NotficationContainer 
                key={i}
                ref={notifications.length-1 === i ? lastItemRef : null} 
                notification={notification}
            />)}
        </div>
    </main>
}

export default Notifications