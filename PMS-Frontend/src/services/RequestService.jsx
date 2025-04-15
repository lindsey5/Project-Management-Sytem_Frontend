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
