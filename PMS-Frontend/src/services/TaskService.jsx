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