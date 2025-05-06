import axios from "axios";

export const createTask = async (data) => {
    try{
        const response = await axios.post('/api/task', data, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        return response.data

    }catch(error){
        return error.response ? error.response.data : error.message
    }
}

export const getTask = async (id) => {
    try{
        const response = await axios.get(`/api/task/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });

        return response.data

    }catch(error){
        console.log(error)
        return error.response ? error.response.data : error.message
    }
}

export const getTasks = async (id) => {
    try{
        const response = await axios.get(`/api/task?project_id=${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });

        return response.data

    }catch(error){
        console.log(error)
        return error.response ? error.response.data : error.message
    }
}

export const updateTask = async (id, updatedTask) => {
    try{
        const response = await axios.put(`/api/task/${id}`, updatedTask, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        return response.data

    }catch(error){
        return error.response ? error.response.data : error.message
    }
}

export const deleteTask = async (id) => {
    try{
        const response = await axios.delete(`/api/task/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        return response.data

    }catch(error){
        return error.response ? error.response.data : error.message
    }
}

export const getProjectTaskHistory = async (project_id, page) => {
    try{
        const response = await axios.get(`/api/task_history/project/${project_id}?page=${page}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        return response.data

    }catch(error){
        return error.response ? error.response.data : error.message
    }
}


export const getTaskHistory = async (task_id, page) => {
    try{
        const response = await axios.get(`/api/task_history/${task_id}?page=${page}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        return response.data

    }catch(error){
        return error.response ? error.response.data : error.message
    }
}

export const getUserTasks = async (page, searchTerm, status, projectStatus) => {
    try{
        const response = await axios.get(`/api/task/user?page=${page}&searchTerm=${searchTerm}&status=${status}&projectStatus=${projectStatus}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        return response.data

    }catch(error){
        return error.response ? error.response.data : error.message
    }
}

export const getAllUserTasks = async () => {
    try{
        const response = await axios.get(`/api/task/user/all`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        return response.data

    }catch(error){
        return error.response ? error.response.data : error.message
    }
}