import { Avatar, Chip } from "@mui/material";
import { openFile, timeAgo } from "../../../utils/utils";
import AttachmentIcon from '@mui/icons-material/Attachment';
import { EllipsisText } from "../../text";
import { base64ToBlob } from "../../../utils/utils";
import { useContext, useEffect } from "react";
import { CommentContext } from "../../../context/commentContext";

const CommentsContainer = ({ task_id }) => {
    const { comments, setTaskId, lastItemRef } = useContext(CommentContext);

    useEffect(() => {
        if(task_id) setTaskId(task_id)
    }, [task_id])

    return <div className="w-full h-full flex flex-col gap-5">
        {comments.length > 0 ? comments.map(comment => {
            return <div 
                key={comment.id} 
                ref={lastItemRef} 
                className="rounded-lg border-1 border-gray-200 py-5 px-3"
            >
               <div className="flex justify-between">
                    <div className="flex gap-3 items-center">
                        <Avatar sx={{ width: '45px', height: '45px'}} src={`data:image/jpeg;base64,${comment.member.user.profile_pic}`}/>
                        <h1 className="text-lg">{comment.member.user.firstname} {comment.member.user.lastname}</h1>
                    </div>
                    <p className="text-gray-500">{timeAgo(new Date(comment.date_time), new Date())}</p>
               </div>
               <div className="notailwind" dangerouslySetInnerHTML={{ __html: comment.content }} />
               <div className="flex flex-wrap gap-3">
                {comment.attachments.map(a => (
                        <Chip
                            key={a.id}
                            icon={<AttachmentIcon />}
                            onClick={() => openFile(base64ToBlob(a))}
                            sx={{
                                maxWidth: '300px',
                                padding: '0 8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                                cursor: 'pointer',
                                ":hover" : {
                                    backgroundColor: '#9CA3AF'
                                }
                            }}
                            label={<EllipsisText text={a.name}/>}
                        />                              
                    ))}
               </div>
            </div>
        }) : <p>No comments.</p>}
    </div>

}

export default CommentsContainer