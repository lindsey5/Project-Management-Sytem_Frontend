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