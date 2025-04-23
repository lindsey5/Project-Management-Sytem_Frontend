import axios from "axios";

export const createComment = async (data) => {
    try{
        const response = await axios.post('/api/comment', data, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
        });
        return response.data
        
    }catch(error){
        return error.response ? error.response.data : error.message
    }
}

export const createCommentAttachment = async (comment_id, file) => {
    const formData = new FormData();
    formData.append('comment_id', comment_id);
    formData.append('file', file);

    try{
        const response = await axios.post('/api/comment/attachment', formData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
        });
        return response.data
        
    }catch(error){
        return error.response ? error.response.data : error.message
    }
}

export const getComments = async (task_id, page) => {
    try{
        const response = await axios.get(`/api/comment/${task_id}?page=${page}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
        });
        return response.data
        
    }catch(error){
        return error.response ? error.response.data : error.message
    }
}

export const getCommentAttachments = async (comment_id) => {
    try{
        const response = await axios.get(`/api/comment/attachment/${comment_id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
        });
        return response.data
        
    }catch(error){
        return error.response ? error.response.data : error.message
    }
}