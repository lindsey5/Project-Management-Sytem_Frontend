import axios from "axios";

export const createTaskAttachment = async (task_id, file) => {
    const formData = new FormData();
    formData.append('task_id', task_id);
    formData.append('file', file);

    try{
        const response = await axios.post(`/api/task_attachment`, formData, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        return response.data

    }catch(error){
        return error.response ? error.response.data : error.message
    }

}

export const getTaskAttachments = async (task_id) => {
    try{
        const response = await axios.get(`/api/task_attachment/${task_id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        return response.data

    }catch(error){
        return error.response ? error.response.data : error.message
    }
}

export const deleteTaskAttachment = async (id) => {
    try{
        const response = await axios.delete(`/api/task_attachment/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        return response.data

    }catch(error){
        return error.response ? error.response.data : error.message
    }

}