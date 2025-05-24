import { useEffect, useRef, useState, useCallback, useContext, forwardRef } from "react"
import { getNotifications, updateNotifications } from "../../../services/NotificationService";
import { SignalContext } from "../../../context/signalContext";
import { Avatar, Button } from "@mui/material";
import { formatDateTime } from "../../../utils/utils";
import CircleIcon from '@mui/icons-material/Circle';
import { getProject } from "../../../services/ProjectService";
import { useNavigate } from "react-router-dom";
import { acceptInvitation } from "../../../services/InvitationService";
import { toast } from "react-toastify";
import { ConfirmDialog } from "../../../components/dialog";
import generateNotificationTitle from '../../../utils/generateNotificationTitle';

const NotficationContainer = forwardRef(({ notification }, ref) => {
    const navigate = useNavigate();
    const title = generateNotificationTitle(notification)
    const handleClick = async () => {
        if(notification.type !== "RemovedToProject" && notification.type !== "InvitationSent"){
            const response = await getProject(notification.project_id);
            if(response.success) navigate(`/project/tasks?c=${response.project.project_code}`, { state: { task : notification.task_id } });
        }
    }

    const handleAccept = async () => {
        if(confirm("Accept invitation?")){
            const response = await acceptInvitation(notification.invitation_id);
            if(response.success) navigate(`/project/task?c=${response.invitation.project.project_code}`)
            else toast.error()
        }
    }

    return <div 
            onClick={handleClick}
            ref={ref} 
            className={`hover:bg-gray-50 cursor-pointer flex gap-5 w-full shadow-md 
                p-6 rounded-lg border-1 border-gray-200 ${!notification.isRead && 'font-bold'}`}
        >
        <Avatar src={`data:image/jpeg;base64,${notification.user.profile_pic}`} sx={{ width: '50px', height: '50px'}}/>
        <div>
            <h1 className="mb-3 text-md">
                <span className="font-bold">{notification.user.firstname} {notification.user.lastname}</span> {title}
                {!notification.isRead && <CircleIcon sx={{ marginLeft: '7px', fontSize: '15px'}} color="error"/>}
            </h1>
            <p className="text-gray-500 text-sm">{formatDateTime(notification.date_time)}</p>
           {notification.message && <div className="mt-6 border-1 border-gray-300 rounded-xl p-3">
                <p className="whitespace-pre-line">{notification.message}</p>
            </div>}
            {notification?.invitation?.status === "Pending" && <div className="flex mt-4 gap-4">
                <Button 
                    onClick={handleAccept}
                    variant="contained" 
                    color="success"
                >Accept</Button>
                <Button variant="outlined" color="error">Decline</Button>
            </div>}
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
            if(fetchedNotifications.notifications.length === 0){
                setHasMore(false);
                return;
            }
            setNotifications([...notifications, ...fetchedNotifications.notifications]);
        }
        fetchData()

    },[page])

    useEffect(() => {
        if(connection){
            connection.on("ReceiveTaskNotification", async (count, newNotification) => {
                setNotifications(prev => [newNotification, ...prev])
            })
        }

        return () => {
            const updateNotificationsAsync = async () => {
                await updateNotifications();
            };
            updateNotificationsAsync();
        }
    }, [connection])

    return <main className="p-10 flex flex-col h-screen">
        <h1 className="text-3xl font-bold mb-10">All Notifications</h1>
        {notifications.length > 0 ? 
        <div className="py-3 flex-grow min-h-0 flex flex-col gap-5 overflow-y-auto">
            {notifications.map((notification, i) => <NotficationContainer 
                key={i}
                ref={notifications.length - 1 === i ? lastItemRef : null} 
                notification={notification}
            />)}
        </div> 
        :
        <div className="flex-grow min-h-0 flex flex-col items-center text-center">
            <img className="w-[90%] max-w-[500px] h-[80%]" src="no-data.jpg"/>
            <h1 className="-mt-5 text-gray-700 text-3xl font-bold">Notifications are empty</h1>
            <p className=" text-gray-700 text-lg">You don't have any notifications yet.</p>
        </div>}
    </main>
}

export default Notifications