import { createContext, useEffect, useState, useCallback, useRef } from "react";
import { getCommentAttachments, getComments } from "../services/CommentService";

export const CommentContext = createContext();

export const CommentContextProvider = ({ children }) => {
    const [comments, setComments] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const observer = useRef();
    const [taskId, setTaskId] = useState();

    const fetchComments = async (reset) => {
        if (!taskId) return;
        
        const currentPage = reset ? 1 : page;
        const fetchedComments = await getComments(taskId, currentPage);
    
        if (fetchedComments.comments.length === 0) {
          setHasMore(false);
          return;
        }
    
        const commentsArr = await Promise.all(
          fetchedComments.comments.map(async (comment) => {
            const res = await getCommentAttachments(comment.id);
            return { ...comment, attachments: res.attachments };
          })
        );
    
        if (reset) {
          setComments(commentsArr);
          setPage(1);
          setHasMore(true);
        }else {
          setComments(prev => [...new Map([...prev, ...commentsArr].map(item => [item.id, item])).values()]);
        }
      };

    useEffect(() => {
        fetchComments(false)
    }, [taskId, page]);

    const lastItemRef = useCallback((node) => {
        if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                setPage((prevPage) => prevPage + 1);
            }
        });
        if (node) observer.current.observe(node);
        
    },[hasMore]);

  
    return (
        <CommentContext.Provider value={{ 
            comments,
            lastItemRef,
            fetchComments,
            setTaskId
            }}>
            {children}
        </CommentContext.Provider>
    )
};