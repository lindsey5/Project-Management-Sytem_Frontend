import { Modal, Card, Typography, Box, IconButton, Button } from "@mui/material";
import { memo, useContext, useEffect, useState } from "react";
import { createTaskAttachment, deleteTaskAttachment, getTaskAttachments } from "../../../services/TaskAttachmentService";
import { ProjectContext } from "../../../layouts/ProjectLayout";
import AddIcon from '@mui/icons-material/Add';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { getMembers } from "../../../services/MemberService";
import { openFile } from "../../../utils/utils";
import { toast } from "react-toastify";
import { ConfirmDialog } from "../../dialog";
import Attachments from "../Attachments";
import HistoryPanel from "./HistoryPanel";
import TaskEditor from "./TaskEditor";
import CommentEditor from "./CommentEditor";
import CommentsContainer from "./CommentsContainer";
import { CommentContextProvider } from "../../../context/commentContext";

const style = {
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: '10px',
    width: '90%',
    maxWidth: '1200px',
    maxHeight: '700px',
    height: '90%',
    p: 5,
    display: 'flex'
};

const TaskDetails = memo(({task, open, closeModal}) => {
    const [attachments, setAttachments] = useState([]);
    const { code, role } = useContext(ProjectContext);
    const [members, setMembers] = useState([]);
    const [value, setValue] = useState("Comments");
    const [selectedAttachment, setSelectedAttachment] = useState(false);
    const [showCommentEditor, setShowCommentEditor] = useState(false);

    const handleFiles = async (e) => {
        const selectedFiles = Array.from(e.target.files || []);
  
        if (selectedFiles.length === 0) return;

        await Promise.all(
            selectedFiles.map(async (file) => {
                const newAttachment = await createTaskAttachment(task.id, file)
                setAttachments(prev => [...prev, newAttachment.attachment]);
            })
        );

        toast.success("Attachments successfully saved")
    };

    useEffect(() => {
        const fetchAttachments = async () => {
            const response = await getTaskAttachments(task.id);

            const fetchedMembers = await getMembers(code);

            setMembers(fetchedMembers.members);
            setAttachments(response.attachments)

        }

        if(task) fetchAttachments()

        return () => {
            setMembers([]);
            setAttachments([]);
            setShowCommentEditor(false)
        }
    }, [task])

    const handleDelete = async () => {
        const response = await deleteTaskAttachment(selectedAttachment)
        if(response.success){
            setAttachments(attachments.filter(a => a.id != selectedAttachment))
            toast.success("Attachment removed.");
            setSelectedAttachment(false);
        }else{
            toast.success("Attachment failed to remove");
        }
    }

    return <Modal
            open={open}
            onClose={closeModal}
            aria-labelledby="parent-modal-title"
            aria-describedby="parent-modal-description"
            sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', overflowY: 'auto'}}
        >
            <Card variant="outlined" sx={{ ...style} }>
            <ConfirmDialog 
                title="Confirm"
                text="Do you really want to delete this attachment?"
                variant="error"
                handleAgree={handleDelete}
                handleClose={() => setSelectedAttachment('')}
                isOpen={selectedAttachment}
            />
                    {/* Left Container*/}
                    <Box width="50%" display={"flex"} flexDirection={"column"}>
                        <Box sx={{padding: '0 10px 10px 10px'}}>
                           <Box display="flex" alignItems="center" gap={2} width="100%">
                                <Typography variant="h6" color="gray">Attachments</Typography>
                                {role === 'Admin' && <IconButton component="label">
                                    <AddIcon />
                                    <input
                                        type="file"
                                        multiple
                                        onChange={handleFiles}
                                        style={{ display: 'none' }}
                                        accept="image/*,application/pdf,doc,.docx"
                                    />
                                </IconButton>}
                           </Box>
                           <Attachments 
                                attachments={attachments}
                                remove={(a) => role === 'Admin' ? setSelectedAttachment(a.id) : undefined}
                                openFile={openFile}
                           />
                        </Box>

                        {/* Comments & History */}
                        <Box sx={{ 
                            overflowY: 'auto', 
                            boxSizing: 'border-box', 
                            height: '100%', 
                            position: 'relative', 
                            marginTop: '20px'
                        }}>
                            <TabContext value={value}>
                                <Box sx={{ backgroundColor: 'white', zIndex: 10, borderBottom: 1, borderColor: 'divider', position: 'sticky', top: 0}}>
                                <TabList onChange={(e, value) => setValue(value)}>
                                    <Tab label="Comments" value="Comments" />
                                    <Tab label="History" value="History" />
                                </TabList>
                                </Box>
                                <TabPanel value="Comments" 
                                    sx={{ 
                                        height: '85%', 
                                        boxSizing: 'border-box',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 2,
                                    }}>
                                    <CommentContextProvider>
                                        <Box 
                                            sx={{ 
                                                width: '100%', 
                                                height: '100%',  
                                                overflowY: 'auto',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: 3,
                                                p: 2,
                                                borderBottom: 1,
                                                borderColor: '#d5d5d5'
                                                }}>
                                            <CommentsContainer task_id={task?.id}/>
                                        </Box>
                                        {!showCommentEditor && <Button 
                                                variant="contained"
                                                sx={{ width: '150px'}}
                                                onClick={() => setShowCommentEditor(true)}
                                            >
                                                Add Comment
                                            </Button>}
                                        {showCommentEditor && <CommentEditor task_id={task.id} close={() => setShowCommentEditor(false)} />}
                                    </CommentContextProvider>
                                </TabPanel>
                                <HistoryPanel task_id={task?.id}/>
                            </TabContext>
                        </Box>
                    </Box>
                    
                    {/* Right Container*/}
                    <TaskEditor members={members} role={role} task={task}/>
            </Card>
    </Modal>
})

export default TaskDetails