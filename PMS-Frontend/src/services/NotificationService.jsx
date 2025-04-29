import axios from "axios";

export const getNotifications = async (page, limit = 10) => {
    try{
        const response = await axios.get(`/api/notification?page=${page}&limit=${limit}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        return response.data

    }catch(error){
        return error.response ? error.response.data : error.message
    }
}

export const updateNotifications = async () => {
    try{
        const response = await axios.put('/api/notification', {},  {
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