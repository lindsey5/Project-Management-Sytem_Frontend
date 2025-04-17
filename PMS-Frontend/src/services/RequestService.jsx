import axios from "axios";

export const createRequest = async (code) => {
    try{
        const response = await axios.post('/api/request', {project_code: code}, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        return response.data

    }catch(error){
        return error.response ? error.response.data : error.message
    }
}

export const getRequest = async ({ id, page=1, limit, status="", searchTerm=""}) => {
    try{
        const response = await axios.get(`/api/request/${id}?page=${page}&limit=${limit}&status=${status}&searchTerm=${searchTerm}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        return response.data

    }catch(error){
        return error.response ? error.response.data : error.message
    }
}

export const updateRequest = async (id, status) => {
    try{
        const response = await axios.put(`/api/request/${id}?status=${status}`, {}, {
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