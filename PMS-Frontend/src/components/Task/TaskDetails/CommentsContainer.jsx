import { useEffect, useState, useRef, useCallback } from "react"
import { getCommentAttachments, getComments } from "../../../services/CommentService";
import { Avatar, Chip } from "@mui/material";
import { openFile, timeAgo } from "../../../utils/utils";
import AttachmentIcon from '@mui/icons-material/Attachment';
import { EllipsisText } from "../../text";
import { base64ToBlob } from "../../../utils/utils";

const CommentsContainer = ({ task_id}) => {
    const [comments, setComments] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const observer = useRef();

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
        const fetchComments = async () => {
            const fetchedComments = await getComments(task_id, page);
            if (fetchedComments.comments.length === 0) {
                setHasMore(false);
                return;
            }

            const commentsArr = []
            if(fetchedComments.comments.length > 0){
                for(const comment of fetchedComments.comments){
                    const response = await getCommentAttachments(comment.id)
                    commentsArr.push({ ...comment, attachments: response.attachments});
                }
            }

            setComments([...comments, ...commentsArr])
        }
        fetchComments()
    }, [page])


    return <div className="w-full h-full flex flex-col gap-5">
        {comments.length > 0 && comments.map(comment => {
            return <div key={comment.id} className="rounded-lg border-1 border-gray-200 py-5 px-3">
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
                            label={<EllipsisText text={a.name}/>
                            
                            }
                        />                              
                    ))}
               </div>
            </div>

        })}
    </div>

}

export default CommentsContainer